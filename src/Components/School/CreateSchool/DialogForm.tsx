import { useSchool } from "@/app/context/SchoolContext";
import SchoolRepository from "@/http/Repository/SchoolRepository";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const validationSchema = Yup.object({
  schoolName: Yup.string().required("Campo nome obrigatório"),
});

interface DialogFormProps {
  refreshPage: () => void;
}

export const DialogForm = (props: DialogFormProps) => {
  const closeModal = () => {
    const modal = document.getElementById(
      `createSchoolModal`
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  const createSchoolHandle = (values: any) => {
    const schoolRepository: SchoolRepository = new SchoolRepository();
    const expirationDate = new Date(Date.now());
    expirationDate.setMinutes(expirationDate.getMinutes() + 60);

    schoolRepository
      .createSchool({
        name: values.schoolName,
        status: true,
      })
      .then((res) => {
        const newToken = res.data?.token;
        document.cookie = `token=${newToken}; Expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
        props.refreshPage();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formik = useFormik({
    initialValues: {
      schoolName: "",
    },
    onSubmit: (values) => {
      createSchoolHandle(values);
    },
    validationSchema: validationSchema,
  });

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() =>
          (
            document.getElementById("createSchoolModal") as HTMLDialogElement
          )?.showModal()
        }
      >
        Criar Escola
      </button>

      <dialog
        id="createSchoolModal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cria Escola</h3>

          <div className="">
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit} method="dialog">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nome</span>
                  </label>
                  <input
                    onChange={formik.handleChange}
                    value={formik.values.schoolName}
                    type="text"
                    placeholder="Nome"
                    name="schoolName"
                    className="input input-bordered"
                  />
                  <ErrorMessage name="schoolName">
                    {(msg) => {
                      return <div className="text-red-600 mt-2">{msg}</div>;
                    }}
                  </ErrorMessage>
                </div>
                <div className="flex mt-2 gap-2">
                  <button type="submit" className="btn">
                    Criar
                  </button>
                  <button onClick={closeModal} className="btn">
                    Close
                  </button>
                </div>
              </form>
            </FormikProvider>
          </div>
        </div>
      </dialog>
    </>
  );
};
