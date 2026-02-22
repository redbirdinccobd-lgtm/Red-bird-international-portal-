
import React from 'react';
import { NavItem, Product, Service } from './types';

export const COMPANY_NAME = "Red Bird International";
export const TAGLINE = "Global Trade & Export Hub";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Our Reach", href: "#reach" },
  { label: "Contact", href: "#contact" },
];

export const SERVICES: Service[] = [
  {
    title: "Stock Sourcing",
    description: "Direct sourcing of premium brand overstock and cancel-order items from leading manufacturers.",
    icon: "📦"
  },
  {
    title: "Quality Inspection",
    description: "Strict quality control protocols to ensure every garment meets international standards.",
    icon: "🔍"
  },
  {
    title: "Global Supply Chain",
    description: "Seamless logistics and shipping solutions to deliver garments anywhere in the world.",
    icon: "🌐"
  },
  {
    title: "Customized Orders",
    description: "Flexible sourcing solutions tailored to the specific volume and brand needs of our clients.",
    icon: "👕"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Premium Cotton T-Shirts",
    brand: "Tommy Hilfiger",
    category: "Menswear",
    price: 8.50,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 2,
    name: "Classic Denim Jeans",
    brand: "Calvin Klein",
    category: "Menswear/Womenswear",
    price: 18.00,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1565084888279-aff9969bb048?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 3,
    name: "Casual Polos",
    brand: "Lacoste",
    category: "Menswear",
    price: 12.50,
    images: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1625910513397-24098ec923be?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 4,
    name: "Designer Hoodies",
    brand: "Nike/Adidas",
    category: "Sportswear",
    price: 22.00,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1511746015091-97c76891005a?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 5,
    name: "Formal Shirts",
    brand: "Ralph Lauren",
    category: "Formal",
    price: 15.75,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87034a264c6?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1603252109303-2751441dd15e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=800"
    ]
  },
  {
    id: 6,
    name: "Luxury Innerwear",
    brand: "CK / Emporio",
    category: "Undergarments",
    price: 6.25,
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800"
    ]
  }
];
