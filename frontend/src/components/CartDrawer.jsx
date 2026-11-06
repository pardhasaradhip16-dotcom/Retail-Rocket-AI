import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  CreditCard,
  Banknote
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQty,
  onRemoveItem,
  onCheckoutOrder,
  theme
}) {
  if (!isOpen) return null;

  const isLight = theme === 'light';
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (COD)');

  // Helper to parse numeric price from string like "₹8,995" or "₹1,49,900"
  const parsePrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    const clean = String(priceStr || '').replace(/[^\d.]/g, '');
    return parseFloat(clean) || 0;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.price) * (item.quantity || 1);
  }, 0);

  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;
  const totalCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;
    const firstItem = cartItems[0];
    onCheckoutOrder({
      items: cartItems,
      mainItem: firstItem,
      totalAmount: `₹${total.toLocaleString('en-IN')}`,
      paymentMethod,
      itemCount: totalCount
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className={`w-screen max-w-md shadow-2xl flex flex-col transition-all duration-300 border-l ${
          isLight 
            ? 'bg-white border-slate-200 text-slate-800' 
            : 'bg-[#091428] border-purple-500/20 text-white'
        }`}>
          {/* Header */}
          <div className={`p-5 border-b flex items-center justify-between ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-purple-500/20 bg-[#060e1d]'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-['Outfit']">Your Shopping Cart</h2>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {totalCount} {totalCount === 1 ? 'item' : 'items'} ready for checkout
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isLight ? 'hover:bg-slate-200 text-slate-600' : 'hover:bg-purple-950/50 text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Your cart is empty</h3>
                  <p className={`text-xs mt-1 max-w-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Explore the personalized AI recommendations and add items to your cart!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemTotal = parsePrice(item.price) * (item.quantity || 1);
                return (
                  <div
                    key={item.item_id}
                    className={`p-3 rounded-2xl border flex gap-3 transition-all ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 shadow-sm' 
                        : 'bg-[#0f1d38]/80 border-purple-500/20'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-purple-500/20 bg-slate-900 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold truncate" title={item.name}>
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.item_id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className={`text-[10px] ${isLight ? 'text-purple-600' : 'text-purple-400'} font-medium`}>
                        {item.category}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-mono font-bold text-xs text-indigo-400">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </span>

                        {/* Quantity Stepper */}
                        <div className={`flex items-center gap-1 rounded-lg border px-1.5 py-0.5 ${
                          isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-purple-500/30'
                        }`}>
                          <button
                            onClick={() => onUpdateQty(item.item_id, (item.quantity || 1) - 1)}
                            className="p-1 hover:text-purple-400 text-slate-400"
                            disabled={(item.quantity || 1) <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold px-1.5">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.item_id, (item.quantity || 1) + 1)}
                            className="p-1 hover:text-purple-400 text-slate-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cartItems.length > 0 && (
            <div className={`p-5 border-t space-y-4 ${
              isLight ? 'border-slate-200 bg-slate-50' : 'border-purple-500/20 bg-[#060e1d]'
            }`}>
              {/* Payment Option Selector */}
              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold block ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  Payment Mode:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setPaymentMethod('Cash on Delivery (COD)')}
                    className={`py-2 px-2.5 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'Cash on Delivery (COD)'
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-sm'
                        : isLight
                        ? 'border-slate-300 bg-white text-slate-600'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Cash on Delivery</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('Credit / Debit Card (Visa)')}
                    className={`py-2 px-2.5 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod.includes('Card')
                        ? 'border-purple-500 bg-purple-500/15 text-purple-400 shadow-sm'
                        : isLight
                        ? 'border-slate-300 bg-white text-slate-600'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card / UPI</span>
                  </button>
                </div>
              </div>

              {/* Price Calculation */}
              <div className={`space-y-1.5 text-xs pt-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Express Delivery</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Payment Handling</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-purple-500/20">
                  <span>Total Amount</span>
                  <span className="font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 text-base">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>Place Order with COD & Track Live</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Buyer Protection
                </span>
                <span>•</span>
                <span>7 Days Replacement</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

