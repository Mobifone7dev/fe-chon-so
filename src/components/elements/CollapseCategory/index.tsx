"use client";
import React, { FC, useState, useEffect } from "react";
import { Collapse } from "react-bootstrap";
import Link from "next/link";

// interface ILink {
//   label: string
//   link: string
// }

type CategoryProps = {
  subject: string;
  listLink: any[];
};

const CollapseCategory: FC<CategoryProps> = ({ subject, listLink }) => {
  const str =
    "MobiFone đang cải thiện tính năng này để giúp bạn có một trải nghiệm sử dụng tốt hơn. Mong bạn thông cảm";
  const [open, setOpen] = useState(true);
  const [widthWindow, setWidthWindow] = useState(0);

  useEffect(() => {
    // make sure your function is being called in client side only
    if (typeof window !== "undefined") {
      setWidthWindow(window.innerWidth);
      if (window.innerWidth < 480) {
        setOpen(false);
      }
    }
  }, []);

  return (
    <div className="category-footer">
      <div className="lable-category">
        <h4>{subject}</h4>
        {widthWindow < 480 && (
          <button
            className={`btn-down ${open && "active"}`}
            onClick={() => setOpen(!open)}
          >
            <i className="icon-chevron-down" />
          </button>
        )}
      </div>
      <Collapse in={open}>
        <ul className="list-category-footer">
          {listLink.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                as={item.link}
                target={item.newTab ? "_blank" : "_self"}
              >
                <span>{item.label}</span>
              </Link>
              {item.isFunc && (
                <div
                  className="alert-func"
                  onClick={() => {
                    alert(str);
                  }}
                ></div>
              )}
            </li>
          ))}
        </ul>
      </Collapse>
    </div>
  );
};

export default CollapseCategory;
