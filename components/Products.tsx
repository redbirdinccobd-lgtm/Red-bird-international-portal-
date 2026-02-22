
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PRODUCTS } from '../constants';

const ProductCarousel: React.FC<{ images: string[]; brand: string }> = ({ images, brand }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Track which indices have been 'activated' for loading to ensure smooth transitions once an image is loaded
  const [loadedIndices, setLoadedIndices] = useState<Set<number>>(new Set([0]));

  // Pre-load the next image whenever the current index changes
  useEffect(() => {
    setLoadedIndices((prev) => {
      const nextIndex = (currentIndex + 1) % images.length;
      if (prev.has(currentIndex) && prev.has(nextIndex)) return prev;
      const next = new Set(prev);
      next.add(currentIndex);
      next.add(nextIndex);
      return next;
    });
  }, [currentIndex, images.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-80 overflow-hidden group/carousel bg-slate-100">
      {/* Images with enhanced Fade + Scale Transition and Hover Zoom */}
      {images.map((img, idx) => {
        const isLoaded = loadedIndices.has(idx);
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
              idx === currentIndex 
                ? 'opacity-100 scale-100 z-10' 
                : 'opacity-0 scale-105 z-0 pointer-events-none'
            }`}
          >
            {isLoaded ? (
              <img
                src={img}
                alt={`${brand} view ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover/carousel:scale-110"
                loading="lazy"
              />
            ) : (
              /* Skeleton/Placeholder while not yet triggered for loading */
              <div className="w-full h-full bg-slate-200 animate-pulse" />
            )}
          </div>
        );
      })}

      {/* Navigation Overlay - Only shows on hover */}
      <div className="absolute inset-0 flex items-center justify-between px-3 z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
        <button
          onClick={prevImage}
          className="bg-white/90 hover:bg-white text-slate-900 p-2.5 rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95 focus:outline-none"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="bg-white/90 hover:bg-white text-slate-900 p-2.5 rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95 focus:outline-none"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Brand Label */}
      <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest z-30 shadow-lg">
        {brand}
      </div>

      {/* Interactive Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ease-out border-none cursor-pointer hover:bg-white/80 ${
              idx === currentIndex 
                ? 'bg-white w-6 shadow-sm' 
                : 'bg-white/40 w-1.5 hover:w-3'
            }`}
            aria-label={`View image ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* Subtle overlay to help visibility of indicators */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-20"></div>
    </div>
  );
};

const Products: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Extract unique brands and categories
  const brands = useMemo(() => ['All', ...Array.from(new Set(PRODUCTS.map(p => p.brand)))], []);
  const categories = useMemo(() => ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))], []);

  // Generate suggestions based on product names and brands
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowerSearch = searchTerm.toLowerCase();
    const matches = new Set<string>();
    
    PRODUCTS.forEach(p => {
      if (p.name.toLowerCase().includes(lowerSearch)) matches.add(p.name);
      if (p.brand.toLowerCase().includes(lowerSearch)) matches.add(p.brand);
    });
    
    return Array.from(matches).slice(0, 6); // Limit to 6 suggestions
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const brandMatch = selectedBrand === 'All' || product.brand === selectedBrand;
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return brandMatch && categoryMatch && searchMatch;
    });
  }, [selectedBrand, selectedCategory, searchTerm]);

  const scrollToProducts = () => {
    const section = document.getElementById('products');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  return (
    <section id="products" className="py-24 bg-slate-50 scroll-mt-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4">Our Specialties</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Explore Our Product Range</h3>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-8">
            We source a diverse array of apparel across categories, ensuring the highest quality for our global partners.
          </p>
          
          <button 
            onClick={scrollToProducts}
            className="group relative inline-flex items-center px-10 py-4 font-bold text-white transition-all duration-300 bg-red-600 rounded-full hover:bg-red-700 shadow-xl shadow-red-600/20 active:scale-95"
          >
            <span className="relative flex items-center">
              View All Products
              <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </button>
        </div>

        {/* Filter Section */}
        <div className="mb-12 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col gap-8">
            
            {/* Search Bar with Autocomplete */}
            <div ref={searchRef} className="relative group/search z-40">
              <input
                type="text"
                placeholder="Search for products or brands (e.g. Tommy, T-Shirt)..."
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all duration-300 shadow-inner"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-6 py-3 hover:bg-slate-50 text-slate-700 hover:text-red-600 font-medium transition-colors flex items-center gap-3 border-b border-slate-50 last:border-none"
                    >
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowSuggestions(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-slate-200 text-slate-500 rounded-full hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Brand Filters */}
              <div className="flex-1">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Filter by Brand</span>
                <div className="flex flex-wrap gap-2">
                  {brands.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        selectedBrand === brand 
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex-1">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Filter by Category</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        selectedCategory === category 
                          ? 'bg-slate-900 text-white shadow-lg' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              {(selectedBrand !== 'All' || selectedCategory !== 'All' || searchTerm !== '') && (
                <button 
                  onClick={handleResetFilters}
                  className="text-red-600 font-bold text-sm hover:underline flex items-center gap-1 self-start lg:self-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Results Counter */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-slate-500 font-medium">
            Showing <span className="text-slate-900 font-bold">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Product Grid */}
        <div id="product-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-[400px]">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full animate-fade-in"
            >
              <ProductCarousel images={product.images} brand={product.brand} />
              <div className="p-7 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{product.category}</p>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">{product.name}</h4>
                
                <div className="mt-auto pt-6 flex justify-between items-center border-t border-slate-50">
                   <button className="text-slate-900 font-bold text-sm inline-flex items-center group/btn transition-colors hover:text-red-600">
                     <span className="border-b-2 border-red-600 pb-0.5">Inquire About Stock</span>
                     <svg className="w-4 h-4 ml-1 transform transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                     </svg>
                   </button>
                   <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" title="Available in Navy"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-red-500" title="Available in Red"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900" title="Available in Black"></div>
                   </div>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400 text-lg">No products found matching your criteria.</p>
              <button 
                onClick={handleResetFilters}
                className="mt-4 text-red-600 font-bold hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;
