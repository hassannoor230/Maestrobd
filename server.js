const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Vercel/serverless deployment
app.set('trust proxy', 1);

// Ensure uploads directory exists
const uploadsDir = process.env.VERCEL ? path.join('/tmp', 'maestro-uploads') : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const types = /jpeg|jpg|png|webp|gif/;
    const extname = types.test(path.extname(file.originalname).toLowerCase());
    const mimetype = types.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only images are allowed'));
  }
});

// In-memory stores
let reservations = [];
let reviews = [
  { id: '1', name: 'Maximus Decimus / Hamza Jawed', rating: 5, text: 'Maestro Café – A Trusted Favorite for 12 Years! Cozy atmosphere and friendly staff.', featured: true },
  { id: '2', name: 'Happy Guest', rating: 5, text: 'Order pe cake tiyar karwaya 1540/- 2 pound, best in taste Maestro never disappoint!', featured: true },
  { id: '3', name: 'Local Foodie', rating: 5, text: 'The Polo Stuffed Chicken is exceptional. Ambiance is perfect for a special evening.', featured: true }
];
let messages = [];
let settings = {
  name: 'Maestro Cafe',
  tagline: 'Bringing Class to the Cuisine!',
  phone: '+92 55 3821477',
  email: 'maestro.cafe.gujranwala@gmail.com',
  address: 'Liberty Plaza, Sialkot Road, Block B Satellite Town, Gujranwala, Punjab, Pakistan',
  plusCode: '557V+59 Gujranwala',
  rating: 4.2,
  reviewsCount: 1319,
  priceRange: 'PKR 2,000–3,000 per person',
  hours: 'Open daily till 1:00 AM',
  facebookFollowers: '10K+',
  years: 12,
  heroImage: '/images/restaurant.jpg',
  heroTitle: 'BRINGING CLASS',
  heroSubtitle: 'TO THE CUISINE.',
  heroDescription: 'A signature dining experience crafted in the heart of Gujranwala. Exceptional cuisine, elegant surroundings, genuine hospitality.',
  aboutTitle: 'MORE THAN A MEAL',
  aboutDescription: 'Where exceptional cuisine, elegant surroundings and genuine hospitality come together.',
  bannerEnabled: false,
  bannerText: '',
  bannerLink: '',
  bannerBgColor: 'gold'
};
let menuItems = [
  { id: "1", name: "Polo Stuffed Chicken", price: 1490, category: "chef", description: "Fried chicken breast stuffed with spinach & cheese. Served with mashed potatoes & sauteed vegetables.", featured: true, popular: true, image: '' },
  { id: "2", name: "Three Cheese Chicken", price: 1490, category: "chef", description: "Fried chicken stuffed with mushrooms & cheese. Served with fries.", featured: true, image: '' },
  { id: "3", name: "Stuffed Chicken With Creamy Mushroom Sauce", price: 1490, category: "chef", description: "Fried chicken breast stuffed with cheese topped with white mushroom sauce.", image: '' },
  { id: "4", name: "Maestro Spinach Milano", price: 1470, category: "chef", description: "Fried chicken breast topped with cheese served with butter rice & spinach sauce.", image: '' },
  { id: "5", name: "Chicken Moroccan", price: 1425, category: "chef", description: "Mild grilled chicken breast tossed in chef's special Moroccan sauce with egg fried rice.", image: '' },
  { id: "6", name: "Pepper Steak", price: 1490, category: "steak", description: "Charcoal grilled chicken topped with black pepper sauce.", popular: true, image: '' },
  { id: "7", name: "Maestro Special Verde Steak", price: 1545, category: "steak", description: "Our special grilled chicken topped with verde chili sauce, egg fried rice & fries.", featured: true, image: '' },
  { id: "8", name: "Italian Steak", price: 1490, category: "steak", description: "Charcoal grilled chicken topped with creamy cheese sauce.", image: '' },
  { id: "9", name: "Mushroom Steak", price: 1490, category: "steak", description: "Charcoal grilled chicken topped with mushroom brown sauce.", image: '' },
  { id: "10", name: "Mexican Steak", price: 1490, category: "steak", description: "Charcoal grilled chicken topped with fresh hot tomato sauce.", image: '' },
  { id: "11", name: "Chicken Mexicano", price: 965, category: "asian", description: "Spicy stir-fried chicken tossed in spicy Mexican sauce with egg fried rice.", image: '' },
  { id: "12", name: "Chicken Ostra", price: 965, category: "asian", description: "Stir-fried chicken tossed in oyster sauce served with egg fried rice.", image: '' },
  { id: "13", name: "Chicken Chili Dry", price: 965, category: "asian", description: "Mild stir-fried chicken in classic red chili sauce with egg fried rice.", popular: true, image: '' },
  { id: "14", name: "Fried Sandwich", price: 830, category: "sandwich", description: "Fried Sandwich.", image: '' },
  { id: "15", name: "Grilled Chicken Sandwich", price: 830, category: "sandwich", description: "Grilled Chicken Sandwich.", popular: true, image: '' },
  { id: "16", name: "Club Sandwich", price: 745, category: "sandwich", description: "Club Sandwich.", popular: true, image: '' },
  { id: "17", name: "Chicken Strips", price: 1140, category: "starter", description: "Fried chicken fillet served with French fries & honey mustard sauce.", image: '' },
  { id: "18", name: "Crispy Wings", price: 1150, category: "starter", description: "Fried chicken crispy wings served with salsa sauce.", image: '' },
  { id: "19", name: "Cheese Loaf", price: 860, category: "starter", description: "Bread & cheese loaf stuffed with baked chicken cubes.", image: '' },
  { id: "20", name: "Loaded Fries", price: 920, category: "starter", description: "Loaded Fries.", image: '' },
  { id: "21", name: "French Fries", price: 720, category: "starter", description: "French Fries.", popular: true, image: '' },
  { id: "22", name: "Maestro Special Salad", price: 940, category: "salad", description: "Maestro Special Salad.", image: '' },
  { id: "23", name: "Chicken Pineapple Salad", price: 915, category: "salad", description: "Chicken Pineapple Salad.", image: '' },
  { id: "24", name: "Russian Salad", price: 750, category: "salad", description: "Russian Salad.", image: '' },
  { id: "25", name: "Oreo Shake", price: 655, category: "shake", description: "Oreo Shake.", image: '' },
  { id: "26", name: "Kit Kat Chocolate Shake", price: 795, category: "shake", description: "Kit Kat Chocolate Shake.", image: '' },
  { id: "27", name: "Chocolate Shake", price: 765, category: "shake", description: "Chocolate Shake.", image: '' },
  { id: "28", name: "Cold Coffee Shake", price: 655, category: "shake", description: "Cold Coffee Shake.", image: '' },
  { id: "29", name: "Caramel Cold Coffee Shake", price: 655, category: "shake", description: "Caramel Cold Coffee Shake.", image: '' },
  { id: "30", name: "Vanilla Cold Coffee Shake", price: 655, category: "shake", description: "Vanilla Cold Coffee Shake.", image: '' },
  { id: "31", name: "Hazelnut Cold Coffee Shake", price: 655, category: "shake", description: "Hazelnut Cold Coffee Shake.", image: '' },
  { id: "32", name: "Strawberry Ice Cream Shake", price: 655, category: "shake", description: "Strawberry Ice Cream Shake.", image: '' },
  { id: "33", name: "Mango Ice Cream Shake", price: 655, category: "shake", description: "Mango Ice Cream Shake.", image: '' },
  { id: "34", name: "Kulfa Ice Cream Shake", price: 655, category: "shake", description: "Kulfa Ice Cream Shake.", image: '' },
  { id: "35", name: "Pastry", price: 335, category: "dessert", description: "Pastry.", image: '' },
  { id: "36", name: "Mousse Pastry", price: 545, category: "dessert", description: "Mousse Pastry.", image: '' },
  { id: "37", name: "Brownie", price: 605, category: "dessert", description: "Brownie.", image: '' },
  { id: "38", name: "Molten Lava", price: 835, category: "dessert", description: "Molten Lava.", image: '' },
  { id: "39", name: "Sizzling Brownie", price: 660, category: "dessert", description: "Sizzling Brownie.", popular: true, image: '' },
  { id: "40", name: "Skillet Cookies", price: 875, category: "dessert", description: "Skillet Cookies.", image: '' },
  { id: "41", name: "Hot Chocolate", price: 535, category: "coffee", description: "Hot Chocolate.", image: '' },
  { id: "42", name: "Hot Coffee", price: 515, category: "coffee", description: "Hot Coffee.", image: '' },
  { id: "43", name: "Caramel Latte", price: 535, category: "coffee", description: "Caramel Latte.", image: '' },
  { id: "44", name: "Black Coffee", price: 325, category: "coffee", description: "Black Coffee.", image: '' },
  { id: "45", name: "Espresso", price: 325, category: "coffee", description: "Espresso.", image: '' },
  { id: "46", name: "Hazelnut Latte", price: 535, category: "coffee", description: "Hazelnut Latte.", image: '' },
  { id: "47", name: "Vanilla Latte", price: 535, category: "coffee", description: "Vanilla Latte.", image: '' },
  { id: "48", name: "Mochaccino", price: 515, category: "coffee", description: "Mochaccino.", image: '' },
  { id: "49", name: "Cappuccino", price: 515, category: "coffee", description: "Cappuccino.", popular: true, image: '' },
  { id: "50", name: "Cardamom Tea", price: 305, category: "tea", description: "Cardamom Tea.", popular: true, image: '' },
  { id: "51", name: "Karak Chai", price: 285, category: "tea", description: "Karak Chai.", image: '' },
  { id: "52", name: "Lipton Tea", price: 155, category: "tea", description: "Lipton Tea.", image: '' },
  { id: "53", name: "Lemon Tea", price: 110, category: "tea", description: "Lemon Tea.", image: '' },
  { id: "54", name: "Pepsi 345ml", price: 155, category: "drink", description: "The Bold, Refreshing & STRONG cola!", image: '' },
  { id: "55", name: "7Up 345ml", price: 155, category: "drink", description: "A Light & Refreshing Lemon-lime soda.", image: '' },
  { id: "56", name: "Aquafina Water 1.5 Litre", price: 175, category: "drink", description: "Pure water.", image: '' },
  { id: "57", name: "Aquafina Water 500ml", price: 95, category: "drink", description: "Pure water.", image: '' },
  { id: "58", name: "Fresh Lime", price: 155, category: "drink", description: "Single serving.", image: '' },
  { id: "59", name: "Pink Lady Mocktail", price: 490, category: "mocktail", description: "Pink Lady Mocktail.", image: '' },
  { id: "60", name: "Mint Margarita Mocktail", price: 435, category: "mocktail", description: "Mint Margarita Mocktail.", image: '' },
  { id: "61", name: "Blue Mist Mocktail", price: 500, category: "mocktail", description: "Blue Mist Mocktail.", image: '' },
  { id: "62", name: "Pina Colada Mocktail", price: 490, category: "mocktail", description: "Pina Colada Mocktail.", image: '' },
  { id: "63", name: "Lemon Ginger Mocktail", price: 435, category: "mocktail", description: "Lemon Ginger Mocktail.", image: '' },
  { id: "64", name: "Fajita Pasta", price: 920, category: "pasta", description: "Mild. Penne pasta tossed in fresh tomato sauce & vegetables topped with grilled chicken.", image: '' },
  { id: "65", name: "Mac & Cheese Pasta", price: 1090, category: "pasta", description: "Elbow macaroni tossed in yellow cheese topped with parmesan & grilled chicken.", image: '' },
  { id: "66", name: "Fettuccine Alfredo Pasta", price: 920, category: "pasta", description: "Alfredo pasta tossed in creamy white cheese sauce & chicken topped with olives.", image: '' },
  { id: "67", name: "Hot & Sour Soup", price: 435, category: "soup", description: "Hot & Sour Soup.", image: '' },
  { id: "68", name: "Mushroom Soup", price: 560, category: "soup", description: "Mushrooms dipped in classic white butter sauce.", image: '' },
  { id: "69", name: "Cream Of Chicken Soup", price: 560, category: "soup", description: "Chicken dipped in classic white butter sauce.", image: '' },
  { id: "70", name: "Special Soup", price: 435, category: "soup", description: "Special Soup.", image: '' },
  { id: "71", name: "Crunch Fried Burger", price: 910, category: "burger", description: "Crunch Fried Burger.", image: '' },
  { id: "72", name: "Ranch Mania Open Face Burger", price: 910, category: "burger", description: "Ranch Mania Open Face Burger.", image: '' },
  { id: "73", name: "Grilled Chicken Burger", price: 830, category: "burger", description: "Grilled Chicken Burger.", image: '' },
  { id: "74", name: "East Land Burger", price: 895, category: "burger", description: "East Land Burger.", image: '' }
];

