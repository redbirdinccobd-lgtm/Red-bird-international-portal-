
export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  images: string[];
  price?: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface InvoiceItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  date: string;
  clientName: string;
  clientAddress: string;
  incoterms?: string;
  portOfDischarge?: string;
  carrier?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
}