"use client";

import { Ilogin } from "@/http/Interfaces/ILogin";
import { ApiResponse } from "@/http/Models/ApiResponse";
import { ILoginPost } from "@/http/Models/Requests/ILoginPost";
import LoginRepository from "@/http/Repository/LoginRepository";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IUserSchoolAssociation } from "@/http/Models/Response/IUserSchoolAssociation";
import * as Yup from "yup";
import { TypeUser } from "@/http/Models/Enum/TypeUser";
import { useSchool } from "@/app/context/SchoolContext";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Email inválido")
    .required("Campo email obrigatório"),
  password: Yup.string()
    .min(6, "Campo senha deve ter no mínimo 6 caracteres")
    .required("Campo senha obrigatório"),
});

interface ILoginSchoolResponse {
  IUserAssociationId: number;
  admin: boolean;
  schoolId: string;
  typeUser: TypeUser;
}

export interface IResponseToken {
  sub: number;
  userName: string;
  schools: ILoginSchoolResponse[];
}

export default function Login() {
  const router = useRouter();

  const { setAssociation } = useSchool();

  const expirationDate = new Date(Date.now());

  expirationDate.setMinutes(expirationDate.getMinutes() + 60);

  const loginAccount = async (value: ILoginPost) => {
    const repository: LoginRepository = new LoginRepository();

    await repository
      .login(value)
      .then((response: ApiResponse<Ilogin>) => {
        const access_token = response.data?.access_token!;

        document.cookie = `token=${access_token}; Expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;

        const claims = atob(access_token.split(".")[1]);

        const dataJWTJson = JSON.parse(claims) as IResponseToken;

        const users: IUserSchoolAssociation[] = [];

        if (dataJWTJson.schools.length === 0) {
          const userData: IUserSchoolAssociation = {
            user: {
              id: dataJWTJson.sub,
              username: dataJWTJson.userName,
              email: value.email,
              status: true,
            },
            status: true,
          };

          users.push(userData);
        } else {
          dataJWTJson.schools.forEach((school) => {
            const userData: IUserSchoolAssociation = {
              user: {
                id: dataJWTJson.sub,
                username: dataJWTJson.userName,
                email: value.email,
                status: true,
              },
              id: school.IUserAssociationId,
              school: {
                id: school.schoolId,
                name: "",
                status: true,
              },
              admin: school.admin,
              typeUser: school.typeUser,
              status: true,
            };

            users.push(userData);
          });
        }

        setAssociation(users);

        document.cookie = `user=${JSON.stringify(
          users
        )}; Expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;

        router.push("/");
      })
      .catch((error) => {
        toast.error("Email ou senha inválidos", {
          position: "top-right",
          duration: 3000,
          style: {
            backgroundColor: "#1d232a",
            color: "#fff",
          },
          icon: "❌",
        });
        console.log("Error >>>>", error);
      });
  };

  useEffect(() => {
    const token = document.cookie.split("=")[1];

    if (token) {
      router.push("/");
    }
  }, [router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      loginAccount(values);
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
                    placeholder="email"
                    name="email"
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
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    type="password"
                    placeholder="password"
                    name="password"
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
                          href="/register"
                          className="label-text-alt link link-hover"
                        >
                          Criar Conta
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-control mt-6">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
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