// Simple admin user
const adminUser = {
  email: 'admin@maestrocafe.com',
  password: bcrypt.hashSync('maestro2026', 10)
};

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));

// CORS configuration - allow Vercel production, preview, and local development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://maestrobd-flax.vercel.app',
  'https://maestrobd-3jesyfdru-hassan-noors-projects.vercel.app',
  'https://maestro-p2wsc7uq7-hassan-noors-projects.vercel.app',
  ...(process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean)
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true 
}));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(uploadsDir));

// Vercel may strip /api before invoking the serverless function.
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  next();
});

// Rate limiter with Vercel-safe IP detection
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'maestro_secret');
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ========== PUBLIC ROUTES ==========

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Maestro Cafe API is running', api: '/api' });
});

// AI Concierge Chat
const aiRouter = require('./routes/ai');
app.use('/api/ai', aiRouter);

// API health endpoint
app.get('/api', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Maestro Cafe API is running', 
    status: 'healthy',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Maestro Cafe API running' });
});

app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.get('/api/menu', (req, res) => {
  const { category, search, featured, popular } = req.query;
  let items = [...menuItems];
  if (category && category !== 'all') items = items.filter(i => i.category === category);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }
  if (featured === 'true') items = items.filter(i => i.featured);
  if (popular === 'true') items = items.filter(i => i.popular);
  res.json(items);
});

