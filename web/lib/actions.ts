"use server"

import type { Role, Report, User } from "./types"
import { mockUsers } from "./data"

export async function updateUserRole(
  userId: string,
  newRole: Role
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const userIndex = mockUsers.findIndex((u) => u.id === userId)
  if (userIndex === -1) {
    return { success: false, message: "User not found." }
  }

  // Update the mock data (in a real app, this would be a database update)
  mockUsers[userIndex].role = newRole

  return {
    success: true,
    message: `Role for ${mockUsers[userIndex].username} updated to ${newRole}.`,
  }
}

export async function getReportsByUserId(
  userId: string,
  users: User[]
): Promise<Report[]> {
  await new Promise((resolve) => setTimeout(resolve, 700)) // Simulate network delay

  const user = users.find((u) => u.id === userId)

  return user?.reportsSubmitted ?? []
}
