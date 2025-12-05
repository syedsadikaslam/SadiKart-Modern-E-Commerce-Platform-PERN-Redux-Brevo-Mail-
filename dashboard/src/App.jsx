import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SideBar from "./components/SideBar";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import Dashboard from "./components/Dashboard";
import Orders from "./components/Orders";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Products from "./components/Products";

import { getUser } from "./store/slices/authSlice";

function App() {
  const dispatch = useDispatch();

  const { openedComponent } = useSelector((state) => state.extra);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(getUser());
    }
  }, [dispatch, isAuthenticated]);

  const renderDashboardContent = () => {
    switch (openedComponent) {
      case "Dashboard": return <Dashboard />;
      case "Orders": return <Orders />;
      case "Users": return <Users />;
      case "Products": return <Products />;
      case "Profile": return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />

        {/* Protected Admin Route */}
        <Route
          path="/Admin"
          element={
            isAuthenticated && user?.role === "Admin" ? (
              <div className="min-h-screen flex bg-gray-100">
                <div className="hidden md:block fixed top-0 left-0 h-full w-72">
                  <SideBar />
                </div>
                <div className="md:hidden">
                  <SideBar />
                </div>
                <main className="flex-1 p-4 md:p-8 ml-0 md:ml-72">
                  {renderDashboardContent()}
                </main>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/Admin" replace />} />
      </Routes>

      <ToastContainer theme="dark" />
    </Router>
  );
}

export default App;
