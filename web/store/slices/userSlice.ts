import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  user: {
    user: {
      id: string
      username: string
      email: string
      role: string
      profilePicture: string
    }
  } | null
  isAuthenticated: boolean
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState["user"]>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    signOutUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, signOutUser } = userSlice.actions
export default userSlice.reducer
