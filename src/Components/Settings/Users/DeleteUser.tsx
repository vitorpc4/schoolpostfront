import { useSchool } from "@/app/context/SchoolContext";
import { ISchool } from "@/http/Models/Response/ISchool";
import { IUserAssociation } from "@/http/Models/Response/IUserAssociation";
import { Trash } from "lucide-react";

interface IDeleteUserProps {
  user: IUserAssociation;
  onDeleted: (id: number) => void;
}

export default function DeleteUser({ user, onDeleted }: IDeleteUserProps) {
  const { association } = useSchool();

  const closeModal = () => {
    const modal = document.getElementById(
      "modalDelete" + user.id!.toString()
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  return (
    <div>
      <button
        className="btn w-16"
        onClick={() => {
          const modal = document.getElementById(
            "modalDelete" + user.id!.toString()
          ) as HTMLDialogElement;
          if (modal) {
            modal.showModal();
          }
        }}
      >
        <Trash />
      </button>
      <dialog id={"modalDelete" + user.id!.toString()} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Excluir usuário</h3>
          <div className="form-control">
            <div>
              <p className="py-4">
                Você tem certeza que deseja excluir o usuário
                <strong> {user.username}</strong>?
              </p>
            </div>
            <div className="flex flex-row-reverse mt-2 gap-2">
              <button
                className="btn btn-error"
                onClick={() => {
                  onDeleted(user.userSchoolAssociationId!);
                  closeModal();
                }}
              >
                Excluir
              </button>
              <button className="btn " onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
