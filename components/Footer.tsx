
import React from 'react';
import { COMPANY_NAME, NAV_ITEMS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
             <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-md leading-none">RED BIRD</span>
                  <span className="text-[8px] tracking-widest font-semibold text-red-500 uppercase">INTERNATIONAL</span>
                </div>
             </div>
             <p className="text-slate-400 mb-6 leading-relaxed">
               Red Bird International is a world-class global trade and export hub. Sourcing premium branded garments for global distribution.
             </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-slate-400 hover:text-red-500 transition-colors">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Product Categories</h4>
            <ul className="space-y-4">
               <li><a href="#products" className="text-slate-400 hover:text-red-500 transition-colors">Menswear</a></li>
               <li><a href="#products" className="text-slate-400 hover:text-red-500 transition-colors">Womenswear</a></li>
               <li><a href="#products" className="text-slate-400 hover:text-red-500 transition-colors">Activewear</a></li>
               <li><a href="#products" className="text-slate-400 hover:text-red-500 transition-colors">Kids wear</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-slate-400 mb-4">Subscribe to get updates on the latest available stock lots.</p>
            <div className="flex">
               <input type="email" placeholder="Email Address" className="bg-slate-800 border-none rounded-l-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 w-full" />
               <button className="bg-red-600 px-4 rounded-r-lg hover:bg-red-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-slate-500 text-sm">
           <p>© {new Date().getFullYear()} {COMPANY_NAME}. All Rights Reserved.</p>
           <div className="flex space-x-6">
              <a href="#admin" className="hover:text-white transition-colors">Admin Documents</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;