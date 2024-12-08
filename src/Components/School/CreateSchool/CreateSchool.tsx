import { Hand } from "lucide-react";
import { DialogForm } from "./DialogForm";
import toast from "react-hot-toast";

export default function CreateSchool() {
  const refreshPage = async () => {
    toast.success("Escola criada com sucesso!", {
      duration: 800,
      position: "top-right",
    });

    await new Promise((resolve) => setTimeout(resolve, 800));

    window.location.reload();
  };
  return (
    <div>
      <main>
        <div
          className="hero bg-base-200"
          style={{ minHeight: "calc(100vh - 70px)" }}
        >
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="flex justify-center">
                <h1 className="text-5xl font-bold mr-5">Olá</h1>
                <Hand size={48}></Hand>
              </div>

              <p className="py-6">
                Ooops... Parece que você ainda não faz parte de uma escola. Para
                iniciarmos será necessário que você crie uma escola clicando no
                botão abaixo.
              </p>
              <DialogForm refreshPage={refreshPage} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
