"use client";

import { useSchool } from "@/app/context/SchoolContext";
import EditorWysiwyg from "@/Components/EditorWySiwyg/EditorWysiwyg";
import { IPostCreateRequest } from "@/http/Models/Requests/Post/IPostCreateRequest";
import { ISchool } from "@/http/Models/Response/ISchool";
import PostRepository from "@/http/Repository/PostRepository";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(8, "Campo titulo deve ter no mínimo 8 caracteres")
    .required("Campo titulo obrigatório"),
  content: Yup.string()
    .min(20, "Campo descrição deve ter no mínimo 20 caracteres")
    .required("Campo descrição é obrigatório"),
  author: Yup.string()
    .min(3, "Campo autor deve ter no mínimo 3 caracteres")
    .required("Campo autor obrigatório"),
});

export default function CreatePost() {
  const { association } = useSchool();

  const createPost = (values: IPostCreateRequest) => {
    const postRepository: PostRepository = new PostRepository();

    const infoAssociation = getInfoSelectedStation();

    if (infoAssociation === undefined) {
      return;
    }

    values.associationSchool = infoAssociation.id!;

    postRepository
      .CreatePost(values, infoAssociation.school?.id!)
      .then(() => {
        toast.success("Post criado com sucesso", {
          duration: 2500,
          position: "top-right",
        });
      })
      .catch(() => {
        toast.error("Erro ao criar post", {
          duration: 2500,
          position: "top-right",
        });
      });
  };

  const getInfoSelectedStation = () => {
    if (association.length > 0) {
      const getLocalStore = localStorage.getItem("selectedSchool");
      if (getLocalStore) {
        const selectedSchool = JSON.parse(getLocalStore) as ISchool;

        const getAssociationBySchoolId = association.find(
          (x) => x.school?.id === selectedSchool.id
        );

        return getAssociationBySchoolId;
      }
    }
  };

  useEffect(() => {
    const result = getInfoSelectedStation();

    if (result) {
      formik.setFieldValue("author", result.user.username!);
    }
  }, [association]);

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      title: "",
      content: "",
      author: "",
      isDraft: false,
      status: true,
      associationSchool: 0,
    },
    onSubmit: (values: IPostCreateRequest) => {
      createPost(values);
    },
    validationSchema: validationSchema,
  });

  return (
    <>
      <div className="container mx-auto mt-5">
        <h3 className="font-bold text-lg">Create Post</h3>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <fieldset>
              <label className="form-control w-full max-w" htmlFor="title">
                <div className="label">
                  <span className="label-text">Titulo</span>
                </div>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.title}
                  type="text"
                  name="title"
                  className="input input-bordered w-full max-w"
                />

                <ErrorMessage name="title">
                  {(msg) => {
                    return <div className="text-red-600 mt-2">{msg}</div>;
                  }}
                </ErrorMessage>
              </label>
            </fieldset>
            <fieldset>
              <label htmlFor="author">
                <div className="label">
                  <span className="label-text">Autor</span>
                </div>
                <input
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.author}
                  name="author"
                  className="input input-bordered w-full max-w"
                  disabled
                />
                <ErrorMessage name="author">
                  {(msg) => {
                    return <div className="text-red-600 mt-2">{msg}</div>;
                  }}
                </ErrorMessage>
              </label>
            </fieldset>
            <label htmlFor="content">
              <div className="label">
                <span className="label-text">Descrição</span>
              </div>
              <div className="w-full">
                <EditorWysiwyg
                  valueFormik={formik.values.content}
                  onChangeFormik={(value) => {
                    formik.setFieldValue("content", value);
                  }}
                />

                <ErrorMessage name="content">
                  {(msg) => {
                    return <div className="text-red-600 mt-2">{msg}</div>;
                  }}
                </ErrorMessage>
              </div>
            </label>
            <label className="form-control w-full max-w mt-2" htmlFor="toggle">
              <div className="label">
                <span className="label-text">Rascunho:</span>
              </div>
              <input
                type="checkbox"
                onChange={formik.handleChange}
                checked={formik.values.isDraft}
                name="isDraft"
                className="toggle ml-1"
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn">
                Create
              </button>
            </div>
          </form>
        </FormikProvider>
      </div>
      <Toaster />
    </>
  );
}
