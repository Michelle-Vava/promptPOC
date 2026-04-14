/**
 * chat-engine.ts — Keyword-aware support chat response engine.
 *
 * Matches user messages against topic patterns and returns contextual
 * replies. Used by the contact support chat screen.
 */

interface TopicRule {
  patterns: RegExp[]
  responses: string[]
}

const TOPICS: TopicRule[] = [
  {
    patterns: [/cancel/i, /refund/i, /money back/i],
    responses: [
      "You can cancel any booking up to 1 hour before your appointment — just go to Activity, find the booking, and tap Cancel. Cancellations within that window are always free. 🙌",
      "Refunds for cancellations are instant since customers are never charged. If a provider cancelled on you and you're seeing unexpected charges, that's definitely something I can escalate — can you share the booking ID?",
      "No cancellation fees for customers, ever. Providers are only charged the $1 flat fee after a booking is confirmed and completed.",
    ],
  },
  {
    patterns: [/price|cost|fee|charge|pay|how much/i],
    responses: [
      "PROMPT is 100% free for customers — no booking fees, no hidden charges, nothing. Providers pay a flat $1 per confirmed booking and keep everything else. 💰",
      "Zero cost for customers, always. Providers pay just $1 per confirmed booking. No subscriptions, no percentages. That's the whole model.",
      "There are no charges on the customer side. Providers see a $1 fee per confirmed booking on their dashboard under Billing.",
    ],
  },
  {
    patterns: [/book|appointment|reserve|slot/i],
    responses: [
      "To book: open the Map, pick a category (hair, repair, wellness, etc.), spin the time wheel to your preferred hour, then tap a provider pin to see details and confirm. It's instant! ⚡",
      "Bookings are confirmed the moment you tap 'Book'. You'll see it in your Activity tab right away. The provider is notified instantly too.",
      "If you don't see available slots at your preferred time, try spinning the time wheel to check other hours — availability updates in real time.",
    ],
  },
  {
    patterns: [/provider|become|list.*service|sign.*up.*provider|start.*providing/i],
    responses: [
      "Want to list your services? Tap 'I'm a Provider' on the home screen, create an account, set your availability and service details, and you'll be live on the map in minutes!",
      "As a provider, you control your own schedule. Set your open hours, slot duration, and services from the Provider Dashboard. You'll see incoming requests in real time.",
      "Providers keep 100% of their service revenue — PROMPT only charges a flat $1 per confirmed booking. No subscriptions or percentages.",
    ],
  },
  {
    patterns: [/hour|time|when|open|available|schedule/i],
    responses: [
      "Provider availability shows up on the map in real time. Use the time wheel to scroll through hours and see who's open at each time slot. 🕐",
      "Most providers on PROMPT offer same-day availability from 8 AM to 8 PM. You can see exact open slots by tapping any provider pin on the map.",
      "If your preferred time is full, try checking nearby hours — providers often have gaps that fill up fast, so the sooner you book, the better!",
    ],
  },
  {
    patterns: [/hair|barber|salon|cut|style|trim/i],
    responses: [
      "We have several hair salons and barbers across Halifax! Filter by the 💇 Hair category on the map to see who's available today. Popular ones book fast! ✂️",
      "Hair services on PROMPT range from quick trims to full styling sessions. Each provider shows their price, duration, and rating right on their pin.",
    ],
  },
  {
    patterns: [/repair|fix|handyman|plumb|electric/i],
    responses: [
      "Our 🔧 Repair category covers handymen, plumbers, electricians, and more. Filter by Repair on the map to find someone available today.",
      "For repairs, we recommend checking provider reviews and ratings. All our repair providers are verified and rated by real customers.",
    ],
  },
  {
    patterns: [/wellness|spa|massage|yoga|health/i],
    responses: [
      "Check out the 🧘 Wellness category! We've got massage therapists, yoga instructors, spa services, and more across Halifax. 🧖‍♀️",
      "Wellness providers offer everything from 30-minute sessions to full spa days. Tap any pin on the map to see their services and pricing.",
    ],
  },
  {
    patterns: [/food|dining|restaurant|eat|lunch|dinner/i],
    responses: [
      "The 🍽️ Dining category shows restaurants and food spots with same-day reservations. Most dining bookings are free for both sides!",
      "Looking for a place to eat? Filter by Dining on the map — you'll see ratings, availability, and can book a table instantly.",
    ],
  },
  {
    patterns: [/map|location|where|area|halifax|dartmouth|bedford/i],
    responses: [
      "PROMPT currently covers the Halifax Regional Municipality — Downtown Halifax, Dartmouth, Bedford, and surrounding areas. We're expanding to more of Nova Scotia soon! 🗺️",
      "The map shows all active providers in your area. You can search by name or address using the search bar at the top. Pins are color-coded by category.",
    ],
  },
  {
    patterns: [/bug|error|crash|broken|not.*work|issue|problem/i],
    responses: [
      "Sorry to hear you're running into issues! Can you describe what happened? Screenshots help a lot too. I'll make sure our engineering team sees this. 🔍",
      "I've flagged this for our team. In the meantime, try refreshing the app or force-closing and reopening it. If the issue persists, use the Report a Problem form for faster tracking.",
      "Thanks for reporting that. Our team monitors bug reports closely and usually pushes fixes within 24-48 hours. Can you tell me what device you're using?",
    ],
  },
  {
    patterns: [/account|profile|setting|password|email|login|sign.*in/i],
    responses: [
      "You can manage your account from the Profile tab — update your name, email, notification preferences, and theme.",
      "Having trouble logging in? Try resetting your password on the login screen. If you're still stuck, I can help verify your account from here.",
      "Your profile settings include push notifications, email reminders, theme (dark/light mode), and time picker style. All changes save automatically.",
    ],
  },
  {
    patterns: [/rate|rating|review|star|feedback/i],
    responses: [
      "After each booking, you can rate your experience. Ratings help other customers find great providers and help providers improve their services! ⭐",
      "Provider ratings are based on verified customer reviews. We don't allow fake reviews — every rating is tied to a confirmed booking.",
    ],
  },
  {
    patterns: [/thank|thanks|thx|appreciate|awesome|great|perfect|cool/i],
    responses: [
      "You're welcome! 😊 Is there anything else I can help with?",
      "Happy to help! Let me know if anything else comes up.",
      "Glad I could help! Don't hesitate to reach out anytime. 🙌",
      "Anytime! That's what we're here for. Enjoy your experience with PROMPT!",
    ],
  },
  {
    patterns: [/hi|hey|hello|sup|yo|good morning|good afternoon|good evening/i],
    responses: [
      "Hey there! 👋 How can I help you today?",
      "Hi! Welcome to PROMPT support. What can I do for you?",
      "Hello! I'm here to help with anything — bookings, providers, account questions, you name it.",
    ],
  },
  {
    patterns: [/dark.*mode|light.*mode|theme|appearance/i],
    responses: [
      "You can switch between dark and light mode from your Profile settings. Just toggle the theme switch — it applies instantly across the whole app! 🌙☀️",
      "Theme preference is saved to your account, so it'll stay consistent.",
    ],
  },
  {
    patterns: [/safe|security|privacy|data|personal/i],
    responses: [
      "We take privacy seriously. Your personal data is encrypted and stored securely. We never sell your information to third parties. Check our Privacy Policy for full details.",
      "PROMPT uses industry-standard encryption. We only share your name and booking time with providers to fulfill your appointments — nothing else.",
    ],
  },
]

