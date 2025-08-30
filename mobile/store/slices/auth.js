import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import Constants from "expo-constants"

const serverUrl =
  Constants.expoConfig?.extra?.serverUrl ||
  Constants.manifest?.extra?.serverUrl ||
  "http://localhost:5000"

// Axios instance
const axiosInstance = axios.create({
  baseURL: `${serverUrl}/api/`,
  withCredentials: true,
})

//Helper functions

const saveToStorage = async (token, user) => {
  try {
    await AsyncStorage.setItem("token", token)
    await AsyncStorage.setItem("user", JSON.stringify(user))
  } catch (error) {
    console.error("Error saving to storage:", error)
  }
}

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  otpEmail: null,
}

// Login Thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/app/login", {
        email,
        password,
      })

      console.log(res)
      // Save token to AsyncStorage
      if (res.data.success) {
        saveToStorage(res.data.token, res.data.user)
        return res.data
      } else {
        console.log("Login failed:", res.data.message)

        return rejectWithValue(res.data.message || "Login failed")
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed")
    }
  }
)

//Update Profile Thunk
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ username, email, password, profilePic }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/app/update", {
        username,
        email,
        password,
        profilePic,
      })

      // Save updated user data to AsyncStorage
      if (res.data.success) {
        saveToStorage(res.data.token, res.data.user)
        return res.data
      } else {
        console.log("Update failed:", res.data.message)

        return rejectWithValue(res.data.message || "Update failed")
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed")
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },

    setOtpEmail: (state, action) => {
      state.otpEmail = action.payload
    },

    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      state.otpEmail = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, setUser, setOtpEmail } = authSlice.actions
export default authSlice.reducer
