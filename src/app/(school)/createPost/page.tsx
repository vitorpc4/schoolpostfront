"use client";

import { useSchool } from "@/app/context/SchoolContext";
import EditorWysiwyg from "@/Components/EditorWySiwyg/EditorWysiwyg";
import { IPostCreateRequest } from "@/http/Models/Requests/Post/IPostCreateRequest";
import { ISchool } from "@/http/Models/Response/ISchool";
import AssociationRepository from "@/http/Repository/AssociationRepository";
import PostRepository from "@/http/Repository/PostRepository";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(8, "Campo titulo deve ter no mínimo 8 caracteres")
    .required("Campo titulo obrigatório"),
  image: Yup.mixed()
    .required("Campo imagem obrigatório")
    .test("FILE_FORMAT", "Only JPG and PNG files are allowed", (value: any) => {
      if (value) {
        const supportedFormats = ["jpeg", "png", "jpg"];
        const extension = value?.name?.split(".").pop()?.toLowerCase();
        return supportedFormats.includes(extension);
      }
      return true;
    })
    .test("FILE_SIZE", "File too large", (value: any) => {
      if (value) {
        return value instanceof File && value.size <= 1000 * 1024 * 1024;
      }
      return true;
    }),
  content: Yup.string()
    .min(20, "Campo descrição deve ter no mínimo 20 caracteres")
    .required("Campo descrição é obrigatório"),
  author: Yup.string()
    .min(3, "Campo autor deve ter no mínimo 3 caracteres")
    .required("Campo autor obrigatório"),
});

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const { association } = useSchool();

  const saveData = (values: any, actions: any) => {
    console.log(values.image);

    const formData = new FormData();
    formData.append("file", values.image);
    formData.append("title", values.image.name);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    console.log("formData: ", formData);

    const post = values;
    alert(JSON.stringify(post, null, 2));
    actions.setSubmitting(false);
  };

  const createPost = (values: IPostCreateRequest) => {
    const postRepository: PostRepository = new PostRepository();

    const infoAssociation = getInfoSelectedStation();

    if (infoAssociation === undefined) {
      return;
    }

    values.associationSchool = infoAssociation.id!;

    postRepository
      .CreatePost(values, infoAssociation.school?.id!)
      .then((response) => {
        console.log(response);
      })
      .catch(() => {
        toast.error("Erro ao criar post", {
          duration: 2500,
          position: "top-right",
        });
      });
    console.log(values);
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
      setAuthor(result.user.username);
    }
  }, [association]);

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      title: "",
      image: undefined,
      content: content,
      author: author,
      isDraft: false,
      status: true,
      associationSchool: 0,
    },
    onSubmit: (values: IPostCreateRequest) => {
      values.content = content;
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
              <label className="form-control w-full max-w" htmlFor="imagem">
                <div className="label">
                  <span className="label-text">Imagem</span>
                </div>
                <input
                  type="file"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    formik.setFieldValue("image", file);
                  }}
                  name="image"
                  accept=".png, .jpeg, .jpg"
                  className="file-input file-input-bordered max-w"
                />

                <ErrorMessage name="image">
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
                    setContent(value);
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
