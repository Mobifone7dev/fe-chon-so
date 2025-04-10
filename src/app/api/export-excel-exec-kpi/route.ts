import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import { getQSParamFromURL } from "../../../until/functions";

export async function GET(request: Request) {
    const URL = process.env.NEXTAUTH_APP_API_URL_SSL;

    if (!URL) {
        console.error("❌ Lỗi: NEXTAUTH_APP_API_URL không được định nghĩa");
        return NextResponse.json({ message: "API URL không được định nghĩa" }, { status: 500 });
    }

    const month = getQSParamFromURL("month", request.url);
    const kpiType = getQSParamFromURL("kpiType", request.url);
    const provincePt = getQSParamFromURL("provincePt", request.url);
    
    if (!month || !kpiType) {
        console.error("❌ Thiếu tham số bắt buộc: month hoặc kpiType");
        return NextResponse.json({ message: "Thiếu tham số month hoặc kpiType" }, { status: 400 });
    }

    // Chuyển đổi format tháng từ "MM/YYYY" thành "DD/MM/YYYY"
    const convertedMonth = `01/${month}`;

    const accessToken = cookies().get("accessToken")?.value;
    if (!accessToken) {
        console.error("❌ Không tìm thấy accessToken");
        return NextResponse.json({ message: "Không tìm thấy accessToken" }, { status: 401 });
    }

    // Tạo URL gọi API backend
    const provinceQuery = provincePt ? `&provincePt=${provincePt}` : "";
    const apiUrl = `${URL}/dashboard/dashboard-export-excel-exec-kpi?month=${convertedMonth}&kpiType=${kpiType}${provinceQuery}`;
    
    console.log("📌 Gọi API backend:", apiUrl);

    try {
        const res = await fetch(apiUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        console.log("📌 Response status:", res.status, res.statusText);

        if (res.status === 403) {
            signOut({ redirect: false });
            redirect("/login");
        }

        if (!res.ok) {
            console.error("❌ Lỗi khi gọi API backend:", res.status);
            return NextResponse.json({ success: false, message: "Lỗi từ API backend" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json({ success: true, result: data.result });

    } catch (error) {
        console.error("❌ Lỗi khi gọi API:", error);
        return NextResponse.json({ message: "Lỗi server", error }, { status: 500 });
    }
}
