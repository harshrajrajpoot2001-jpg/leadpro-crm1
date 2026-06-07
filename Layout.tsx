import { Customer, Task, Notification, TimelineActivity, ActivityLog } from './types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'as-1',
    name: 'Alex Sterling',
    company: 'Vortex Technologies',
    email: 'alex.s@vortex-tech.com',
    phone: '+1 (555) 348-1124',
    office: 'Seattle, WA, USA',
    leadSource: 'Organic Search',
    status: 'Qualified',
    lastFollowUpDate: '2023-10-24',
    lastFollowUpRel: '2 days ago',
    avatarInitials: 'AS',
    isVip: false
  },
  {
    id: 'mk-2',
    name: 'Maya Kovic',
    company: 'Lunar Systems',
    email: 'm.kovic@lunar-systems.io',
    phone: '+1 (555) 789-3221',
    office: 'Austin, TX, USA',
    leadSource: 'Google Ads',
    status: 'New',
    lastFollowUpDate: '2023-10-26',
    lastFollowUpRel: 'Today',
    avatarInitials: 'MK',
    isVip: false
  },
  {
    id: 'jr-3',
    name: 'Julian Rhodes',
    company: 'Apex Logistics',
    email: 'j.rhodes@apex-logistics.com',
    phone: '+1 (555) 456-9118',
    office: 'Denver, CO, USA',
    leadSource: 'Cold Email',
    status: 'Contacted',
    lastFollowUpDate: '2023-10-19',
    lastFollowUpRel: '1 week ago',
    avatarInitials: 'JR',
    isVip: false
  },
  {
    id: 'sm-4',
    name: 'Sarah Miller',
    company: 'Nebula Co.',
    email: 'sarah@nebula.co',
    phone: '+1 (555) 123-9876',
    office: 'New York, NY, USA',
    leadSource: 'Partner Referral',
    status: 'Lost',
    lastFollowUpDate: '2023-10-12',
    lastFollowUpRel: 'Overdue',
    avatarInitials: 'SM',
    isVip: false
  },
  {
    id: 'js-5',
    name: 'John Smith',
    company: 'Apex Global Logistics Inc.',
    email: 'john.smith@apexlogistics.com',
    phone: '+1 (555) 982-3412',
    office: 'San Francisco, CA, USA',
    leadSource: 'Direct Referral (Q3 Tech Expo)',
    status: 'Qualified',
    lastFollowUpDate: '2023-10-24',
    lastFollowUpRel: '2 days ago',
    avatarInitials: 'JS',
    isVip: true
  },
  {
    id: 'mj-6',
    name: 'Marcus Jenkins',
    company: 'GridSource Energy',
    email: 'mjenkins@gridsource.com',
    phone: '+1 (555) 671-8890',
    office: 'Houston, TX, USA',
    leadSource: 'Webinar Attendee',
    status: 'New',
    lastFollowUpDate: '2023-10-23',
    lastFollowUpRel: '3 days ago',
    avatarInitials: 'MJ',
    isVip: false
  },
  {
    id: 'hc-7',
    name: 'Helena Cross',
    company: 'Spectra Capital',
    email: 'helena@spectracap.com',
    phone: '+1 (555) 234-5678',
    office: 'Boston, MA, USA',
    leadSource: 'LinkedIn Outreach',
    status: 'Contacted',
    lastFollowUpDate: '2023-10-15',
    lastFollowUpRel: '12 days ago',
    avatarInitials: 'HC',
    isVip: true
  }
];

