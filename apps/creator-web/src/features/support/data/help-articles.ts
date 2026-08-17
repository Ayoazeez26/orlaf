import type { HelpArticle, HelpArticleCategory } from "../types"

export const HELP_ARTICLE_CATEGORY_LABEL: Record<HelpArticleCategory, string> =
  {
    "getting-started": "Getting started",
    monetization: "Monetization",
    promotions: "Promotions",
    account: "Account",
  }

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "publish-first-series",
    title: "How do I publish my first series?",
    category: "getting-started",
    minutes: 3,
    updated: "May 28, 2026",
    paragraphs: [
      "Publishing a series on Sable takes four steps. You can save as a draft at any point and come back later.",
    ],
    steps: [
      {
        title: "Create the project",
        body: "Go to Projects → New Project. Add a working title and pick a genre. This creates a draft you can keep private.",
      },
      {
        title: "Upload episodes",
        body: "Add at least one episode as MP4, MOV, or AVI up to 4K. Files can be up to 5GB each. Encoding typically finishes within a few minutes.",
      },
      {
        title: "Add cover art and synopsis",
        body: "Upload a 16:9 thumbnail and write a short synopsis. This is what viewers see on Discover and search.",
      },
      {
        title: "Submit for review",
        body: "When you're ready, submit the series. Most reviews complete within 24–48 hours. You'll get an email and an in-app notification either way.",
      },
    ],
    relatedIds: ["video-formats", "channel-profile", "how-promotions-work"],
  },
  {
    id: "video-formats",
    title: "What video formats are supported?",
    category: "getting-started",
    minutes: 2,
    updated: "May 12, 2026",
    paragraphs: [
      "Sable accepts MP4, MOV, and AVI files up to 4K resolution. Each file can be up to 5GB.",
      "H.264 or H.265 video with AAC audio is recommended. After upload, encoding usually finishes within a few minutes.",
    ],
    relatedIds: ["publish-first-series", "channel-profile"],
  },
  {
    id: "channel-profile",
    title: "How do I set up my channel profile?",
    category: "getting-started",
    minutes: 2,
    updated: "May 12, 2026",
    paragraphs: [
      "Open Settings → Studio to set your studio name, handle, tagline, logo, and primary genre.",
      "A complete profile helps viewers find you on Discover and makes your series look consistent across the platform.",
    ],
    relatedIds: ["publish-first-series", "enable-2fa"],
  },
  {
    id: "when-paid",
    title: "When do I get paid?",
    category: "monetization",
    minutes: 4,
    updated: "May 12, 2026",
    paragraphs: [
      "Payouts run on a regular cycle after a holding period so chargebacks can settle.",
      "Once your balance clears the minimum and your payout method is verified, funds are sent to the account on file. You can track status under Earnings.",
    ],
    relatedIds: ["add-payout-method", "minimum-payout"],
  },
  {
    id: "add-payout-method",
    title: "How do I add a payout method?",
    category: "monetization",
    minutes: 3,
    updated: "May 12, 2026",
    paragraphs: [
      "Go to Settings → Earnings (or Revenue → Payouts) and add a bank account. We'll ask you to verify ownership before the first payout.",
      "Keep your legal name and tax details current so payouts aren't delayed.",
    ],
    relatedIds: ["when-paid", "tax-deducted"],
  },
  {
    id: "tax-deducted",
    title: "Why was tax deducted from my payout?",
    category: "monetization",
    minutes: 3,
    updated: "May 12, 2026",
    paragraphs: [
      "Withholding depends on your country and the tax information on your studio. If details are missing or mismatched, a default rate may apply.",
      "Update tax forms in Settings → Earnings. Adjusted withholding usually applies to the next payout cycle.",
    ],
    relatedIds: ["when-paid", "add-payout-method"],
  },
  {
    id: "minimum-payout",
    title: "What is the minimum payout?",
    category: "monetization",
    minutes: 2,
    updated: "May 12, 2026",
    paragraphs: [
      "A minimum balance is required before we send funds, so small amounts aren't paid out as separate transfers.",
      "Earnings below the threshold stay in your studio balance until the next cycle that meets the minimum.",
    ],
    relatedIds: ["when-paid", "add-payout-method"],
  },
  {
    id: "how-promotions-work",
    title: "How do promotions work?",
    category: "promotions",
    minutes: 4,
    updated: "May 12, 2026",
    paragraphs: [
      "Promotions put your series in extra Discover and search placements for a set budget and duration.",
      "You choose the series, audience, and spend. Delivery pauses if the series is unpublished or the budget runs out.",
    ],
    relatedIds: ["pause-promotion", "unused-budget"],
  },
  {
    id: "pause-promotion",
    title: "Can I pause a running promotion?",
    category: "promotions",
    minutes: 2,
    updated: "May 12, 2026",
    paragraphs: [
      "Yes. Open the campaign from Promotions and pause it. Delivery stops, and unused budget stays on the campaign until you resume or end it.",
    ],
    relatedIds: ["how-promotions-work", "unused-budget"],
  },
  {
    id: "unused-budget",
    title: "What happens to unused promotion budget?",
    category: "promotions",
    minutes: 2,
    updated: "May 12, 2026",
    paragraphs: [
      "Unused budget remains on the campaign while it is paused or still running. When a campaign ends, leftover budget is returned to your promotions balance.",
    ],
    relatedIds: ["how-promotions-work", "pause-promotion"],
  },
  {
    id: "enable-2fa",
    title: "How do I enable two-factor authentication?",
    category: "account",
    minutes: 3,
    updated: "May 12, 2026",
    paragraphs: [
      "Go to Settings → Security and turn on two-factor authentication. Scan the QR code with an authenticator app, then enter the 6-digit code to confirm.",
      "Keep backup codes somewhere safe. Support cannot bypass 2FA for you.",
    ],
    relatedIds: ["delete-account", "channel-profile"],
  },
  {
    id: "delete-account",
    title: "How do I delete my account?",
    category: "account",
    minutes: 2,
    updated: "May 12, 2026",
    paragraphs: [
      "Account deletion is permanent. Open Settings → Security (or Studio) and follow the delete account flow.",
      "Published series are unpublished. Outstanding payouts are processed according to our payout policy before the account is closed.",
    ],
    relatedIds: ["enable-2fa", "channel-profile"],
  },
]

export const GUIDELINE_RULES = [
  {
    n: 1,
    title: "Be respectful",
    body: "No harassment, hate speech, or targeted attacks. Disagreements are fine — personal attacks are not.",
  },
  {
    n: 2,
    title: "Original work only",
    body: "Upload content you own or have licensed. Copyright strikes apply within 24 hours of a valid claim.",
  },
  {
    n: 3,
    title: "No explicit or harmful content",
    body: "Nudity, graphic violence, and content that endangers minors are removed and may trigger account suspension.",
  },
  {
    n: 4,
    title: "Honest monetization",
    body: "No engagement farming, view manipulation, or misleading thumbnails. Sponsorships must be disclosed.",
  },
  {
    n: 5,
    title: "Protect your account",
    body: "Use 2FA, never share login credentials, and report suspicious activity from Settings → Security.",
  },
] as const

export function getHelpArticle(id: string) {
  return HELP_ARTICLES.find((article) => article.id === id)
}
