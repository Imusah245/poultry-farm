import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'

// Pages
import Home           from './pages/Home'
import EggProduction  from './pages/EggProduction'
import BroilerProduction from './pages/BroilerProduction'
import OurFarm        from './pages/OurFarm'
import Technology     from './pages/Technology'
import Dashboard      from './pages/Dashboard'
import Blog           from './pages/Blog'
import Partnerships   from './pages/Partnerships'
import Contact        from './pages/Contact'
import About          from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-farm-cream grain">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/eggs"          element={<EggProduction />} />
            <Route path="/broilers"      element={<BroilerProduction />} />
            <Route path="/farm"          element={<OurFarm />} />
            <Route path="/technology"    element={<Technology />} />
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/blog"          element={<Blog />} />
            <Route path="/partnerships"  element={<Partnerships />} />
            <Route path="/contact"       element={<Contact />} />
            <Route path="/about"         element={<About />} />
            {/* 404 fallback */}
            <Route path="*" element={
              <div className="section container-max flex flex-col items-center justify-center min-h-[50vh] text-center">
                <p className="section-label">404</p>
                <h1 className="text-4xl font-display mb-4">Page Not Found</h1>
                <p className="text-farm-dark/60 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary">Back to Home</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
