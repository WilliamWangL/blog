import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Eye, Heart, Calendar, User, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { articleApi } from '@/utils/api'

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>()

  const { data, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => articleApi.getArticleBySlug(slug!),
    enabled: !!slug,
  })

  const article = data?.data?.data

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
          <Link to="/" className="text-primary-600 hover:underline">Go back home</Link>
        </div>
      </div>
    )
  }

  return (
    <article className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {article.summary}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>TechReview Team</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{article.viewCount?.toLocaleString()} views</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>{article.likeCount} likes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose dark:prose-invert prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Rating */}
        {article.rating && (
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Our Rating</h3>
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-8 h-8 ${i < Math.floor(article.rating!) ? 'fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{article.rating}</span>
              <span className="text-gray-500">/ 5</span>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}