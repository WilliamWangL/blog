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
    <div className="min-h-screen bg-gray-50/50 dark:bg-black/20">
      {/* Category Header */}
      <div className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800/50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-3 text-xs tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-6 font-medium">
            <span>Category</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-gray-900 dark:text-white mb-6">
            {category?.name || slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl font-light leading-relaxed">
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