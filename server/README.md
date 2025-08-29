# Solar Mitr Backend

Backend server for the Solar Mitr AI Chatbot, a solar buyer support assistant for Cosmic Solar.

## Features

- AI-powered chatbot using Mistral AI API
- Company profile configuration via JSON
- Lead management system
- ROI calculator for solar installations
- RESTful API endpoints

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mistral AI API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Mistral AI API key

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on `.env.example` and fill in your configuration values
5. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/solar-mitr
MISTRAL_API_KEY=your_mistral_api_key
MISTRAL_MODEL=mistral-medium
```

## API Endpoints

### Chat Endpoints

- `POST /api/chat/message` - Process a chat message
- `POST /api/chat/roi` - Calculate ROI based on user inputs
- `GET /api/chat/history/:conversationId` - Get conversation history
- `DELETE /api/chat/history/:conversationId` - Clear conversation history

### Lead Endpoints

- `POST /api/lead` - Create a new lead
- `POST /api/lead/submit` - Submit a lead (alias for create lead)
- `GET /api/lead` - Get all leads
- `GET /api/lead/stats` - Get lead statistics
- `GET /api/lead/:id` - Get a lead by ID
- `PUT /api/lead/:id` - Update a lead by ID
- `DELETE /api/lead/:id` - Delete a lead by ID

### Config Endpoints

- `GET /api/config/company` - Get company profile data
- `GET /api/config/section/:section` - Get specific section of company profile
- `GET /api/config/offerings/:customerType` - Get offerings for a specific customer type
- `GET /api/config/subsidy/:customerType` - Get subsidy information for a specific customer type
- `GET /api/config/roi-calculator` - Get ROI calculator data

## Data Structure

### Company Profile

The company profile data is stored in `data/solar_company_profile.json` and includes:

- Company information
- Offerings for different customer types
- Why choose us points
- Subsidy information
- ROI calculator data
- FAQs
- CTAs
- Testimonials

### Lead Model

The lead model includes the following fields:

- Name (required)
- Phone (required)
- City (required)
- State
- Intent (site_survey, subsidy_application, expert_call, general_inquiry)
- User Type (homeowner, business_owner, society_manager, other)
- Electricity Bill
- Rooftop Available
- Estimated System Size
- Estimated Savings
- Estimated Subsidy
- Conversation ID
- Created At

## License

ISC