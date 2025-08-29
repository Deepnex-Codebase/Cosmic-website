# Solar Buyer Support Assistant ("Solar Mitr") — Product Requirements Document (PRD)

## 1. Overview

**Product Name:** Solar Mitr — AI Chatbot for Solar Buyer Support
**Owner:** Cosmic Solar
**Objective:** To develop an AI-powered chatbot that acts like a solar sales/support agent to educate, engage, and convert prospects into solar customers using data from a backend JSON configuration.

---

## 2. Goals

* Convince potential buyers to switch to solar through helpful, persuasive conversations.
* Answer buyer questions using real-time, structured company data.
* Simulate a human solar agent who can explain offerings, subsidies, and ROI.
* Collect qualified leads for follow-up by human sales agents.

---

## 3. Chatbot Persona & Tone

**Name:** Solar Mitr
**Persona:** Friendly, knowledgeable, professional, and persuasive solar agent
**Tone:** Helpful, conversational, encouraging, and reassuring

---

## 4. Features & Flows

### 4.1 Introduction Flow

* Friendly greeting
* Short introduction about cosmic solar 
* Ask user if they are a homeowner, business owner, or society manager

### 4.2 User Qualification Flow

* Ask electricity bill range
* Ask location/state (for subsidy info)
* Ask rooftop availability

### 4.3 Personalized Benefits Flow

* Pitch tailored solar benefits (savings, subsidy, safety)
* Pull talking points from JSON like:

  * "Save up to 70% on your bills"
  * "0% EMI available"
  * "Govt. approved MNRE panels with 25 years warranty"

### 4.4 Objection Handling

* Cost concerns → "0% EMI & 25-year savings"
* Maintenance doubts → "Free AMC & mobile tracking"
* Safety concerns → "Certified installers with safety audits"

### 4.5 ROI Estimation Flow

* Ask bill & state
* Estimate system size, savings, and subsidy using backend logic or static logic
* Show ROI and breakeven timeline

### 4.6 Call to Action Flow

* Offer to:

  * Book free site survey
  * Apply for subsidy
  * Schedule call with solar expert
* Lead capture (Name, Phone, City)

### 4.7 Escalation Flow

* If user needs more help → "Connect with human agent"
* Integrate with WhatsApp, email, or call routing (future scope)

---

## 5. Backend Integration

### 5.1 Data Source

* Use `solar_company_profile.json` for:

  * Company overview
  * Offerings
  * CTAs
  * Why choose us list

### 5.2 Optional Lead API

* `POST /lead/submit`
* Payload: `{ name, phone, city, intent }`

### 5.3 Optional Config API

* `GET /config/company`
* Returns JSON file data to chatbot

---

## 6. Tech Stack

| Layer       | Tech                         |
| ----------- | ---------------------------- |
| Frontend    | React/HTML Chat Widget       |
| Backend     | Node.js + Express (optional) |
| Chat Engine | Mistral / OpenAI API         |
| DB          | MongoDB (only for leads)     |
| Hosting     | VPS / Hostinger / Render     |

---

## 7. Non-Goals

* No complex CRM integration in v1
* No multilingual support in v1
* No WhatsApp automation in v1

---

## 8. Future Enhancements

* WhatsApp-based support
* Voice bot (IVR-based assistant)
* CRM + ticket system integration
* Dynamic ROI engine with subsidy API

---

## 9. Success Metrics

* % of chats converted to leads
* Average time on conversation
* Drop-off rate before CTA
* User feedback (emoji rating, etc.)

---

## 10. Deliverables

* JSON config file ✅
* Full PRD (this file) ✅
* Chatbot script/dialog flow (next)
* Optional backend API for lead + JSON
* Frontend widget integration (optional)
