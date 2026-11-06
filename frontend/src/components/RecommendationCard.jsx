import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Tag, ShoppingCart, Check, Eye } from 'lucide-react';
import { enrichProduct } from '../utils/productCatalog';

export default function RecommendationCard({ item: rawItem, rank, onSelect, onAddToCart, theme }) {
  const item = enrichProduct(rawItem);
  const isLight = theme === 'light';
  const [justAdded, setJustAdded] = useState(false);

  const barWidth = Math.min(100, Math.max(15, Math.round(item.score * 1000)));

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(item);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`border rounded-2xl p-4 flex flex-col justify-between shadow-md group relative overflow-hidden transition-all ${
        isLight
          ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'
          : 'bg-[#0a1630]/90 backdrop-blur-xl border-purple-500/20 hover:border-purple-500/50 shadow-xl'
      }`}
    >
      <div>
        {/* Top bar with Rank & Badge */}
        <div className="flex justify-between items-center mb-3">
          <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${
            isLight
              ? 'bg-purple-100 text-purple-700 border-purple-200'
              : 'bg-purple-600/20 text-purple-300 border-purple-500/30'
          }`}>
            #{rank}
          </span>
          <span className={`text-[10px] font-medium flex items-center gap-1 ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            <Sparkles className="w-3 h-3 text-cyan-600" /> SVD Rank
          </span>
        </div>

        {/* Real Product Image Container */}
        <div className={`w-full h-44 rounded-xl border relative overflow-hidden mb-4 bg-slate-900 group-hover:scale-[1.02] transition-transform duration-300 ${
          isLight ? 'border-slate-200' : 'border-white/10'
        }`}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";
            }}
          />
          {/* Price Overlay Badge */}
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-white font-mono font-bold text-xs shadow-lg">
            {item.price}
          </div>
        </div>

        {/* Product Name & Category */}
        <div className="space-y-1 mb-3">
          <div className={`text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 ${
            isLight ? 'text-purple-600' : 'text-purple-400'
          }`}>
            <Tag className="w-3 h-3" /> {item.category}
          </div>
          <h3 className={`text-sm font-bold font-['Outfit'] line-clamp-2 leading-snug ${
            isLight ? 'text-slate-900' : 'text-white'
          }`} title={item.name}>
            {item.name}
          </h3>
          <p className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            ID: #{item.item_id}
          </p>
        </div>

        {/* Score Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs">
            <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Recommendation Score
            </span>
            <span className={`font-mono font-semibold ${isLight ? 'text-indigo-600' : 'text-cyan-400'}`}>
              {item.score}
            </span>
          </div>

          <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${barWidth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full"
            />
          </div>
        </div>

        {/* Event indicators */}
        <div className={`flex items-center gap-3 text-[10px] mb-4 pt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> View
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span> Add to Cart
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Transaction
          </span>
        </div>
      </div>

      {/* Dual Action Buttons: Add to Cart & Details */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={handleAddToCartClick}
          className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
          }`}
          title="Add this product to your Shopping Cart"
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added!
            </>
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
            </>
          )}
        </button>

        <button
          onClick={() => onSelect && onSelect(item)}
          className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              : 'bg-[#0d1b3e] hover:bg-purple-600/20 text-slate-300 hover:text-white border-purple-500/20'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Details
        </button>
      </div>
    </motion.div>
  );
}
