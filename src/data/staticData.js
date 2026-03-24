// ─────────────────────────────────────────────
// SAMPLE DATA  –  replace with real API calls
// ─────────────────────────────────────────────

export const BANNERS = [
  { id: 1, title: 'Fresh Groceries',  subtitle: 'Delivered Instantly', emoji: '🥦', gradient: 'linear-gradient(135deg,#0f1c14 0%,#1a9e5f 60%,#2dbd77 100%)', cta: 'Shop Vegetables' },
  { id: 2, title: 'Seasonal Fruits',  subtitle: 'Now Available!',      emoji: '🥭', gradient: 'linear-gradient(135deg,#7b2e00 0%,#e07b00 60%,#ffb347 100%)', cta: 'Shop Fruits' },
  { id: 3, title: 'Legal & Medical',  subtitle: 'Services Online',     emoji: '⚖️', gradient: 'linear-gradient(135deg,#1a0040 0%,#7040c8 60%,#a070ff 100%)', cta: 'Explore' },
  { id: 4, title: 'Health Essentials',subtitle: 'Delivered Fast',      emoji: '💊', gradient: 'linear-gradient(135deg,#400020 0%,#c83060 60%,#ff70a0 100%)', cta: 'Shop Medical' },
];

export const PARENT_CATEGORIES = [
  {
    id: 'groceries', name: 'Groceries', emoji: '🛒', color: '#2a7d4f', bg: '#eaf7f0', sub: 'Wheat, Rice, Oil…',
    subcategories: [
      { id: 'atta', name: 'Atta & Flour', emoji: '🌾' },
      { id: 'rice', name: 'Rice Varieties', emoji: '🍚' },
      { id: 'oil', name: 'Cooking Oils', emoji: '🫙' },
      { id: 'sugar', name: 'Sugar & Salt', emoji: '🧂' },
      { id: 'pulses', name: 'Dal & Pulses', emoji: '🫘' },
      { id: 'biscuits', name: 'Biscuits & Snacks', emoji: '🍪' },
      { id: 'noodles', name: 'Noodles & Pasta', emoji: '🍝' },
      { id: 'breakfast', name: 'Breakfast & Cereal', emoji: '🥣' },
    ],
  },
  {
    id: 'vegetables', name: 'Vegetables', emoji: '🥦', color: '#1a9e5f', bg: '#f0faf4', sub: 'Leafy, Root & More',
    subcategories: [
      { id: 'leafy', name: 'Leafy Greens', emoji: '🥬' },
      { id: 'root', name: 'Root Veggies', emoji: '🥔' },
      { id: 'gourds', name: 'Gourds & Squash', emoji: '🎃' },
      { id: 'onion', name: 'Onion & Garlic', emoji: '🧅' },
      { id: 'tomato', name: 'Tomatoes', emoji: '🍅' },
      { id: 'capsicum', name: 'Capsicum & Chilli', emoji: '🫑' },
      { id: 'herbs', name: 'Herbs & Sprouts', emoji: '🌿' },
      { id: 'frozen_veg', name: 'Frozen Vegetables', emoji: '🧊' },
    ],
  },
  {
    id: 'fruits', name: 'Fruits', emoji: '🍎', color: '#e07b00', bg: '#fff5e6', sub: 'Daily & Seasonal',
    subcategories: [
      { id: 'daily', name: 'Daily Fruits', emoji: '🍎' },
      { id: 'seasonal', name: 'Seasonal Picks', emoji: '🥭' },
      { id: 'citrus', name: 'Citrus Fruits', emoji: '🍊' },
      { id: 'grapes', name: 'Grapes & Berries', emoji: '🍇' },
      { id: 'tropical', name: 'Tropical & Exotic', emoji: '🥝' },
      { id: 'melons', name: 'Melons', emoji: '🍉' },
      { id: 'dried', name: 'Dry Fruits & Nuts', emoji: '🌰' },
    ],
  },
  {
    id: 'dairy', name: 'Dairy & Eggs', emoji: '🥛', color: '#c89000', bg: '#fff8e1', sub: 'Milk, Curd, Cheese',
    subcategories: [
      { id: 'milk', name: 'Milk & Cream', emoji: '🥛' },
      { id: 'curd', name: 'Curd & Buttermilk', emoji: '🫙' },
      { id: 'cheese', name: 'Cheese & Paneer', emoji: '🧀' },
      { id: 'butter', name: 'Butter & Ghee', emoji: '🧈' },
      { id: 'eggs', name: 'Eggs', emoji: '🥚' },
      { id: 'bread', name: 'Bread & Bakery', emoji: '🍞' },
    ],
  },
  {
    id: 'grains', name: 'Rice & Grains', emoji: '🌾', color: '#b06020', bg: '#faf0e6', sub: 'Basmati, Millets',
    subcategories: [
      { id: 'rice2', name: 'Rice Varieties', emoji: '🍚' },
      { id: 'wheat', name: 'Wheat & Flour', emoji: '🌾' },
      { id: 'millets', name: 'Millets & Ragi', emoji: '🫘' },
      { id: 'lentils', name: 'Lentils & Dal', emoji: '🟡' },
      { id: 'pasta', name: 'Pasta & Noodles', emoji: '🍝' },
    ],
  },
  {
    id: 'spices', name: 'Spices', emoji: '🌶️', color: '#d94040', bg: '#fef0f0', sub: 'Masalas & Blends',
    subcategories: [
      { id: 'whole', name: 'Whole Spices', emoji: '🌶️' },
      { id: 'ground', name: 'Ground Spices', emoji: '🫙' },
      { id: 'masala', name: 'Masala Blends', emoji: '🍛' },
      { id: 'salt', name: 'Salt & Sugar', emoji: '🧂' },
      { id: 'cond', name: 'Sauces & Pickles', emoji: '🥫' },
    ],
  },
  {
    id: 'oils', name: 'Oils & Ghee', emoji: '🫙', color: '#4060d9', bg: '#f0f4ff', sub: 'Cooking & Refined',
    subcategories: [
      { id: 'cooking', name: 'Cooking Oils', emoji: '🛢️' },
      { id: 'ghee', name: 'Pure Ghee', emoji: '🧈' },
      { id: 'olive', name: 'Olive & Specialty', emoji: '🫒' },
      { id: 'van', name: 'Vanaspati', emoji: '🫙' },
    ],
  },
  {
    id: 'beauty', name: 'Beauty', emoji: '💄', color: '#d946a8', bg: '#fdf0f9', sub: 'Skin, Hair & Care',
    subcategories: [
      { id: 'skincare', name: 'Skin Care', emoji: '✨' },
      { id: 'haircare', name: 'Hair Care', emoji: '💆' },
      { id: 'makeup', name: 'Makeup', emoji: '💄' },
      { id: 'fragrance', name: 'Fragrances', emoji: '🌸' },
      { id: 'mencare', name: "Men's Grooming", emoji: '🪒' },
      { id: 'bodycare', name: 'Body Care', emoji: '🧴' },
      { id: 'sunscreen', name: 'Sunscreen & SPF', emoji: '☀️' },
      { id: 'tools', name: 'Beauty Tools', emoji: '💅' },
    ],
  },
  {
    id: 'electronics', name: 'Electronics', emoji: '📱', color: '#1a6fd4', bg: '#eef4ff', sub: 'Phones, Gadgets…',
    subcategories: [
      { id: 'phones', name: 'Mobile Phones', emoji: '📱' },
      { id: 'earbuds', name: 'Earbuds & Audio', emoji: '🎧' },
      { id: 'chargers', name: 'Chargers & Cables', emoji: '🔌' },
      { id: 'watch', name: 'Smartwatches', emoji: '⌚' },
      { id: 'laptop', name: 'Laptop Accessories', emoji: '💻' },
      { id: 'camera', name: 'Cameras', emoji: '📸' },
      { id: 'gaming', name: 'Gaming', emoji: '🎮' },
      { id: 'smarthome', name: 'Smart Home', emoji: '🏠' },
    ],
  },
  {
    id: 'legal', name: 'Legal', emoji: '⚖️', color: '#7040c8', bg: '#f5f0ff', sub: 'Docs & Services',
    subcategories: [
      { id: 'docs', name: 'Document Services', emoji: '📄' },
      { id: 'reg', name: 'Registration', emoji: '📝' },
      { id: 'consult', name: 'Legal Consulting', emoji: '👨‍⚖️' },
      { id: 'notary', name: 'Notary Services', emoji: '🖊️' },
    ],
  },
  {
    id: 'medical', name: 'Medical', emoji: '💊', color: '#c83060', bg: '#fff0f5', sub: 'Medicines & Care',
    subcategories: [
      { id: 'rx', name: 'Prescription Drugs', emoji: '💊' },
      { id: 'otc', name: 'OTC Medicines', emoji: '🩺' },
      { id: 'supps', name: 'Vitamins & Supplements', emoji: '💪' },
      { id: 'care', name: 'Personal Care', emoji: '🧴' },
      { id: 'devices', name: 'Health Devices', emoji: '🩻' },
    ],
  },
  {
    id: 'social', name: 'Social', emoji: '🤝', color: '#0080c8', bg: '#e8f8ff', sub: 'Community & Help',
    subcategories: [
      { id: 'events', name: 'Events & Gatherings', emoji: '🎉' },
      { id: 'donate', name: 'Donations & NGO', emoji: '❤️' },
      { id: 'vol', name: 'Volunteer Work', emoji: '🙋' },
      { id: 'comm', name: 'Community Help', emoji: '🏘️' },
    ],
  },
  {
    id: 'more', name: 'More', emoji: '➕', color: '#606060', bg: '#f5f5f5', sub: 'Explore All',
    subcategories: [
      { id: 'cleaning', name: 'Cleaning Supplies', emoji: '🧹' },
      { id: 'baby', name: 'Baby Products', emoji: '👶' },
      { id: 'pet', name: 'Pet Care', emoji: '🐾' },
      { id: 'stat', name: 'Stationery', emoji: '📚' },
    ],
  },
];