const FALLBACK_RESPONSES = [
  "That's a great question! Let me look into that for you. Could you give me a bit more detail about what you need help with?",
  "I want to make sure I help you properly — could you tell me a bit more? For example, is this about a booking, your account, or something else?",
  "I'm not 100% sure I understand — could you rephrase that? I can help with bookings, providers, account settings, pricing, and more.",
  "Hmm, I want to get this right. Could you elaborate a bit? Common topics I can help with: bookings, cancellations, pricing, provider questions, and account settings.",
  "Thanks for reaching out! I want to make sure I point you in the right direction. What area does your question relate to?",
]

const FOLLOW_UPS = [
  "\n\nIs there anything else I can help with?",
  "\n\nAnything else on your mind?",
  "",
  "",
  "\n\nLet me know if you have more questions!",
  "",
]

const topicCounters = new Map<number, number>()
let fallbackCounter = 0

export function getSmartReply(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim()

  for (let i = 0; i < TOPICS.length; i++) {
    const topic = TOPICS[i]
    if (topic.patterns.some(p => p.test(msg))) {
      const count = topicCounters.get(i) ?? 0
      topicCounters.set(i, count + 1)
      const response = topic.responses[count % topic.responses.length]
      const followUp = FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)]
      return response + followUp
    }
  }

  const response = FALLBACK_RESPONSES[fallbackCounter % FALLBACK_RESPONSES.length]
  fallbackCounter++
  return response
}

export const GREETING = "Hi there! 👋 I'm Sam from PROMPT support. I can help with bookings, cancellations, pricing, provider questions, account settings, and more. What's on your mind?"
