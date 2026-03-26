import { useQuery } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Shield } from 'lucide-react'
import { userApi } from '@/utils/api'
import type { User } from '@/types'

export default function Users() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(1, 20),
  })

  const users = data?.data?.data?.records || []

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Admin</span>
      case 'EDITOR':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Editor</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">User</span>
    }
  }

  const getStatusBadge = (status: number) => {
    return status === 1
      ? <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Active</span>
      : <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Inactive</span>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New User</span>
        </button>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                        {user.nickname?.[0] || user.username[0].toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{user.nickname || user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}