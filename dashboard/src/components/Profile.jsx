import React, { useEffect, useState } from "react";
import Header from "./Header";
import avatarImg from "../assets/avatar.jpg";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  updateAdminProfile,
  updateAdminPassword,
} from "../store/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, profileLoading, passwordLoading } = useSelector(
    (state) => state.auth
  );

  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(avatarImg);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Load user into form fields
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        email: user.email || "",
      });

      if (user.avatar?.url) {
        setAvatarPreview(user.avatar.url);
      }
    }
  }, [user]);

  // Avatar preview on upload
  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleProfileChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE PROFILE
  const updateProfile = () => {
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("email", editData.email);
    if (avatarFile) formData.append("avatar", avatarFile);

    dispatch(updateAdminProfile(formData));
  };

  // UPDATE PASSWORD
  const updatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    dispatch(
      updateAdminPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      })
    );
  };

  return (
    <main className="p-1 pt-10">
      <Header />

      <h1 className="text-3xl font-bold mb-2">Profile</h1>
      <p className="text-gray-600 mb-6">Manage your profile settings.</p>

      {/* PROFILE UPDATE */}
      <div className="bg-white shadow p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
          <img
            src={avatarPreview}
            className="w-28 h-28 rounded-full object-cover border"
            alt="User Avatar"
          />

          <div>
            <label className="block font-medium mb-2">Change Avatar</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>

        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          value={editData.name}
          onChange={handleProfileChange}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={editData.email}
          onChange={handleProfileChange}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={updateProfile}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {profileLoading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* PASSWORD UPDATE */}
      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <label className="block text-sm font-medium mb-1">
          Current Password
        </label>
        <input
          name="currentPassword"
          type="password"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block text-sm font-medium mb-1">New Password</label>
        <input
          name="newPassword"
          type="password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block text-sm font-medium mb-1">
          Confirm New Password
        </label>
        <input
          name="confirmNewPassword"
          type="password"
          value={passwordData.confirmNewPassword}
          onChange={handlePasswordChange}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={updatePassword}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {passwordLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </main>
  );
};

export default Profile;
