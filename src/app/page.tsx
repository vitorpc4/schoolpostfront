"use client";

import { NavBar } from "@/Components/NavBar/navbar";
import { useSchool } from "./context/SchoolContext";
import { Frown, Hand } from "lucide-react";
import { DialogForm } from "@/Components/School/CreateSchool/DialogForm";
import toast, { Toaster } from "react-hot-toast";
import CreateSchool from "@/Components/School/CreateSchool/CreateSchool";
import { ISchool } from "@/http/Models/Response/ISchool";
import { useState } from "react";
import { IUserSchoolAssociation } from "@/http/Models/Response/IUserSchoolAssociation";
import Welcome from "@/Components/School/Welcome/welcome";

export default function Home() {
  const { association } = useSchool();
  const [schoolselect, setSchoolSelect] =
    useState<IUserSchoolAssociation | null>(null);

  const getInfoSelectedStation = () => {
    if (association.length > 0) {
      const getLocalStore = localStorage.getItem("selectedSchool");
      if (getLocalStore != null) {
        const selectedSchool = JSON.parse(getLocalStore) as ISchool;

        const getAssociationBySchoolId = association.find(
          (x) => x.school?.id === selectedSchool.id
        );

        setSchoolSelect(getAssociationBySchoolId!);
      }
    }
  };

  return (
    <>
      <NavBar />
      {association.length === 0 ? <CreateSchool /> : <Welcome />}

      <Toaster />
    </>
  );
}
