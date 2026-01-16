
import { UserRole, Program, User, Donation, Expense, Application, LandingPageContent } from '../types';

export const INITIAL_USERS: User[] = [
  { 
    id: '1', 
    name: 'Abdul Ghaffar', 
    email: 'ghaffar@trust.org', 
    phone: '+92 300 1112223', 
    role: UserRole.ADMIN, 
    title: 'Chairman',
    approved: true, 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    bio: 'Chairman of Albadar Trust. Leading our strategic vision to provide transparent welfare services across the nation.'
  },
  { 
    id: 'admin-2', 
    name: 'Hayatullah', 
    email: 'hayat@trust.org', 
    phone: '+92 300 4445556', 
    role: UserRole.ADMIN, 
    title: 'Vice Chairman',
    approved: true, 
    avatar: 'https://i.pravatar.cc/150?u=hayat',
    bio: 'Vice Chairman overseeing regional operations and trust outreach programs.'
  },
  { 
    id: 'admin-3', 
    name: 'Rahmatullah', 
    email: 'rahmat@trust.org', 
    phone: '+92 300 7778889', 
    role: UserRole.ADMIN, 
    title: 'Director',
    approved: true, 
    avatar: 'https://i.pravatar.cc/150?u=rahmat',
    bio: 'Director of Operations. Responsible for the execution of field projects and emergency relief.'
  },
  { 
    id: 'admin-4', 
    name: 'Abdul Malik', 
    email: 'malik@trust.org', 
    phone: '+92 300 9990001', 
    role: UserRole.ADMIN, 
    title: 'Deputy Director',
    approved: true, 
    avatar: 'https://i.pravatar.cc/150?u=malik',
    bio: 'Deputy Director assisting in the coordination of medical and educational platforms.'
  },
  { 
    id: '3', 
    name: 'Ali Ahmed', 
    email: 'ali@gmail.com', 
    phone: '+92 321 5556667', 
    role: UserRole.DONATOR, 
    approved: true, 
    avatar: 'https://picsum.photos/seed/ali/200' 
  },
  { 
    id: '4', 
    name: 'Saima Bano', 
    email: 'saima@gmail.com', 
    phone: '+92 345 4443332', 
    role: UserRole.BENEFICIARY, 
    approved: false, 
    avatar: 'https://picsum.photos/seed/saima/200' 
  },

  // Leadership Group (Trustees/Board)
  { id: 't1', name: 'M. Ibrahim', email: 'ibrahim@trust.org', role: UserRole.TRUSTEE, title: 'Member', approved: true, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 't5', name: 'Bilal Siddiqui', email: 'bilal@trust.org', role: UserRole.TRUSTEE, title: 'Accountant', approved: true, avatar: 'https://i.pravatar.cc/150?u=5' },
  { id: 't6', name: 'Maryam Nawaz', email: 'maryam@trust.org', role: UserRole.TRUSTEE, title: 'Media Coordinator', approved: true, avatar: 'https://i.pravatar.cc/150?u=6' },
  { id: 't7', name: 'Barrister Asad', email: 'asad@trust.org', role: UserRole.TRUSTEE, title: 'Lawyer', approved: true, avatar: 'https://i.pravatar.cc/150?u=7' }
];

export const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'p1',
    title: 'Winter Blanket Drive',
    description: 'Providing warm blankets to families in remote northern regions.',
    goal: 500000,
    raised: 325000,
    category: 'Relief',
    status: 'ACTIVE',
    imageUrl: 'https://picsum.photos/seed/winter/600/400'
  },
  {
    id: 'p2',
    title: 'Education for All',
    description: 'Scholarships for deserving students in underprivileged schools.',
    goal: 1000000,
    raised: 450000,
    category: 'Education',
    status: 'ACTIVE',
    imageUrl: 'https://picsum.photos/seed/edu/600/400'
  },
  {
    id: 'p3',
    title: 'Clean Water Project',
    description: 'Installing solar-powered water pumps in drought-hit villages.',
    goal: 2000000,
    raised: 2000000,
    category: 'Infrastructure',
    status: 'COMPLETED',
    imageUrl: 'https://picsum.photos/seed/water/600/400'
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  { id: 'd1', userId: '3', programId: 'p1', amount: 5000, method: 'EasyPaisa', date: '2023-10-01', status: 'SUCCESSFUL' },
  { id: 'd2', userId: '3', programId: 'p2', amount: 10000, method: 'BankTransfer', date: '2023-11-15', status: 'SUCCESSFUL' },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'e1', programId: 'p1', userId: '1', amount: 50000, description: 'Bought 200 blankets', proofUrl: 'https://picsum.photos/seed/receipt/400/600', date: '2023-10-10' }
];

export const INITIAL_APPLICATIONS: Application[] = [
  { id: 'a1', userId: '4', programId: 'p2', status: 'PENDING', documents: ['doc1.pdf'], appliedDate: '2023-12-01' }
];

export const INITIAL_LANDING_CONTENT: LandingPageContent = {
  logoUrl: '',
  heroTitle: "Transforming Lives Through Pure Compassion.",
  heroSubtitle: "Albadar Welfare Trust is dedicated to uplifting underserved communities across Pakistan through sustainable education, healthcare, and humanitarian relief projects.",
  aboutTitle: "Decades of Unwavering Commitment.",
  aboutDescription: "Founded on the principles of Islamic humanitarianism, Albadar Welfare Trust has grown from a local initiative to a nationwide force for good. We believe transparency is the soul of charity.",
  stats: [
    { id: 's1', label: 'Families Helped', value: '15,000+', icon: 'fa-people-group', color: 'text-emerald-600' },
    { id: 's2', label: 'Meals Served', value: '500,000+', icon: 'fa-bowl-food', color: 'text-rose-600' },
    { id: 's3', label: 'Schools Built', value: '12', icon: 'fa-school', color: 'text-blue-600' },
    { id: 's4', label: 'Clean Water Pumps', value: '150+', icon: 'fa-faucet-drip', color: 'text-amber-600' },
  ],
  gallery: [
    { id: 'g1', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600', title: 'Food Distribution' },
    { id: 'g2', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600', title: 'Education Support' },
    { id: 'g3', url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=600', title: 'Medical Camp' },
    { id: 'g4', url: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&q=80&w=600', title: 'Water Well Project' },
    { id: 'g5', url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=600', title: 'Crisis Relief' },
    { id: 'g6', url: 'https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&q=80&w=600', title: 'Shelter Building' },
  ],
  officialAccounts: [
    { id: 'acc1', label: 'EasyPaisa', num: '0300-1234567', name: 'Albadar Trust', icon: 'fa-wallet' },
    { id: 'acc2', label: 'JazzCash', num: '0311-7654321', name: 'Albadar Trust', icon: 'fa-money-bill-transfer' },
    { id: 'acc3', label: 'Meezan Bank', num: '01020304050607', name: 'Albadar Trust', icon: 'fa-bank', iban: 'PK00MEZN01020304050607' }
  ],
  contactEmail: "info@albadarwelfare.org",
  contactPhone: "+92 21 3456 7890",
  contactAddress: "Plot 12-C, 4th Lane, DHA Phase 6, Karachi, Pakistan"
};
