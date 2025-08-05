
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Articles from '@/pages/Articles';
import ArticleDetail from '@/pages/ArticleDetail';
import Videos from '@/pages/Videos';
import VideoDetail from '@/pages/VideoDetail';
import Tools from '@/pages/Tools';
import Contact from '@/pages/Contact';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/admin/Dashboard';
import HelpCenter from '@/pages/HelpCenter';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import NotFound from '@/pages/NotFound';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/videos/:id" element={<VideoDetail />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <Dashboard />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
