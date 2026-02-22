
import React, { useState, useMemo, useRef } from 'react';
import { PRODUCTS } from '../constants';
import { Invoice, InvoiceItem } from '../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'invoice' | 'history'>('invoice');
  const [previewMode, setPreviewMode] = useState<'invoice' | 'packingList'>('invoice');
  
  // Invoice Form State
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [incoterms, setIncoterms] = useState('FOB');
  const [portOfDischarge, setPortOfDischarge] = useState('');
  const [carrier, setCarrier] = useState('');
  const [selectedItems, setSelectedItems] = useState<{id: number, qty: number, price: number}[]>([]);
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);
  
  // History State
  const [history, setHistory] = useState<Invoice[]>([]);
  const docRef = useRef<HTMLDivElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple simulation of admin access
      setIsAuthenticated(true);
    } else {
      alert('Invalid Password');
    }
  };

  const addItem = (productId: number) => {
    const product = PRODUCTS.find(p => p.id === productId);
    setSelectedItems([...selectedItems, { 
      id: productId, 
      qty: 100, 
      price: product?.price || 10.00 
    }]);
  };

  const runningTotals = useMemo(() => {
    const subtotal = selectedItems.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const tax = subtotal * 0.05;
    return { subtotal, tax, grandTotal: subtotal + tax };
  }, [selectedItems]);

  const generateDocs = () => {
    const items: InvoiceItem[] = selectedItems.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return {
        productId: item.id,
        name: product?.name || 'Unknown',
        quantity: item.qty,
        unitPrice: item.price,
        total: item.qty * item.price
      };
    });

    const invoice: Invoice = {
      id: `RB-${Math.floor(Math.random() * 90000) + 10000}`,
      date: new Date().toLocaleDateString(),
      clientName,
      clientAddress,
      incoterms,
      portOfDischarge,
      carrier,
      items,
      subtotal: runningTotals.subtotal,
      tax: runningTotals.tax,
      grandTotal: runningTotals.grandTotal
    };

    setHistory(prev => [invoice, ...prev]);
    setGeneratedInvoice(invoice);
    setPreviewMode('invoice');
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToCSV = () => {
    if (!generatedInvoice) return;

    const headers = ['Product Name', 'Quantity (PCS)', 'Unit Price (USD)', 'Total (USD)'];
    const rows = generatedInvoice.items.map(item => [
      `"${item.name}"`,
      item.quantity,
      item.unitPrice.toFixed(2),
      item.total.toFixed(2)
    ]);

    // Add totals row
    rows.push([]);
    rows.push(['Subtotal', '', '', generatedInvoice.subtotal.toFixed(2)]);
    rows.push(['Tax (5%)', '', '', generatedInvoice.tax.toFixed(2)]);
    rows.push(['Grand Total', '', '', generatedInvoice.grandTotal.toFixed(2)]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${generatedInvoice.id}_items.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewPastInvoice = (invoice: Invoice) => {
    setGeneratedInvoice(invoice);
    setActiveTab('invoice');
    setPreviewMode('invoice');
  };

  const exportToPDF = async () => {
    if (!docRef.current || !generatedInvoice) return;

    const element = docRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${generatedInvoice.id}_${previewMode}.pdf`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Documents</h2>
            <p className="text-slate-500">Access Restricted to Authorized Personnel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Security Key</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-600/20">
              Unlock Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-slate-200 py-4 no-print">
        <div className="container mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="bg-red-600 text-white font-black px-3 py-1 rounded">RB</span>
            <span className="font-bold text-slate-900 uppercase tracking-widest text-sm">Admin Dashboard</span>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-slate-500 hover:text-red-600 text-sm font-bold">Logout</button>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="w-72 space-y-6 no-print">
            <div className="px-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('invoice')}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                    activeTab === 'invoice' 
                    ? 'bg-red-600 text-white shadow-xl shadow-red-600/30 scale-[1.02] -translate-y-0.5' 
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors ${activeTab === 'invoice' ? 'text-white' : 'text-slate-400 group-hover:text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Document Editor</span>
                </button>

                <button 
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                    activeTab === 'history' 
                    ? 'bg-red-600 text-white shadow-xl shadow-red-600/30 scale-[1.02] -translate-y-0.5' 
                    : 'bg-white text-slate-500 border border-slate-100 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <svg className={`w-5 h-5 transition-colors ${activeTab === 'history' ? 'text-white' : 'text-slate-400 group-hover:text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Shipment Logs</span>
                </button>
              </div>
            </div>

            <div className="px-2 pt-6 border-t border-slate-200">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Export Tools</h4>
              <button 
                className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold bg-white text-slate-500 border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm opacity-60 cursor-not-allowed"
                disabled
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 10-8 0v2a2 2 0 002 2h4a2 2 0 002-2zm3-9a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                <span>Bulk Customs Sync</span>
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === 'invoice' && !generatedInvoice && (
              <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200 animate-fade-in no-print">
                <div className="flex justify-between items-center mb-8 border-b pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Shipment Editor</h3>
                    <p className="text-slate-500 text-sm">Prepare commercial documents for export.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Document Status</span>
                    <div className="text-amber-600 font-bold flex items-center justify-end gap-1">
                      <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
                      Drafting
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Client (Consignee)</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-red-500 outline-none transition-all" 
                      placeholder="e.g. Global Fashion Group"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Final Destination</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-red-500 outline-none transition-all" 
                      placeholder="e.g. London, United Kingdom"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mb-10">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Incoterms</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-red-500 outline-none transition-all" 
                      placeholder="e.g. FOB, CIF"
                      value={incoterms}
                      onChange={(e) => setIncoterms(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Port of Discharge</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-red-500 outline-none transition-all" 
                      placeholder="e.g. Port of Felixstowe"
                      value={portOfDischarge}
                      onChange={(e) => setPortOfDischarge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Carrier / Vessel</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:border-red-500 outline-none transition-all" 
                      placeholder="e.g. Maersk Line"
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Add Products</h4>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCTS.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => addItem(p.id)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium hover:border-red-500 hover:text-red-600 transition-all flex items-center gap-2"
                      >
                        <span className="text-red-500">+</span> {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedItems.length > 0 && (
                  <div className="border border-slate-100 rounded-2xl overflow-hidden mb-8 shadow-inner bg-slate-50/30">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-left font-bold text-slate-600">Product Name</th>
                          <th className="px-6 py-4 text-center font-bold text-slate-600">Quantity (PCS)</th>
                          <th className="px-6 py-4 text-right font-bold text-slate-600">Unit Price (USD)</th>
                          <th className="px-6 py-4 text-right font-bold text-slate-600">Row Total</th>
                          <th className="px-6 py-4 text-center font-bold text-slate-600">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedItems.map((item, idx) => {
                          const p = PRODUCTS.find(prod => prod.id === item.id);
                          return (
                            <tr key={idx} className="bg-white hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-900">{p?.name}</td>
                              <td className="px-6 py-4 text-center">
                                <input 
                                  type="number" 
                                  className="w-24 px-2 py-1 text-center bg-slate-50 border border-transparent hover:border-slate-200 focus:bg-white focus:border-red-500 rounded-lg outline-none transition-all font-bold" 
                                  value={item.qty}
                                  onChange={(e) => {
                                    const newItems = [...selectedItems];
                                    newItems[idx].qty = parseInt(e.target.value) || 0;
                                    setSelectedItems(newItems);
                                  }}
                                />
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <span className="text-slate-400">$</span>
                                  <input 
                                    type="number" 
                                    step="0.01"
                                    className="w-24 px-2 py-1 text-right bg-slate-50 border border-transparent hover:border-slate-200 focus:bg-white focus:border-red-500 rounded-lg outline-none transition-all font-bold" 
                                    value={item.price}
                                    onChange={(e) => {
                                      const newItems = [...selectedItems];
                                      newItems[idx].price = parseFloat(e.target.value) || 0;
                                      setSelectedItems(newItems);
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right font-black text-slate-900">${(item.qty * item.price).toFixed(2)}</td>
                              <td className="px-6 py-4 text-center">
                                <button 
                                  onClick={() => setSelectedItems(selectedItems.filter((_, i) => i !== idx))}
                                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                  title="Remove item"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex justify-between items-end">
                   <div className="flex gap-4">
                      <button 
                        onClick={() => setSelectedItems([])}
                        className="text-slate-400 font-bold text-xs hover:text-red-500 uppercase tracking-widest"
                        disabled={selectedItems.length === 0}
                      >
                        Clear All Items
                      </button>
                   </div>
                   <div className="w-72 bg-slate-900 text-white p-6 rounded-2xl space-y-3 shadow-xl">
                      <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-tighter">
                         <span>Draft Subtotal</span>
                         <span>${runningTotals.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-black">
                         <span>TOTAL USD</span>
                         <span>${runningTotals.grandTotal.toFixed(2)}</span>
                      </div>
                   </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100">
                  <button 
                    onClick={generateDocs}
                    className="w-full bg-red-600 text-white font-bold px-10 py-5 rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-30 disabled:grayscale"
                    disabled={selectedItems.length === 0 || !clientName}
                  >
                    Lock Shipment & Generate Official PDFs
                  </button>
                </div>
              </div>
            )}

            {/* Document Preview (Printable) */}
            {generatedInvoice && (
              <div className="space-y-6 relative">
                <div className="no-print flex justify-between items-center mb-4 sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md py-4">
                  <button 
                    onClick={() => setGeneratedInvoice(null)} 
                    className="text-red-600 font-bold flex items-center gap-2 hover:underline"
                  >
                    ← Edit Draft Again
                  </button>
                  
                  <div className="flex bg-white p-1 rounded-full shadow-sm border border-slate-200">
                    <button 
                      onClick={() => setPreviewMode('invoice')}
                      className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${previewMode === 'invoice' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      Commercial Invoice
                    </button>
                    <button 
                      onClick={() => setPreviewMode('packingList')}
                      className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${previewMode === 'packingList' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                      Packing List
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={exportToCSV}
                      className="bg-white text-slate-700 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 text-xs font-bold"
                      title="Export to CSV"
                    >
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      CSV
                    </button>
                    <button 
                      onClick={exportToPDF}
                      className="bg-white text-slate-700 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 text-xs font-bold"
                      title="Export to PDF"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="bg-slate-900 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                      title="Print Document"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div ref={docRef}>
                  {previewMode === 'invoice' ? (
                    /* Invoice Page */
                    <div className="bg-white p-12 shadow-2xl border border-slate-200 rounded-lg max-w-[800px] mx-auto print:shadow-none print:border-none print:p-0 animate-fade-in relative overflow-hidden">
                    {/* Watermark for screen preview only */}
                    <div className="no-print absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-100 font-black text-8xl -rotate-45 pointer-events-none opacity-20 uppercase">Official</div>
                    
                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-10 mb-10">
                      <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">COMMERCIAL INVOICE</h1>
                        <p className="text-slate-500 font-bold">Ref No: {generatedInvoice.id}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-2 mb-2">
                           <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-[10px]">R</span>
                           </div>
                           <h2 className="text-lg font-bold text-slate-900">Red Bird International</h2>
                        </div>
                        <p className="text-slate-500 text-xs">House #12, Road #04, Sector #01</p>
                        <p className="text-slate-500 text-xs">Uttara, Dhaka, Bangladesh</p>
                        <p className="text-slate-500 text-xs font-medium mt-1">contact@redbird-international.com</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 mb-12">
                      <div>
                        <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Billed To (Consignee)</h4>
                        <p className="font-bold text-slate-900 text-lg leading-tight">{generatedInvoice.clientName}</p>
                        <p className="text-slate-600 text-sm mt-2 max-w-[280px]">{generatedInvoice.clientAddress}</p>
                      </div>
                      <div className="text-right">
                        <div className="mb-4">
                           <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Date of Issue</h4>
                           <p className="font-bold text-slate-900">{generatedInvoice.date}</p>
                        </div>
                        <div>
                           <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Port of Loading</h4>
                           <p className="font-bold text-slate-900">Chattogram, Bangladesh</p>
                        </div>
                        {generatedInvoice.portOfDischarge && (
                          <div className="mt-4">
                             <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Port of Discharge</h4>
                             <p className="font-bold text-slate-900">{generatedInvoice.portOfDischarge}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <table className="w-full mb-12">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="py-4 text-left font-bold text-slate-900 text-sm">Description of Goods</th>
                          <th className="py-4 text-center font-bold text-slate-900 text-sm">Qty</th>
                          <th className="py-4 text-right font-bold text-slate-900 text-sm">Unit Price</th>
                          <th className="py-4 text-right font-bold text-slate-900 text-sm">Total Value (USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedInvoice.items.map((item, i) => (
                          <tr key={i} className="border-b border-slate-50">
                            <td className="py-4 text-slate-700 text-sm">
                               <p className="font-bold">{item.name}</p>
                               <p className="text-[10px] text-slate-400 uppercase">Origin: Bangladesh</p>
                            </td>
                            <td className="py-4 text-center text-slate-700 text-sm">{item.quantity} PCS</td>
                            <td className="py-4 text-right text-slate-700 text-sm">${item.unitPrice.toFixed(2)}</td>
                            <td className="py-4 text-right font-bold text-slate-900 text-sm">${item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flex justify-between items-start">
                       <div className="max-w-[300px]">
                          <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Payment Terms</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">Payment to be made via Telegraphic Transfer (TT) or Letter of Credit (L/C) as per signed agreement.</p>
                       </div>
                       <div className="w-64 space-y-3">
                          <div className="flex justify-between text-slate-500 text-sm">
                            <span>{generatedInvoice.incoterms || 'FOB'} Subtotal</span>
                            <span>${generatedInvoice.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-slate-500 text-sm">
                            <span>Doc Fees / Handling</span>
                            <span>${generatedInvoice.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xl font-black text-slate-900 border-t-2 border-slate-900 pt-3">
                            <span>TOTAL</span>
                            <span>${generatedInvoice.grandTotal.toFixed(2)}</span>
                          </div>
                       </div>
                    </div>

                    <div className="mt-24 flex justify-between">
                       <div className="text-center w-48">
                          <div className="border-b border-slate-300 h-12 mb-2"></div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Authorized Signature</p>
                       </div>
                       <div className="text-center w-48">
                          <div className="border-b border-slate-300 h-12 mb-2"></div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Receiver Acknowledgment</p>
                       </div>
                    </div>
                  </div>
                ) : (
                  /* Packing List Page */
                  <div className="bg-white p-12 shadow-2xl border border-slate-200 rounded-lg max-w-[800px] mx-auto print:shadow-none print:border-none print:p-0 animate-fade-in relative overflow-hidden">
                    <div className="no-print absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-100 font-black text-8xl -rotate-45 pointer-events-none opacity-20 uppercase">Official</div>

                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-10 mb-10">
                      <div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">PACKING LIST</h1>
                        <p className="text-slate-500 font-bold">Ref No: {generatedInvoice.id}/PL</p>
                      </div>
                      <div className="text-right">
                         <div className="flex items-center justify-end space-x-2 mb-2">
                           <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-[10px]">R</span>
                           </div>
                           <h2 className="text-lg font-bold text-slate-900">Red Bird International</h2>
                        </div>
                        <p className="text-slate-500 text-xs">Exports & Logistics Division</p>
                        <p className="text-slate-500 text-xs font-medium mt-1">ops@redbird-international.com</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 mb-12">
                      <div>
                        <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Consignee Details</h4>
                        <p className="font-bold text-slate-900 text-lg leading-tight">{generatedInvoice.clientName}</p>
                        <p className="text-slate-600 text-sm mt-2">{generatedInvoice.clientAddress}</p>
                      </div>
                      <div className="text-right">
                        <div className="mb-4">
                           <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Shipment Date</h4>
                           <p className="font-bold text-slate-900">{generatedInvoice.date}</p>
                        </div>
                        <div>
                           <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Total Weight (Est.)</h4>
                           <p className="font-bold text-slate-900">{(generatedInvoice.items.reduce((acc, i) => acc + i.quantity, 0) * 0.28).toFixed(1)} KGS</p>
                        </div>
                        {generatedInvoice.carrier && (
                          <div className="mt-4">
                             <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Carrier</h4>
                             <p className="font-bold text-slate-900">{generatedInvoice.carrier}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <table className="w-full mb-12">
                      <thead>
                        <tr className="border-b-2 border-slate-200 bg-slate-50">
                          <th className="py-4 px-2 text-left font-bold text-slate-900 text-[11px] uppercase tracking-wider">Item Details</th>
                          <th className="py-4 px-2 text-center font-bold text-slate-900 text-[11px] uppercase tracking-wider">Quantity</th>
                          <th className="py-4 px-2 text-center font-bold text-slate-900 text-[11px] uppercase tracking-wider">Cartons</th>
                          <th className="py-4 px-2 text-right font-bold text-slate-900 text-[11px] uppercase tracking-wider">Net Weight</th>
                          <th className="py-4 px-2 text-right font-bold text-slate-900 text-[11px] uppercase tracking-wider">Gross Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {generatedInvoice.items.map((item, i) => {
                          const cartons = Math.ceil(item.quantity / 50); // Simulated 50 units per carton
                          const netW = item.quantity * 0.25; // 0.25kg per item
                          const grossW = netW * 1.12; // 12% packaging weight
                          return (
                            <tr key={i} className="border-b border-slate-50">
                              <td className="py-4 px-2 text-slate-700 text-sm">
                                 <p className="font-bold">{item.name}</p>
                                 <p className="text-[9px] text-slate-400">P.O. REF: RBI-2024-{item.productId}</p>
                              </td>
                              <td className="py-4 px-2 text-center text-slate-900 font-bold text-sm">{item.quantity} PCS</td>
                              <td className="py-4 px-2 text-center text-slate-700 text-sm">{cartons} CTNS</td>
                              <td className="py-4 px-2 text-right text-slate-700 text-sm">{netW.toFixed(2)} KG</td>
                              <td className="py-4 px-2 text-right font-bold text-slate-900 text-sm">{grossW.toFixed(2)} KG</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-900 text-white">
                           <td className="py-4 px-4 font-bold text-[11px] uppercase border-r border-slate-700">Shipment Totals</td>
                           <td className="py-4 px-2 text-center font-bold border-r border-slate-700">{generatedInvoice.items.reduce((acc, i) => acc + i.quantity, 0)} PCS</td>
                           <td className="py-4 px-2 text-center font-bold border-r border-slate-700">{generatedInvoice.items.reduce((acc, i) => acc + Math.ceil(i.quantity / 50), 0)} CTNS</td>
                           <td className="py-4 px-2 text-right font-bold border-r border-slate-700">{generatedInvoice.items.reduce((acc, i) => acc + (i.quantity * 0.25), 0).toFixed(1)} KG</td>
                           <td className="py-4 px-2 text-right font-bold">{generatedInvoice.items.reduce((acc, i) => acc + (i.quantity * 0.25 * 1.12), 0).toFixed(1)} KG</td>
                        </tr>
                      </tfoot>
                    </table>

                    <div className="grid grid-cols-3 gap-6 mb-12">
                       <div className="p-4 border border-slate-100 rounded-lg">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Packaging</h4>
                          <p className="text-xs text-slate-700 font-medium">Standard 5-Ply Corrugated Cartons</p>
                       </div>
                       <div className="p-4 border border-slate-100 rounded-lg">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Marks</h4>
                          <p className="text-xs text-slate-700 font-medium">C/NO: 1 UPWARDS</p>
                       </div>
                       <div className="p-4 border border-slate-100 rounded-lg">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">Shipped Via</h4>
                          <p className="text-xs text-slate-700 font-medium">{generatedInvoice.carrier || 'Sea Freight (FCL)'}</p>
                       </div>
                    </div>

                    <div className="mt-20 pt-10 border-t border-slate-100 text-center text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                       Official Logistics Documentation • Red Bird International
                    </div>
                  </div>
                )}
              </div>

              <div className="no-print flex justify-center mt-12 mb-20 gap-4">
                  <button 
                    onClick={handlePrint} 
                    className="bg-red-600 text-white font-bold px-12 py-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print {previewMode === 'invoice' ? 'Commercial Invoice' : 'Packing List'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200 no-print animate-fade-in">
                <div className="flex justify-between items-center mb-8 border-b pb-6">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Shipment Archive
                  </h3>
                  <p className="text-slate-500 text-sm font-medium">Tracking {history.length} generated documents</p>
                </div>

                {history.length > 0 ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-100">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left font-bold text-slate-600">Invoice ID</th>
                          <th className="px-6 py-4 text-left font-bold text-slate-600">Client Name</th>
                          <th className="px-6 py-4 text-center font-bold text-slate-600">Date</th>
                          <th className="px-6 py-4 text-right font-bold text-slate-600">Grand Total</th>
                          <th className="px-6 py-4 text-center font-bold text-slate-600">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {history.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-black text-red-600">{inv.id}</td>
                            <td className="px-6 py-4 font-bold text-slate-900">{inv.clientName}</td>
                            <td className="px-6 py-4 text-center text-slate-500">{inv.date}</td>
                            <td className="px-6 py-4 text-right font-black text-slate-900">${inv.grandTotal.toFixed(2)}</td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => viewPastInvoice(inv)}
                                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-red-600 transition-all hover:shadow-lg shadow-slate-900/10"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-24 text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="font-bold text-slate-600">Archive Empty</p>
                    <p className="text-sm mt-1">Generated documents will appear here for review.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;
