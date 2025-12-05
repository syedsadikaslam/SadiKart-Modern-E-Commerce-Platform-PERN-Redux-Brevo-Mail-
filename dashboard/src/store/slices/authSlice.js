import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

const initialState = {
  user: null,
  loading: false,
  profileLoading: false,
  passwordLoading: false,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    requestStartProfile: (state) => {
      state.profileLoading = true;
      state.error = null;
    },

    requestStartPassword: (state) => {
      state.passwordLoading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    loginFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    getUserFailed: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    logoutSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },

    updateProfileSuccess: (state, action) => {
      state.profileLoading = false;
      state.user = action.payload;
    },

    updateProfileFailed: (state, action) => {
      state.profileLoading = false;
      state.error = action.payload;
    },

    updatePasswordSuccess: (state) => {
      state.passwordLoading = false;
    },

    updatePasswordFailed: (state, action) => {
      state.passwordLoading = false;
      state.error = action.payload;
    },

    forgotPasswordSuccess: (state) => {
      state.loading = false;
    },

    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    resetAuthSlice: (state) => {
      state.loading = false;
      state.profileLoading = false;
      state.passwordLoading = false;
      state.error = null;
    },
  },
});

export const {
  requestStart,
  requestStartProfile,
  requestStartPassword,
  loginSuccess,
  loginFailed,
  getUserSuccess,
  getUserFailed,
  logoutSuccess,
  updateProfileSuccess,
  updateProfileFailed,
  updatePasswordSuccess,
  updatePasswordFailed,
  forgotPasswordSuccess,
  resetPasswordSuccess,
  resetAuthSlice,
} = authSlice.actions;

export default authSlice.reducer;

// LOGIN
export const login = (data) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axiosInstance.post("/auth/login", data);

    if (res.data.user.role !== "Admin") {
      toast.error("Access denied! Admin only.");
      return dispatch(loginFailed("Only Admin can login"));
    }

    dispatch(loginSuccess(res.data.user));
    toast.success(res.data.message);
  } catch (error) {
    const msg = error?.response?.data?.message || "Login failed";
    toast.error(msg);
    dispatch(loginFailed(msg));
  }
};

// ❗ FIXED GET USER — NO requestStart() here
export const getUser = () => async (dispatch) => {
  try {
    const res = await axiosInstance.get("/auth/me");
    dispatch(getUserSuccess(res.data.user));
  } catch {
    dispatch(getUserFailed());
  }
};

// LOGOUT
export const logout = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axiosInstance.post("/auth/logout");
    toast.success(res.data.message || "Logged out successfully!");
    dispatch(logoutSuccess());
    setTimeout(() => {
      window.location.href = "/login";
    }, 700);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Logout failed");
  }
};

// FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axiosInstance.post(
      "/auth/password/forgot?frontendUrl=http://localhost:5174",
      email
    );
    dispatch(forgotPasswordSuccess());
    toast.success(res.data.message);
  } catch (error) {
    const msg = error?.response?.data?.message || "Unable to request email.";
    toast.error(msg);
    dispatch(loginFailed(msg));
  }
};

// RESET PASSWORD
export const resetPassword = (newData, token) => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axiosInstance.put(
      `/auth/password/reset/${token}`,
      newData
    );
    dispatch(resetPasswordSuccess(res.data.user));
    toast.success(res.data.message);
  } catch (error) {
    const msg = error?.response?.data?.message || "Reset failed";
    toast.error(msg);
    dispatch(loginFailed(msg));
  }
};

// UPDATE PROFILE
export const updateAdminProfile = (data) => async (dispatch) => {
  dispatch(requestStartProfile());
  try {
    const res = await axiosInstance.put("/auth/profile/update", data);
    dispatch(updateProfileSuccess(res.data.user));
    toast.success("Profile updated successfully!");
  } catch (error) {
    const msg = error?.response?.data?.message || "Profile update failed";
    toast.error(msg);
    dispatch(updateProfileFailed(msg));
  }
};

// UPDATE PASSWORD
export const updateAdminPassword = (data) => async (dispatch) => {
  dispatch(requestStartPassword());
  try {
    const res = await axiosInstance.put("/auth/password/update", data);
    dispatch(updatePasswordSuccess());
    toast.success(res.data.message || "Password updated successfully!");
    dispatch(logoutSuccess());
    setTimeout(() => {
      window.location.href = "/login";
    }, 700);
  } catch (error) {
    const msg = error?.response?.data?.message || "Password update failed";
    toast.error(msg);
    dispatch(updatePasswordFailed(msg));
  }
};
