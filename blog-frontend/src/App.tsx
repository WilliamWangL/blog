import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import ArticleDetail from '@/pages/ArticleDetail'
import CategoryPage from '@/pages/CategoryPage'
import SearchPage from '@/pages/SearchPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:slug" element={<ArticleDetail />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Layout>
  )
}

export default App