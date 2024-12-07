import { useSchool } from "@/app/context/SchoolContext";
import { TypeUser } from "@/http/Models/Enum/TypeUser";
import { ICreateUserRequest } from "@/http/Models/Requests/Users/ICreateUserRequest";
import { ISchool } from "@/http/Models/Response/ISchool";
import UserRepository from "@/http/Repository/User.Repository";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { Eye, EyeClosed, RefreshCcw, Type } from "lucide-react";
import { useDebugValue, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  username: Yup.string().required("Campo nome obrigatório"),
  email: Yup.string().required("Campo email obrigatório"),
  password: Yup.string().required("Campo senha obrigatório"),
  typeUser: Yup.string().required("Campo tipo de usuário obrigatório"),
  admin: Yup.boolean(),
});

interface IFormCreate {
  username: string;
  email: string;
  password: string;
  typeUser: string;
  admin: boolean;
}

interface ICreateUserProps {
  responseCreate: (result: boolean) => void;
}

export default function CreateUser({ responseCreate }: ICreateUserProps) {
  const { association } = useSchool();
  const [visiblePass, setVisiblePass] = useState(false);
  const [admin, setAdmin] = useState(false);

  const changeVisiblePass = () => {
    setVisiblePass(!visiblePass);
  };

  const closeModal = () => {
    const modal = document.getElementById(
      `createUserModal`
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    formik.setFieldValue("password", randomPassword);
  };

  const createUserHandle = (values: ICreateUserRequest) => {
    const userRepository: UserRepository = new UserRepository();

    userRepository
      .createUserAssociation(values)
      .then((res) => {
        console.log("res >>>>", res);
        responseCreate(true);
        formik.resetForm();
        closeModal();
      })
      .catch((error) => {
        responseCreate(false);
        console.log("Error on createUserHandle", error);
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
    onSubmit: (values: IFormCreate) => {
      console.log("tgeat");
      if (values.typeUser === TypeUser.Student) {
        values.admin = false;
      }

      const schoolId = getInfoSelectedStation()?.school?.id!;

      const post: ICreateUserRequest = {
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

      createUserHandle(post);
    },

    validationSchema: validationSchema,
  });

  return (
    <>
      <div className="flex flex-row justify-end">
        <button
          className="btn"
          onClick={() => {
            const modal = document.getElementById(
              "createUserModal"
            ) as HTMLDialogElement | null;
            if (modal) {
              modal.showModal();
            }
          }}
        >
          Criar usuário
        </button>
      </div>
      <dialog id="createUserModal" className="modal">
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
                  Criar
                </button>
                <button onClick={closeModal} className="btn">
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
