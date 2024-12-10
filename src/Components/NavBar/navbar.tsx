import { useSchool } from "@/app/context/SchoolContext";
import {
  CircleUser,
  House,
  PanelLeftClose,
  PanelRightClose,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SelectSchool } from "../School/SelectSchool/SelectSchool";
import { useRouter } from "next/navigation";
import { ISchool } from "@/http/Models/Response/ISchool";
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
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="bg-base-300 p-2 flex justify-between w-screen ">
        <div>
          <label
            htmlFor="my-drawer"
            className={`btn btn-square btn-outline mx-2 ${
              !user ? "btn-disabled" : ""
            } `}
          >
            <PanelRightClose />
          </label>
        </div>
        <div>
          <SelectSchool />
        </div>
        <div>
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="rounded-full">
                <CircleUser />
              </div>
            </button>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/settings">Settings</Link>
              </li>
              <li onClick={logOut}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          className="drawer-overlay"
          aria-label="Close sidebar"
        ></label>
        <nav className="menu bg-base-200 text-base-content min-h-screen w-96 p-3">
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-outline drawer-overlay"
            aria-label="Close sidebar"
          >
            <PanelLeftClose />
          </label>
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
        </nav>
      </div>
    </div>
  );
};
