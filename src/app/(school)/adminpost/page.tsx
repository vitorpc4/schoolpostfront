"use client";

import { useSchool } from "@/app/context/SchoolContext";
import IAdminPosts from "@/app/Interface/IAdminPosts";
import adminPosts from "@/app/MockData/MockData";
import DeletePost from "@/Components/Posts/DeletePost/DeletePost";
import { TypeUser } from "@/http/Models/Enum/TypeUser";
import { IPost } from "@/http/Models/Response/IPost";
import { ISchool } from "@/http/Models/Response/ISchool";
import { IUserSchoolAssociation } from "@/http/Models/Response/IUserSchoolAssociation";
import PostRepository from "@/http/Repository/PostRepository";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowLeft, ArrowRight, Check, Ellipsis, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback, useEffect } from "react";
import toast, { ToastBar, Toaster } from "react-hot-toast";

export default function AdminPosts() {
  const router = useRouter();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { association } = useSchool();

  const [search, setSearch] = useState<string>("");

  const getSchoolFromLocalStorage = () => {
    const schoolStorage = localStorage.getItem("selectedSchool");

    if (!schoolStorage) {
      return;
    }

    const school = JSON.parse(schoolStorage) as ISchool;

    return school;
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

  const getPosts = async (options: PaginationState, search: string) => {
    const postRepository = new PostRepository();
    const school = getSchoolFromLocalStorage();

    if (!school) {
      return;
    }

    const schoolId = school.id!;

    try {
      if (search) {
        const res = await postRepository.GetPublishedPostsAndDraftsByKeyWord(
          options.pageIndex + 1,
          options.pageSize,
          schoolId,
          search
        );

        return res.data;
      }

      const res = await postRepository.GetPublishedPostsAndDrafts(
        options.pageIndex + 1,
        options.pageSize,
        schoolId
      );

      return res.data;
    } catch (error) {
      toast.error("Erro ao buscar posts", {
        duration: 2500,
        position: "top-right",
      });

      return { posts: [], totalItems: 0 };
    }
  };

  const dataQuery = useQuery({
    queryKey: ["data", pagination, search],
    queryFn: () => getPosts(pagination, search),
    placeholderData: keepPreviousData,
  });

  const requestDeleteItem = (id: number) => {
    const postRepository = new PostRepository();
    const school = getSchoolFromLocalStorage();

    if (!school) {
      return;
    }

    postRepository
      .DeleteItem(id, school.id!)
      .then((response) => {
        console.log(response);
        toast.success("Post deletado com sucesso", {
          duration: 2500,
          position: "top-right",
        });
      })
      .catch((error) => {
        toast.error("Erro ao deletar o post", {
          duration: 2500,
          position: "top-right",
        });
      });
  };

  const deleteItem = useCallback(
    (id: number) => {
      requestDeleteItem(id);
      dataQuery.refetch();
    },
    [dataQuery]
  );

  const columns = useMemo<ColumnDef<IPost>[]>(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => (
          <div>
            <div className="font-bold">{row.original.title}</div>
            <div className="text-sm opacity-50">{row.original.username}</div>
          </div>
        ),
      },
      {
        header: "Description",
        accessorKey: "content",
        cell: ({ row }) => {
          return (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  row.original.content
                    .replace(/<[^>]*>?/gm, "")
                    .substring(0, 50) + " ...",
              }}
            ></div>
          );
        },
      },
      {
        header: "Publicado",
        accessorKey: "isDraft",
        cell: ({ row }) => <div>{row.original.isDraft ? "" : <Check />}</div>,
      },
      {
        header: "Ações",
        accessorKey: "actions",
        cell: ({ row }) => (
          <div className="dropdown dropdown-hover">
            <div tabIndex={0} role="button" className="btn m-1">
              <Ellipsis />
            </div>
            <div className="menu dropdown-content w-32 grid gap-1 z-50">
              <Link href={`/editPost/id?id=${row.original.id}`} className="btn">
                <Pencil />
                Editar
              </Link>

              <DeletePost post={row.original} onDeleted={deleteItem} />
            </div>
          </div>
        ),
      },
    ],
    [deleteItem]
  );

  const table = useReactTable({
    data: dataQuery.data?.posts ?? [],
    columns,
    rowCount: dataQuery.data?.totalItems || 0,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: false,
    autoResetPageIndex: false,
    autoResetExpanded: false,
  });

  useEffect(() => {
    const result = getInfoSelectedStation();
    if (result) {
      if (result.typeUser === TypeUser.Student) {
        toast.error("Você não tem permissão para acessar essa página", {
          duration: 2500,
          position: "top-right",
        });
        router.push("/");
      }
    }
  }, [getInfoSelectedStation()]);

  const searchPost = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const param = e.target.value;

    setSearch(param);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  return (
    <>
      <div className="container mx-auto px-48 mt-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Administrar Posts</h1>
          <div className="flex flex-row gap-2">
            <div>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  onChange={searchPost}
                  type="text"
                  className="grow"
                  placeholder="Search"
                />
              </label>
            </div>
            <div>
              <Link href="/createPost" className="btn">
                Criar Post
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <table className="table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <div>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-end mt-3 gap-3">
            <div>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="select select-bordered"
              >
                {[5, 10, 20, 30, 40, 50].map((pagesize) => (
                  <option key={pagesize} value={pagesize}>
                    {pagesize}
                  </option>
                ))}
              </select>
            </div>
            <div className="join gap-2">
              <div>
                <button
                  onClick={() => table.previousPage()}
                  className={`btn  
                ${!table.getCanPreviousPage() ? "btn-disabled" : ""}
                `}
                >
                  <ArrowLeft />
                </button>
              </div>
              <div>
                <button
                  onClick={() => table.nextPage()}
                  className={`btn
                ${!table.getCanNextPage() ? "btn-disabled" : ""}
              `}
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
            <div className="flex items-center">
              {table.getRowModel().rows.length.toLocaleString()} of{" "}
              {dataQuery.data?.totalItems.toLocaleString()} rows
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
