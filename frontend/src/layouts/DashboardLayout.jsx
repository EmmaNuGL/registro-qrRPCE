import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="main-area">
        <Header collapsed={collapsed} />

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}