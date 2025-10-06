const mongoose = require('mongoose');

const privacyPolicySchema = new mongoose.Schema({
  lastUpdated: {
    type: String,
    default: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  },
  introduction: {
    type: String,
    required: true,
    default: "Cosmic Power Technologies (\"we,\" \"our,\" or \"us\") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website www.cosmicpowertech.com, and how we comply with global privacy standards including Facebook/Meta advertising requirements."
  },
  informationCollected: {
    description: {
      type: String,
      default: "We collect information to provide our services, improve user experience, and run advertising campaigns."
    },
    providedInfo: {
      type: String,
      default: "Name, Email Address, Phone Number, Company/Job Title, Address (when you contact us or request information)."
    },
    automaticInfo: {
      type: String,
      default: "IP Address, Browser Type, Device Information, Operating System\nPages visited, time spent, referral sources\nCookies and tracking pixels"
    },
    thirdPartyData: {
      type: String,
      default: "We may use Meta (Facebook/Instagram) tracking technologies, such as the Facebook Pixel, to understand user interactions, measure ad performance, and create personalized experiences."
    }
  },
  informationUsage: {
    type: [String],
    default: [
      "To operate, maintain, and improve our website and services",
      "To respond to inquiries and provide support",
      "To send updates, newsletters, and promotional offers (only if you opt-in)",
      "To analyze trends and site usage for business insights",
      "To deliver and measure targeted advertisements across platforms (e.g., Facebook/Instagram Ads, Google Ads)",
      "To comply with legal and regulatory obligations"
    ]
  },
  cookiesAndTracking: {
    description: {
      type: String,
      default: "We use cookies, pixels, and other tracking tools to:"
    },
    purposes: {
      type: [String],
      default: [
        "Improve website performance and user experience",
        "Analyze traffic and user behavior",
        "Deliver personalized ads via Facebook, Instagram, Google, and other networks"
      ]
    },
    managingCookies: {
      type: String,
      default: "You can manage or disable cookies via your browser settings. For Facebook Ads, you can adjust ad preferences at Facebook Ad Preferences."
    }
  },
  dataSharing: {
    description: {
      type: String,
      default: "We do not sell your personal information. We may share information only with:"
    },
    sharingEntities: {
      type: [String],
      default: [
        "Service Providers (hosting, analytics, ad platforms, email marketing tools)",
        "Advertising Platforms (Facebook, Instagram, Google) for targeted advertising",
        "Legal Authorities when required by law",
        "Business Transfers in case of merger, acquisition, or restructuring"
      ]
    }
  },
  dataSecurity: {
    description: {
      type: String,
      default: "We use reasonable security measures such as SSL encryption, access controls, and internal policies to protect your information."
    },
    disclaimer: {
      type: String,
      default: "However, please note: no method of electronic transmission or storage is 100% secure."
    }
  },
  userRights: {
    description: {
      type: String,
      default: "Depending on your location, you may have the following rights:"
    },
    rights: {
      type: [String],
      default: [
        "Access & Correction: Request access to or correction of your personal data",
        "Deletion: Request that we delete your data (subject to legal obligations)",
        "Opt-Out of Marketing: Unsubscribe from emails or adjust your ad preferences"
      ]
    },
    adOptOuts: {
      type: [String],
      default: [
        "Facebook Ad Preferences",
        "Google Ads Settings"
      ]
    },
    contactInfo: {
      type: String,
      default: "To exercise your rights, contact us at info@cosmicpowertech.com."
    }
  },
  internationalTransfers: {
    type: String,
    default: "If you are accessing from outside India, your data may be processed in countries where our servers and service providers are located. We ensure safeguards are in place to protect your information."
  },
  childrenPrivacy: {
    type: String,
    default: "Our services are not directed at individuals under 13 years of age, and we do not knowingly collect personal information from children."
  },
  policyChanges: {
    type: String,
    default: "We may update this Privacy Policy periodically. Any updates will be posted on this page, and material changes will be communicated via website notices or email."
  },
  contactDetails: {
    email: {
      type: String,
      default: "COSMICPOWERTECH@GMAIL.COM"
    },
    address: {
      type: String,
      default: "73 Tapas Nagar Society, Palanpur Canal Rd, Palanpur, Surat, Gujarat 395009"
    },
    website: {
      type: String,
      default: "www.cosmicpowertech.com"
    }
  }
}, { timestamps: true });

const PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);

module.exports = PrivacyPolicy;