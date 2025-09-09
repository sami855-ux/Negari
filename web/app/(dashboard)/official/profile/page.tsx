"use client"

import { EditableOfficerProfile } from "@/components/official/OfficerProfile"

export default function OfficerPage() {
  const handleSave = async (updatedData) => {
    // Create FormData to handle file upload
    const formData = new FormData()
    formData.append("username", updatedData.username)
    formData.append("email", updatedData.email)
    if (updatedData.profilePictureFile) {
      formData.append("profilePicture", updatedData.profilePictureFile)
    }

    try {
      const response = await fetch("/api/officer/profile", {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Handle successful update
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error // This will be caught in the component
    }
  }

  return (
    <EditableOfficerProfile
      username="John Doe"
      email="john.doe@negari.org"
      role="OFFICER"
      createdAt="2023-01-15T08:30:00Z"
      profilePicture="/path/to/profile.jpg"
      telegramId="johndoe123"
      googleId="john.doe@gmail.com"
      onSave={handleSave}
    />
  )
}
