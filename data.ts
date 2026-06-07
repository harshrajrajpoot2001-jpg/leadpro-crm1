export interface Customer {
  id: string;
  name: string; // Maps to customerName on DB
  company: string;
  email: string;
  phone: string;
  office: string; // Contains address or city
  city?: string; // Explicit city field requested
  leadSource: string;
  status: 'Qualified' | 'New' | 'Contacted' | 'Lost';
  lastFollowUpDate: string;
  lastFollowUpRel: string;
  avatarInitials: string;
  isVip: boolean;
  assignedTo?: string; // Person assigned
  remark?: string; // General remark
  createdAt?: any;
}

export interface FollowUp {
  id: string;
  customerId: string;
  customerName: string;
  phone?: string;
  city?: string;
  status: 'Pending' | 'Completed';
  followUpDate: string; // YYYY-MM-DD
  assignedTo: string; // Email or name of assignee
  remark?: string;
  createdAt?: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'staff';
  createdAt?: any;
}

export interface TimelineActivity {
  id: string;
  customerId: string;
  type: string; // 'discovery_call' | 'proposal' | 'qualification' | 'followup'
  title: string;
  dateTimeStr: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  priority: 'High Priority' | 'Follow-up' | 'General';
  time: string;
  dueDate: 'Today' | 'Week';
  isCompleted: boolean;
  assignees?: string[]; // picture URLs
}

export interface Notification {
  id: string;
  type: 'person_add' | 'paid' | 'warning' | 'task_alt' | 'security' | 'comment' | 'inventory_2';
  title: string;
  message: string;
  timeRel: string;
  category: 'Hot Lead' | 'Revenue' | 'Urgent' | 'Achievement' | 'System' | 'Comment' | 'Security';
  isUnread: boolean;
  replies?: CommentReply[];
  detail?: string;
  avatarSrc?: string;
}

export interface CommentReply {
  id: string;
  author: string;
  timeRel: string;
  text: string;
  avatarSrc?: string;
}

export interface ActivityLog {
  id: string;
  text: string;
  timeRel: string;
  type: 'primary' | 'secondary' | 'tertiary';
}

export interface CallReminder {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  dateTime: string; // ISO date string or combination like YYYY-MM-DD HH:MM
  notes: string;
  status: 'Scheduled' | 'Notified' | 'Snoozed' | 'Dismissed';
}
