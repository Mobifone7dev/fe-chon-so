"use client"; // Đặt ở dòng đầu tiên
import React, { FC } from "react";
import Link from "next/link";
import { menuCategory } from "@config/constants";
import PhoneComponent from "@components/elements/PhoneComponent";
import MenuItem from "../elements/MenuItem/index";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type MenuProps = {
  toggleMenu: () => void;
  isOpen: boolean;
};

const MobileMenu: FC<MenuProps> = ({ toggleMenu, isOpen }) => {
  // const [isOpenMenu, setIsOpenMenu] = useState()
  const router = useRouter(); // Khởi tạo useRouter

  return (
    <div className="menu-mobile">
      <div className="head-menu">
        <div className="group-logo">
          <Link href="/" as="/" passHref>
            <img
              src="/imgs/logo-primary.png"
              alt="logo"
              width="80"
              height="24"
            />
          </Link>
        </div>
        <button
          className={`btn-toggleMenu ${isOpen && "isOpen"}`}
          onClick={() => toggleMenu()}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div className="hotline-menu-mobile">
        <a href="tel:18001090 " className={`btn-houze btn-solid`}>
          <PhoneComponent color="#fff" />
          <span>18001090 </span>
        </a>
      </div>
      <div className="logout-menu-mobile">
        <button
          onClick={() => {
            signOut({ redirect: false });
            router.push("/login");
          }}
        >
          <a className={`btn-houze btn-solid`}>
            <span>Logout </span>
          </a>
        </button>
      </div>

      <div className="mbf-mb">
        {/* <b>MobiFone.vn</b> */}
        <a href="https://mobifone.vn/" target="_blank" rel="noreferrer">
          Truy cập mobifone.vn
        </a>
      </div>
      <div className="navigation-menu no-line">
        {/* <MenuItem itemMenuLink={{ label: 'Trang chủ', link: '/' }} /> */}
        {menuCategory.map((item: any, index) => (
          <MenuItem key={index} itemMenuLink={item} />
        ))}
      </div>

      <div className="info-menu-mobile">
        <p>
          <i className="icon-call-connecting"></i> Hotline 18001090
        </p>
        <ul className="social-menu">
          <li>
            <a
              href="https://www.facebook.com/houze.group/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="icon-facebook"></i>
            </a>
          </li>
          <li>
            <a
              href="https://vm.tiktok.com/ZSdMYoJ7r/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="icon-tiktok"></i>
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/company/houze-group/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="icon-linkedin"></i>
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/c/HouzeGroup"
              target="_blank"
              rel="noreferrer"
            >
              <i className="icon-youtube"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
