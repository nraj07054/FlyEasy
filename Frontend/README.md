# FlightFinder - AI-Powered Flight Card Offers & Coupon Search

A modern, Next.js-based flight search interface that allows users to find the best credit card offers, coupon codes, and discounts for flights across different aggregators using natural language queries.

## Features

✨ **Natural Language Search** - Ask questions like "Best credit card offers for flights to Tokyo" or "Kayak coupon codes for London flights"

🎯 **Multi-Aggregator Comparison** - Compare card offers and coupons from Kayak, Skyscanner, Google Flights, Expedia, and more

💳 **Credit Card Deals** - Find exclusive credit card discounts and cashback offers (Chase, Amex, Capital One, Citi, etc.)

🎫 **Coupon Stacking** - Discover multiple coupon codes that can be combined for maximum savings

🎨 **Modern UI/UX** - Clean, minimal design with smooth animations and responsive layout

⚡ **Fast & Responsive** - Built with Next.js 14 and Tailwind CSS for optimal performance

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── layout.js          # Root layout with metadata
│   ├── page.js            # Home page
│   └── globals.css        # Global styles with Tailwind directives
├── components/
│   └── flight-search.jsx  # Main flight search component
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Project dependencies
```

## Usage

### Basic Search

Simply type your flight card offer query in natural language:
- "Best Chase credit card offers for flights to Paris"
- "Kayak coupon codes for round trip to New York"
- "Amex Platinum flight discounts to Tokyo"
- "Stack multiple coupons for London flights under $500"
- "Capital One travel credit for flights to Miami"

The AI will understand your intent and search across multiple aggregators to find the best card offers, coupon codes, and stackable discounts.

### Features Overview

The interface includes four main feature cards:

1. **Best Card Offers** - Find credit card discounts across all aggregators
2. **Coupon Comparison** - Compare all coupon codes in one place
3. **Latest Offers** - Real-time coupon codes and credit card deals
4. **Maximum Savings** - Stack multiple offers and find hidden discounts

### Results Display

Search results show:
- **Aggregator name** (Kayak, Skyscanner, Google Flights, Expedia)
- **Original price** vs **Discounted price** with strikethrough
- **Card offer details** (e.g., "Chase Sapphire 15% off", "Amex Platinum $70 credit")
- **Coupon code** in a copyable format
- **Total savings** highlighted in green
- **Get Offer** button to claim the deal

## Customization

### Adding Real API Integration

To connect to a real flight search API:

1. Create an API route in `app/api/search/route.js`:
```javascript
export async function POST(request) {
  const { query } = await request.json();
  
  // Call your flight search API
  const results = await fetchFlightDeals(query);
  
  return Response.json(results);
}
```

2. Update the `handleSearch` function in `components/flight-search.jsx`:
```javascript
const handleSearch = async (e) => {
  e.preventDefault();
  setIsSearching(true);
  
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: searchQuery })
  });
  
  const results = await response.json();
  setFlightResults(results);
  setIsSearching(false);
  setShowResults(true);
};
```

### Styling Customization

Colors, gradients, and animations can be customized in:
- `tailwind.config.js` - Theme extensions
- `components/flight-search.jsx` - Component-specific styles
- `app/globals.css` - Global CSS variables

### Adding More Aggregators and Offers

To add more flight aggregators with their card offers:

```javascript
const sampleResults = [
  // ... existing results
  {
    aggregator: "YourAggregator",
    originalPrice: "$XXX",
    discountedPrice: "$XXX",
    offer: "Card Name + Discount Type",
    couponCode: "COUPON123",
    savings: "$XX"
  }
];
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **PostCSS** - CSS transformations

## Performance Optimizations

- Client-side component with `'use client'` directive
- Optimized animations using CSS transforms
- Lazy loading of search results
- Backdrop blur for glassmorphism effects
- Gradient mesh backgrounds for visual depth

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Connect to real flight search APIs with card offer data (Skyscanner, Amadeus, etc.)
- [ ] Add filters (card type, discount amount, aggregator)
- [ ] Implement automatic coupon code testing and validation
- [ ] Add price alerts for specific card offers
- [ ] User authentication and saved favorite offers
- [ ] Browser extension for automatic coupon application
- [ ] Integration with credit card reward programs
- [ ] Cashback tracking and optimization
- [ ] Compare card annual fees vs travel benefits

## License

MIT

## Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ using Next.js and Tailwind CSS
