import React, { useState } from 'react';
import { 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function DeliveryTracker({ theme, activeOrder: initialOrder }) {
  const isLight = theme === 'light';

  const [pincode, setPincode] = useState('560001');
  const [pincodeStatus, setPincodeStatus] = useState({
    checked: true,
    available: true,
    city: 'Bengaluru, Karnataka',
    date: 'Saturday, Nov 8, 2026',
    cod: true
  });

  const [searchTrackingId, setSearchTrackingId] = useState('RR-EXP-984210');
  const [currentStep, setCurrentStep] = useState(2); // 0: Placed, 1: Packed, 2: In Transit, 3: Delivered

  const orders = [
    {
      trackingId: 'RR-EXP-984210',
      item: 'Logitech MX Master 3S Wireless Mouse',
      price: '₹8,995',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
      paymentMethod: 'Cash on Delivery (COD)',
      estimatedDate: 'Saturday, Nov 8, 2026',
      carrier: 'BlueDart Express',
      destination: 'Flat 402, Green Glen Layout, Bengaluru - 560001'
    },
    {
      trackingId: 'RR-EXP-771923',
      item: 'Sony WH-1000XM5 Wireless Headphones',
      price: '₹29,990',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      paymentMethod: 'Credit Card (Visa •••• 4242)',
      estimatedDate: 'Monday, Nov 10, 2026',
      carrier: 'Delhivery Air',
      destination: 'Flat 402, Green Glen Layout, Bengaluru - 560001'
    }
  ];

  const activeOrder = initialOrder || orders[0];

  const trackingSteps = [
    {
      title: 'Order Placed & Confirmed',
      desc: 'Order verified via OTP. Payment mode confirmed.',
      time: 'Nov 5, 2026 • 10:30 AM',
      completed: currentStep >= 0,
      active: currentStep === 0
    },
    {
      title: 'Packed & Quality Inspected',
      desc: 'Sealed with tamper-proof packaging at RetailRocket Hub.',
      time: 'Nov 6, 2026 • 02:15 PM',
      completed: currentStep >= 1,
      active: currentStep === 1
    },
    {
      title: 'In Transit / Out for Delivery',
      desc: `Dispatched via ${activeOrder.carrier}. Delivery agent assigned.`,
      time: 'Nov 7, 2026 • 08:45 AM',
      completed: currentStep >= 2,
      active: currentStep === 2
    },
    {
      title: 'Delivered to Doorstep',
      desc: `Cash on Delivery collection & OTP verification.`,
      time: 'Expected: ' + activeOrder.estimatedDate,
      completed: currentStep >= 3,
      active: currentStep === 3
    }
  ];

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus({ checked: true, available: false, city: 'Unknown', date: '', cod: false });
      return;
    }

    const metroCodes = ['110001', '400001', '560001', '500001', '600001', '700001'];
    const isMetro = metroCodes.includes(pincode);
    setPincodeStatus({
      checked: true,
      available: true,
      city: isMetro ? 'Metro Fast Zone' : 'Standard Delivery Zone',
      date: isMetro ? 'Friday, Nov 7, 2026 (Express 48h)' : 'Sunday, Nov 9, 2026 (Standard)',
      cod: true
    });
  };

  const advanceStep = () => {
    setCurrentStep((prev) => (prev < 3 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Customer Delivery Promise */}
      <div className={`p-6 rounded-2xl border ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#0a1630]/90 border-purple-500/20'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/40">
          <div>
            <h2 className={`text-xl font-bold font-['Outfit'] flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Truck className="w-5 h-5 text-purple-600" /> Customer Delivery & Order Tracker
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time shipment tracking, estimated delivery dates, and multi-mode payment options.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Cash on Delivery (COD) Enabled
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Cards & UPI Accepted
            </span>
          </div>
        </div>

        {/* Pincode & Delivery Date Checker */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
          <div className="md:col-span-5">
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">
              Check Estimated Delivery Date & COD by Pincode:
            </label>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                className={`flex-1 border rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#020817] border-purple-500/30 text-white'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:from-purple-500 hover:to-indigo-500"
              >
                Check Date
              </button>
            </form>
          </div>

          <div className="md:col-span-7">
            {pincodeStatus.checked && pincodeStatus.available ? (
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Estimated Delivery: {pincodeStatus.date}</h4>
                    <p className="text-[11px] opacity-80">{pincodeStatus.city} • Free Shipping Available</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-1 bg-emerald-500 text-white rounded-md">
                  COD Available
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Please enter a valid 6-digit Indian Postal Pincode (e.g. 560001, 110001, 400001).</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Delivery Tracker & Order Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Shipment Stepper Tracker (7 cols) */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-6 ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0a1630]/90 border-purple-500/20'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/40">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-500 tracking-wider">Live Shipment Status</span>
              <h3 className={`text-base font-bold font-['Outfit'] mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Tracking ID: <span className="font-mono text-purple-600">{activeOrder.trackingId}</span>
              </h3>
            </div>
            <button
              onClick={advanceStep}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-all flex items-center gap-1.5"
              title="Simulate courier delivery progress for demo"
            >
              <span>Simulate Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-purple-600 before:via-indigo-600 before:to-slate-700">
            {trackingSteps.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                {/* Step Node Icon */}
                <div className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                  step.completed
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                    : isLight
                    ? 'bg-slate-200 text-slate-600 border-slate-300'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}>
                  {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold ${
                      step.completed ? (isLight ? 'text-slate-900' : 'text-white') : 'text-slate-500'
                    }`}>
                      {step.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Courier & Destination Box */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#020817] border-purple-500/20'
          }`}>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block">Delivery Address:</span>
                <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                  {activeOrder.destination}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">Courier Partner:</span>
              <span className="font-bold text-purple-500">{activeOrder.carrier}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Item Summary & Payment Methods (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Item Card */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a1630]/90 border-purple-500/20'
          }`}>
            <h3 className={`text-sm font-bold font-['Outfit'] ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Package Item Details
            </h3>

            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200/20">
                <img src={activeOrder.image} alt={activeOrder.item} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h4 className={`text-xs font-bold line-clamp-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {activeOrder.item}
                </h4>
                <p className="text-xs font-mono font-bold text-emerald-600">{activeOrder.price}</p>
                <span className="inline-block text-[10px] font-semibold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">
                  Qty: 1 • Standard Packaging
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200/40 pt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Option:</span>
                <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  {activeOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Fee:</span>
                <span className="font-bold text-emerald-500">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Delivery:</span>
                <span className="font-bold text-purple-500">{activeOrder.estimatedDate}</span>
              </div>
            </div>
          </div>

          {/* Payment Options Showcase */}
          <div className={`p-6 rounded-2xl border space-y-3.5 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#0a1630]/90 border-purple-500/20'
          }`}>
            <h3 className={`text-sm font-bold font-['Outfit'] flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Supported Payment Methods
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <Banknote className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="font-bold block text-[11px]">Cash on Delivery</span>
                  <span className="text-[9px] text-slate-400">Pay cash or UPI at door</span>
                </div>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <CreditCard className="w-4 h-4 text-purple-500" />
                <div>
                  <span className="font-bold block text-[11px]">Credit / Debit Cards</span>
                  <span className="text-[9px] text-slate-400">Visa, MC, RuPay, Amex</span>
                </div>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <QrCode className="w-4 h-4 text-cyan-500" />
                <div>
                  <span className="font-bold block text-[11px]">Instant UPI</span>
                  <span className="text-[9px] text-slate-400">GPay, PhonePe, Paytm</span>
                </div>
              </div>
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <Clock className="w-4 h-4 text-amber-500" />
                <div>
                  <span className="font-bold block text-[11px]">No-Cost EMI</span>
                  <span className="text-[9px] text-slate-400">Up to 12 months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

