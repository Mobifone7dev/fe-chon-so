"use client";
import React, { FC, useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import Link from "next/link";
import { menuCategory } from "@config/constants";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HeaderAppNoAuth = () => {
  const router = useRouter();
  const [isSticky, setisSticky] = useState(false);
  const handleSticky = () => {
    const scrollTop = window.scrollY;
    scrollTop > 1 ? setisSticky(true) : setisSticky(false);
  };
  const goHome = () => {
    router.push("/");
  };

  return (
    <div className={`header ${isSticky && "is-sticky"}`}>
      <div className="header-top">
        <div className="logo-group">
          <div className="block-center">
            <div className="logo">
              <Link href="/" as="/" passHref>
                <img src={`/imgs/logo-primary.png`} alt="logo" />
              </Link>
            </div>
            <div className="main-title">7</div>
          </div>
        </div>
        <div className="hotline">
          <a
            href="https://www.mobifone.vn/"
            target="_blank"
            rel="noreferrer"
            className="back-mbf"
          >
            Truy cập mobifone.vn
          </a>
          <a href="tel:18001090" className={`btn-houze btn-solid`}>
            <i className="icon-call-connecting" />
            <span>18001090</span>
          </a>
          <button onClick={() => goHome()} className={`btn-houze btn-solid`}>
            <span>Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderAppNoAuth;
