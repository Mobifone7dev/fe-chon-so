"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
const API_URL_TABLE = process.env.NEXTAUTH_APP_API_URL_SSL;

export default function AddPhones() {
  const [rows, setRows] = useState([]);

  const handleReadExcel = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Vui lòng chọn file Excel!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const workbook = XLSX.read(ev.target.result, { type: "binary" });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);

      // Validate cột
      const requiredCols = ["phone", "type", "loai_ck"];
      const fileCols = Object.keys(json[0] || {});

      for (let col of requiredCols) {
        if (!fileCols.includes(col)) {
          alert(`Thiếu cột bắt buộc: ${col}`);
          return;
        }
      }

      // Validate từng dòng
      for (let row of json) {
        if (!row.phone || !row.type) {
          alert("Không được để trống bất kỳ dòng nào!");
          return;
        }
        if (!/^\d+$/.test(row.phone)) {
          alert(`Phone không hợp lệ: ${row.phone}`);
          return;
        }
      }

      setRows(json);
    };

    reader.readAsBinaryString(file);
  };

  const handleAdd = async () => {
    const res = await fetch(`${API_URL_TABLE}/chon-so/add-phones-index-dla`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rows),
    }).catch((error) => {
      console.error("Lỗi handleAdd:", error);
      alert("Đã xảy ra lỗi khi gửi dữ liệu!");
    });

    const result = await res.json();
    if (res.ok) {
      alert(`Thêm thành công ${result.added} dòng vào Elasticsearch`);
    } else {
      alert("Lỗi server: " + result.error);
    }
  };

  return (
    <div>
      <h2>Thêm Phone từ file Excel</h2>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleReadExcel}
        required
      />
      <button className={"btn btn-primary"} onClick={handleAdd}>
        Thêm vào Elasticsearch
      </button>

      {/* <pre>{JSON.stringify(rows, null, 2).length > 0 ? "Up file thang cong" : "Kiem tra file"}</pre> */}
    </div>
  );
}
