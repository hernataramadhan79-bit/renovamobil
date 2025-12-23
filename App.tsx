
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Car, NewsPost, InboxMessage, User, Testimonial, AboutData } from './types';
import { INITIAL_CARS, INITIAL_NEWS, INITIAL_INBOX, INITIAL_TESTIMONIALS, INITIAL_ABOUT } from './constants';
import {
  getCars, createCar, updateCar, deleteCar,
  getNews, createNews, updateNews, deleteNews,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getInbox, createInboxMessage, updateInboxMessage, deleteInboxMessage,
  getAbout, updateAbout,
  getUsers, createUser, updateUser, deleteUser,
  getCurrentUser, signOut, supabase
} from './utils/supabase';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CarDetail from './pages/CarDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import Contact from './pages/Contact';
import About from './pages/About';
import LoginModal from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageNews from './pages/admin/ManageNews';
import ManageInbox from './pages/admin/ManageInbox';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageAbout from './pages/admin/ManageAbout';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onOpenLogin }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isAdminPage) {
    if (!user || user.role !== 'ADMIN') {
      return <Navigate to="/" replace />;
    }
    return (
      <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 animate-fade-in">
        <AdminSidebar onLogout={onLogout} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-slate-100 relative">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 animate-fade-in">
      <Navbar user={user} onLogout={onLogout} onOpenLogin={onOpenLogin} />
      <main className="flex-1">
        {children}
      </main>
      <Footer onOpenLogin={onOpenLogin} />
    </div>
  );
};

const App: React.FC = () => {
  // State Definitions
  const [cars, setCars] = useState<Car[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [inbox, setInbox] = useState<InboxMessage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [aboutData, setAboutData] = useState<AboutData>(INITIAL_ABOUT);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [carsData, newsData, inboxData, testimonialsData] = await Promise.all([
          getCars(),
          getNews(),
          getInbox(),
          getTestimonials()
        ]);

        setCars(carsData);
        setNews(newsData);
        setInbox(inboxData);
        setTestimonials(testimonialsData);

        // Load about data separately to handle errors gracefully
        try {
          const aboutDataResult = await getAbout();
          setAboutData(aboutDataResult);
        } catch (error) {
          console.error('Error loading about data:', error);
          setAboutData(INITIAL_ABOUT);
        }
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        // Fallback to localStorage or constants if Supabase fails
        try {
          const savedCars = localStorage.getItem('renova_cars');
          const savedNews = localStorage.getItem('renova_news');
          const savedInbox = localStorage.getItem('renova_inbox');
          const savedTestimonials = localStorage.getItem('renova_testimonials');
          const savedAbout = localStorage.getItem('renova_about');

          setCars(savedCars ? JSON.parse(savedCars) : INITIAL_CARS);
          setNews(savedNews ? JSON.parse(savedNews) : INITIAL_NEWS);
          setInbox(savedInbox ? JSON.parse(savedInbox) : INITIAL_INBOX);
          setTestimonials(savedTestimonials ? JSON.parse(savedTestimonials) : INITIAL_TESTIMONIALS);
          setAboutData(savedAbout ? JSON.parse(savedAbout) : INITIAL_ABOUT);
        } catch (fallbackError) {
          console.error('Error loading fallback data:', fallbackError);
          setCars(INITIAL_CARS);
          setNews(INITIAL_NEWS);
          setInbox(INITIAL_INBOX);
          setTestimonials(INITIAL_TESTIMONIALS);
          setAboutData(INITIAL_ABOUT);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auth state listener
  useEffect(() => {
    const getInitialUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error getting initial user:', error);
        setUser(null);
      }
    };

    getInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Error getting user on auth change:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setIsLoginOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setUser(null);
    }
  };

  const addMessage = async (msg: Omit<InboxMessage, 'id' | 'date' | 'isRead'>) => {
    try {
      const newMsg = {
        ...msg,
        date: new Date().toISOString().split('T')[0],
        isRead: false
      };
      const createdMsg = await createInboxMessage(newMsg);
      setInbox([createdMsg, ...inbox]);
    } catch (error) {
      console.error('Error adding message:', error);
      // Fallback to local state
      const newMsg: InboxMessage = {
        ...msg,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString().split('T')[0],
        isRead: false
      };
      setInbox([newMsg, ...inbox]);
    }
  };

  const addTestimonial = async (data: Omit<Testimonial, 'id' | 'date' | 'isVisible'>) => {
    try {
      const newTestimonial = {
        ...data,
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        isVisible: true
      };
      const createdTestimonial = await createTestimonial(newTestimonial);
      setTestimonials([createdTestimonial, ...testimonials]);
    } catch (error) {
      console.error('Error adding testimonial:', error);
      // Fallback to local state
      const newTestimonial: Testimonial = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
        isVisible: true
      };
      setTestimonials([newTestimonial, ...testimonials]);
    }
  };

  return (
    <HashRouter>
      <Layout 
        user={user} 
        onLogout={handleLogout} 
        onOpenLogin={() => setIsLoginOpen(true)}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <Home 
              cars={cars.filter(c => c.is_featured)} 
              testimonials={testimonials.filter(t => t.isVisible)} 
              onAddTestimonial={addTestimonial}
              user={user}
              onOpenLogin={() => setIsLoginOpen(true)}
            />
          } />
          <Route path="/catalog" element={<Catalog cars={cars} />} />
          <Route path="/catalog/:id" element={<CarDetail cars={cars} />} />
          <Route path="/news" element={<News news={news} />} />
          <Route path="/news/:id" element={<NewsDetail news={news} />} />
          <Route path="/about" element={<About data={aboutData} />} />
          <Route path="/contact" element={<Contact onSendMessage={addMessage} cars={cars} />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard cars={cars} news={news} inbox={inbox} />} />
          <Route path="/admin/cars" element={<ManageCars />} />
          <Route path="/admin/news" element={<ManageNews />} />
          <Route path="/admin/inbox" element={<ManageInbox inbox={inbox} setInbox={setInbox} />} />
          <Route path="/admin/testimonials" element={<ManageTestimonials testimonials={testimonials} setTestimonials={setTestimonials} />} />
          <Route path="/admin/about" element={<ManageAbout data={aboutData} onSave={setAboutData} />} />

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>

      {isLoginOpen && (
        <LoginModal 
          onLogin={handleLogin} 
          user={user} 
          onClose={() => setIsLoginOpen(false)} 
        />
      )}
    </HashRouter>
  );
};

export default App;
