"use client";
import React from "react";
import { Audio } from "react-loader-spinner";

const LoadingComponent = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
    <Audio
      height="20"
      width="20"
      color="green"
      ariaLabel="loading"
    />
  </div>
  );
};

export default LoadingComponent;