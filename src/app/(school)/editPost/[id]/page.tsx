"use client";

import adminPosts from "@/app/MockData/MockData";
import EditorWysiwyg from "@/Components/EditorWySiwyg/EditorWysiwyg";
import { ISchool } from "@/http/Models/Response/ISchool";
import PostRepository from "@/http/Repository/PostRepository";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";

const validationSchema = Yup.object({
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

export default function EditPost() {
  const adminPost = adminPosts;
  const id = parseInt(useSearchParams().get("id")!);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (id) {
      getPost(id);
    }
  }, [hydrated, adminPost, id]);

  const getSchoolFromLocalStorage = () => {
    const schoolStorage = localStorage.getItem("selectedSchool");

    if (!schoolStorage) {
      return;
    }

    const school = JSON.parse(schoolStorage) as ISchool;

    return school;
  };

  const getPost = (id: number) => {
    const postRepository: PostRepository = new PostRepository();

    const school = getSchoolFromLocalStorage();

    if (!school) {
      return;
    }

    postRepository.GetPost(id, school.id!).then((response) => {
      if (response.data) {
        setTitle(response.data.title);
        setContent(response.data.content);
        setAuthor(response.data.username);
        setIsDraft(response.data.isDraft);
      }
    });
  };

  const saveData = (values: any) => {
    const postRepository: PostRepository = new PostRepository();

    const school = getSchoolFromLocalStorage();

    if (!school) {
      return;
    }

    const post = values;
    post.id = id;
    post.status = true;

    postRepository
      .UpdatePost(post, school.id!)
      .then(() => {
        toast.success("Post atualizado com sucesso", {
          duration: 2500,
          position: "top-right",
        });
      })
      .catch(() => {
        toast.error("Erro ao atualizar post", {
          duration: 2500,
          position: "top-right",
        });
      });
  };

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    initialValues: {
      title: title,
      content: content,
      author: author,
      isDraft: isDraft,
    },
    onSubmit: (values) => {
      values.content = content;
      saveData(values);
    },
    validationSchema: validationSchema,
  });

  return (
    <>
      <div className="container mx-auto mt-5">
        <h3 className="font-bold text-lg">Atualizar Post</h3>
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
                  disabled
                  className="input input-bordered w-full max-w"
                />
                <ErrorMessage name="author">
                  {(msg) => {
                    return <div className="text-red-600 mt-2">{msg}</div>;
                  }}
                </ErrorMessage>
              </label>
            </fieldset>
            <label htmlFor="description">
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
            <div className="modal-action mr-1">
              <button type="submit" className="btn">
                Atualizar
              </button>
            </div>
          </form>
        </FormikProvider>
        <Toaster />
      </div>
    </>
  );
}
