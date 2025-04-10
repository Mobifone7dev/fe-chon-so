import React from "react";
import RegisterForm from "../../components/register/RegisterForm";
import { redirect } from "next/navigation";
import { authOptions } from "../../app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }
  return <RegisterForm />;
};

export default page;
