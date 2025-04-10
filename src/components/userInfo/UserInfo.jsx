"use client";
import React from "react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserInfo = () => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <div className="grid place-items-center h-screen card">
      <div className="shadow-lg p-8  flex flex-col gap-2 my-6 ">
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
      </div>
      <div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
      </div>
      <button
        onClick={() => {
          signOut({ redirect: false });
          router.push("/login");
        }}
        className="bg-red-500 text-white font-bold px-6 py-2 mt-3"
      >
        Logout
      </button>
    </div>
  );
};

export default UserInfo;
