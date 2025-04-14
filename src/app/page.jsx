"use client";
import NumberTable from "@components/chonSo";
import { useSession } from "next-auth/react";
const API_URL_TABLE = process.env.NEXTAUTH_APP_API_URL_SSL;
import axios from 'axios';  // Import axios
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


const Page = (props) => {

  
    const { data: session, status } = useSession();
    const router = useRouter();
  
    useEffect(() => {
      if (status === "unauthenticated") {
        // Chuyển hướng người dùng đến trang đăng nhập nếu không đăng nhập
        router.push("/login");
      }
    }, [status, router]);


    if (status === "loading") {
      return <p>Loading...</p>; // Hiển thị trong khi kiểm tra trạng thái đăng nhập
    }
  
    if (!session) {
      return null; // Tránh render nội dung khi chưa xác định trạng thái
    }
  



  return (

      <div className="scene">
        <div className="flex flex-1">
          <div className="w-full">
            <NumberTable />
          </div>
        </div>
      </div>

  );
};

export default Page;