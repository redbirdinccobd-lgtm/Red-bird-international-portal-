
import React from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div className="md:max-w-xl">
            <h2 className="text-red-500 font-bold tracking-widest uppercase text-sm mb-4">How We Work</h2>
            <h3 className="text-4xl md:text-5xl font-bold">End-to-End Solutions for Global Retailers.</h3>
          </div>
          <p className="text-slate-400 text-lg md:max-w-sm">
            We handle the complexities of sourcing and shipping so you can focus on growing your brand.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => (
            <div key={index} className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-red-600 transition-colors group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold mb-4">{service.title}</h4>
              <p className="text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
