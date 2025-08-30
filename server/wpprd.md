# PRD: WhatsApp ↔ Node.js ↔ Mistral AI Chatbot Integration

## ✅ Objective

Allow WhatsApp users to interact with your Mistral-based chatbot through Meta’s Cloud API. Your Node.js backend should act as the bridge between WhatsApp messages and Mistral API replies.

---

## 🧱 Tech Stack

| Component       | Technology                 |
| --------------- | -------------------------- |
| Backend Server  | Node.js (Express.js)       |
| LLM Chatbot     | Mistral AI (via local/API) |
| Webhook Handler | Express.js middleware      |
| Messaging Layer | Meta WhatsApp Cloud API    |
| Auth            | Bearer Token (Meta)        |
| Deployment      | Local with Ngrok / VPS     |

---

## 📦 Required `.env` Settings

```env
PORT=5000
VERIFY_TOKEN=cosmic.deepnex.in31
META_ACCESS_TOKEN=EAA...your_long_token...
PHONE_NUMBER_ID=123456789012345
MISTRAL_CHATBOT_URL=http://localhost:5050/chat
```

---

## ⚙️ Module Breakdown

### 1. Webhook Verification Handler

**Endpoint:** `GET /webhook/whatsapp`

**Purpose:** Handle Meta's verification challenge when connecting the webhook.

```js
app.get('/webhook/whatsapp', (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});
```

---

### 2. WhatsApp Message Handler

**Endpoint:** `POST /webhook/whatsapp`

**Purpose:** Receive messages from WhatsApp and route to Mistral, then reply back.

```js
app.post('/webhook/whatsapp', async (req, res) => {
  const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!entry) return res.sendStatus(200);

  const from = entry.from;
  const text = entry.text?.body;

  const botReply = await getMistralReply(text);

  await axios.post(
    `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: { body: botReply },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );

  res.sendStatus(200);
});
```

---

### 3. Mistral Chatbot Caller

**Function:**

```js
async function getMistralReply(userMessage) {
  const response = await axios.post(process.env.MISTRAL_CHATBOT_URL, {
    message: userMessage
  });
  return response.data.reply;
}
```

> ⚠️ Ensure the Mistral service is running on the specified `MISTRAL_CHATBOT_URL`

---

## 🔮 Testing Checklist

| Task                           | Method                   |
| ------------------------------ | ------------------------ |
| Webhook verification           | Meta dashboard           |
| Incoming message received      | WhatsApp sandbox message |
| Message sent to Mistral        | Local API test           |
| Mistral reply received         | Console or logs          |
| Response sent back to WhatsApp | Message shown to user    |
| 403 on failure                 | Token mismatch           |

---

## 🚀 Optional Enhancements

* MongoDB session tracking
* NLP-based command recognition
* Image/audio support
* Keyword menu replies

---

## ✅ Developer To-Do Summary

1. Create `.env` with correct values
2. Load `dotenv` in server.js:

   ```js
   require('dotenv').config();
   ```
3. Implement both `/webhook/whatsapp` routes (GET + POST)
4. Test via Meta Sandbox

Let me know if you want a ZIP project boilerplate with everything ready.
