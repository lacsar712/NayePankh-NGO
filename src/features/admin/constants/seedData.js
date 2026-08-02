// Logic: default seed data shown before Firestore/localStorage loads.
export const DEFAULT_USERS = [
  { id: 'usr-1', name: 'Amit Kumar', email: 'amit@gmail.com', role: 'user' },
  { id: 'usr-2', name: 'Priya Sharma', email: 'priya@nayepankh.org', role: 'admin' },
  { id: 'usr-3', name: 'Rahul Varma', email: 'rahul@gmail.com', role: 'volunteer' },
  { id: 'usr-4', name: 'Sneha Patel', email: 'sneha@nayepankh.org', role: 'admin' },
];

export const DEFAULT_VOLUNTEERS = [
  { id: 'vol-1', name: 'Ramesh Singh', email: 'ramesh@gmail.com', phone: '9876543210', city: 'Noida', program: 'Education', status: 'pending' },
  { id: 'vol-2', name: 'Anjali Gupta', email: 'anjali@gmail.com', phone: '9123456789', city: 'Delhi', program: 'Healthcare', status: 'approved' },
  { id: 'vol-3', name: 'Vikram Rao', email: 'vikram@gmail.com', phone: '8877665544', city: 'Mumbai', program: 'Livelihood', status: 'pending' },
];

export const DEFAULT_EVENTS = [
  { id: 'cloth-drive', title: 'Noida Winter Clothes & Blanket Drive', date: '2026-12-20', location: 'Sector 62 Community Center, Noida', image: '/winter-camp.jpg', status: 'upcoming' },
  { id: 'health-camp', title: 'Project Swasthya Free Medical Health Camp', date: '2027-01-10', location: 'Government High School, Chhalera, UP', image: '/medical-camp.jpg', status: 'upcoming' },
  { id: 'career-fair', title: 'Swabalamban Youth Skill & Career Fair', date: '2027-02-15', location: 'Youth Center, Sector 15, Noida', image: '/career-fair.jpg', status: 'upcoming' },
];

export const DEFAULT_DONATIONS = [
  { id: 'don-1', donor: 'Suresh Raina', email: 'suresh@gmail.com', amount: 1500, frequency: 'one-time', method: 'UPI', date: '2026-06-12' },
  { id: 'don-2', donor: 'Meera Das', email: 'meera@gmail.com', amount: 3000, frequency: 'monthly', method: 'Card', date: '2026-06-11' },
  { id: 'don-3', donor: 'Karan Johar', email: 'karan@gmail.com', amount: 500, frequency: 'one-time', method: 'Netbanking', date: '2026-06-10' },
  { id: 'don-4', donor: 'Rohit Sharma', email: 'rohit@gmail.com', amount: 6000, frequency: 'one-time', method: 'UPI', date: '2026-06-09' },
];

export const EMPTY_NEW_EVENT = {
  title: '',
  date: '',
  location: '',
  desc: '',
  type: 'Drive Campaign',
  rawType: 'drive',
  image: '',
  status: 'upcoming',
};
