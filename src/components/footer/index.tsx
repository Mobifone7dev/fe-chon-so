import React, { FC } from "react";
import Image from "next/image";
import CollapseCategory from "../elements/CollapseCategory";
import { infoLink, companyLink, serviceLink } from "@config/constants";
import Link from "next/link";

const Footer: FC = () => {
  const { NEXT_PUBLIC_APP_ENV } = process.env;
  const str =
    "MobiFone 7 đang cải thiện tính năng này để giúp bạn có một trải nghiệm sử dụng tốt hơn. Mong bạn thông cảm";
  return (
    <footer className="footer">
      <div className="top-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-6">
              <div className="info-footer">
                <div className="logo-footer">
                  <Image
                    src="/imgs/logo-mbf.png"
                    alt="logo"
                    width="150"
                    height="40"
                  />
                </div>
                <h3>Tổng công ty Viễn Thông MobiFone</h3>
                <div className="short-desc">
                  <img
                    src="https://www.mobifone.vn/assets/source/icons/tham-dinh.png"
                    alt="so-cong-thuong"
                  />
                </div>
                <p>
                  <i className="icon-location"></i>
                  Số 01 phố Phạm Văn Bạch, Yên Hòa, Cầu Giấy, Hà Nội.
                </p>
                <p>
                  <i className="icon-call"></i>
                  (+84-24) 3783 1800
                </p>
                <p>
                  <i className="icon-mail"></i>
                  support@mobifone.vn
                </p>
              </div>
            </div>
            <div className="col-md-12 col-lg-6">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <CollapseCategory
                    subject={"Công ty"}
                    listLink={companyLink}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <CollapseCategory subject={"Thông tin"} listLink={infoLink} />
                </div>
                <div className="col-md-4 mb-3">
                  <CollapseCategory
                    subject={"Điều khoản & Bảo mật"}
                    listLink={serviceLink}
                  />
                </div>
              </div>
              <div className="social">
                <span>Kết nối với chúng tôi</span>
                <ul className="social-icon">
                  <li>
                    <a
                      href="https://www.facebook.com/mobifone/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="icon-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.tiktok.com/@mobifone.official/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="icon-tiktok"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/company/mobifone/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="icon-linkedin"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@mobifone.official"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="icon-youtube"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-footer">
        <div className="copyright">
          Copyright 2022 © MobiFone - All Rights Reserved
        </div>
        <div className="term-policy">
          <Link
            href={"https://mobifone.vn/dieu-khoan-su-dung"}
            as={"https://mobifone.vn/dieu-khoan-su-dung"}
            passHref
          >
            <span>Điều khoản sử dụng</span>
          </Link>
          <Link
            href={"https://mobifone.vn"}
            as={"https://mobifone.vn"}
            passHref
          >
            <span>Chính sách bảo mật</span>
          </Link>
          <a
            onClick={() => {
              alert(str);
            }}
          >
            Quy chế hoạt động
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