export const PRODUCTS = {
  groceries: [
    { id: 'g1', name: 'Aashirvaad Atta', qty: '5 kg', price: 249, oldPrice: 290, emoji: '🌾', badge: 'BEST SELLER' },
    { id: 'g2', name: 'Fortune Soyabean Oil', qty: '1 L', price: 139, oldPrice: 160, emoji: '🫙', badge: null },
    { id: 'g3', name: 'Tata Salt', qty: '1 kg', price: 22, emoji: '🧂', badge: null },
    { id: 'g4', name: 'Basmati Rice', qty: '5 kg', price: 399, oldPrice: 450, emoji: '🍚', badge: '20% OFF' },
    { id: 'g5', name: 'Toor Dal', qty: '1 kg', price: 120, emoji: '🫘', badge: null },
    { id: 'g6', name: 'Sugar (Refined)', qty: '1 kg', price: 45, emoji: '🍬', badge: null },
    { id: 'g7', name: 'Sunflower Oil', qty: '1 L', price: 125, oldPrice: 140, emoji: '🌻', badge: null },
    { id: 'g8', name: 'Poha (Thick)', qty: '500g', price: 32, emoji: '🌾', badge: 'FRESH' },
  ],
  vegetables: [
    { id: 'v1', name: 'Fresh Broccoli', qty: '500g', price: 48, oldPrice: 60, emoji: '🥦', badge: '20% OFF' },
    { id: 'v2', name: 'Spinach Bunch', qty: '250g', price: 25, emoji: '🥬', badge: 'FRESH' },
    { id: 'v3', name: 'Country Tomato', qty: '1 kg', price: 35, emoji: '🍅', badge: null },
    { id: 'v4', name: 'Onion (Big)', qty: '1 kg', price: 40, oldPrice: 50, emoji: '🧅', badge: null },
    { id: 'v5', name: 'Orange Carrot', qty: '500g', price: 28, emoji: '🥕', badge: null },
    { id: 'v6', name: 'Coriander Leaves', qty: '100g', price: 15, emoji: '🌿', badge: 'ORGANIC' },
    { id: 'v7', name: "Lady's Finger", qty: '500g', price: 30, emoji: '🫛', badge: null },
    { id: 'v8', name: 'Bitter Gourd', qty: '500g', price: 22, emoji: '🥒', badge: null },
  ],
  fruits: [
    { id: 'f1', name: 'Ratnagiri Mango', qty: '1 kg (4-5 pcs)', price: 149, oldPrice: 200, emoji: '🥭', badge: 'HOT' },
    { id: 'f2', name: 'Robusta Banana', qty: 'Dozen', price: 55, emoji: '🍌', badge: null },
    { id: 'f3', name: 'Black Grapes', qty: '500g', price: 80, emoji: '🍇', badge: 'SWEET' },
    { id: 'f4', name: 'Watermelon', qty: '~3 kg whole', price: 120, emoji: '🍉', badge: null },
    { id: 'f5', name: 'Shimla Apple', qty: '4 pcs (~600g)', price: 99, oldPrice: 130, emoji: '🍎', badge: null },
    { id: 'f6', name: 'Fresh Coconut', qty: '1 pc', price: 45, emoji: '🥥', badge: null },
  ],
  dairy: [
    { id: 'd1', name: 'Full Cream Milk', qty: '500 ml', price: 32, emoji: '🥛', badge: null },
    { id: 'd2', name: 'Curd (Dahi)', qty: '400g', price: 38, emoji: '🧀', badge: 'FRESH' },
    { id: 'd3', name: 'Farm Eggs', qty: '12 pcs', price: 84, emoji: '🥚', badge: null },
    { id: 'd4', name: 'Multigrain Bread', qty: '400g loaf', price: 48, oldPrice: 55, emoji: '🍞', badge: null },
    { id: 'd5', name: 'Amul Butter', qty: '100g', price: 55, emoji: '🧈', badge: null },
  ],
};

export const OFFER_FILTERS = [
  { id: 'bestsellers', label: '🔥 Best Sellers' },
  { id: 'flash', label: '⚡ Flash Deals' },
  { id: 'new', label: '🆕 New Arrivals' },
  { id: 'organic', label: '🌿 Organic' },
  { id: 'budget', label: '💲 Under ₹99' },
  { id: 'diet', label: '🥗 Diet & Health' },
  { id: 'bundles', label: '🎁 Bundles' },
];

export const PROMO_CARDS = [
  { id: 1, title: 'Fresh Seasonal Fruits 🍊 30% off', emoji: '🍉', gradient: 'linear-gradient(135deg,#e07b00,#ffb347)' },
  { id: 2, title: 'New! Legal & Medical Essentials', emoji: '⚖️', gradient: 'linear-gradient(135deg,#1a9e5f,#2dbd77)' },
];

export const CITIES = [
  'Visakhapatnam', 'Hyderabad', 'Vijayawada', 'Bengaluru',
  'Chennai', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Ahmedabad',
];