app.get('/api/menu/:id', (req, res) => {
  const item = menuItems.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

app.get('/api/reviews', (req, res) => {
  res.json(reviews.filter(r => r.featured !== false));
});

app.post('/api/reservations', (req, res) => {
  const { date, time, guests, name, phone, email, specialRequest, reservationType, selectedItem, deliveryAddress, deliveryPhone } = req.body;
  if (!date || !time || !guests || !name || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const reservation = {
    id: Date.now().toString(),
    date, time, guests, name, phone, email: email || '', specialRequest: specialRequest || '',
    reservationType: reservationType || 'dine-in',
    selectedItem: selectedItem || null,
    deliveryAddress: deliveryAddress || '',
    deliveryPhone: deliveryPhone || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  reservations.push(reservation);
  console.log('New reservation:', reservation);
  res.status(201).json({ message: 'Reservation request received. We will confirm shortly.', reservation });
});

app.post('/api/contact', (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !message) return res.status(400).json({ message: 'Name and message required' });
  const msg = { id: Date.now().toString(), name, email, phone, message, createdAt: new Date().toISOString() };
  messages.push(msg);
  res.status(201).json({ message: 'Message sent successfully' });
});

// ========== ADMIN ROUTES ==========

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (email !== adminUser.email || !bcrypt.compareSync(password, adminUser.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET || 'maestro_secret', { expiresIn: '24h' });
  res.json({ token, user: { email, role: 'admin' } });
});

app.get('/api/admin/dashboard', auth, (req, res) => {
  res.json({
    totalReservations: reservations.length,
    pendingReservations: reservations.filter(r => r.status === 'pending').length,
    dineInReservations: reservations.filter(r => r.reservationType === 'dine-in').length,
    deliveryReservations: reservations.filter(r => r.reservationType === 'delivery').length,
    totalReviews: reviews.length,
    totalMessages: messages.length,
    menuItems: menuItems.length,
    recentReservations: reservations.slice(-5).reverse()
  });
});

app.get('/api/admin/reservations', auth, (req, res) => {
  res.json(reservations.reverse());
});

app.patch('/api/admin/reservations/:id', auth, (req, res) => {
  const r = reservations.find(x => x.id === req.params.id);
  if (!r) return res.status(404).json({ message: 'Not found' });
  if (req.body.status) r.status = req.body.status;
  res.json(r);
});

app.get('/api/admin/messages', auth, (req, res) => {
  res.json(messages.reverse());
});

app.get('/api/admin/reviews', auth, (req, res) => {
  res.json(reviews);
});

app.post('/api/admin/reviews', auth, (req, res) => {
  const review = { id: Date.now().toString(), ...req.body };
  reviews.push(review);
  res.status(201).json(review);
});

app.delete('/api/admin/reviews/:id', auth, (req, res) => {
  reviews = reviews.filter(r => r.id !== req.params.id);
  res.json({ message: 'Deleted' });
});

// Settings
app.put('/api/admin/settings', auth, (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

// Menu CRUD
app.get('/api/admin/menu', auth, (req, res) => {
  res.json(menuItems);
});

app.post('/api/admin/menu', auth, (req, res) => {
  const item = {
    id: Date.now().toString(),
    name: req.body.name,
    price: parseInt(req.body.price) || 0,
    category: req.body.category || 'other',
    description: req.body.description || '',
    featured: req.body.featured || false,
    popular: req.body.popular || false,
    image: req.body.image || ''
  };
  menuItems.push(item);
  res.status(201).json(item);
});

app.put('/api/admin/menu/:id', auth, (req, res) => {
  const index = menuItems.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Item not found' });
  menuItems[index] = { ...menuItems[index], ...req.body, id: req.params.id };
  res.json(menuItems[index]);
});

app.delete('/api/admin/menu/:id', auth, (req, res) => {
  const index = menuItems.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Item not found' });
  menuItems.splice(index, 1);
  res.json({ message: 'Deleted' });
});

// Image upload
app.post('/api/admin/upload', auth, upload.single('image'), (req, res) => {
  if (process.env.VERCEL) {
    return res.status(503).json({ message: 'Image uploads require a persistent storage provider in production.' });
  }
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl, filename: req.file.filename });
});

// API 404 handler - only for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl 
  });
});

// Global error handler - production safe
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong. Please try again.' 
      : err.message
  });
});

// Export app for Vercel serverless deployment
module.exports = app;

// Start local development server only when running directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🍽️  Maestro Cafe API running on http://localhost:${PORT}`);
    console.log(`   Admin login: admin@maestrocafe.com / maestro2026\n`);
  });
}
