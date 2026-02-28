# ExpenseTracker MVP

A smart, AI-powered expense management application that helps you track your spending, analyze patterns, and stay within budget. Built with vanilla JavaScript, this MVP features AI category suggestions, Google Sheets integration, and beautiful insights.

## 🌟 Features

### Core Functionality
- **Add Expenses**: Quick expense entry with amount, date, description, and category
- **Monthly Budget Tracking**: Visual progress bar showing spending against your monthly budget
- **Category Management**: 10 predefined categories (Food, Transport, Housing, etc.)
- **Expense Filtering**: Filter expenses by category to analyze specific spending areas
- **Real-time Insights**: Top spending categories and spending pattern analysis

### AI-Powered Features
- **Smart Category Suggestions**: AI-powered category recommendations based on expense descriptions
- **Intelligent Insights**: AI-generated spending analysis and recommendations (when API key is provided)
- **Fallback Logic**: Rule-based category suggestions when AI is unavailable

### Integrations
- **Google Sheets Sync**: Automatically sync expenses to Google Sheets for backup and analysis
- **Gemini AI Integration**: Leverage Google's Gemini AI for category suggestions and insights

### User Experience
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Visual feedback during API calls
- **Modal Settings**: Easy configuration of API keys and budget

## 🚀 Quick Start

1. **Clone or Download** the repository
2. **Open `index.html`** in a modern web browser
3. **Start Adding Expenses** - the app works offline with sample data
4. **Configure Settings** (optional) - click the ⚙️ button to add API keys

## 📁 Project Structure

```
ExpenseTracker MVP/
├── index.html          # Main HTML structure
├── app.js             # JavaScript application logic
├── style.css          # Styling with design system
└── README.md          # This file
```

## 🔧 Configuration

### Google Sheets Integration

1. Create a Google Sheet with columns: Date, Amount, Description, Category, ID
2. Get your Google Sheets ID from the URL
3. Set up Google Sheets API access
4. Add the Sheets ID in Settings (⚙️)

### Gemini AI Integration

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Add the API key in Settings (⚙️)
3. Enjoy AI-powered category suggestions and insights

## 💻 Technical Details

### Architecture
- **Frontend**: Pure HTML, CSS, JavaScript (ES6+)
- **State Management**: Simple global state with reactive rendering
- **API Integration**: Fetch API for Google Sheets and Gemini AI
- **Design System**: Custom CSS variables for theming and consistency

### Key Components

#### Data Management
```javascript
// Global state
let expenses = [...initialData.expenses];
let categories = [...initialData.categories];
let monthlyBudget = initialData.monthlyBudget;
```

#### Rendering System
- `renderHeader()` - Updates monthly total and budget progress
- `renderExpenseList()` - Displays filtered and sorted expenses
- `renderInsights()` - Shows spending analysis and top categories

#### AI Integration
- **Category Suggestion**: Uses Gemini AI or fallback rules
- **Spending Insights**: AI-generated analysis of spending patterns
- **Error Handling**: Graceful fallbacks when AI is unavailable

### Browser Compatibility
- Modern browsers (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- ES6+ features used (modules, async/await, fetch)
- CSS Grid and Flexbox for layout

## 🎨 Design System

The app uses a comprehensive design system with:
- **Color Tokens**: Semantic color variables for light/dark themes
- **Typography Scale**: Consistent font sizes and weights
- **Spacing System**: Uniform spacing using CSS custom properties
- **Component Library**: Reusable button, form, and card components

### Theme Support
- Automatic dark/light mode detection
- Manual theme switching via `data-color-scheme` attribute
- CSS custom properties for seamless theme transitions

## 📊 Sample Data

The app comes with 5 sample expenses to demonstrate functionality:
- Grocery shopping (Food) - ₹250
- Uber ride (Transport) - ₹45  
- Monthly rent (Housing) - ₹1,200
- Coffee meeting (Food) - ₹89
- Laptop purchase (Electronics) - ₹2,500

## 🔑 Key Features Deep Dive

### Smart Category Suggestions
When you enter an expense description, the AI analyzes the text and suggests the most appropriate category. Falls back to rule-based matching if AI is unavailable.

### Google Sheets Integration
Expenses are automatically synced to your Google Sheet in real-time, providing:
- Backup of your expense data
- Advanced analysis in Google Sheets
- Data portability and sharing

### Budget Tracking
Visual progress bar shows your monthly spending against your budget:
- Green: Under budget
- Visual percentage display
- Real-time updates as you add expenses

### Insights Dashboard
Three key insight cards provide:
1. **Spending Pattern**: AI analysis of your spending habits
2. **Budget Status**: Visual progress toward monthly budget
3. **Top Categories**: Your highest spending categories with amounts

## 🚀 Future Enhancements

### Planned Features
- [ ] Expense editing and deletion
- [ ] Multiple budget periods (weekly, yearly)
- [ ] Expense search and advanced filtering
- [ ] Data export (CSV, PDF)
- [ ] Recurring expense tracking
- [ ] Photo attachments for receipts
- [ ] Multi-currency support
- [ ] Spending goal setting

### Technical Improvements
- [ ] Service Worker for offline functionality
- [ ] IndexedDB for local data persistence
- [ ] Progressive Web App (PWA) features
- [ ] Advanced chart visualizations
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements (ARIA labels, screen reader support)

## 🛠️ Development

### Running Locally
```bash
# Serve the files with any local server
python -m http.server 8000
# OR
npx serve .
# OR
live-server
```

### Customization
- Modify categories in `initialData.categories`
- Adjust budget in `initialData.monthlyBudget`  
- Customize theme colors in CSS custom properties
- Add new insight calculations in `renderInsights()`

## 📱 Mobile Experience

The app is fully responsive and provides an excellent mobile experience:
- Touch-friendly interface
- Optimized form inputs for mobile keyboards
- Responsive grid layouts
- Mobile-first design approach

## 🔒 Privacy & Security

- **Local Storage**: Data stored locally in browser
- **API Keys**: Stored in local variables (not persistent)
- **No Backend**: No server-side data collection
- **HTTPS Required**: For Google Sheets API integration

## 🤝 Contributing

This is an MVP project. Contributions welcome for:
- Bug fixes
- UI/UX improvements  
- New features from the roadmap
- Performance optimizations
- Accessibility improvements

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 💡 About

ExpenseTracker MVP is a demonstration of modern web development practices:
- Vanilla JavaScript architecture
- AI integration patterns
- Progressive enhancement
- Modern CSS techniques
- Responsive design principles

Built with ❤️ for smart expense management.
