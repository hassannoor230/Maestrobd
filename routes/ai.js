const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');
require('dotenv').config();

// Lazy OpenAI client initialization - only create when API key is available
let client = null;
function getClient() {
  if (client) return client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your_openai')) {
    client = new OpenAI({ apiKey });
  }
  return client;
}

const menuItems = require('../data/menu');
const settings = {
  name: 'Maestro Cafe',
  tagline: 'Bringing Class to the Cuisine!',
  phone: '+92 55 3821477',
  email: 'maestro.cafe.gujranwala@gmail.com',
  address: 'Liberty Plaza, Sialkot Road, Block B Satellite Town, Gujranwala, Punjab, Pakistan',
  hours: 'Open daily till 1:00 AM',
  rating: 4.2,
  reviewsCount: 1319,
  priceRange: 'PKR 2,000–3,000 per person',
};

let reservations = [];
let aiConversations = [];

const systemPrompt = `You are the AI concierge for Maestro Cafe, a luxury restaurant in Gujranwala, Pakistan.

RESTAURANT INFORMATION:
- Name: Maestro Cafe
- Tagline: "Bringing Class to the Cuisine!"
- Phone: +92 55 3821477
- Email: maestro.cafe.gujranwala@gmail.com
- Address: Liberty Plaza, Sialkot Road, Block B Satellite Town, Gujranwala, Punjab, Pakistan
- Hours: Open daily till 1:00 AM (Last order at 12:30 AM)
- Rating: 4.2 stars
- Reviews: 1,319+
- Price Range: PKR 2,000–3,000 per person

SERVICES:
- Dine-in
- Takeout
- Delivery (within Gujranwala area)

YOUR PERSONALITY:
- Warm, sophisticated, and hospitable
- Concise but informative
- Use simple Urdu/Roman Urdu when customers write in Urdu
- Never say "I'm just an AI" - say "I'm Maestro's digital concierge"
- Be helpful with reservations and menu questions
- Recommend signature dishes when asked

SIGNATURE DISHES:
- Polo Stuffed Chicken (PKR 1,490)
- Three Cheese Chicken (PKR 1,490)
- Maestro Special Verde Steak (PKR 1,545)
- Chicken Mexicano (PKR 965)
- Chicken Chili Dry (PKR 965)

IMPORTANT RULES:
1. Always be helpful and warm
2. For reservations, ask for: name, phone, date, time, number of guests
3. For menu questions, reference actual menu items
4. Current time in Pakistan is UTC+5
5. If you don't know something, say you'll check and get back
6. Keep responses conversational and not too long`;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

function formatMenuItems() {
  return menuItems.map(item => 
    `- ${item.name} (PKR ${item.price}) - ${item.category} - ${item.description}`
  ).join('\n');
}

function getOpeningHoursStatus() {
  const now = new Date();
  const pakistanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
  const hour = pakistanTime.getHours();
  
  if (hour >= 12 || hour < 1) {
    return 'open';
  }
  return 'closed';
}

