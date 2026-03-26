import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Smartphone, Laptop, Home, Zap, Eye, Heart, ArrowRight } from 'lucide-react'
import { articleApi, categoryApi } from '@/utils/api'
import type { Article, Category } from '@/types'

const categoryIcons: Record<string, React.ReactNode> = {
  smartphones: <Smartphone className="w-10 h-10" />,
  laptops: <Laptop className="w-10 h-10" />,
  'smart-home': <Home className="w-10 h-10" />,
  accessories: <Zap className="w-10 h-10" />,
}

const categoryColors: Record<string, string> = {
  smartphones: 'from-blue-500 to-blue-600',
  laptops: 'from-purple-500 to-purple-600',
  'smart-home': 'from-orange-500 to-orange-600',
  accessories: 'from-green-500 to-green-600',
}

export default function Home() {
  const { data: articlesData } = useQuery({
    queryKey: ['articles'],
    queryFn: () => articleApi.getArticles(1, 6),
  })

  const { data: featuredData } = useQuery({
    queryKey: ['featured-articles'],
    queryFn: () => articleApi.getFeaturedArticles(3),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
  })

  const articles = articlesData?.data?.data?.records || []
  const featuredArticles = featuredData?.data?.data || []
  const categories = categoriesData?.data?.data || []

  return (
    <div>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="hero-gradient rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-sm font-medium mb-6">
                Professional · Unbiased · In-depth
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Discover Products<br />Worth Buying
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                We've tested thousands of products to bring you the most professional and unbiased buying advice.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/category/tech"
                  className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Browse Reviews
                </Link>
                <button className="px-8 py-3.5 glass-effect rounded-xl font-semibold hover:bg-white/20 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Categories</h2>
            <Link to="/categories" className="text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category: Category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${categoryColors[category.slug] || 'from-gray-500 to-gray-600'} rounded-2xl p-6 text-white card-hover`}>
                  <div className="mb-4">{categoryIcons[category.slug] || <Zap className="w-10 h-10" />}</div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{Math.floor(Math.random() * 100 + 50)} Reviews</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Latest Reviews</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticles[0] && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Editor's Pick</h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid md:grid-cols-2">
                <div className="aspect-square md:aspect-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/30 text-6xl font-bold">★</span>
                  </div>
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full">
                      Best of 2024
                    </span>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>Featured</span>
                    <span>·</span>
                    <span>{new Date(featuredArticles[0].publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {featuredArticles[0].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                    {featuredArticles[0].summary}
                  </p>
                  <Link
                    to={`/article/${featuredArticles[0].slug}`}
                    className="self-start px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Read Full Review
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden card-hover group">
      <Link to={`/article/${article.slug}`}>
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Smartphone className="w-16 h-16" />
            </div>
          )}
          {article.isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                Editor's Pick
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span>Review</span>
            <span>·</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {article.summary}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
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