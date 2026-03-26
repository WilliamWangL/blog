import { FileText, Eye, Heart, Users } from 'lucide-react'

const stats = [
  { label: 'Total Articles', value: '128', icon: FileText, color: 'bg-blue-500' },
  { label: 'Total Views', value: '45.2K', icon: Eye, color: 'bg-green-500' },
  { label: 'Total Likes', value: '3.8K', icon: Heart, color: 'bg-red-500' },
  { label: 'Total Users', value: '12', icon: Users, color: 'bg-purple-500' },
]

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No recent activity to display.</p>
        </div>
      </div>
    </div>
  )
}