import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { articleApi } from '@/utils/api'
import type { Article } from '@/types'

export default function Articles() {
  const { data, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articleApi.getArticles(1, 20),
  })

  const articles = data?.data?.records || []

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Published</span>
      case 0:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Draft</span>
      case 2:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Archived</span>
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
        <Link to="/articles/new" className="btn-primary flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Title</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Views</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Published</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article: Article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500">{article.slug}</div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(article.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{article.viewCount?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/articles/edit/${article.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
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