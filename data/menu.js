const menuItems = [
  // Chef Specials
  { id: "1", name: "Polo Stuffed Chicken", price: 1490, category: "chef", description: "Fried chicken breast stuffed with spinach & cheese. Served with mashed potatoes & sauteed vegetables.", featured: true, popular: true },
  { id: "2", name: "Three Cheese Chicken", price: 1490, category: "chef", description: "Fried chicken stuffed with mushrooms & cheese. Served with fries.", featured: true },
  { id: "3", name: "Stuffed Chicken With Creamy Mushroom Sauce", price: 1490, category: "chef", description: "Fried chicken breast stuffed with cheese topped with white mushroom sauce." },
  { id: "4", name: "Maestro Spinach Milano", price: 1470, category: "chef", description: "Fried chicken breast topped with cheese served with butter rice & spinach sauce." },
  { id: "5", name: "Chicken Moroccan", price: 1425, category: "chef", description: "Mild grilled chicken breast tossed in chef's special Moroccan sauce with egg fried rice." },

  // Steaks
  { id: "6", name: "Pepper Steak", price: 1490, category: "steak", description: "Charcoal grilled chicken topped with black pepper sauce.", popular: true },
  { id: "7", name: "Maestro Special Verde Steak", price: 1545, category: "steak", description: "Our special grilled chicken topped with verde chili sauce, egg fried rice & fries.", featured: true },
  { id: "8", name: "Italian Steak", price: 1490, category: "steak", description: "Charcoal grilled chicken topped with creamy cheese sauce." },
  { id: "9", name: "Mushroom Steak", price: 1490, category: "steak", description: "Charcoal grilled chicken topped with mushroom brown sauce." },
  { id: "10", name: "Mexican Steak", price: 1490, category: "steak", description: "Charcoal grilled chicken topped with fresh hot tomato sauce." },

  // Pan-Asian
  { id: "11", name: "Chicken Mexicano", price: 965, category: "asian", description: "Spicy stir-fried chicken tossed in spicy Mexican sauce with egg fried rice." },
  { id: "12", name: "Chicken Ostra", price: 965, category: "asian", description: "Stir-fried chicken tossed in oyster sauce served with egg fried rice." },
  { id: "13", name: "Chicken Chili Dry", price: 965, category: "asian", description: "Mild stir-fried chicken in classic red chili sauce with egg fried rice.", popular: true },

  // Sandwiches & Starters
  { id: "14", name: "Fried Sandwich", price: 830, category: "sandwich", description: "Fried Sandwich." },
  { id: "15", name: "Grilled Chicken Sandwich", price: 830, category: "sandwich", description: "Grilled Chicken Sandwich.", popular: true },
  { id: "16", name: "Club Sandwich", price: 745, category: "sandwich", description: "Club Sandwich.", popular: true },
  { id: "17", name: "Chicken Strips", price: 1140, category: "starter", description: "Fried chicken fillet served with French fries & honey mustard sauce." },
  { id: "18", name: "Crispy Wings", price: 1150, category: "starter", description: "Fried chicken crispy wings served with salsa sauce." },
  { id: "19", name: "Cheese Loaf", price: 860, category: "starter", description: "Bread & cheese loaf stuffed with baked chicken cubes." },
  { id: "20", name: "Loaded Fries", price: 920, category: "starter", description: "Loaded Fries." },
  { id: "21", name: "French Fries", price: 720, category: "starter", description: "French Fries.", popular: true },

  // Salads
  { id: "22", name: "Maestro Special Salad", price: 940, category: "salad", description: "Maestro Special Salad." },
  { id: "23", name: "Chicken Pineapple Salad", price: 915, category: "salad", description: "Chicken Pineapple Salad." },
  { id: "24", name: "Russian Salad", price: 750, category: "salad", description: "Russian Salad." },

  // Shakes
  { id: "25", name: "Oreo Shake", price: 655, category: "shake", description: "Oreo Shake." },
  { id: "26", name: "Kit Kat Chocolate Shake", price: 795, category: "shake", description: "Kit Kat Chocolate Shake." },
  { id: "27", name: "Chocolate Shake", price: 765, category: "shake", description: "Chocolate Shake." },
  { id: "28", name: "Cold Coffee Shake", price: 655, category: "shake", description: "Cold Coffee Shake." },
  { id: "29", name: "Caramel Cold Coffee Shake", price: 655, category: "shake", description: "Caramel Cold Coffee Shake." },
  { id: "30", name: "Vanilla Cold Coffee Shake", price: 655, category: "shake", description: "Vanilla Cold Coffee Shake." },
  { id: "31", name: "Hazelnut Cold Coffee Shake", price: 655, category: "shake", description: "Hazelnut Cold Coffee Shake." },
  { id: "32", name: "Strawberry Ice Cream Shake", price: 655, category: "shake", description: "Strawberry Ice Cream Shake." },
  { id: "33", name: "Mango Ice Cream Shake", price: 655, category: "shake", description: "Mango Ice Cream Shake." },
  { id: "34", name: "Kulfa Ice Cream Shake", price: 655, category: "shake", description: "Kulfa Ice Cream Shake." },

  // Desserts
  { id: "35", name: "Pastry", price: 335, category: "dessert", description: "Pastry." },
  { id: "36", name: "Mousse Pastry", price: 545, category: "dessert", description: "Mousse Pastry." },
  { id: "37", name: "Brownie", price: 605, category: "dessert", description: "Brownie." },
  { id: "38", name: "Molten Lava", price: 835, category: "dessert", description: "Molten Lava." },
  { id: "39", name: "Sizzling Brownie", price: 660, category: "dessert", description: "Sizzling Brownie.", popular: true },
  { id: "40", name: "Skillet Cookies", price: 875, category: "dessert", description: "Skillet Cookies." },

  // Coffee & Tea
  { id: "41", name: "Hot Chocolate", price: 535, category: "coffee", description: "Hot Chocolate." },
  { id: "42", name: "Hot Coffee", price: 515, category: "coffee", description: "Hot Coffee." },
  { id: "43", name: "Caramel Latte", price: 535, category: "coffee", description: "Caramel Latte." },
  { id: "44", name: "Black Coffee", price: 325, category: "coffee", description: "Black Coffee." },
  { id: "45", name: "Espresso", price: 325, category: "coffee", description: "Espresso." },
  { id: "46", name: "Hazelnut Latte", price: 535, category: "coffee", description: "Hazelnut Latte." },
  { id: "47", name: "Vanilla Latte", price: 535, category: "coffee", description: "Vanilla Latte." },
  { id: "48", name: "Mochaccino", price: 515, category: "coffee", description: "Mochaccino." },
  { id: "49", name: "Cappuccino", price: 515, category: "coffee", description: "Cappuccino.", popular: true },
  { id: "50", name: "Cardamom Tea", price: 305, category: "tea", description: "Cardamom Tea.", popular: true },
  { id: "51", name: "Karak Chai", price: 285, category: "tea", description: "Karak Chai." },
  { id: "52", name: "Lipton Tea", price: 155, category: "tea", description: "Lipton Tea." },
  { id: "53", name: "Lemon Tea", price: 110, category: "tea", description: "Lemon Tea." },

  // Soft Drinks
  { id: "54", name: "Pepsi 345ml", price: 155, category: "drink", description: "The Bold, Refreshing & STRONG cola!" },
  { id: "55", name: "7Up 345ml", price: 155, category: "drink", description: "A Light & Refreshing Lemon-lime soda." },
  { id: "56", name: "Aquafina Water 1.5 Litre", price: 175, category: "drink", description: "Pure water." },
  { id: "57", name: "Aquafina Water 500ml", price: 95, category: "drink", description: "Pure water." },
  { id: "58", name: "Fresh Lime", price: 155, category: "drink", description: "Single serving." },

  // Mocktails
  { id: "59", name: "Pink Lady Mocktail", price: 490, category: "mocktail", description: "Pink Lady Mocktail." },
  { id: "60", name: "Mint Margarita Mocktail", price: 435, category: "mocktail", description: "Mint Margarita Mocktail." },
  { id: "61", name: "Blue Mist Mocktail", price: 500, category: "mocktail", description: "Blue Mist Mocktail." },
  { id: "62", name: "Pina Colada Mocktail", price: 490, category: "mocktail", description: "Pina Colada Mocktail." },
  { id: "63", name: "Lemon Ginger Mocktail", price: 435, category: "mocktail", description: "Lemon Ginger Mocktail." },

  // Pasta
  { id: "64", name: "Fajita Pasta", price: 920, category: "pasta", description: "Mild. Penne pasta tossed in fresh tomato sauce & vegetables topped with grilled chicken." },
  { id: "65", name: "Mac & Cheese Pasta", price: 1090, category: "pasta", description: "Elbow macaroni tossed in yellow cheese topped with parmesan & grilled chicken." },
  { id: "66", name: "Fettuccine Alfredo Pasta", price: 920, category: "pasta", description: "Alfredo pasta tossed in creamy white cheese sauce & chicken topped with olives." },

  // Soup
  { id: "67", name: "Hot & Sour Soup", price: 435, category: "soup", description: "Hot & Sour Soup." },
  { id: "68", name: "Mushroom Soup", price: 560, category: "soup", description: "Mushrooms dipped in classic white butter sauce." },
  { id: "69", name: "Cream Of Chicken Soup", price: 560, category: "soup", description: "Chicken dipped in classic white butter sauce." },
  { id: "70", name: "Special Soup", price: 435, category: "soup", description: "Special Soup." },

  // Burgers
  { id: "71", name: "Crunch Fried Burger", price: 910, category: "burger", description: "Crunch Fried Burger." },
  { id: "72", name: "Ranch Mania Open Face Burger", price: 910, category: "burger", description: "Ranch Mania Open Face Burger." },
  { id: "73", name: "Grilled Chicken Burger", price: 830, category: "burger", description: "Grilled Chicken Burger." },
  { id: "74", name: "East Land Burger", price: 895, category: "burger", description: "East Land Burger." }
];

module.exports = menuItems;
