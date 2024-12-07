"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ChevronUp, FileX } from "lucide-react";
import { useEffect, useState } from "react";
import PostRepository from "@/http/Repository/PostRepository";
import toast, { Toaster } from "react-hot-toast";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";

export default function ReadNews() {
  const [isOpen, setIsOpen] = useState(true);

  const title = "Descoberta Revolucionária na Ciência";
  const description =
    "Cientistas fazem avanço significativo que pode mudar o futuro da medicina e tecnologia";
  const author = "Maria Silva";
  const id = useSearchParams().get("id");

  const image =
    "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";

  const getNews = async (id: number) => {
    const postRepository = new PostRepository();

    const school = localStorage.getItem("selectedSchool");

    if (!school) {
      return;
    }

    const schoolId = JSON.parse(school).id;

    const res = await postRepository.GetPost(id, schoolId).then((response) => {
      return response.data;
    });

    return res;
  };

  const queryClient = useQueryClient();
  const { status, data, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      try {
        return await getNews(id != null ? parseInt(id) : 0);
      } catch (error) {
        throw error;
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
    retry: false,
  });

  useEffect(() => {
    if (!isPlaceholderData && data?.id) {
      queryClient.prefetchQuery({
        queryKey: ["post", data.id],
        queryFn: () => getNews(data.id!),
      });
    }
  }, [id, data, isPlaceholderData, queryClient, status]);

  if (id === null) {
    return <h1>Notícia não encontrada</h1>;
  }

  if (status === "error") {
    return (
      <>
        <div className="hero bg-base-200 min-h-[1250]">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <div className="flex justify-center mb-5">
                <FileX size={48} />
              </div>

              <h1 className="text-5xl font-bold">Não encontrado</h1>
              <p className="py-6">
                O post solicitado não existe ou foi removido. Verifique com o
                administrador da sua escola.
              </p>
              <button className="btn btn-primary">
                <Link href={"/posts"}>Voltar Posts</Link>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex justify-between items-center w-full text-left"
              aria-expanded={isOpen}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {data?.title}
              </h1>
              {isOpen ? (
                <ChevronUp className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            <div
              className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out 
                ${isOpen ? "h-max opacity-100" : "max-h-0 opacity-0"} `}
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: data?.content!.replace(/<[^>]*>?/gm, "")!,
                }}
                className="text-gray-600 dark:text-gray-300 mb-6"
              ></p>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Por {data?.username}
                </span>
              </div>
            </div>
          </div>
        </article>
        <Toaster />
      </div>
    </>
  );
}
