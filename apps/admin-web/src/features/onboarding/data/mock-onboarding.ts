import type { OnboardingApplication, OnboardingInvite } from "../types"

export const MOCK_APPLICATIONS: OnboardingApplication[] = [
  {
    id: "tunde-bakare",
    name: "Tunde Bakare",
    email: "tunde@email.com",
    username: "@tundeshoots",
    initials: "TB",
    location: "Lagos",
    source: "Application",
    submitted: "2h ago",
    status: "pending",
  },
  {
    id: "amaka-eze",
    name: "Amaka Eze",
    email: "amaka.e@email.com",
    username: "@amakae_films",
    initials: "AE",
    location: "Abuja",
    source: "Application",
    submitted: "1d ago",
    status: "approved",
  },
  {
    id: "raj-patel",
    name: "Raj Patel",
    email: "raj.p@email.com",
    username: "@rajcreates",
    initials: "RP",
    location: "Mumbai",
    source: "Application",
    submitted: "1w ago",
    status: "rejected",
  },
  {
    id: "chioma-obi",
    name: "Chioma Obi",
    email: "chioma.o@email.com",
    username: "@chioma_studio",
    initials: "CO",
    location: "Port Harcourt",
    source: "Application",
    submitted: "3h ago",
    status: "pending",
  },
]

export const MOCK_INVITES: OnboardingInvite[] = [
  {
    id: "invite-fola",
    email: "fola@futurefilms.co",
    status: "sent",
    sentBy: "Admin",
    sent: "1h ago",
  },
  {
    id: "invite-sarah",
    email: "sarah.chen@studio.io",
    status: "accepted",
    sentBy: "Admin",
    sent: "1d ago",
  },
  {
    id: "invite-kwame",
    email: "kwame@shortfilms.gh",
    status: "expired",
    sentBy: "Admin",
    sent: "14d ago",
  },
]
