"use client";
import React from "react";
import HeaderApp from "src/components/header/HeaderApp";
import "react-modern-drawer/dist/index.css";
import MobileMenu from "@components/MobileMenu";
import dynamic from "next/dynamic";
import Footer from "@components/footer";
import "@ionic/react/css/core.css";
import { setupIonicReact } from "@ionic/react";
const Drawer = dynamic(() => import("react-modern-drawer"), {
  ssr: false,
});
setupIonicReact();
const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
      <HeaderApp toggleMenu={toggleDrawer} isOpen={isOpen} />
      <div className="main-layout">
        <div className="content-page">{children}</div>
      </div>
      <Footer />

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="left"
        className="houze-drawer"
        size={300}
        zIndex={9999}
      >
        <MobileMenu toggleMenu={toggleDrawer} isOpen={isOpen} />
      </Drawer>
    </>
  );
};

export default Layout;
