import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    signOutUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, signOutUser } = userSlice.actions
export default userSlice.reducer
