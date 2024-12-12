"use client";

import { useSchool } from "@/app/context/SchoolContext";
import { NewsCard } from "@/Components/News/NewsCard/newsCard";
import { IPost } from "@/http/Models/Response/IPost";
import PostRepository from "@/http/Repository/PostRepository";
import {
  keepPreviousData,
  QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Posts() {
  const router = useRouter();

  const [page, setPage] = useState(0);

  const [search, setSearch] = useState("");

  const queryClient = useQueryClient();

  const { status, data, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["posts", page, search],
    queryFn: () => getPosts(page + 1, search),
    placeholderData: keepPreviousData,
  });

  const getPosts = async (page: number, search: string) => {
    const postRepository = new PostRepository();

    const school = localStorage.getItem("selectedSchool");
    if (school == null) {
      router.push("/");
      return { posts: [], totalItems: 0, hasMore: false };
    }

    const schoolId = JSON.parse(school).id;

    try {
      if (search) {
        const res = await postRepository.getPostByKeyWord(
          page,
          10,
          schoolId,
          search
        );

        return res.data || { posts: [], totalItems: 0, hasMore: false };
      }

      const res = await postRepository.getPosts(page, 12, schoolId);

      return res.data || { posts: [], totalItems: 0, hasMore: false };
    } catch (error) {
      toast.error("Erro ao buscar posts", {
        duration: 2500,
        position: "top-right",
      });

      return { posts: [], totalItems: 0, hasMore: false };
    }
  };

  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["posts", page + 1, search],
        queryFn: () => getPosts(page + 1, search),
      });
    }
  }, [data, isPlaceholderData, page, queryClient, search]);

  const searchPost = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const param = e.target.value;
    setSearch(param);
    setPage(0);
  }, []);

  return (
    <>
      <div className="mt-2 p-1 border-red-700">
        <label className="input input-bordered flex items-center gap-2">
          <input
            onChange={searchPost}
            type="text"
            className="grow"
            placeholder="Search"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      <div
        className="grid
        sm:grid-cols-1
        md:grid-cols-2
        lg:grid-cols-2 pl-6
        xl:grid-cols-3
        2xl:grid-cols-6
        gap-5 mt-3 mr-3"
      >
        {data?.posts &&
          data.posts.map((myNews: IPost, index: number) => (
            <NewsCard
              key={index}
              id={myNews.id!}
              title={myNews.title}
              description={myNews.content}
              author={myNews.username}
              image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            />
          ))}
      </div>

      <div className="grid mt-5 grid-flow-row">
        <div className="col-end-12">
          <div className="grid grid-cols-2">
            <div className="flex items-center justify-center">
              Página atual: {page + 1}
            </div>
            <div className="join">
              <button
                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                disabled={page === 0}
                className="join-item btn btn-outline"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setPage((old) => (data?.hasMore ? old + 1 : old));
                }}
                disabled={isPlaceholderData || !data?.hasMore}
                className="join-item btn btn-outline"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
