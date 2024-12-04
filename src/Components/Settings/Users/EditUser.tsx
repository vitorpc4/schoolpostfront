"use client";

import { useSchool } from "@/app/context/SchoolContext";
import { TypeUser } from "@/http/Models/Enum/TypeUser";
import { IUpdateUserRequest } from "@/http/Models/Requests/Users/IUpdateUserRequest";
import { ISchool } from "@/http/Models/Response/ISchool";
import UserRepository from "@/http/Repository/User.Repository";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { Eye, EyeClosed, Pencil, RefreshCcw } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  username: Yup.string().required("Campo nome obrigatório"),
  email: Yup.string().required("Campo email obrigatório"),
  password: Yup.string().required("Campo senha obrigatório"),
  typeUser: Yup.string().required("Campo tipo de usuário obrigatório"),
  admin: Yup.boolean(),
});

interface IFormUpdate {
  username: string;
  email: string;
  password: string;
  typeUser: string;
  admin: boolean;
}

interface IEditUserProps {
  id: number;
  responseEdit: (result: boolean) => void;
}

export default function EditUser({ id, responseEdit }: IEditUserProps) {
  const { association } = useSchool();
  const [visiblePass, setVisiblePass] = useState(false);
  const [admin, setAdmin] = useState(false);

  const changeVisiblePass = () => {
    setVisiblePass(!visiblePass);
  };

  const closeModal = () => {
    const modal = document.getElementById(
      `updateUserModal${id}`
    ) as HTMLDialogElement;
    if (modal) {
      formik.resetForm();
      modal.close();
    }
  };

  const getUserById = () => {
    const userRepository = new UserRepository();

    userRepository
      .get(id.toString())
      .then((res) => {
        console.log("res >>>>", res);

        console.log(getInfoSelectedStation());

        const userAssociation = res.data!.userSchoolAssociation?.find(
          (x) => x.school?.id === getInfoSelectedStation()?.school?.id
        );

        console.log("user association: ");
        console.log(userAssociation);

        formik.setFieldValue("username", res.data!.username);
        formik.setFieldValue("email", res.data!.email);
        formik.setFieldValue("typeUser", userAssociation?.typeUser);
        formik.setFieldValue("admin", userAssociation?.admin);
      })
      .catch((error) => {
        console.log("Error on getUserById", error);
      });
  };

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    formik.setFieldValue("password", randomPassword);
  };

  const updateUserHandle = (values: IUpdateUserRequest) => {
    const userRepository: UserRepository = new UserRepository();

    userRepository
      .update(values.id, values)
      .then((res) => {
        console.log("res >>>>", res);
        responseEdit(true);
        formik.resetForm();
        closeModal();
      })
      .catch((error) => {
        responseEdit(false);
        console.log("Error on updateUserHandle", error);
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

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      typeUser: "",
      admin: admin,
    },
    onSubmit: (values: IFormUpdate) => {
      if (values.typeUser === TypeUser.Student) {
        values.admin = false;
      }

      const schoolId = getInfoSelectedStation()?.school?.id!;

      const post: IUpdateUserRequest = {
        id: id.toString(),
        admin: values.admin,
        email: values.email,
        password: values.password,
        typeUser:
          values.typeUser === "Professor"
            ? TypeUser.Professor
            : TypeUser.Student,
        username: values.username,
        schoolId: schoolId,
        status: true,
      };

      updateUserHandle(post);
    },

    validationSchema: validationSchema,
  });

  return (
    <>
      <div className="flex flex-row justify-end">
        <button
          className="btn w-32"
          onClick={() => {
            const modal = document.getElementById(
              `updateUserModal${id}`
            ) as HTMLDialogElement | null;
            if (modal) {
              getUserById();
              modal.showModal();
            }
          }}
        >
          <Pencil />
          Editar
        </button>
      </div>
      <dialog id={`updateUserModal${id}`} className="modal">
        <div className="modal-box">
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} method="dialog">
              <div className="form-control">
                <div>
                  <label className="label">
                    <span className="label-text">Nome</span>
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    type="text"
                    placeholder="Nome"
                    name="username"
                    className="input input-bordered w-full"
                  />
                  <ErrorMessage name="username">
                    {(msg) => {
                      return <div className="text-red-600 mt-2">{msg}</div>;
                    }}
                  </ErrorMessage>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    type="email"
                    placeholder="Email"
                    name="email"
                    className="input input-bordered w-full"
                  />
                  <ErrorMessage name="email">
                    {(msg) => {
                      return <div className="text-red-600 mt-2">{msg}</div>;
                    }}
                  </ErrorMessage>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Senha</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-2">
                    <input
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      type={visiblePass ? "text" : "password"}
                      placeholder="Senha"
                      name="password"
                    />

                    <div className=" flex flex-row-reverse w-full ml-5">
                      <button
                        type="button"
                        className="btn-sm"
                        onClick={changeVisiblePass}
                      >
                        {visiblePass ? <Eye /> : <EyeClosed />}
                      </button>

                      <button
                        type="button"
                        className="btn-sm mr-3"
                        onClick={generateRandomPassword}
                      >
                        <RefreshCcw />
                      </button>
                    </div>
                  </label>
                  <ErrorMessage name="password">
                    {(msg) => {
                      return <div className="text-red-600 mt-2">{msg}</div>;
                    }}
                  </ErrorMessage>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text">Tipo usuário</span>
                  </label>
                  <select
                    onChange={formik.handleChange}
                    value={formik.values.typeUser}
                    name="typeUser"
                    className="select select-bordered w-full"
                  >
                    <option disabled value="">
                      Selecione
                    </option>
                    <option value="Professor">Professor</option>
                    <option value="Student">Student</option>
                  </select>
                  <ErrorMessage name="typeUser">
                    {(msg) => {
                      return <div className="text-red-600 mt-2">{msg}</div>;
                    }}
                  </ErrorMessage>
                </div>
                {formik.values.typeUser === TypeUser.Professor ? (
                  <div>
                    <div className="flex flex-row mt-3 gap-3">
                      <span>Administrador</span>
                      <input
                        type="checkbox"
                        onChange={formik.handleChange}
                        checked={formik.values.admin}
                        name="admin"
                        className="toggle"
                      />
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="flex flex-row-reverse mt-2 gap-2">
                <button type="submit" className="btn">
                  Atualizar
                </button>
                <button type="button" onClick={closeModal} className="btn">
                  Fechar
                </button>
              </div>
            </form>
          </FormikProvider>
        </div>
      </dialog>
    </>
  );
}
