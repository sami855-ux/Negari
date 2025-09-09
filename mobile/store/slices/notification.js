import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Mock API calls (replace with actual API calls)
const fetchNotificationsAPI = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data with Date objects (simulate backend)
  return [
    {
      id: "1",
      recipientId: "user1",
      type: "NEW_REPORT",
      message: "New report has been submitted in your area",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      createdBy: { id: "system", username: "System" },
    },
    {
      id: "2",
      recipientId: "user1",
      type: "STATUS_UPDATED",
      message: 'Your report #1234 status has been updated to "In Progress"',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 120),
      createdBy: { id: "admin1", username: "Admin User" },
    },
  ]
}

const markAllAsReadAPI = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}

const deleteNotificationAPI = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, id }
}

const deleteNotificationsAPI = async (ids) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true, ids }
}

// Async thunks
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchNotificationsAPI()
      // ✅ Convert all Date objects to ISO strings BEFORE returning to Redux
      return response.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
      }))
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await markAllAsReadAPI()
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteNotificationAPI(id)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteSelectedNotifications = createAsyncThunk(
  "notifications/deleteSelectedNotifications",
  async (ids, { rejectWithValue }) => {
    try {
      const response = await deleteNotificationsAPI(ids)
      return response
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // ✅ Ensure createdAt is always a string when adding manually
      state.notifications.unshift({
        ...action.payload,
        createdAt:
          typeof action.payload.createdAt === "string"
            ? action.payload.createdAt
            : new Date(action.payload.createdAt).toISOString(),
      })
      if (!action.payload.isRead) {
        state.unreadCount += 1
      }
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      )
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount -= 1
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter((n) => !n.isRead).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }))
        state.unreadCount = 0
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedNotification = state.notifications.find(
          (n) => n.id === action.payload.id
        )
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount -= 1
        }
        state.notifications = state.notifications.filter(
          (n) => n.id !== action.payload.id
        )
      })
      .addCase(deleteSelectedNotifications.fulfilled, (state, action) => {
        const deletedUnreadCount = state.notifications.filter(
          (n) => action.payload.ids.includes(n.id) && !n.isRead
        ).length
        state.unreadCount -= deletedUnreadCount
        state.notifications = state.notifications.filter(
          (n) => !action.payload.ids.includes(n.id)
        )
      })
  },
})

export const { addNotification, markAsRead, clearError } =
  notificationsSlice.actions

export const selectNotifications = (state) => state.notifications.notifications
export const selectUnreadCount = (state) => state.notifications.unreadCount
export const selectIsLoading = (state) => state.notifications.isLoading
export const selectError = (state) => state.notifications.error

export default notificationsSlice.reducer
