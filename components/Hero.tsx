
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1920" 
          alt="Garments Industry" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block px-4 py-1 bg-red-600 text-white text-xs font-bold tracking-widest uppercase mb-6 rounded">
            Global Trade & Export Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Sourcing <span className="text-red-500 underline decoration-4 underline-offset-8">Premium</span> Branded Garments Globally.
          </h1>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
            Red Bird International specializes in sourcing high-quality ready-made garments stock from world-class brands including Tommy Hilfiger, Calvin Klein, and more.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="#products" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-red-600/40 text-center">
              Explore Our Catalog
            </a>
            <a href="#about" className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg transition-all text-center">
              Learn More
            </a>
          </div>
          
          <div className="mt-12 flex items-center space-x-6 text-slate-400">
             <div className="flex flex-col">
                <span className="text-white font-bold text-2xl">100+</span>
                <span className="text-xs uppercase tracking-tighter">Brands Sourced</span>
             </div>
             <div className="w-px h-10 bg-slate-700"></div>
             <div className="flex flex-col">
                <span className="text-white font-bold text-2xl">25+</span>
                <span className="text-xs uppercase tracking-tighter">Countries Served</span>
             </div>
             <div className="w-px h-10 bg-slate-700"></div>
             <div className="flex flex-col">
                <span className="text-white font-bold text-2xl">5M+</span>
                <span className="text-xs uppercase tracking-tighter">Units Exported</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
