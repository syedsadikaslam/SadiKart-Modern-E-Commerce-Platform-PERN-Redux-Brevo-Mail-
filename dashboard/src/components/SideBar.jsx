import React, { useState } from "react";
import {
  Bell,
  LayoutDashboard,
  ListOrdered,
  Package,
  Users,
  Menu,
  User,
  LogOut,
  MoveLeft,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { toggleComponent } from "../store/slices/extraSlice";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { openedComponent } = useSelector((state) => state.extra);

  const menuItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Orders", label: "Orders", icon: ListOrdered },
    { id: "Users", label: "Users", icon: Users },
    { id: "Products", label: "Products", icon: Package },
    { id: "Profile", label: "Profile", icon: User },
  ];

  const openSection = (section) => {
    dispatch(toggleComponent(section));
    navigate("/Admin");
    setMobileOpen(false);  
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="md:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-40 shadow-md">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <Menu size={28} onClick={() => setMobileOpen(true)} className="cursor-pointer" />
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 bg-gray-900 text-white border-r border-gray-800 
        transition-transform duration-300 z-50 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>

          {/* Close button (mobile only) */}
          <MoveLeft
            size={26}
            className="md:hidden cursor-pointer"
            onClick={() => setMobileOpen(false)}
          />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-2 px-4 mt-4">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => openSection(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all 
              ${
                openedComponent === id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-5 left-0 w-full px-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideBar;
