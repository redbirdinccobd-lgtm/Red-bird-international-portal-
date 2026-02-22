
import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-100 rounded-full z-0 opacity-50"></div>
             <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800" 
                  alt="Quality Garments" 
                  className="w-full h-auto"
                />
             </div>
             <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-8 rounded-xl shadow-xl z-20 max-w-[240px]">
                <p className="text-3xl font-bold mb-1">10+</p>
                <p className="text-sm text-slate-400">Years of Excellence in RMG Stock Export</p>
             </div>
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4">About Red Bird International</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              A Global Leader in Premium Ready-Made Garments.
            </h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Based in the heart of the global textile hub, Red Bird International bridges the gap between top manufacturers and global retailers. We specialize in high-demand stock lots and fresh orders from the world's most recognized brands.
            </p>
            
            <div className="space-y-6">
               <div className="flex items-start space-x-4">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Brand Authenticity</h4>
                    <p className="text-slate-500">We work directly with authorized sources to ensure 100% genuine brand stock.</p>
                  </div>
               </div>
               <div className="flex items-start space-x-4">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Ethical Sourcing</h4>
                    <p className="text-slate-500">Commitment to fair trade practices and sustainable supply chain management.</p>
                  </div>
               </div>
               <div className="flex items-start space-x-4">
                  <div className="bg-red-50 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Global Logistics</h4>
                    <p className="text-slate-500">Ready to supply to US, EU, Middle East and beyond with rapid delivery.</p>
                  </div>
               </div>
            </div>
            
            <div className="mt-12 flex flex-wrap gap-8 items-center opacity-60">
                <span className="font-black italic text-2xl text-slate-400">TOMMY</span>
                <span className="font-black uppercase text-2xl text-slate-400">CALVIN KLEIN</span>
                <span className="font-black text-2xl text-slate-400 tracking-tighter underline">LACOSTE</span>
                <span className="font-black text-2xl text-slate-400">ZARA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