function generateResponse(userMessage, conversationHistory) {
  const message = userMessage.toLowerCase();
  const menu = formatMenuItems();
  
  if (message.includes('menu') || message.includes('khana') || message.includes('dish') || message.includes('food')) {
    if (message.includes('recommend') || message.includes('best') || message.includes('signature')) {
      return `Our signature dishes are absolutely exceptional:

🌟 **Polo Stuffed Chicken** (PKR 1,490)
Fried chicken breast stuffed with spinach & cheese. Served with mashed potatoes & sautéed vegetables.

🌟 **Three Cheese Chicken** (PKR 1,490)
Fried chicken stuffed with mushrooms & cheese. Served with fries.

🌟 **Maestro Special Verde Steak** (PKR 1,545)
Our special grilled chicken topped with verde chili sauce, egg fried rice & fries.

Would you like me to help you make a reservation for any of these?`;
    }
    return `Here's our menu:\n\n${menu}\n\nWould you like to know more about any specific dish or make a reservation?`;
  }

  if (message.includes('hour') || message.includes('time') || message.includes('khulna') || message.includes('band')) {
    const status = getOpeningHoursStatus();
    if (status === 'open') {
      return `Maestro Cafe is currently open! 🕐

We're open daily until 1:00 AM (Last order at 12:30 AM)

Would you like to make a reservation for tonight?`;
    }
    return `Maestro Cafe is currently closed. 🕐

We're open daily from 12:00 PM until 1:00 AM (Last order at 12:30 AM)

Feel free to ask me to book a table for when we reopen!`;
  }

  if (message.includes('location') || message.includes('address') || message.includes('kahan') || message.includes('map')) {
    return `📍 **Maestro Cafe Location:**

Liberty Plaza, Sialkot Road,
Block B Satellite Town,
Gujranwala, Punjab, Pakistan

Plus Code: 557V+59 Gujranwala

We're easily accessible and have ample parking. Would you like me to help you book a table?`;
  }

  if (message.includes('phone') || message.includes('call') || message.includes('number') || message.includes('contact')) {
    return `📞 **Contact Us:**

Phone: +92 55 3821477
Email: maestro.cafe.gujranwala@gmail.com

Feel free to call us anytime! How may I assist you further?`;
  }

  if (message.includes('reservation') || message.includes('book') || message.includes('table') || message.includes('table') || message.includes('chahiye')) {
    return `I'd be delighted to help you book a table at Maestro Cafe! 🍽️

To make a reservation, I'll need:
- Your name
- Phone number
- Date you'd like to visit
- Time (we're open until 1:00 AM)
- Number of guests

Would you like me to proceed with a reservation?`;
  }

  if (message.includes('delivery') || message.includes('home') || message.includes('deliver')) {
    return `🚚 **Delivery Service:**

Yes, we offer delivery within Gujranwala!

Delivery charges and availability depend on your location. For more details and to place an order, please call us at **+92 55 3821477**.

Would you like me to help you with anything else?`;
  }

  if (message.includes('price') || message.includes('cost') || message.includes('expensive') || message.includes('mahanga')) {
    return `💰 **Price Range:**

Our average price per person is **PKR 2,000–3,000**

We offer excellent value for a luxury dining experience with:
- Premium ingredients
- Chef's signature recipes
- Elegant ambiance
- Exceptional service

Would you like to explore our menu or make a reservation?`;
  }

  if (message.includes('review') || message.includes('feedback') || message.includes('rating')) {
    return `⭐ **Customer Reviews:**

Maestro Cafe has a rating of **4.2 stars** with over **1,319 reviews**!

Our guests consistently praise:
- Exceptional Polo Stuffed Chicken
- Cozy atmosphere
- Friendly staff
- Great value for money

Would you like to book a table to experience it yourself?`;
  }

  if (message.includes('special') || message.includes('offer') || message.includes('deal') || message.includes('off')) {
    return `🎉 **Special Offers:**

We frequently have seasonal specials and chef's recommendations. For current offers, please:

1. Visit our restaurant
2. Ask our staff about today's specials
3. Call us at +92 55 3821477

Would you like to make a reservation to check out our latest offerings?`;
  }

  return `Thank you for your message! I'm here to help with:

🍽️ Making reservations
📋 Exploring our menu
📍 Location & directions
🕐 Opening hours
📞 Contact information
🚚 Delivery inquiries

How may I assist you today?`;
}

router.post('/chat', limiter, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messageLength = message.trim().length;
    if (messageLength < 1 || messageLength > 500) {
      return res.status(400).json({ error: 'Message must be between 1 and 500 characters' });
    }

    if (!process.env.OPENAI_API_KEY) {
      const response = generateResponse(message, []);
      
      const conversation = aiConversations.find(c => c.sessionId === sessionId);
      if (conversation) {
        conversation.messages.push({ role: 'user', content: message });
        conversation.messages.push({ role: 'assistant', content: response });
        conversation.updatedAt = new Date();
      } else {
        aiConversations.push({
          sessionId,
          messages: [
            { role: 'user', content: message },
            { role: 'assistant', content: response }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      return res.json({ response, sessionId });
    }

    try {
      const openaiClient = getClient();
      if (!openaiClient) {
        const response = generateResponse(message, []);
        return res.json({ response, sessionId });
      }

      const conversation = aiConversations.find(c => c.sessionId === sessionId);
      const messages = conversation?.messages || [];
      
      const openaiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message }
      ];

      const completion = await openaiClient.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: openaiMessages,
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;

      if (conversation) {
        conversation.messages.push({ role: 'user', content: message });
        conversation.messages.push({ role: 'assistant', content: response });
        conversation.updatedAt = new Date();
      } else {
        aiConversations.push({
          sessionId,
          messages: [
            { role: 'user', content: message },
            { role: 'assistant', content: response }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      return res.json({ response, sessionId });
    } catch (openaiError) {
      console.error('OpenAI Error:', openaiError);
      const response = generateResponse(message, []);
      return res.json({ response, sessionId });
    }
  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ error: 'An error occurred processing your request' });
  }
});

router.get('/stats', (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayConversations = aiConversations.filter(c => 
    new Date(c.createdAt) >= today
  );
  
  res.json({
    totalConversations: aiConversations.length,
    todayConversations: todayConversations.length,
    thisWeekConversations: aiConversations.filter(c => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(c.createdAt) >= weekAgo;
    }).length,
  });
});

router.get('/conversations', (req, res) => {
  res.json(aiConversations.reverse());
});

router.get('/conversations/:sessionId', (req, res) => {
  const conversation = aiConversations.find(c => c.sessionId === req.params.sessionId);
  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }
  res.json(conversation);
});

module.exports = router;
