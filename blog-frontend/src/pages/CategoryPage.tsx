import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { articleApi, categoryApi } from '@/utils/api'
import type { Article, Category } from '@/types'
import { Eye, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: categoryData } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryApi.getCategoryBySlug(slug!),
    enabled: !!slug,
  })

  const { data: articlesData } = useQuery({
    queryKey: ['category-articles', slug],
    queryFn: () => articleApi.getArticles(1, 12),
    enabled: !!slug,
  })

  const category = categoryData?.data?.data
  const articles = articlesData?.data?.data?.records || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Category Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {category?.name || slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {category?.description || `Browse all reviews in the ${slug} category.`}
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No articles found in this category.</p>
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