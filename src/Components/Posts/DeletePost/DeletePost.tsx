import IAdminPosts from "@/app/Interface/IAdminPosts";
import { IPost } from "@/http/Models/Response/IPost";
import { Trash } from "lucide-react";

interface IDeletePostProps {
  post: IPost;
  onDeleted: (id: number) => void;
}
export default function DeletePost({ post, onDeleted }: IDeletePostProps) {
  const handleSubmit = () => {
    onDeleted(post.id!);
  };

  const closeModal = () => {
    const modal = document.getElementById(
      `modal_${post.id!.toString()}`
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  return (
    <>
      <div>
        <button
          className="btn w-16 md:w-32"
          onClick={() => {
            const modal = document.getElementById(
              "modal_" + post.id!.toString()
            ) as HTMLDialogElement;
            if (modal) {
              modal.showModal();
            }
          }}
        >
          <Trash />
        </button>
        <dialog
          id={`modal_${post.id!.toString()}`}
          className="modal sm:modal-middle"
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg flex gap-3">
              <Trash /> Excluir
            </h3>
            <p className="py-4">Tem certeza que deseja excluir o post?</p>
            <p>Titulo: {post.title}</p>
            <p>Autor: {post.username}</p>
            <div className="modal-action">
              <form onSubmit={handleSubmit} method="dialog">
                <div className="flex gap-2">
                  <button type="button" onClick={closeModal} className="btn">
                    Close
                  </button>
                  <button type="submit" className="btn btn-error">
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}
