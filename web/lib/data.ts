import { Role, type User } from "./types"
import { faker } from "@faker-js/faker"

export type ReportSeverity = "LOW" | "MEDIUM" | "HIGH"
export type status =
  | "PENDING"
  | "VERIFIED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED"

export type ReportCategory =
  | "INFRASTRUCTURE"
  | "SANITATION"
  | "ENVIRONMENT"
  | "SAFETY"
  | "MAINTENANCE"
  | "OTHER"

export interface Report {
  id: string
  title: string
  description: string
  category: ReportCategory // Single category
  imageUrls: string[]
  videoUrl: string | null
  reporterId: string // UUID for reporter
  reporterName: string // Display name for reporter
  severity: ReportSeverity
  isAnonymous: boolean
  tags: string[] // Array of tags
  location: {
    latitude: number
    longitude: number
    address: string
    city: string
    region: string
  }
  reporter: {
    id: string
    username: string
    email: string
  }
  createdAt: Date
  status: status
}

const SEVERITIES: ReportSeverity[] = ["Low", "Medium", "High"]
const CATEGORIES: ReportCategory[] = [
  "INFRASTRUCTURE",
  "SANITATION",
  "ENVIRONMENT",
  "SAFETY",
  "MAINTENANCE",
  "OTHER",
]
const REPORTER_NAMES: string[] = [
  "Alice Johnson",
  "Bob Williams",
  "Charlie Brown",
  "Diana Miller",
  "Eve Davis",
]
const STATUS: status[] = ["PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"]

export function generateMockReports(count: number): Report[] {
  const reports: Report[] = []
  for (let i = 0; i < count; i++) {
    const createdAt = faker.date.recent({ days: 60 }) // Reports created within the last 60 days
    const reporterName = faker.helpers.arrayElement(REPORTER_NAMES)
    reports.push({
      id: faker.string.uuid(),
      title: faker.lorem.sentence({ min: 3, max: 7 }),
      description: faker.lorem.paragraph({ min: 1, max: 3 }),
      category: faker.helpers.arrayElement(CATEGORIES),
      imageUrls: faker.helpers.arrayElements(
        [
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
          "/placeholder.svg?height=200&width=300",
        ],
        { min: 0, max: 2 }
      ),
      videoUrl: faker.helpers.arrayElement([
        null,
        "https://example.com/video.mp4",
      ]),
      reporterId: faker.string.uuid(),
      reporterName: reporterName,
      severity: faker.helpers.arrayElement(SEVERITIES),
      isAnonymous: faker.datatype.boolean(),
      tags: faker.helpers.arrayElements(
        [
          "bridge",
          "public safety",
          "repair",
          "water",
          "pollution",
          "road",
          "tree",
          "waste",
        ],
        { min: 0, max: 3 }
      ),
      location: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        region: faker.location.state(),
      },
      createdAt: createdAt,
      status: faker.helpers.arrayElement(STATUS),
    })
  }
  return reports
}

export const mockReports = generateMockReports(50) // Generate 50 mock reports

export const mockUsers: User[] = [
  {
    id: "user_001",
    username: "Alice Smith",
    email: "alice@example.com",
    profilePicture: "/placeholder.svg?height=100&width=100",
    googleId: "google_alice",
    telegramId: null,
    role: Role.CITIZEN,
    createdAt: new Date("2023-01-15T10:00:00Z"),
  },
  {
    id: "user_002",
    username: "Bob Johnson",
    email: "bob@example.com",
    profilePicture: "/placeholder.svg?height=100&width=100",
    googleId: null,
    telegramId: "telegram_bob",
    role: Role.WORKER,
    createdAt: new Date("2023-02-20T11:30:00Z"),
  },
  {
    id: "user_003",
    username: "Charlie Brown",
    email: "charlie@example.com",
    profilePicture: "/placeholder.svg?height=100&width=100",
    googleId: null,
    telegramId: null,
    role: Role.OFFICER,
    createdAt: new Date("2023-03-01T14:00:00Z"),
  },
  {
    id: "user_004",
    username: "Diana Prince",
    email: "diana@example.com",
    profilePicture: "/placeholder.svg?height=100&width=100",
    googleId: "google_diana",
    telegramId: "telegram_diana",
    role: Role.ADMIN,
    createdAt: new Date("2023-04-05T09:15:00Z"),
  },
  {
    id: "user_005",
    username: "Eve Davis",
    email: null, // No email
    profilePicture: "/placeholder.svg?height=100&width=100",
    googleId: null,
    telegramId: null,
    role: Role.CITIZEN,
    createdAt: new Date("2023-05-10T16:45:00Z"),
  },
  {
    id: "user_006",
    username: "Frank White",
    email: "frank@example.com",
    profilePicture: "/placeholder.svg?height=100&width=100",
    googleId: "google_frank",
    telegramId: null,
    role: Role.WORKER,
    createdAt: new Date("2023-06-12T08:00:00Z"),
  },
  {
    id: "user_007",
    username: "Grace Black",
    email: "grace@example.com",
    profilePicture: "/placeholder.svg?height=100&width=100",
    googleId: null,
    telegramId: "telegram_grace",
    role: Role.OFFICER,
    createdAt: new Date("2023-07-18T13:20:00Z"),
  },
  {
    id: "user_008",
    username: "Henry Green",
    email: null, // No email
    profilePicture: "/placeholder.svg?height=100&width=100",
    googleId: null,
    telegramId: null,
    role: Role.CITIZEN,
    createdAt: new Date("2023-08-25T10:50:00Z"),
  },
]
