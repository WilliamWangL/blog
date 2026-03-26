import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Eye, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { articleApi } from '@/utils/api'
import type { Article } from '@/types'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => articleApi.searchArticles(query, 1, 20),
    enabled: query.length > 0,
  })

  const articles = data?.data?.data?.records || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {query ? `Showing results for "${query}"` : 'Enter a search term to find reviews'}
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : query ? (
          articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No articles found matching "{query}"
              </p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Try different keywords or browse categories
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Use the search box above to find product reviews
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm card-hover group">
      <Link to={`/article/${article.slug}`}>
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <span className="text-4xl">📱</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {article.summary}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount?.toLocaleString() || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{article.likeCount || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}