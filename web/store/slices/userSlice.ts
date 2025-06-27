import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logoutUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setUser, logoutUser, setLoading } = userSlice.actions
export default userSlice.reducer
