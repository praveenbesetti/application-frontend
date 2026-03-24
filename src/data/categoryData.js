// ─────────────────────────────────────────────────────────
// CATEGORY PAGE STATIC DATA
// All products organised by categoryId → subcategoryId
// Replace with real API:  GET /api/v1/category/:id/products
// ─────────────────────────────────────────────────────────

export const ALL_CATEGORY_PRODUCTS = {
  // ── GROCERIES ─────────────────────────────────────────
  groceries: {
    all: [
      { id: 'g1',  name: 'Aashirvaad Atta',      qty: '5 kg',   price: 249, oldPrice: 290, emoji: '🌾', badge: 'BEST SELLER', subcat: 'atta'      },
      { id: 'g2',  name: 'Pillsbury Atta',        qty: '1 kg',   price: 58,  oldPrice: 65,  emoji: '🌾', badge: null,          subcat: 'atta'      },
      { id: 'g3',  name: 'Fortune Soyabean Oil',  qty: '1 L',    price: 139, oldPrice: 160, emoji: '🫙', badge: null,          subcat: 'oil'       },
      { id: 'g4',  name: 'Sundrop Sunflower Oil', qty: '1 L',    price: 125, oldPrice: 140, emoji: '🌻', badge: null,          subcat: 'oil'       },
      { id: 'g5',  name: 'Tata Salt',             qty: '1 kg',   price: 22,                 emoji: '🧂', badge: null,          subcat: 'sugar'     },
      { id: 'g6',  name: 'Sugar (Refined)',        qty: '1 kg',   price: 45,                 emoji: '🍬', badge: null,          subcat: 'sugar'     },
      { id: 'g7',  name: 'Basmati Rice',           qty: '5 kg',   price: 399, oldPrice: 450, emoji: '🍚', badge: '20% OFF',     subcat: 'rice'      },
      { id: 'g8',  name: 'Sona Masoori Rice',      qty: '5 kg',   price: 320,                emoji: '🍚', badge: null,          subcat: 'rice'      },
      { id: 'g9',  name: 'Toor Dal',               qty: '1 kg',   price: 120,                emoji: '🫘', badge: null,          subcat: 'pulses'    },
      { id: 'g10', name: 'Chana Dal',              qty: '1 kg',   price: 95,                 emoji: '🫘', badge: null,          subcat: 'pulses'    },
      { id: 'g11', name: 'Britannia Biscuits',     qty: '200g',   price: 30,                 emoji: '🍪', badge: null,          subcat: 'biscuits'  },
      { id: 'g12', name: 'Parle-G',                qty: '800g',   price: 50,                 emoji: '🍪', badge: 'POPULAR',     subcat: 'biscuits'  },
      { id: 'g13', name: 'Maggi Noodles',          qty: '420g (6pk)', price: 78,             emoji: '🍝', badge: null,          subcat: 'noodles'   },
      { id: 'g14', name: 'Sunfeast Pasta',         qty: '500g',   price: 65,                 emoji: '🍝', badge: null,          subcat: 'noodles'   },
      { id: 'g15', name: 'Kelloggs Corn Flakes',   qty: '875g',   price: 299, oldPrice: 350, emoji: '🥣', badge: null,          subcat: 'breakfast' },
      { id: 'g16', name: 'Poha (Thick)',            qty: '500g',   price: 32,                 emoji: '🌾', badge: 'FRESH',       subcat: 'breakfast' },
    ],
  },

  // ── VEGETABLES ────────────────────────────────────────
  vegetables: {
    all: [
      { id: 'v1',  name: 'Fresh Broccoli',      qty: '500g',  price: 48,  oldPrice: 60,  emoji: '🥦', badge: '20% OFF', subcat: 'leafy'   },
      { id: 'v2',  name: 'Spinach Bunch',        qty: '250g',  price: 25,                emoji: '🥬', badge: 'FRESH',   subcat: 'leafy'   },
      { id: 'v3',  name: 'Methi Leaves',         qty: '200g',  price: 18,                emoji: '🌿', badge: null,      subcat: 'leafy'   },
      { id: 'v4',  name: 'Potato',               qty: '1 kg',  price: 28,                emoji: '🥔', badge: null,      subcat: 'root'    },
      { id: 'v5',  name: 'Sweet Potato',         qty: '500g',  price: 35,                emoji: '🍠', badge: null,      subcat: 'root'    },
      { id: 'v6',  name: 'Country Tomato',       qty: '1 kg',  price: 35,                emoji: '🍅', badge: null,      subcat: 'tomato'  },
      { id: 'v7',  name: 'Cherry Tomato',        qty: '250g',  price: 45,                emoji: '🍅', badge: 'EXOTIC',  subcat: 'tomato'  },
      { id: 'v8',  name: 'Onion (Big)',           qty: '1 kg',  price: 40,  oldPrice: 50, emoji: '🧅', badge: null,      subcat: 'onion'   },
      { id: 'v9',  name: 'Garlic',               qty: '100g',  price: 20,                emoji: '🧄', badge: null,      subcat: 'onion'   },
      { id: 'v10', name: 'Orange Carrot',        qty: '500g',  price: 28,                emoji: '🥕', badge: null,      subcat: 'root'    },
      { id: 'v11', name: 'Capsicum (Green)',      qty: '250g',  price: 30,                emoji: '🫑', badge: null,      subcat: 'capsicum'},
      { id: 'v12', name: 'Red Capsicum',         qty: '200g',  price: 55,                emoji: '🌶️', badge: null,      subcat: 'capsicum'},
      { id: 'v13', name: 'Coriander Leaves',     qty: '100g',  price: 15,                emoji: '🌿', badge: 'ORGANIC', subcat: 'herbs'   },
      { id: 'v14', name: 'Curry Leaves',         qty: '50g',   price: 10,                emoji: '🌿', badge: null,      subcat: 'herbs'   },
      { id: 'v15', name: "Lady's Finger",        qty: '500g',  price: 30,                emoji: '🫛', badge: null,      subcat: 'gourds'  },
      { id: 'v16', name: 'Bitter Gourd',         qty: '500g',  price: 22,                emoji: '🥒', badge: null,      subcat: 'gourds'  },
    ],
  },

  // ── FRUITS ────────────────────────────────────────────
  fruits: {
    all: [
      { id: 'f1',  name: 'Ratnagiri Mango',   qty: '1 kg (4-5 pcs)', price: 149, oldPrice: 200, emoji: '🥭', badge: 'HOT',     subcat: 'seasonal' },
      { id: 'f2',  name: 'Watermelon',         qty: '~3 kg whole',    price: 120,                emoji: '🍉', badge: null,      subcat: 'melons'   },
      { id: 'f3',  name: 'Robusta Banana',     qty: 'Dozen',          price: 55,                 emoji: '🍌', badge: null,      subcat: 'daily'    },
      { id: 'f4',  name: 'Black Grapes',       qty: '500g',           price: 80,                 emoji: '🍇', badge: 'SWEET',   subcat: 'grapes'   },
      { id: 'f5',  name: 'Shimla Apple',       qty: '4 pcs (~600g)',  price: 99,  oldPrice: 130, emoji: '🍎', badge: null,      subcat: 'daily'    },
      { id: 'f6',  name: 'Fresh Coconut',      qty: '1 pc',           price: 45,                 emoji: '🥥', badge: null,      subcat: 'tropical' },
      { id: 'f7',  name: 'Mosambi',            qty: '4 pcs',          price: 60,                 emoji: '🍊', badge: null,      subcat: 'citrus'   },
      { id: 'f8',  name: 'Kiwi',              qty: '4 pcs',           price: 120,                emoji: '🥝', badge: 'EXOTIC',  subcat: 'tropical' },
      { id: 'f9',  name: 'Dates (Medjool)',    qty: '250g',           price: 180,                emoji: '🌰', badge: null,      subcat: 'dried'    },
      { id: 'f10', name: 'Cashew Nuts',        qty: '200g',           price: 220, oldPrice: 260, emoji: '🌰', badge: null,      subcat: 'dried'    },
      { id: 'f11', name: 'Muskmelon',          qty: '~1 kg whole',    price: 65,                 emoji: '🍈', badge: null,      subcat: 'melons'   },
      { id: 'f12', name: 'Guava',             qty: '4 pcs',           price: 40,                 emoji: '🍐', badge: 'FRESH',   subcat: 'daily'    },
    ],
  },

  // ── DAIRY ─────────────────────────────────────────────
  dairy: {
    all: [
      { id: 'd1',  name: 'Full Cream Milk',     qty: '500 ml',    price: 32,               emoji: '🥛', badge: null,    subcat: 'milk'   },
      { id: 'd2',  name: 'Toned Milk',          qty: '1 L',       price: 58,               emoji: '🥛', badge: null,    subcat: 'milk'   },
      { id: 'd3',  name: 'Fresh Cream',         qty: '200 ml',    price: 45,               emoji: '🫙', badge: null,    subcat: 'milk'   },
      { id: 'd4',  name: 'Curd (Dahi)',         qty: '400g',      price: 38,               emoji: '🧀', badge: 'FRESH', subcat: 'curd'   },
      { id: 'd5',  name: 'Buttermilk',          qty: '200 ml',    price: 20,               emoji: '🫙', badge: null,    subcat: 'curd'   },
      { id: 'd6',  name: 'Paneer',              qty: '200g',      price: 85, oldPrice: 100,emoji: '🧀', badge: null,    subcat: 'cheese' },
      { id: 'd7',  name: 'Amul Cheese Slices',  qty: '200g',      price: 95,               emoji: '🧀', badge: null,    subcat: 'cheese' },
      { id: 'd8',  name: 'Amul Butter',         qty: '100g',      price: 55,               emoji: '🧈', badge: null,    subcat: 'butter' },
      { id: 'd9',  name: 'Desi Ghee',           qty: '500 ml',    price: 299, oldPrice:340,emoji: '🧈', badge: null,    subcat: 'butter' },
      { id: 'd10', name: 'Farm Eggs (White)',   qty: '12 pcs',    price: 84,               emoji: '🥚', badge: null,    subcat: 'eggs'   },
      { id: 'd11', name: 'Desi Eggs (Brown)',   qty: '6 pcs',     price: 54,               emoji: '🥚', badge: 'DESI',  subcat: 'eggs'   },
      { id: 'd12', name: 'Multigrain Bread',    qty: '400g loaf', price: 48, oldPrice: 55, emoji: '🍞', badge: null,    subcat: 'bread'  },
      { id: 'd13', name: 'Pav (Dinner Rolls)',  qty: '6 pcs',     price: 35,               emoji: '🍞', badge: 'SOFT',  subcat: 'bread'  },
    ],
  },
};

export const SORT_OPTIONS = [
  { id: 'relevance',   label: 'Relevance'      },
  { id: 'price_asc',  label: 'Price: Low → High' },
  { id: 'price_desc', label: 'Price: High → Low' },
  { id: 'discount',   label: 'Biggest Discount' },
  { id: 'name',       label: 'A → Z'           },
];
