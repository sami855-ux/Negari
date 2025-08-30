export enum Role {
  CITIZEN = "CITIZEN",
  WORKER = "WORKER",
  OFFICER = "OFFICER",
  ADMIN = "ADMIN",
}

export type Report = {
  id: string
  title: string
  description: string
  category: string
  videoUrl: string | null
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  resolutionNote: string | null
  resolvedAt: Date | null
  createdAt: Date
  updatedAt: Date
  isAnonymous: boolean
  locationId: string
  reporterId: string
  assignedToId: string | null
}

export type User = {
  id: string
  username: string
  email: string | null
  password?: string | null
  profilePicture: string | null
  googleId: string | null
  telegramId: string | null
  role: Role
  createdAt: Date
  regionId: string | null

  // Relationships
  reportsSubmitted: Report[]
  reportsAssignedToMe: Report[]
}

export type RatingResponse = {
  userId: string
  totalRatingsGiven: number
  averageRating: number
  scoreDistribution: {
    [score in "1" | "2" | "3" | "4" | "5"]: number
  }
  ratings: {
    score: number
    comment: string | null
    createdAt: string // ISO timestamp
    official: {
      id: string
      username: string
      email: string | null
      profilePicture: string | null
    }
  }[]
}

export type ActivityLog = {
  id: string
  actorId?: string
  actorName?: string
  actorRole: "ADMIN" | "USER" | "OFFICIAL" | "SYSTEM"
  action:
    | "REPORT_SUBMITTED"
    | "STATUS_CHANGED"
    | "AI_PRIORITY_SET"
    | "AI_SPAM_DETECTED"
    | "REPORT_ASSIGNED"
    | "REPORT_RESOLVED"
    | "LOGIN"
    | "BACKUP_CREATED"
  targetType: "REPORT" | "USER" | "VOICE" | "SYSTEM"
  targetId?: string
  targetLabel?: string
  description: string
  meta?: Record<string, any>
  createdAt: string
}
export interface Location {
  id: string
  latitude: number
  longitude: number
  address: string
  city: string
  region: string
}
