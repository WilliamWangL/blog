import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Smartphone, Laptop, Home as HomeIcon, Zap, Eye, Heart, ArrowRight } from 'lucide-react'
import { articleApi, categoryApi } from '@/utils/api'
import type { Article, Category } from '@/types'

const categoryIcons: Record<string, React.ReactNode> = {
  smartphones: <Smartphone className="w-8 h-8 stroke-[1.5]" />,
  laptops: <Laptop className="w-8 h-8 stroke-[1.5]" />,
  'smart-home': <HomeIcon className="w-8 h-8 stroke-[1.5]" />,
  accessories: <Zap className="w-8 h-8 stroke-[1.5]" />,
}

const categoryColors: Record<string, string> = {
  smartphones: 'from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900',
  laptops: 'from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900',
  'smart-home': 'from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900',
  accessories: 'from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900',
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
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="hero-gradient rounded-[2.5rem] p-8 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-gray-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <span className="inline-block px-5 py-2 rounded-full border border-white/20 bg-white/5 text-xs font-light tracking-[0.2em] uppercase mb-8 backdrop-blur-md">
                Professional · Unbiased · In-depth
              </span>
              <h1 className="text-5xl md:text-7xl font-extralight mb-8 leading-tight tracking-tight">
                Discover Products<br />
                <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">Worth Buying</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
                We've tested thousands of products to bring you the most professional and unbiased buying advice.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/category/tech"
                  className="px-8 py-4 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-colors tracking-wide uppercase"
                >
                  Browse Reviews
                </Link>
                <button className="px-8 py-4 border border-white/20 rounded-full text-sm font-medium hover:bg-white/10 transition-colors tracking-wide uppercase backdrop-blur-md">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-4">
              <h2 className="text-3xl font-extralight tracking-tight text-gray-900 dark:text-white">Popular Categories</h2>
              <div className="hidden sm:block w-24 h-px bg-gray-200 dark:bg-gray-800"></div>
            </div>
            <Link to="/categories" className="text-sm tracking-widest uppercase font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center group">
              <span>View All</span> 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category: Category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${categoryColors[category.slug] || 'from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900'} rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-white card-hover relative overflow-hidden`}>
                  <div className="mb-6 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-500">{categoryIcons[category.slug] || <Zap className="w-8 h-8 stroke-[1.5]" />}</div>
                  <h3 className="font-medium text-xl tracking-tight">{category.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-light">{Math.floor(Math.random() * 100 + 50)} Reviews</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-12">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
            <h2 className="text-3xl font-extralight tracking-tight text-gray-900 dark:text-white px-4">Latest Reviews</h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticles[0] && (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-12">
              <h2 className="text-3xl font-extralight tracking-tight text-gray-900 dark:text-white">Editor's Pick</h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl group">
              <div className="grid md:grid-cols-2 min-h-[600px]">
                <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {featuredArticles[0].coverImage ? (
                    <img 
                      src={featuredArticles[0].coverImage} 
                      alt={featuredArticles[0].title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      <Smartphone className="w-24 h-24 text-gray-300 dark:text-gray-600 stroke-[0.5]" />
                    </div>
                  )}
                  <div className="absolute top-8 left-8">
                    <span className="px-5 py-2 bg-black/80 backdrop-blur-md text-white text-xs font-medium tracking-widest uppercase rounded-full">
                      Best of 2024
                    </span>
                  </div>
                </div>
                <div className="p-12 md:p-20 flex flex-col justify-center bg-white dark:bg-gray-900 relative">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/50 dark:to-gray-900/50 pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 text-xs tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-6 font-medium">
                      <span>Featured</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                      <span>{new Date(featuredArticles[0].publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                      {featuredArticles[0].title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-10 font-light">
                      {featuredArticles[0].summary}
                    </p>
                    <Link
                      to={`/article/${featuredArticles[0].slug}`}
                      className="inline-flex items-center space-x-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors tracking-wide uppercase group/btn"
                    >
                      <span>Read Full Review</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
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
    <article className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden card-hover group border border-gray-100 dark:border-gray-800">
      <Link to={`/article/${article.slug}`}>
        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600">
              <Smartphone className="w-12 h-12 stroke-[1]" />
            </div>
          )}
          {article.isFeatured && (
            <div className="absolute top-6 left-6">
              <span className="px-4 py-1.5 bg-black/80 backdrop-blur-md text-white text-xs tracking-wider uppercase font-medium rounded-full">
                Editor's Pick
              </span>
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