import { IUser } from "@/http/Models/Response/IUser";
import { Trash } from "lucide-react";

interface IDeleteUserProps {
  user: IUser;
  onDeleted: (id: number) => void;
}

export default function DeleteUser({ user, onDeleted }: IDeleteUserProps) {
  return (
    <div>
      <button
        className="btn w-32"
        onClick={() => {
          const modal = document.getElementById(
            "modal_" + user.id!.toString()
          ) as HTMLDialogElement;
          if (modal) {
            modal.showModal();
          }
        }}
      >
        <Trash /> Excluir
      </button>
    </div>
  );
}