export const INITIAL_TIMELINE: TimelineActivity[] = [
  {
    id: 'tl-1',
    customerId: 'js-5',
    type: 'discovery_call',
    title: 'Discovery Call Completed',
    dateTimeStr: 'Oct 24, 10:30 AM',
    description: 'Discussed initial requirements for the fleet expansion project. Client expressed interest in premium maintenance packages.'
  },
  {
    id: 'tl-2',
    customerId: 'js-5',
    type: 'proposal',
    title: 'Proposal Sent',
    dateTimeStr: 'Oct 20, 02:15 PM',
    description: 'Sent comprehensive PDF proposal for Enterprise Solutions (v2.1).'
  },
  {
    id: 'tl-3',
    customerId: 'js-5',
    type: 'qualification',
    title: 'Lead Qualified',
    dateTimeStr: 'Oct 18, 09:00 AM',
    description: 'Automatically promoted to "Hot Lead" based on engagement score.'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'tsk-1',
    title: 'Client Proposal Review: TechCorp',
    priority: 'High Priority',
    time: '2:30 PM',
    dueDate: 'Today',
    isCompleted: false,
    assignees: [
      'https://lh3.googleusercontent.com/aida/AP1WRLuwQQR_NZ85QYmoUplCiU8fbA-mMe_6Bgjk_sjcRnOonBAyMsdIRLxKc0-TbZoOZn_EatpA1HdRVrlxigqFzwolHaPPf2iQMQMe7CasG8uAKVMkg-iUphhNos0Y01jgqLdC_dmGJincA6lbzd5hrUJOhDkaHeZJfXJzq-iy1B1uyO0v-2you6-HDFUh7o90yXbHdiNuZx3fPlAfSoy8DlqDrt_OCVWeyiy1XVosf9NV9pI1Jz60iGpXXKc'
    ]
  },
  {
    id: 'tsk-2',
    title: 'Follow-up Call: David Brent',
    priority: 'Follow-up',
    time: '4:00 PM',
    dueDate: 'Today',
    isCompleted: false,
    assignees: [
      'https://lh3.googleusercontent.com/aida/AP1WRLuWLciDwwepzf1g2zkYKP0Asek4cbIAN74g5jUahpJhl0CLB8fi693Cl0zxFmMPyH-xU_lQyd9uf2So5DwE4LgMghi1KyYBZXmxY7D7QFosktRB296A2Kt6sP-1h23KutIGZUkhDgzvDnT7lHogNlv_a7zXXYiRf9ctkker9gdElUXLl4B6HHKpfaAYy8hn4HbD7YjSJDHMHR1h-6ETem2bPDBhsAPwoqqMJUF60lvgvMLfg1PMRyuD1m0'
    ]
  },
  {
    id: 'tsk-3',
    title: 'Internal Strategy Meeting',
    priority: 'General',
    time: '5:30 PM',
    dueDate: 'Today',
    isCompleted: false,
    assignees: [
      'https://lh3.googleusercontent.com/aida/AP1WRLvBPM7wd57aWi_7HZzfJF-TQPTXYOPWH2ljwm0LVmzw30Gr9ahd6w9THO-8DyVeRe0HQtd7-n6OVswiHaL7PpLXw6G66s2qfrqiLAFbuRCmM_3_d8hn40wjMsLij-Gl6pcQUj1nMsTTkzIMMZ7T_uQ6WQ2PflZuzDxjbrVk-urFoEcJMMsM_qlZUkzNkIG8fH_B3doocgO9pivZnhkmvVpogmLKqJweD_clCGX7Uk4r3WyGDGd1faP2KLw',
      'https://lh3.googleusercontent.com/aida/AP1WRLvRlFfABCj2BmjPnSmrO23NoVBbOVRRsyMId77E2wcyGSoa89vcHKCGvzyx2LFvf0YNqWawgf4ZImbD0V3AkgCRg3exwrH5x7mzDWAIiaAnJsA3I9RNQhXeRPRLlThIsZpjuGIXuGlafhATn5Y7U8cujg0hB8aE8uZfmh9Qa2q3GS1rZc9kZrInxSReSc0LKK8jHda66R8IczuCqcCNgKE-mCf_WWJ0rnq8KZFCDcvxRXut3XXRybu5Ano'
    ]
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'person_add',
    title: 'New lead assigned',
    message: 'Sarah Jenkins from TechCorp has been assigned to your queue. High-priority lead with $50k potential annual contract value.',
    timeRel: '2 mins ago',
    category: 'Hot Lead',
    isUnread: true
  },
  {
    id: 'notif-2',
    type: 'paid',
    title: 'Deal Closed',
    message: 'Project Aurora secured at $120k.',
    timeRel: '45 mins ago',
    category: 'Revenue',
    isUnread: true
  },
  {
    id: 'notif-3',
    type: 'warning',
    title: 'Follow-up Overdue',
    message: 'Michael Scott (Dunder Mifflin).',
    timeRel: '2 hours ago',
    category: 'Urgent',
    isUnread: true
  },
  {
    id: 'notif-4',
    type: 'task_alt',
    title: 'Team Goal Reached',
    message: '100 leads this week.',
    timeRel: '4 hours ago',
    category: 'Achievement',
    isUnread: false
  },
  {
    id: 'notif-5',
    type: 'comment',
    title: 'Elena Vance mentioned you',
    message: '"@Alex - can you check the budget constraints on the Apex Project lead? They\'re asking for a discount."',
    timeRel: '3 hours ago',
    category: 'Comment',
    isUnread: true,
    avatarSrc: 'https://lh3.googleusercontent.com/aida/AP1WRLvr8pLRwEayxbcniPs2cfToO1BgCsAo75xRnND-YFGCS8N25JhSduN8ipEGPxMbwA9hUX0Oeg1fmWyeCxrg9Z80Czp-UqBRwNdNRakFFxP0Iz5aB0hyctt-vXZsWoo1U5MNOYcZu9xAWJ6t-KOZQEh_QDVCLnXlR-MZaeJqq84SkYxRN9Lx5hbp9JPXAqiXVWyo3hd04lN4u9liTAAnJd9gCUK42mq26J__xz1QxkVHPDivoYQXe4rwAZ8',
    replies: []
  },
  {
    id: 'notif-6',
    type: 'security',
    title: 'Unusual login detected',
    message: 'A login was detected from a new device in London, UK. If this wasn\'t you, please secure your account immediately.',
    timeRel: '5 hours ago',
    category: 'Security',
    isUnread: true
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    text: 'Updated Vortex Tech status to Qualified',
    timeRel: '10 minutes ago',
    type: 'primary'
  },
  {
    id: 'log-2',
    text: 'Exported full directory (CSV)',
    timeRel: '2 hours ago',
    type: 'secondary'
  },
  {
    id: 'log-3',
    text: 'New lead assigned: Sarah Miller',
    timeRel: '5 hours ago',
    type: 'tertiary'
  }
];
