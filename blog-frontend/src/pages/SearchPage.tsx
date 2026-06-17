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

  const articles = data?.data?.records || []

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black/20">
      {/* Search Header */}
      <div className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800/50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-3 text-xs tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-6 font-medium">
            <span>Search</span>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <Search className="w-10 h-10 text-gray-300 dark:text-gray-600 stroke-[1.5]" />
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-gray-900 dark:text-white">
              Search Results
            </h1>
          </div>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-light">
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
    <article className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden card-hover group border border-gray-100 dark:border-gray-800">
      <Link to={`/article/${article.slug}`}>
        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600">
              <span className="text-4xl opacity-50 grayscale">📱</span>
            </div>
          )}
        </div>
        <div className="p-8">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 font-medium">
            <span>Review</span>
            <span>·</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
          <h3 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 font-light">
            {article.summary}
          </p>
          <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-6 text-sm text-gray-400 dark:text-gray-500">
              <span className="flex items-center space-x-2">
                <Eye className="w-4 h-4 stroke-[1.5]" />
                <span className="font-light">{article.viewCount?.toLocaleString() || 0}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Heart className="w-4 h-4 stroke-[1.5]" />
                <span className="font-light">{article.likeCount || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}