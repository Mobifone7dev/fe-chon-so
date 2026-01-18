"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
const API_URL_TABLE = process.env.NEXTAUTH_APP_API_URL_SSL;

export default function DeletePhones() {
  const [phones, setPhones] = useState([]);

  const handleReadExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return alert("Vui lòng chọn file Excel!");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const workbook = XLSX.read(ev.target.result, { type: "binary" });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);

      // Kiểm tra cột phone
      const cols = Object.keys(json[0] || {});
      if (!cols.includes("phone")) {
        alert("File xoá phải có cột 'phone'");
        return;
      }

      // Validate dữ liệu
      const phones = [];
      for (let row of json) {
        if (!row.phone) {
          alert("Không được để phone trống!");
          return;
        }
        if (!/^\d+$/.test(row.phone)) {
          alert(`Phone không hợp lệ: ${row.phone}`);
          return;
        }
        phones.push(row.phone);
      }

      setPhones(phones);
    };

    reader.readAsBinaryString(file);
  };

  const handleDelete = async () => {
    const res = await fetch(
      `${API_URL_TABLE}/chon-so/delete-phones-index-dla`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phones }),
      },
    ).catch((error) => {
      console.error("Lỗi handleAdd:", error);
      alert("Đã xảy ra lỗi khi gửi dữ liệu!");
    });

    const result = await res.json();
    if (res.ok) {
      alert(`Xóa thành công ${result.added} dòng vào Elasticsearch`);
    } else {
      alert("Lỗi server: " + result.error);
    }
  };

  return (
    <div>
      <h2>Xóa số từ file Excel</h2>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleReadExcel}
        required
      />
      <button className={"btn btn-primary"} onClick={handleDelete}>
        Xóa trong Elasticsearch
      </button>

      {/* <pre>{JSON.stringify(phones, null, 2).length > 0 ? "Up file thang cong" : "Kiem tra file"}</pre> */}
    </div>
  );
}
