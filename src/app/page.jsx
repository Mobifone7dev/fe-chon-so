"use client";
import NumberTable from "@components/chonSo";
import NumberTableDLA from "@components/chonSo-dla";

if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    const message = e?.message || "";
    if (message.includes("Loading chunk")) {
      // Reload lại trang để tải version mới
      window.location.reload();
    }
  });
}

import { useState } from "react";

const Page = (props) => {
  const [activeTab, setActiveTab] = useState("KH");

  return (
    <div className="scene">
      <div className="flex flex-1">
        <div className="w-full h-full">
          {/* <NumberTable /> */}
          {/* TAB BUTTONS */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab("KH")}
              className={`px-4 py-2 mr-2 border-b-2 ${
                activeTab === "KH"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600"
              }`}
            >
              Khánh Hòa
            </button>

            <button
              onClick={() => setActiveTab("DL")}
              className={`px-4 py-2 border-b-2 ${
                activeTab === "DL"
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent text-gray-600"
              }`}
            >
              Đắk Lắk
            </button>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "KH" && (
            <div>
              <NumberTable />
            </div>
          )}

          {activeTab === "DL" && (
            <div>
              <NumberTableDLA />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
