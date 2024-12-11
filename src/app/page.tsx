"use client";

import { NavBar } from "@/Components/NavBar/navbar";
import { useSchool } from "./context/SchoolContext";
import { Frown, Hand } from "lucide-react";
import { DialogForm } from "@/Components/School/CreateSchool/DialogForm";
import toast, { Toaster } from "react-hot-toast";
import CreateSchool from "@/Components/School/CreateSchool/CreateSchool";
import { ISchool } from "@/http/Models/Response/ISchool";
import { useEffect, useState } from "react";
import { IUserSchoolAssociation } from "@/http/Models/Response/IUserSchoolAssociation";
import Welcome from "@/Components/School/Welcome/welcome";

export default function Home() {
  const { association } = useSchool();
  const [schoolselect, setSchoolSelect] =
    useState<IUserSchoolAssociation | null>(null);
  const [schoolExist, setSchoolExist] = useState<boolean>(false);

  const getInfoSelectedStation = () => {
    if (association) {
      if (association.length > 0) {
        var searchSchool = association.find((x) => x.school);

        if (!searchSchool) {
          setSchoolExist(false);
        } else {
          setSchoolExist(true);
        }
      }
    }
  };

  useEffect(() => {
    getInfoSelectedStation();
  }, [association]);

  return (
    <>
      <NavBar />
      <div>{!schoolExist ? <CreateSchool /> : <Welcome />}</div>

      <Toaster />
    </>
  );
}
