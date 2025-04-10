"use client";

import React, { FC, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Collapse } from "react-bootstrap";

interface IMenuItem {
  label: string;
  link: string;
  children?: [];
  description?: string;
}

type MenuProps = {
  itemMenuLink: IMenuItem;
};

const MenuItem: FC<MenuProps> = ({ itemMenuLink }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const handleDropMenu = () => {
    setOpen((prev) => !prev);
  };

  return itemMenuLink.children !== undefined ? (
    <div
      className={`menu-item ${itemMenuLink.link === pathname ? "active" : ""}`}
    >
      <div className="label-menu-item">
        <h4>{itemMenuLink.label}</h4>
        <button
          className={`btn-down ${open && "active"}`}
          onClick={() => handleDropMenu()}
        >
          <i className="icon-chevron-down" />
        </button>
      </div>
      <Collapse in={open}>
        <div>
          {
            itemMenuLink.children.map((item: IMenuItem, index: any) => (
              <Link key={index} href={item.link} as={item.link}>
                <div className="sub-menu-item">
                  <b>{item.label}</b>
                  <br />
                  <span>{item.description}</span>
                </div>
              </Link>
            )) as any
          }
        </div>
      </Collapse>
    </div>
  ) : (
    <div
      className={`menu-item ${itemMenuLink.link === pathname ? "active" : ""}`}
    >
      <Link href={itemMenuLink.link} as={itemMenuLink.link}>
        {itemMenuLink.label}
      </Link>
    </div>
  );
};

export default MenuItem;
