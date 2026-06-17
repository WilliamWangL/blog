import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Save } from 'lucide-react'
import RichTextEditor from '@/components/RichTextEditor'
import { articleApi, categoryApi } from '@/utils/api'
import type { Article, Category } from '@/types'

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditing = !!id

  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    summary: '',
    content: '',
    categoryId: undefined,
    status: 0,
    isFeatured: false,
    rating: undefined,
  })

  const { data: articleData } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articleApi.getArticle(Number(id)),
    enabled: isEditing,
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
  })

  const categories = categoriesData?.data || []

  useEffect(() => {
    if (articleData?.data) {
      setFormData(articleData.data)
    }
  }, [articleData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await articleApi.updateArticle(Number(id), formData)
      } else {
        await articleApi.createArticle(formData)
      }
      navigate('/articles')
    } catch (error) {
      console.error('Failed to save article:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100)
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/articles')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Article' : 'New Article'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value
                setFormData({
                  ...formData,
                  title,
                  slug: formData.slug || generateSlug(title),
                })
              }}
              className="input-field"
              placeholder="Enter article title"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="input-field"
              placeholder="article-url-slug"
              required
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Brief summary of the article"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
              className="input-field"
            >
              <option value="">Select a category</option>
              {categories.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (0-5)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating || ''}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="input-field"
              placeholder="4.5"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
              className="input-field"
            >
              <option value={0}>Draft</option>
              <option value={1}>Published</option>
              <option value={2}>Archived</option>
            </select>
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
              Featured Article
            </label>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <RichTextEditor
              content={formData.content || ''}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/articles')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Article</span>
          </button>
        </div>
      </form>
    </div>
  )
}