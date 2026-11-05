export const PRODUCT_CATALOG = {
  "48030": {
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Audio & Electronics",
    price: "₹29,990",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
  },
  "89323": {
    name: "Apple Watch Series 9 Smartwatch",
    category: "Wearable Tech",
    price: "₹41,900",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80"
  },
  "228644": {
    name: "Herschel Supply Co. Everyday Backpack",
    category: "Bags & Travel",
    price: "₹6,499",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"
  },
  "291877": {
    name: "Logitech MX Master 3S Wireless Mouse",
    category: "Computer Accessories",
    price: "₹8,995",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80"
  },
  "65273": {
    name: "Samsung Galaxy Tab S9 Ultra",
    category: "Tablets & Computers",
    price: "₹1,08,999",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80"
  },
  "294676": {
    name: "Apple MacBook Pro 16-inch M3",
    category: "Laptops",
    price: "₹2,49,900",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80"
  },
  "310944": {
    name: "Keychron K2 Mechanical Gaming Keyboard",
    category: "Gaming Peripherals",
    price: "₹9,499",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80"
  },
  "9877": {
    name: "JBL Charge 5 Portable Bluetooth Speaker",
    category: "Audio Systems",
    price: "₹14,999",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=80"
  },
  "148103": {
    name: "Sony WF-1000XM5 True Wireless Earbuds",
    category: "Audio & Electronics",
    price: "₹19,990",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80"
  },
  "166306": {
    name: "Canon EOS R6 Mark II Mirrorless Camera",
    category: "Cameras & Optics",
    price: "₹2,15,995",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80"
  },
  "215503": {
    name: "Nike Air Max 270 Sport Running Shoes",
    category: "Footwear & Apparel",
    price: "₹12,995",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80"
  },
  "24059": {
    name: "Bose QuietComfort Ultra Headphones",
    category: "Audio & Electronics",
    price: "₹35,900",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80"
  },
  "255908": {
    name: "Dell UltraSharp 27 4K USB-C Monitor",
    category: "Monitors & Displays",
    price: "₹49,990",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80"
  },
  "279531": {
    name: "Anker 737 Power Bank 24,000mAh",
    category: "Mobile Accessories",
    price: "₹11,999",
    image: "https://images.unsplash.com/photo-1609592424079-24751433f81e?w=500&auto=format&fit=crop&q=80"
  },
  "347226": {
    name: "Kindle Paperwhite Signature Edition",
    category: "E-Readers & Tablets",
    price: "₹14,999",
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=500&auto=format&fit=crop&q=80"
  }
};

export function enrichProduct(item) {
  const strId = String(item.item_id || item.id);
  const catalogEntry = PRODUCT_CATALOG[strId];

  return {
    ...item,
    name: item.name || catalogEntry?.name || `Product Item #${strId}`,
    category: item.category || catalogEntry?.category || "Consumer Retail",
    price: item.price || catalogEntry?.price || "₹9,999",
    image: item.image || catalogEntry?.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
  };
}
