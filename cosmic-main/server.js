import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// API endpoint to send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email, name, otp } = req.body;
  
  if (!email || !name || !otp) {
    return res.status(400).json({ success: false, message: 'Email, name, and OTP are required' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Cosmic Powertech Solutions Quote Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Cosmic Powertech Solutions</h2>
        <p>Hello ${name},</p>
        <p>Thank you for your interest in our services. Please use the following One-Time Password (OTP) to verify your email address:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p>Best regards,<br>Cosmic Powertech Solutions Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP email' });
  }
});

// Mock API endpoints to handle the proxy errors
app.get('/api/heroes/active', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Solar Expert', image: '/solar-panels.jpg', description: 'Expert in solar panel installation' },
      { id: 2, name: 'Energy Consultant', image: '/site-assessment.jpg', description: 'Specialized in energy efficiency' }
    ]
  });
});

app.get('/api/settings/public', (req, res) => {
  res.json({
    success: true,
    data: {
      siteName: 'Cosmic Powertech Solutions',
      contactEmail: 'info@cosmicpowertech.com',
      contactPhone: '+91 1234567890',
      address: 'Mumbai, Maharashtra, India'
    }
  });
});

app.get('/api/co2-emission-reduction/active', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Residential Solar', reduction: '2.5 tons per year', image: '/co2emission.png' },
      { id: 2, title: 'Commercial Solar', reduction: '15 tons per year', image: '/co2emission.png' }
    ]
  });
});

app.get('/api/intelligent-solution/active', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'Smart Energy Management', description: 'AI-powered energy optimization', image: '/solar_design.png' },
      { id: 2, title: 'Remote Monitoring', description: '24/7 system performance tracking', image: '/solar_design.png' }
    ]
  });
});

app.get('/api/blog-posts/active', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: 'The Future of Solar Energy', author: 'Admin', date: '2024-07-20', image: '/newsimage.jpeg' },
      { id: 2, title: 'Maximizing Your Solar Investment', author: 'Admin', date: '2024-07-18', image: '/newsimage.jpeg' }
    ]
  });
});

app.get('/api/homepage', (req, res) => {
  res.json({
    success: true,
    energySolutions: [{ id: 1, name: 'Residential Solar', description: 'Complete solar solutions for your home.' }],
    products: [{ id: 1, name: 'Solar Panels', description: 'High-efficiency solar panels.' }],
    projects: [{ id: 1, name: 'Rooftop Installation', location: 'Mumbai', image: '/installation.jpg' }],
    testimonials: [{ id: 1, name: 'Satisfied Customer', message: 'Great service and professional installation.' }],
    teamMembers: [{ id: 1, name: 'John Doe', position: 'Lead Engineer', image: '/team-member.jpg' }],
    blogPosts: [{ id: 1, title: 'The Future of Solar Energy', author: 'Admin', date: '2024-07-20', image: '/newsimage.jpeg' }],
    faqs: [{ id: 1, question: 'How long does installation take?', answer: 'Typically 1-2 days for a residential system.' }],
    settings: { siteName: 'Cosmic Powertech Solutions' }
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});