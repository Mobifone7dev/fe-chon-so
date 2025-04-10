import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { checkPackage } from "./../../../lib/api";
import { getQSParamFromURL } from "../../../until/functions";

export const dynamic = "force-dynamic";

export async function GET(req, context) {
  try {
    const isdn = getQSParamFromURL("isdn", req.url);
    const res = await checkPackage(isdn);
    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred while get code.", error },
      { status: 500 }
    );
  }
}

