import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Login from '@/pages/Login'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Articles from '@/pages/Articles'
import ArticleEditor from '@/pages/ArticleEditor'
import Categories from '@/pages/Categories'
import Users from '@/pages/Users'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="articles" element={<Articles />} />
        <Route path="articles/new" element={<ArticleEditor />} />
        <Route path="articles/edit/:id" element={<ArticleEditor />} />
        <Route path="categories" element={<Categories />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  )
}

export default App