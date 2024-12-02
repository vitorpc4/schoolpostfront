"use client";

import { IUserSchoolAssociation } from "@/http/Models/Response/IUserSchoolAssociation";
import { createContext, useContext, useEffect, useState } from "react";
import { IResponseToken } from "../(account)/login/page";

const SchoolContext = createContext<{
  selectedSchool: string | null;
  setSelectedSchool: (school: string) => void;
  association: IUserSchoolAssociation[];
  setAssociation: (association: IUserSchoolAssociation[]) => void;
}>({
  selectedSchool: null,
  setSelectedSchool: () => {},
  association: [],
  setAssociation: () => {},
});

export function useSchool() {
  return useContext(SchoolContext);
}

const updateObjuser = (user: string, token: string) => {
  let emailUser = "";

  if (user || user.length > 0) {
    emailUser = user
      .replace(/\\(.)/g, "$1")
      .split(",")
      .find((x) => x.includes("email"))
      ?.split(":")[1]!
      .trim()!
      .replace(/^"+|"+$/g, "")!;
  }

  const claims = atob(token.split(".")[1]);

  const dataJWTJson = JSON.parse(claims) as IResponseToken;

  const users: IUserSchoolAssociation[] = [];

  if (dataJWTJson.schools.length > 0) {
    dataJWTJson.schools.forEach((school) => {
      const userData: IUserSchoolAssociation = {
        user: {
          id: dataJWTJson.sub,
          username: dataJWTJson.userName,
          email: emailUser,
          status: true,
        },
        id: school.IUserAssociationId,
        school: {
          id: school.schoolId,
          name: "",
          status: true,
        },
        admin: school.admin,
        typeUser: school.typeUser,
        status: true,
      };

      users.push(userData);
    });
  }

  if (users.length > 0) {
    const expirationDate = new Date(Date.now());

    expirationDate.setMinutes(expirationDate.getMinutes() + 60);
    document.cookie = `user=${JSON.stringify(
      users
    )}; Expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;

    return users;
  }
};

export function SchoolProvider({ children }: { children: React.ReactNode }) {
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [association, setAssociation] = useState<IUserSchoolAssociation[]>([]);
  useEffect(() => {
    if (!association) {
      return;
    }
    if (document.cookie.length === 0) {
      return;
    }

    if (association.length > 0) {
      return;
    }

    const user = document.cookie
      .split(";")
      .find((x) => x.includes("user"))
      ?.split("=")[1];

    const token = document.cookie
      .split(";")
      .find((x) => x.includes("token"))
      ?.split("=")[1];

    if (user && token) {
      const usersUpdate = updateObjuser(user, token)!;

      setAssociation(usersUpdate);
    }
  }, [association, setAssociation]);
  return (
    <SchoolContext.Provider
      value={{ selectedSchool, setSelectedSchool, association, setAssociation }}
    >
      {children}
    </SchoolContext.Provider>
  );
}
