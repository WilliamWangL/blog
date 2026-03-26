import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, FolderTree, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/utils/api'

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    authApi.logout()
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/articles', icon: FileText, label: 'Articles' },
    { path: '/categories', icon: FolderTree, label: 'Categories' },
    { path: '/users', icon: Users, label: 'Users' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">TechReview Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}