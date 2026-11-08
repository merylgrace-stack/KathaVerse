import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { RequireRole } from './components/RequireRole'
import { RequireSignIn } from './components/RequireSignIn'
import { AuthProvider } from './lib/auth'
import { LanguageProvider } from './lib/language'
import { About } from './pages/About'
import { Admin } from './pages/Admin'
import { Contribute } from './pages/Contribute'
import { Explore } from './pages/Explore'
import { Home } from './pages/Home'
import { Library } from './pages/Library'
import { Login } from './pages/Login'
import { Reader } from './pages/Reader'
import { StoryDetail } from './pages/StoryDetail'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const immersive = /\/read\/?$/.test(pathname)

  return (
    <AuthProvider>
      <LanguageProvider>
        <ScrollToTop />
        <div className="flex min-h-screen flex-col">
          {!immersive && <Header />}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/stories/:storyId" element={<StoryDetail />} />
              <Route
                path="/stories/:storyId/read"
                element={
                  <RequireSignIn>
                    <Reader />
                  </RequireSignIn>
                }
              />
              <Route path="/library" element={<Library />} />
              <Route path="/contribute" element={<Contribute />} />
              <Route path="/login" element={<Login mode="signin" />} />
              <Route path="/register" element={<Login mode="signup" />} />
              <Route
                path="/admin"
                element={
                  <RequireRole roles={['reviewer', 'admin']}>
                    <Admin />
                  </RequireRole>
                }
              />
              {/* The old public reviewer route is retired; readers never see it. */}
              <Route path="/reviewer" element={<Navigate to="/admin" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          {!immersive && <Footer />}
        </div>
      </LanguageProvider>
    </AuthProvider>
  )
}
