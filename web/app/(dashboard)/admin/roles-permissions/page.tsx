"use client"

import { useEffect, useState } from "react"
import {
  Check,
  Save,
  Lock,
  User,
  HardHat,
  Shield,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import useGetAllPolicy from "@/hooks/useGetAllPolicy"
import { permission } from "process"
import { updatePolicy } from "@/services/policy"
import toast from "react-hot-toast"
import { LoadingModal } from "@/components/LoadingModal"

type Permission = {
  id: string
  label: string
  description: string
  category: string
}

type Role = {
  id: string
  name: string
  description: string
  icon: string
  permissions: Record<string, boolean>
}

const permissionDefinitions: Permission[] = [
  // Report Permissions
  {
    id: "canViewReports",
    label: "View Reports",
    description: "Can view all submitted reports",
    category: "Reports",
  },
  {
    id: "canVerifyReports",
    label: "Verify Reports",
    description: "Can verify report accuracy",
    category: "Reports",
  },
  {
    id: "canAssignReports",
    label: "Assign Reports",
    description: "Can assign reports to other users",
    category: "Reports",
  },
  {
    id: "canDeleteReports",
    label: "Delete Reports",
    description: "Can permanently delete reports",
    category: "Reports",
  },
  {
    id: "canUpdateReportStatus",
    label: "Update Status",
    description: "Can change report status",
    category: "Reports",
  },

  // User Management
  {
    id: "canViewUsers",
    label: "View Users",
    description: "Can view user profiles",
    category: "Users",
  },
  {
    id: "canEditUsers",
    label: "Edit Users",
    description: "Can edit user information",
    category: "Users",
  },
  {
    id: "canSuspendUsers",
    label: "Suspend Users",
    description: "Can suspend user accounts",
    category: "Users",
  },
  {
    id: "canAssignUserRoles",
    label: "Assign Roles",
    description: "Can change user roles",
    category: "Users",
  },

  // System Settings
  {
    id: "canManageSettings",
    label: "Manage Settings",
    description: "Can modify system settings",
    category: "System",
  },
  {
    id: "canManageCategories",
    label: "Manage Categories",
    description: "Can manage report categories",
    category: "System",
  },
  {
    id: "canToggleSystemPolicy",
    label: "Toggle Policies",
    description: "Can change system policies",
    category: "System",
  },

  // Analytics
  {
    id: "canViewAnalytics",
    label: "View Analytics",
    description: "Can access analytics dashboard",
    category: "Analytics",
  },
  {
    id: "canExportReports",
    label: "Export Reports",
    description: "Can export report data",
    category: "Analytics",
  },

  // Communication
  {
    id: "canSendNotifications",
    label: "Send Notifications",
    description: "Can send system notifications",
    category: "Communication",
  },
  {
    id: "canRespondToFeedback",
    label: "Respond to Feedback",
    description: "Can respond to user feedback",
    category: "Communication",
  },
  {
    id: "canManageFeedback",
    label: "Manage Feedback",
    description: "Can manage all feedback",
    category: "Communication",
  },
]

const icons = {
  user: <User className="w-4 h-4" />,
  hardhat: <HardHat className="w-4 h-4" />,
  shield: <Shield className="w-4 h-4" />,
  lock: <Lock className="w-4 h-4" />,
}

export default function RolesPermissionsPage() {
  const { isLoading, policy, refetch } = useGetAllPolicy()

  const [isUpdating, setIsUpdating] = useState(false)
  const [roles, setRoles] = useState<Role[] | []>([])
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(
    permissionDefinitions.reduce((acc, perm) => {
      if (!acc[perm.category]) {
        acc[perm.category] = true
      }
      return acc
    }, {} as Record<string, boolean>)
  )

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const togglePermissionForRole = (roleId: string, permissionId: string) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: {
                ...role.permissions,
                [permissionId]: !role.permissions[permissionId],
              },
            }
          : role
      )
    )
  }

  const togglePermissionForAllRoles = (permissionId: string) => {
    const currentState = roles.every((role) => role.permissions[permissionId])
    setRoles((prevRoles) =>
      prevRoles.map((role) => ({
        ...role,
        permissions: {
          ...role.permissions,
          [permissionId]: !currentState,
        },
      }))
    )
  }

  const saveRolePermissions = async (roleId: string) => {
    // In a real app, you would call an API here
    const data = roles.find((role) => role.id === roleId)

    console.log(data)

    const updateData = {
      description: data?.description,
      permissions: data?.permissions,
      isActive: true,
    }

    setIsUpdating(true)

    try {
      const res = await updatePolicy(roleId.toUpperCase(), updateData)

      if (res.success) {
        refetch()

        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === roleId
              ? {
                  ...role,
                  permissions: data?.permissions || {},
                  description: data?.description || "",
                }
              : role
          )
        )

        toast.success("Role updated successfully")
        return
      } else {
        toast.error("Failed to update role permissions")
        return
      }
    } catch (error) {
      toast.error(
        error?.message || "An error occurred while updating role permissions"
      )
    } finally {
      setIsUpdating(false)
    }
  }

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "label",
      header: () => <div className="font-medium text-left">Permission</div>,
      cell: ({ row }) => {
        const permission = row.original
        return (
          <div className="pl-4">
            <div className="font-medium">{permission.label}</div>
            <div className="text-xs text-muted-foreground">
              {permission.description}
            </div>
          </div>
        )
      },
    },
    ...roles?.map((role) => ({
      id: role.id,
      header: () => (
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center gap-2">
            {icons[role.icon]}
            <span className="font-medium">{role.name}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => saveRolePermissions(role.id)}
          >
            <Save className="w-3 h-3" />
            Save
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const permissionId = row.original.id
        return (
          <div className="flex justify-center">
            <Checkbox
              checked={role.permissions[permissionId]}
              onCheckedChange={() =>
                togglePermissionForRole(role.id, permissionId)
              }
              className="h-5 w-5 border-gray-400 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white transition-colors duration-200"
            />
          </div>
        )
      },
    })),
  ]

  const table = useReactTable({
    data: permissionDefinitions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Group permissions by category
  const permissionsByCategory = permissionDefinitions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>
  )

  useEffect(() => {
    if (!isLoading) {
      setRoles(policy)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin w-5 h-5" />
      </div>
    )
  }

  return (
    <>
      <div className="container py-2 mx-auto">
        <div className="mb-8 w-full bg-white rounded-md border border-gray-200 px-4 py-4 h-32 flex justify-between items-center">
          <div className="">
            <h1 className="text-2xl font-bold tracking-tight pb-2">
              Roles & Permissions
            </h1>
            <p className="text-muted-foreground">
              Manage system access levels for different user roles
            </p>
          </div>
        </div>

        <div className="border rounded-lg shadow-sm bg-background">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        index === 0 ? "w-[300px]" : "",
                        "h-16 text-center first:text-left"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Object.entries(permissionsByCategory).map(
                ([category, permissions]) => (
                  <>
                    <TableRow
                      key={`category-${category}`}
                      className="cursor-pointer bg-gray-50 hover:bg-gray-50 dark:bg-gray-900/50 dark:hover:bg-gray-900/50"
                      onClick={() => toggleCategory(category)}
                    >
                      <TableCell colSpan={columns.length} className="px-4 py-2">
                        <div className="flex items-center gap-2 font-medium">
                          {expandedCategories[category] ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                          {category}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedCategories[category] &&
                      permissions.map((permission) => {
                        const row = table
                          .getRowModel()
                          .rows.find((r) => r.original.id === permission.id)
                        if (!row) return null
                        return (
                          <TableRow
                            key={permission.id}
                            className="transition-colors border-t hover:bg-gray-50/50 dark:hover:bg-gray-900/30"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="p-0">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={roles.every(
                                    (role) => role.permissions[permission.id]
                                  )}
                                  onCheckedChange={() =>
                                    togglePermissionForAllRoles(permission.id)
                                  }
                                  className="h-5 w-5 border-gray-400 data-[state=checked]:bg-green-500 data-[state=checked]:text-white transition-colors duration-200"
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </>
                )
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {roles.map((role) => (
            <Badge
              key={role.id}
              variant="outline"
              className="flex items-center gap-2 px-3 py-1.5"
            >
              {role.icon}
              <span>{role.name}</span>
              <span className="text-muted-foreground">{role.description}</span>
            </Badge>
          ))}
        </div>
      </div>

      <LoadingModal open={isUpdating} />
    </>
  )
}
