"use client";

import { useSchool } from "@/app/context/SchoolContext";
import { ISchool } from "@/http/Models/Response/ISchool";
import { IUserAssociation } from "@/http/Models/Response/IUserAssociation";
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
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";

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
    const associationRepository = new AssociationRepository();
    associationRepository
      .delete(id.toString())
      .then(() => {
        toast.success("Usuário excluído com sucesso", {
          duration: 2500,
          position: "top-right",
        });
        dataQuery.refetch();
      })
      .catch(() => {
        toast.error("Erro ao excluir usuário", {
          duration: 2500,
          position: "top-right",
        });
      });
  }, []);

  const columns = useMemo<ColumnDef<IUserAssociation>[]>(
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
              <EditUser id={row.original.id!} responseEdit={editUserHandle} />

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

  const editUserHandle = (result: boolean) => {
    if (result) {
      dataQuery.refetch();
      toast.success("Usuário atualizado com sucesso", {
        duration: 2500,
        position: "top-right",
      });
      return;
    }
  };

  const createUserHandle = (result: boolean) => {
    if (result) {
      dataQuery.refetch();
      toast.success("Usuário criado com sucesso", {
        duration: 2500,
        position: "top-right",
      });
      return;
    }

    toast.error("Erro ao criar usuário", {
      duration: 2500,
      position: "top-right",
    });
  };

  return (
    <>
      <div>
        <CreateUser responseCreate={createUserHandle} />
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
      </div>
      <Toaster />
    </>
  );
}
