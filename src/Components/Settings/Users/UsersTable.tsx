"use client";

import { useSchool } from "@/app/context/SchoolContext";
import { ISchool } from "@/http/Models/Response/ISchool";
import { IUser } from "@/http/Models/Response/IUser";
import AssociationRepository from "@/http/Repository/AssociationRepository";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { Ellipsis, Pencil } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import DeleteUser from "./DeleteUser";

export default function UsersTable() {
  const { association } = useSchool();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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

  const getUsers = async (option: PaginationState) => {
    const associationRepository = new AssociationRepository();

    const school = getInfoSelectedStation()!;

    const schoolId = school.school?.id;

    try {
      const res = await associationRepository.getUsersBySchoolId(
        schoolId!,
        option.pageIndex + 1,
        option.pageSize
      );

      return res.data;
    } catch (error) {
      console.log("Error on getUsers", error);
      toast.error("Erro ao buscar usuários", {
        duration: 2500,
        position: "top-right",
      });

      return { users: [], totalItems: 0 };
    }
  };

  const deleteUser = useCallback((id: number) => {
    console.log("deletando: ", id);
    dataQuery.refetch();
  }, []);

  const columns = useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        Header: "Id",
        accessorKey: "id",
        cell: ({ row }) => <span>{row.original.id}</span>,
      },
      {
        Header: "Name",
        accessorKey: "username",
        cell: ({ row }) => <span>{row.original.username}</span>,
      },
      {
        Header: "email",
        accessorKey: "email",
        cell: ({ row }) => <span>{row.original.email}</span>,
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

              <DeleteUser user={row.original} onDeleted={deleteUser} />
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const dataQuery = useQuery({
    queryKey: ["users", pagination],
    queryFn: () => getUsers(pagination),
    placeholderData: keepPreviousData,
  });

  const table = useReactTable({
    data: dataQuery.data?.users ?? [],
    columns,
    rowCount: dataQuery.data?.totalItems || 0,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
    autoResetPageIndex: false,
    autoResetExpanded: false,
  });

  return (
    <>
      <div>
        <div className="flex flex-row justify-end">
          <button className="btn">Criar usuário</button>
        </div>
        <table className="table table-zebra">
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
      </div>
      <Toaster />
    </>
  );
}
