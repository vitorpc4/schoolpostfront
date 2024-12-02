"use client";

import { IRegister } from "@/http/Interfaces/IRegister";
import { ApiResponse } from "@/http/Models/ApiResponse";
import IRegisterPost from "@/http/Models/Requests/IRegisterPost";
import RegisterRepository from "@/http/Repository/RegisterRepository";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";

import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Email inválido")
    .required("Campo email obrigatório"),
  username: Yup.string()
    .min(3, "Campo username deve ter no mínimo 3 caracteres")
    .max(20, "Campo username deve ter no máximo 20 caracteres")
    .required("Campo username obrigatório"),
  password: Yup.string()
    .min(6, "Campo senha deve ter no mínimo 6 caracteres")
    .required("Campo senha obrigatório"),
});

export default function Register() {
  const router = useRouter();

  const createAccount = async (values: IRegisterPost) => {
    const repository: RegisterRepository = new RegisterRepository();

    await repository
      .register(values)
      .then(async (response: ApiResponse<IRegister>) => {
        toast.success(`Usuário ${response.data?.email} criado com sucesso`, {
          position: "top-right",
          duration: 3000,
          style: {
            backgroundColor: "#1d232a",
            color: "#fff",
          },
          icon: "✅",
        });

        await new Promise((r) => setTimeout(r, 1500));

        router.push("/login");
      })
      .catch((error) => {
        toast.error("Email informado já existe", {
          position: "top-right",
          duration: 3000,
          style: {
            backgroundColor: "#1d232a",
            color: "#fff",
          },
          icon: "❌",
        });
        console.log("ERROR >>>>", error);
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      createAccount(values);
    },
    validationSchema: validationSchema,
  });

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="card bg-base-100 md:w-screen  w-full max-w-sm shrink-0 shadow-2xl">
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit} className="card-body">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type="email"
                    name="email"
                    placeholder="email"
                    className="input input-bordered"
                  />
                  <ErrorMessage name="email">
                    {(msg) => {
                      return <div className="text-red-600 mt-2">{msg}</div>;
                    }}
                  </ErrorMessage>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">UserName</span>
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    type="text"
                    name="username"
                    placeholder="UserName"
                    className="input input-bordered"
                  />
                  <ErrorMessage name="username">
                    {(msg) => {
                      return <div className="text-red-600 mt-2">{msg}</div>;
                    }}
                  </ErrorMessage>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type="password"
                    name="password"
                    placeholder="password"
                    className="input input-bordered"
                  />
                  <ErrorMessage name="password">
                    {(msg) => {
                      return <div className="text-red-600 mt-2">{msg}</div>;
                    }}
                  </ErrorMessage>
                  <div className="flex flex-row-reverse">
                    <div>
                      <label className="label">
                        <Link
                          href="/login"
                          className="label-text-alt link link-hover"
                        >
                          Já tenho uma conta
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-control mt-6">
                  <button className="btn btn-primary">Registrar</button>
                </div>
              </form>
            </FormikProvider>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
