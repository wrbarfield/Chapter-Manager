
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  roadName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  membershipNo: string;
  joinDate: string;
  photo?: string; // Base64 string for member photo
  // year -> monthIndex (0-11) -> attended
  attendance: Record<number, Record<number, boolean>>;
}

export type AppTab = 'dashboard' | 'members' | 'attendance' | 'settings';

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
