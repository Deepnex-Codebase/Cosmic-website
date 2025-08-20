# OTP Email Verification System

This project includes an OTP (One-Time Password) email verification system for the quote request form. It uses Nodemailer to send OTP emails to users and verifies them before submitting the form.

## Setup Instructions

### 1. Environment Variables

Create or update the `.env` file in the root directory with the following variables:

```
# EmailJS Configuration (Client-side - not used anymore)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Nodemailer Configuration (Server-side)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
PORT=5000
```

**Important Notes for Gmail:**
- For `EMAIL_USER`, use your Gmail address
- For `EMAIL_PASS`, you need to use an App Password, not your regular Gmail password
  - To generate an App Password:
    1. Enable 2-Step Verification on your Google Account
    2. Go to [Google Account Security](https://myaccount.google.com/security)
    3. Under "Signing in to Google", select "App passwords"
    4. Generate a new app password for "Mail" and "Other (Custom name)"
    5. Use the generated 16-character password as your `EMAIL_PASS`

### 2. Install Dependencies

All required dependencies should already be installed, but if needed:

```bash
npm install
```

### 3. Running the Application

To run both the frontend and backend server simultaneously:

```bash
npm run dev:all
```

Or run them separately:

- Frontend only: `npm run dev`
- Backend only: `npm run server`

## How It Works

1. When a user submits the quote request form, a 6-digit OTP is generated
2. The OTP is sent to the user's email using Nodemailer
3. The OTP expires after 5 minutes
4. The user enters the OTP to verify their email
5. If verified successfully, the form submission is completed

## Troubleshooting

- If emails are not being sent:
  - Check that your `.env` file has the correct email credentials
  - Make sure you're using an App Password if using Gmail
  - Check the server console for any error messages
  - Verify that the backend server is running on port 5000

- If the OTP verification fails:
  - Make sure you're entering the correct OTP
  - Check if the OTP has expired (5-minute time limit)
  - Try requesting a new OTP