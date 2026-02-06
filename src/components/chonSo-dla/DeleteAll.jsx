"use client";
import { useState } from "react";

const API_URL_TABLE = process.env.NEXTAUTH_APP_API_URL_SSL;

export default function AddPhones() {
  const [loading, setLoading] = useState(false);

  const handleDeleteAll = async () => {
    if (loading) return;

    const ok = window.confirm(
      "⚠️ Bạn có chắc chắn muốn xóa TOÀN BỘ dữ liệu không?\nDữ liệu sẽ không thể khôi phục!"
    );

    if (!ok) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL_TABLE}/chon-so/delete-kho-dla`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Đã xóa toàn bộ dữ liệu Elasticsearch");
      } else {
        alert("❌ Lỗi server: " + result.error);
      }
    } catch (error) {
      console.error("Lỗi handleDelete:", error);
      alert("Đã xảy ra lỗi khi gửi dữ liệu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h2>Xóa toàn bộ dữ liệu trong kho</h2>
      <button
        className="btn btn-danger"
        onClick={handleDeleteAll}
        disabled={loading}
      >
        {loading ? "Bạn chờ nhé..." : "Xóa toàn bộ dữ liệu"}
      </button>
    </div>
  );
}
