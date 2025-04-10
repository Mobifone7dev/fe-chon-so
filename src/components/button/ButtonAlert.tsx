"use client";
import React from "react";

const ButtonAlert = () => {
  return (
    <button
      onClick={() => alert("Tính năng đang được xây dựng, mong bạn thông cảm")}
    >
      <i className="icon-arrow-download" />
      Nhận tài liệu
    </button>
  );
};

export default ButtonAlert;
