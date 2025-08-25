# WhatsApp ↔ Node.js ↔ Mistral AI Chatbot Integration

## 📝 Overview

This integration allows WhatsApp users to interact with your Mistral-based chatbot through Meta's Cloud API. The Node.js backend acts as a bridge between WhatsApp messages and Mistral AI replies.

## 🛠️ Setup Instructions

### 1. Environment Configuration

Ensure your `.env` file contains the following WhatsApp-related variables:

```env
# WhatsApp Cloud API Configuration
VERIFY_TOKEN=cosmic.deepnex.in31
META_ACCESS_TOKEN=your_meta_access_token
PHONE_NUMBER_ID=your_phone_number_id
```

- `VERIFY_TOKEN`: A custom string you create to verify webhook setup
- `META_ACCESS_TOKEN`: Your WhatsApp Cloud API token from Meta Developer Portal
- `PHONE_NUMBER_ID`: The ID of your WhatsApp Business Account phone number

### 2. Meta Developer Portal Setup

1. Go to [Meta Developer Portal](https://developers.facebook.com/)
2. Create or select an app with WhatsApp API access
3. Navigate to WhatsApp > Setup Webhook
4. Enter your webhook URL: `https://your-domain.com/webhook/whatsapp`
5. Enter your `VERIFY_TOKEN` as specified in your `.env` file
6. Subscribe to the `messages` webhook field

### 3. Exposing Your Webhook

For development, you can use [ngrok](https://ngrok.com/) to expose your local server:

```bash
ngrok http 5000
```

For production, deploy your application to a server with a public IP address and configure your domain to point to it.

## 🚀 How It Works

1. **Webhook Verification**:
   - Meta sends a verification request to your webhook endpoint
   - Your server verifies the token and responds with the challenge

2. **Message Flow**:
   - User sends a message on WhatsApp
   - Meta forwards the message to your webhook
   - Your server processes the message using Mistral AI
   - Your server sends the response back to the user via WhatsApp

3. **Conversation Management**:
   - Each WhatsApp user gets a unique conversation ID based on their phone number
   - Conversation history is maintained for context-aware responses

## 🧪 Testing

1. **Webhook Verification**:
   - Set up your webhook URL in the Meta Developer Portal
   - Verify that your server responds with the challenge

2. **Sending Messages**:
   - Send a test message to your WhatsApp Business number
   - Check your server logs to ensure the message is received
   - Verify that the chatbot responds appropriately

## 📋 API Reference

### Webhook Verification

- **Endpoint**: `GET /webhook/whatsapp`
- **Purpose**: Verify webhook setup with Meta

### Message Handling

- **Endpoint**: `POST /webhook/whatsapp`
- **Purpose**: Receive and process incoming WhatsApp messages

## 🔍 Troubleshooting

- **Webhook Verification Fails**: Ensure your `VERIFY_TOKEN` matches in both the Meta Developer Portal and your `.env` file
- **Messages Not Received**: Check that you've subscribed to the `messages` webhook field
- **No Response from Chatbot**: Verify that your Mistral AI service is running and accessible
- **Error Sending Responses**: Confirm that your `META_ACCESS_TOKEN` and `PHONE_NUMBER_ID` are correct

## 🔮 Future Enhancements

- Add support for media messages (images, audio, etc.)
- Implement user authentication for secure conversations
- Add analytics to track conversation metrics
- Implement message templates for structured responses

## 📚 Resources

- [WhatsApp Business Platform Documentation](https://developers.facebook.com/docs/whatsapp/)
- [Meta Graph API Reference](https://developers.facebook.com/docs/graph-api/)
- [Mistral AI Documentation](https://docs.mistral.ai/)