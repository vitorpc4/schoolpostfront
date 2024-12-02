"use client";
import { NavBar } from "@/Components/NavBar/navbar";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="z-10">{children}</main>
    </>
  );
}
