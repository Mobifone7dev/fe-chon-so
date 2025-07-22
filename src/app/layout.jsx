/* eslint-disable @next/next/no-sync-scripts */
'use client';
import "../styles/global.scss";
import React, { Suspense,useEffect } from "react";
import "react-modern-drawer/dist/index.css";
import Layout from "../components/layout/Layout";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const RootLayout = ({ children }) => {

  useEffect(() => {
    const handler = (event) => {
      const err = event 
      if (err?.message?.includes('Loading chunk')) {
        console.warn('ChunkLoadError detected, reloading...')
        window.location.reload()
      }
    }

    window.addEventListener('error', handler)
    return () => window.removeEventListener('error', handler)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="icon" type="image/png" href="imgs/favicon.png" />
      <title>Hệ thống chọn số Công ty 7</title>

      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* <script
          src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
          integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js"
          integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js"
          integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
          crossOrigin="anonymous"
        ></script> */}
     <Layout>{children}</Layout>
      </body>
    </html>
  );
};
export default RootLayout;
