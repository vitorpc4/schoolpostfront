import { Hand } from "lucide-react";

export default function Welcome() {
  return (
    <main>
      <div className="hero bg-base-200 min-h-[1250]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="flex justify-center">
              <h1 className="text-5xl font-bold mr-5">Olá</h1>
              <Hand size={48}></Hand>
            </div>

            <p className="py-6">
              Para iniciarmos, selecione uma escola no menu superior. Ao
              selecionar a escola será possível abrir o menu lateral
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
