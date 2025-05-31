# Card Genie - Credit Card Recommendation Platform

Card Genie is a smart credit card recommendation platform that analyzes your spending patterns and suggests the best credit cards to maximize your rewards and savings.

![Card Genie](new_credit_card.png)

## Features

- **Statement Analysis**: Upload your credit card statements or manually enter spending data
- **Personalized Recommendations**: Get tailored credit card recommendations based on your spending habits
- **Spending Breakdown**: Visualize your spending across different categories
- **Savings Calculator**: See how much you could save with recommended cards
- **Secure & Private**: Your data is encrypted and never shared with third parties

## Technologies Used

- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - React Router for navigation
  - React Query for data fetching
  - Tailwind CSS for styling
  - Recharts for data visualization
  - Radix UI components
  - React Hook Form for form handling

- **Development Tools**:
  - ESLint for code linting
  - TypeScript for type checking
  - Vite for fast development and building

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or Bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/card-genie-frontend.git
   cd card-genie-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or if using Bun
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or if using Bun
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or if using Bun
bun run build
```

## Usage

1. **Upload Statement**: Upload your credit card statement PDF or CSV file
2. **Or Enter Manually**: Alternatively, enter your spending data manually by category
3. **View Analysis**: See a breakdown of your spending patterns
4. **Get Recommendations**: Receive personalized credit card recommendations
5. **Compare Benefits**: Compare different cards and their benefits
6. **Calculate Savings**: See how much you could save with each recommended card

## API Integration

The application connects to a backend API for processing data and generating recommendations. Make sure the API is running at the correct endpoint (default: `http://localhost:3003`).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
