
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPortal from './components/AdminPortal';

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);

  // Simple route simulation
  useEffect(() => {
    const handleHash = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (isAdminView) {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Products />
      
      {/* Brands Scrolling Section */}
      <section className="py-12 bg-white border-y border-slate-100">
         <div className="container mx-auto px-4 overflow-hidden">
            <div className="flex items-center space-x-12 animate-scroll">
               <span className="text-3xl font-bold text-slate-200 grayscale opacity-40">TOMMY HILFIGER</span>
               <span className="text-3xl font-bold text-slate-200 grayscale opacity-40">CALVIN KLEIN</span>
               <span className="text-3xl font-bold text-slate-200 grayscale opacity-40">LACOSTE</span>
               <span className="text-3xl font-bold text-slate-200 grayscale opacity-40">RALPH LAUREN</span>
               <span className="text-3xl font-bold text-slate-200 grayscale opacity-40">NIKE</span>
               <span className="text-3xl font-bold text-slate-200 grayscale opacity-40">H&M</span>
               <span className="text-3xl font-bold text-slate-200 grayscale opacity-40">ZARA</span>
               <span className="text-3xl font-bold text-slate-200 grayscale opacity-40">LEVIS</span>
            </div>
         </div>
      </section>

      <Contact />
      <Footer />
      
      {/* Hidden Admin Access (Shortcut: Click the Year in Footer or direct URL) */}
      
      {/* Global CSS for Animations */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: 200%;
          animation: scroll 30s linear infinite;
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;