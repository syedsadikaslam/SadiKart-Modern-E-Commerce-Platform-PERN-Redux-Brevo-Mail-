import React, { useEffect, useState, useMemo } from "react";
import avatarImg from "../assets/avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
 import { fetchAllUsers, deleteUser } from "../store/slices/adminSlice";

const Users = () => {
  const dispatch = useDispatch();
  const { users, totalUsers, loading } = useSelector((state) => state.admin);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    dispatch(fetchAllUsers(page));
  }, [dispatch, page]);

  const totalPages = Math.max(1, Math.ceil(totalUsers / 10));

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();

    return users.filter((u) =>
      [u.name, u.email].some((field) =>
        field?.toLowerCase().includes(q)
      )
    );
  }, [search, users]);

  return (
    <main className="p-2 pt-10">
 
      {/* Title */}
      <h1 className="text-3xl font-extrabold mb-1 text-gray-900">Users</h1>
      <p className="text-gray-600 mb-6">View & manage all registered users.</p>

      {/* Search + Pagination */}
      <div className="bg-white p-4 shadow-md rounded-xl mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="🔍 Search users..."
            className="w-full bg-white px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
          >
            ◀ Prev
          </button>

          <span className="font-semibold bg-gray-100 px-4 py-2 rounded-lg shadow">
            {page} / {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* USERS CARDS */}
      <div className="grid gap-4">
        {loading ? (
          <div className="py-10 text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No users found.</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-md rounded-xl p-4 flex items-center gap-4 border border-gray-200 hover:shadow-lg transition-all"
            >
              {/* Avatar */}
              <img
                src={user.avatar?.url || avatarImg}
                className="w-14 h-14 rounded-full object-cover shadow"
                alt="User Avatar"
              />

              {/* User Info */}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              {/* Joined Date */}
              <span className="text-gray-500 text-sm whitespace-nowrap">
                {new Date(user.created_at).toLocaleDateString()}
              </span>

              {/* Delete Button */}
              <button
                onClick={() =>
                  setDeleteModal({ open: true, id: user.id })
                }
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl p-6 rounded-xl w-[90%] max-w-sm">
            <h2 className="text-xl font-bold mb-2">Delete User?</h2>
            <p className="text-gray-600 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  dispatch(deleteUser(deleteModal.id, page));
                  setDeleteModal({ open: false, id: null });
                }}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Users;
