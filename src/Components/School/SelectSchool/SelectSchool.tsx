"use client";

import { useSchool } from "@/app/context/SchoolContext";
import { ApiResponse } from "@/http/Models/ApiResponse";
import { ISchool } from "@/http/Models/Response/ISchool";
import { IUserSchoolAssociation } from "@/http/Models/Response/IUserSchoolAssociation";
import AssociationRepository from "@/http/Repository/AssociationRepository";
import { useEffect, useRef, useState } from "react";

export const SelectSchool = () => {
  const { selectedSchool, setSelectedSchool, association } = useSchool();

  const [schools, setSchools] = useState<ISchool[] | undefined>([]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedSchool = e.target.value;

    const school = schools?.find((item) => item.id === newSelectedSchool);

    setSelectedSchool(newSelectedSchool);

    localStorage.setItem("selectedSchool", JSON.stringify(school));

    window.location.reload();
  };

  useEffect(() => {
    if (!association) {
      return;
    }
    if (association.length === 0) {
      return;
    }

    const associationRepository: AssociationRepository =
      new AssociationRepository();
    associationRepository
      .getUserAssociationByUserId(association[0].user.id!)
      .then((response: ApiResponse<IUserSchoolAssociation[]>) => {
        const schools = response.data
          ?.map((item) => item.school)
          .filter((school): school is ISchool => school !== undefined);

        if (schools) {
          setSchools(schools);
          const mySchool = localStorage.getItem("selectedSchool");
          if (!mySchool) {
            return;
          }

          const searchAssociationInMySchool = schools.find(
            (item) => item.id === JSON.parse(mySchool).id
          );

          if (!searchAssociationInMySchool) {
            if (!schools[0]) {
              return;
            }

            setSelectedSchool(schools[0].id!);
            localStorage.setItem("selectedSchool", JSON.stringify(schools[0]));

            return;
          }

          const school = JSON.parse(mySchool) as ISchool;
          setSelectedSchool(school.id!);
        }
      })
      .catch((error) => {
        console.log("Error >>>>", error);
      });
  }, [association]);

  return (
    <>
      <div>
        <select
          value={selectedSchool || ""}
          onChange={handleChange}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="" disabled>
            Escolha a escola
          </option>
          {schools?.map((item, index) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
