
export enum UserRole {
  ADMIN = 'ADMIN',
  DONATOR = 'DONATOR',
  BENEFICIARY = 'BENEFICIARY',
  TRUSTEE = 'TRUSTEE'
}

export interface User {
  id: string;
  name: string; // Display Name (Full Name)
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  title?: string;
  avatar?: string;
  approved: boolean;
  bio?: string;
  cnic?: string;
  cnicFront?: string; // Base64 encoded image
  cnicBack?: string;  // Base64 encoded image
  medicalReport?: string; // Base64 encoded PDF or image
  demands?: string[]; // e.g., ["Rashan", "Medical", "Education"]
}

export interface Program {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  imageUrl: string;
}

export interface Donation {
  id: string;
  userId: string;
  programId: string; // 'GENERAL' for unassigned donations
  amount: number;
  method: 'EasyPaisa' | 'JazzCash' | 'BankTransfer';
  date: string;
  status: 'PENDING' | 'SUCCESSFUL';
  purpose?: string;
}

export interface Expense {
  id: string;
  programId: string;
  userId: string;
  amount: number;
  description: string;
  proofUrl: string;
  date: string;
}

export interface Application {
  id: string;
  userId: string;
  programId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  documents: string[];
  appliedDate: string;
  rejectionReason?: string;
}

export interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
}

export interface TrustAccount {
  id: string;
  label: string; // e.g. EasyPaisa
  num: string;   // Account Number
  name: string;  // Account Title
  icon: string;
  iban?: string;
}

export interface LandingPageContent {
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
  stats: Stat[];
  gallery: GalleryImage[];
  officialAccounts: TrustAccount[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}
