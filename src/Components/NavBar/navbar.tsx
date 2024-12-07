import { useSchool } from "@/app/context/SchoolContext";
import {
  House,
  NotebookPen,
  PanelLeftClose,
  PanelRightClose,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SelectSchool } from "../School/SelectSchool/SelectSchool";
import { useRouter } from "next/navigation";
import { ISchool } from "@/http/Models/Response/ISchool";
import { IUserAssociation } from "@/http/Models/Response/IUserAssociation";
import { IUserSchoolAssociation } from "@/http/Models/Response/IUserSchoolAssociation";
import { TypeUser } from "@/http/Models/Enum/TypeUser";

export const NavBar = () => {
  const router = useRouter();
  const { association } = useSchool();
  const [user, setUser] = useState<IUserSchoolAssociation>();
  const logOut = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const getInfoSelectedStation = () => {
    if (!association) return;

    if (association.length > 0) {
      const getLocalStore = localStorage.getItem("selectedSchool");
      if (getLocalStore != null) {
        const selectedSchool = JSON.parse(getLocalStore) as ISchool;

        const getAssociationBySchoolId = association.find(
          (x) => x.school?.id === selectedSchool.id
        );

        if (getAssociationBySchoolId) {
          setUser(getAssociationBySchoolId);
        }
      }
    }
  };

  useEffect(() => {
    getInfoSelectedStation();
  }, [getInfoSelectedStation]);

  return (
    <div className="drawer w-screen">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col-5">
        <div className="navbar bg-base-300 w-screen">
          <div className="flex justify-between w-screen">
            <div className="mx-2">
              <label
                htmlFor="my-drawer"
                className={`
                   ${user == undefined ? "btn-disabled" : ""} 
                  btn 
                  btn-square 
                  btn-outline`}
              >
                <PanelRightClose />
              </label>
            </div>
            <SelectSchool />
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link href={"/settings"}>Settings</Link>
                </li>
                <li onClick={logOut}>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div
          className="menu bg-base-200 text-base-content min-h-full 
            w-80
            p-3"
        >
          <label
            className={`
              
              btn btn-square 
                btn-outline drawer-overlay
                
                `}
            aria-label="close sidebar"
            htmlFor="my-drawer"
          >
            <PanelLeftClose />
          </label>
          <div>
            <ul className="mt-2">
              <li>
                <Link href="/">
                  <House />
                  Home
                </Link>
              </li>
              <li>
                <details open>
                  <summary>
                    <StickyNote />
                    Posts
                  </summary>
                  <ul>
                    <li>
                      <Link href="/posts">Posts</Link>
                    </li>
                    {user?.typeUser === TypeUser.Professor && (
                      <li>
                        <Link href="/adminpost">Administração</Link>
                      </li>
                    )}
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
