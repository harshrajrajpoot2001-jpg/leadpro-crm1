import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  UserPlus,
  DollarSign,
  AlertCircle,
  Percent,
  Calendar,
  Download,
  Check,
  Clock,
  BellRing,
  CheckSquare,
  Sparkles,
  BarChart2,
  PieChart as LucidePieChart,
  Search,
  X
} from 'lucide-react';
import { Customer, Task, Notification, ActivityLog, FollowUp } from '../types';

interface DashboardProps {
  customers: Customer[];
  followUps: FollowUp[];
  onToggleFollowUp: (id: string) => void;
  onAddFollowUp?: (followup: Partial<FollowUp>) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  activityLogs: ActivityLog[];
  onSelectCustomer: (id: string) => void;
  setCurrentTab: (tab: string) => void;
  userRole: 'admin' | 'staff';
}

export default function Dashboard({
  customers,
  followUps,
  onToggleFollowUp,
  onAddFollowUp,
  tasks,
  setTasks,
  notifications,
  setNotifications,
  activityLogs,
  onSelectCustomer,
  setCurrentTab,
  userRole
}: DashboardProps) {
  const [taskFilter, setTaskFilter] = useState<'Today' | 'Week'>('Today');
  const [selectedBar, setSelectedBar] = useState<string | null>('12pm');
  const [newFollowUpName, setNewFollowUpName] = useState('');
  const [newFollowUpDate, setNewFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [newFollowUpRemark, setNewFollowUpRemark] = useState('');
  const [newFollowUpCust, setNewFollowUpCust] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date());

  const getDaysInMonthCalendar = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] = [];
    
    // Previous Month padding days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevDay = prevMonthTotalDays - i;
      const prevMonthIdx = month === 0 ? 11 : month - 1;
      const prevYearVal = month === 0 ? year - 1 : year;
      const dateStr = `${prevYearVal}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: prevDay,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Current Month days
    const todayStr = new Date().toISOString().split('T')[0];
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr
      });
    }
    
    // Trailing padding days
    const remaining = 42 - days.length;
    for (let n = 1; n <= remaining; n++) {
      const nextMonthIdx = month === 11 ? 0 : month + 1;
      const nextYearVal = month === 11 ? year + 1 : year;
      const dateStr = `${nextYearVal}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: n,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return days;
  };

  // Search & Date Filter Slicer State declarations
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const unreadNotifications = notifications.filter(n => n.isUnread);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  // 1. Centralized filtering logic for Customers based on search & date inputs
  const filteredCustomers = customers.filter(c => {
    // A. Apply Search Filter across multiple attributes
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchName = c.name?.toLowerCase().includes(query);
      const matchCompany = c.company?.toLowerCase().includes(query);
      const matchEmail = c.email?.toLowerCase().includes(query);
      const matchSource = c.leadSource?.toLowerCase().includes(query);
      const matchOffice = c.office?.toLowerCase().includes(query);
      const matchStatus = c.status?.toLowerCase().includes(query);
      
      if (!matchName && !matchCompany && !matchEmail && !matchSource && !matchOffice && !matchStatus) {
        return false;
      }
    }

    // B. Apply Date Slicer Filter based on lead registration / tracking date
    if (c.lastFollowUpDate) {
      if (startDate && c.lastFollowUpDate < startDate) return false;
      if (endDate && c.lastFollowUpDate > endDate) return false;
    }

    return true;
  });

  // 2. Centralized filtering logic for Follow-ups based on slicers
  const filteredFollowUps = followUps.filter(f => {
    // A. Apply Search Filter across follow-ups
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchName = f.customerName?.toLowerCase().includes(query);
      const matchRemark = f.remark?.toLowerCase().includes(query);
      const matchStatus = f.status?.toLowerCase().includes(query);
      if (!matchName && !matchRemark && !matchStatus) return false;
    }

    // B. Apply Date range constraint
    if (f.followUpDate) {
      if (startDate && f.followUpDate < startDate) return false;
      if (endDate && f.followUpDate > endDate) return false;
    }

    return true;
  });

  // Calculate dynamic stats corresponding to filtered sets
  const totalLeadsCount = filteredCustomers.length;
  const pendingFollowUpsCount = filteredFollowUps.filter(f => f.status === 'Pending').length;

  const statusStats = {
    New: filteredCustomers.filter(c => c.status === 'New').length,
    Contacted: filteredCustomers.filter(c => c.status === 'Contacted').length,
    Qualified: filteredCustomers.filter(c => c.status === 'Qualified').length,
    Lost: filteredCustomers.filter(c => c.status === 'Lost').length,
  };

  // Interested Leads metric corresponding to active engagements (Qualified or Contacted)
  const interestedLeadsCount = statusStats.Qualified + statusStats.Contacted;

  // Quick Preset Handlers for dashboard date range slicer
  const handleQuickPreset = (type: 'all' | 'this-month' | 'last-30' | 'last-90') => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (type === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (type === 'this-month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(firstDay.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (type === 'last-30') {
      const priorDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      setStartDate(priorDate.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (type === 'last-90') {
      const priorDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
      setStartDate(priorDate.toISOString().split('T')[0]);
      setEndDate(todayStr);
    }
  };

  // Export filtered rows to downloadable CSV format (Excel compatible)
  const handleExportToExcel = () => {
    const headers = [
      "Lead_ID", "Client_Name", "Company", "Email", "Phone", "Office_Location", 
      "Lead_Source", "Status", "Last_Followup_Date", "Is_VIP", "Assigned_To", "Remark"
    ];

    const csvRows = [
      headers.join(","),
      ...filteredCustomers.map(c => [
        `"${(c.id || "").replace(/"/g, '""')}"`,
        `"${(c.name || "").replace(/"/g, '""')}"`,
        `"${(c.company || "").replace(/"/g, '""')}"`,
        `"${(c.email || "").replace(/"/g, '""')}"`,
        `"${(c.phone || "").replace(/"/g, '""')}"`,
        `"${((c.office || c.city) || "").replace(/"/g, '""')}"`,
        `"${(c.leadSource || "").replace(/"/g, '""')}"`,
        `"${(c.status || "").replace(/"/g, '""')}"`,
        `"${(c.lastFollowUpDate || "").replace(/"/g, '""')}"`,
        `"${c.isVip ? "Yes" : "No"}"`,
        `"${(c.assignedTo || "").replace(/"/g, '""')}"`,
        `"${(c.remark || "").replace(/"/g, '""')}"`
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leadpro_dashboard_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateDashboardFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFollowUpName || !newFollowUpCust) {
      alert("Please select or enter a mock Customer Name");
      return;
    }
    if (onAddFollowUp) {
      onAddFollowUp({
        customerName: newFollowUpName,
        customerId: newFollowUpCust || `cust-${Date.now()}`,
        followUpDate: newFollowUpDate,
        remark: newFollowUpRemark,
        status: 'Pending',
        assignedTo: userRole === 'admin' ? 'admin@company.com' : 'staff@company.com'
      });
      setNewFollowUpName('');
      setNewFollowUpRemark('');
    }
  };

  // Filter follow-ups by Today vs Week based on the filtered task range
  const todayStr = new Date().toISOString().split('T')[0];
  const activeFollowUps = filteredFollowUps.filter(f => {
    if (taskFilter === 'Today') {
      return f.followUpDate === todayStr;
    } else {
      const fDate = new Date(f.followUpDate);
      const today = new Date(todayStr);
      const diffTime = fDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= -1 && diffDays <= 7;
    }
  });

  // A. Today's Follow-up chart details
  const barChartData = [
    { time: '8am', value: statusStats.New * 3 + 2, displayVal: `${statusStats.New * 3 + 2} Enquiries`, height: 'h-[35%]' },
    { time: '10am', value: statusStats.Contacted * 2 + 5, displayVal: `${statusStats.Contacted * 2 + 5} Follow-ups`, height: 'h-[60%]' },
    { time: '12pm', value: statusStats.Qualified * 4 + 8, displayVal: `${statusStats.Qualified * 4 + 8} Actions`, height: 'h-[90%]', highlighted: true },
    { time: '2pm', value: statusStats.Lost * 1 + 3, displayVal: `${statusStats.Lost * 1 + 3} Reschedules`, height: 'h-[45%]' },
    { time: '4pm', value: pendingFollowUpsCount + 6, displayVal: `${pendingFollowUpsCount + 6} Syncs`, height: 'h-[75%]' },
  ];

  // B. Monthly Leads intake chart data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyLeadsData = months.map(m => ({ month: m, count: 0 }));

  filteredCustomers.forEach(c => {
    if (c.lastFollowUpDate) {
      const parts = c.lastFollowUpDate.split('-');
      if (parts.length >= 2) {
        const monthIdx = parseInt(parts[1], 10) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
          monthlyLeadsData[monthIdx].count++;
        }
      }
    }
  });

  const maxMonthlyCount = Math.max(...monthlyLeadsData.map(d => d.count), 1);

  // C. Dynamic circular donut/pie segment slice values for Lead Status
  const statusSegmentsData = [
    { label: "New", count: statusStats.New, color: "#4ade80" },
    { label: "Contacted", count: statusStats.Contacted, color: "#ffb786" },
    { label: "Qualified", count: statusStats.Qualified, color: "#4d8eff" },
    { label: "Lost", count: statusStats.Lost, color: "#fb7185" }
  ];

  const totalLeadsForDonut = Math.max(statusSegmentsData.reduce((sum, v) => sum + v.count, 0), 1);
  let currentOffset = 0;
  const donutSegments = statusSegmentsData.map(v => {
    const percentage = v.count / totalLeadsForDonut;
    const length = percentage * 251.2;
    const offset = 251.2 - currentOffset;
    currentOffset += length;
    return {
      ...v,
      percentage: Math.round(percentage * 100),
      offset,
      length
    };
  });

  return (
    <div className="space-y-8 select-none">
      {/* Content Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#d4e4fa] tracking-tight">CRM Analytics Dashboard</h2>
          <p className="text-sm text-[#c2c6d6] mt-1">
            Welcome back, LeadPro {userRole === 'admin' ? 'Admin' : 'Team member'}. Live connected with responsive Firestore pipeline.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <div className="bg-[#122131] px-4 py-2 rounded-lg border border-[#424754]/80 flex items-center gap-3 text-sm font-semibold text-[#d4e4fa]">
            <Calendar className="w-4 h-4 text-[#adc6ff]" />
            <span>Today's Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Date Filter Slicer & Search Controls Panel */}
      <div className="bg-[#122131]/95 border border-[#424754]/75 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input Filter */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-[#8c909f]" />
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-8 py-2.5 bg-[#0d1c2d] border border-[#424754]/80 text-[#d4e4fa] text-xs font-semibold rounded-xl focus:border-[#4d8eff] focus:outline-none transition-colors"
            placeholder="Search leads by name, company, email, status, source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 group cursor-pointer"
            >
              <X className="h-4 w-4 text-[#8c909f] group-hover:text-white transition-colors" />
            </button>
          )}
        </div>

        {/* Date Filter Slicers & Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#0d1c2d] border border-[#424754]/80 px-2.5 py-1.5 rounded-xl">
            <span className="text-[10px] font-extrabold text-[#8c909f] tracking-wider uppercase pr-1">From:</span>
            <input
              type="date"
              style={{ colorScheme: 'dark' }}
              className="bg-transparent border-none text-[#d4e4fa] text-xs outline-none cursor-pointer focus:ring-0"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#0d1c2d] border border-[#424754]/80 px-2.5 py-1.5 rounded-xl">
            <span className="text-[10px] font-extrabold text-[#8c909f] tracking-wider uppercase pr-1">To:</span>
            <input
              type="date"
              style={{ colorScheme: 'dark' }}
              className="bg-transparent border-none text-[#d4e4fa] text-xs outline-none cursor-pointer focus:ring-0"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex gap-0.5 bg-[#0d1c2d] p-0.5 border border-[#424754]/65 rounded-xl text-[9px] font-bold">
            <button
              onClick={() => handleQuickPreset('all')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${!startDate && !endDate ? 'bg-[#3e495d] text-[#adc6ff]' : 'text-[#8c909f] hover:text-[#d4e4fa]'}`}
            >
              ALL
            </button>
            <button
              onClick={() => handleQuickPreset('this-month')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${startDate && endDate ? 'bg-[#3e495d] text-[#adc6ff]' : 'text-[#8c909f] hover:text-[#d4e4fa]'}`}
            >
              MTD
            </button>
            <button
              onClick={() => handleQuickPreset('last-30')}
              className="px-2 py-1 rounded-lg transition-all text-[#8c909f] hover:text-[#d4e4fa] cursor-pointer"
            >
              30D
            </button>
          </div>

          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 bg-[#adc6ff] hover:bg-[#99b7ff] text-[#0c1c2b] px-4.5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-colors cursor-pointer"
            title="Download CSV report representing filtered lead lists"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to Excel</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads KPI */}
        <div 
          onClick={() => setCurrentTab('customers')}
          className="bg-[#122131]/80 border border-[#424754]/50 hover:border-[#adc6ff]/60 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 cursor-pointer group shadow-lg"
        >
          <div className="flex justify-between items-start">
            <div className="bg-[#adc6ff]/10 p-2.5 rounded-xl text-[#adc6ff]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[#4ade80] text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+15%</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-[#8c909f] uppercase tracking-wider">Total Leads</p>
            <h3 className="text-3xl font-extrabold text-[#d4e4fa] mt-1 transition-colors group-hover:text-[#adc6ff]">{totalLeadsCount}</h3>
          </div>
          <div className="mt-4 h-1.5 bg-[#273647] rounded-full overflow-hidden">
            <div className="h-full bg-[#adc6ff] w-[80%] rounded-full"></div>
          </div>
        </div>

        {/* Interested Leads KPI */}
        <div className="bg-[#122131]/80 border border-[#424754]/50 hover:border-[#ffb786]/60 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-lg cursor-pointer group">
          <div className="flex justify-between items-start">
            <div className="bg-[#ffb786]/10 p-2.5 rounded-xl text-[#ffb786]">
              <LucidePieChart className="w-5 h-5" />
            </div>
            <div className="text-[#a855f7] text-[10px] font-bold uppercase tracking-wider bg-[#a855f7]/10 px-1.5 py-0.5 rounded border border-[#a855f7]/20">
              ENGAGED
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-[#8c909f] uppercase tracking-wider">Interested Leads</p>
            <h3 className="text-3xl font-extrabold text-[#d4e4fa] mt-1 transition-colors group-hover:text-[#ffb786]">{interestedLeadsCount}</h3>
          </div>
          <div className="mt-4 h-1.5 bg-[#273647] rounded-full overflow-hidden">
            <div className="h-full bg-[#ffb786] w-[65%] rounded-full"></div>
          </div>
        </div>

        {/* Pending Follow-ups KPI (Directly from CRM database) */}
        <div className="bg-[#122131]/80 border border-red-500/20 hover:border-red-500/40 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-lg cursor-pointer">
          <div className="flex justify-between items-start">
            <div className="bg-red-500/10 p-2.5 rounded-xl text-red-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-red-400 text-[10px] font-bold uppercase py-0.5 px-1.5 bg-red-500/10 border border-red-500/20 rounded animate-pulse">
              <span>ACTIVE</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Pending Follow-ups</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{pendingFollowUpsCount}</h3>
          </div>
          <div className="mt-4 h-1.5 bg-[#273647] rounded-full overflow-hidden">
            <div className="h-full bg-red-400 w-[55%] rounded-full"></div>
          </div>
        </div>

        {/* Conversion Rate KPI */}
        <div className="bg-[#122131]/80 border border-[#424754]/50 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="bg-[#bcc7de]/10 p-2.5 rounded-xl text-[#bcc7de]">
              <Percent className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[#4ade80] text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3.1%</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-[#8c909f] uppercase tracking-wider">Conversion Rate</p>
            <h3 className="text-3xl font-extrabold text-[#d4e4fa] mt-1">
              {totalLeadsCount > 0 ? Math.round((statusStats.Qualified / totalLeadsCount) * 100) : 24}%
            </h3>
          </div>
          <div className="mt-4 h-1.5 bg-[#273647] rounded-full overflow-hidden">
            <div className="h-full bg-[#bcc7de] w-[28%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Live Status Cards (Summary Indicators) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-green-400/80 tracking-wider">New Leads</p>
            <p className="text-2xl font-extrabold text-white mt-1">{statusStats.New}</p>
          </div>
          <span className="text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">Cold</span>
        </div>
        <div className="bg-[#df7412]/5 border border-[#df7412]/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#ffb786] tracking-wider">Contacted</p>
            <p className="text-2xl font-extrabold text-white mt-1">{statusStats.Contacted}</p>
          </div>
          <span className="text-xs font-semibold bg-[#df7412]/10 text-[#ffb786] border border-[#df7412]/20 px-2 py-0.5 rounded">Warm</span>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Qualified</p>
            <p className="text-2xl font-extrabold text-white mt-1">{statusStats.Qualified}</p>
          </div>
          <span className="text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">Hot</span>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">Lost / Dead</p>
            <p className="text-2xl font-extrabold text-white mt-1">{statusStats.Lost}</p>
          </div>
          <span className="text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded">Closed</span>
        </div>
      </div>

      {/* Corporate Power BI Style Charts Grid - Hourly Capacity, Monthly Registrations, Lead Status Share */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* 1. Today's Follow-up Bar Chart */}
        <div className="bg-[#122131]/80 border border-[#424754]/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-[#d4e4fa] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#adc6ff]" />
              <span>Today's Follow-up Trend</span>
            </h3>
            <span className="text-[9px] bg-[#3e495d] text-[#adc6ff] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Hourly Capacity</span>
          </div>

          <div className="relative h-[220px] flex items-end justify-between px-1 pb-2 border-b border-[#424754]/40 gap-2">
            {barChartData.map((bar) => {
              const isSelected = selectedBar === bar.time;
              return (
                <div
                  key={bar.time}
                  onClick={() => setSelectedBar(bar.time)}
                  className="flex-1 flex flex-col justify-end items-center gap-2 group h-full cursor-pointer animate-fade-in"
                >
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 relative ${
                      isSelected
                        ? 'bg-[#4d8eff] shadow-lg shadow-[#4d8eff]/30'
                        : bar.highlighted
                        ? 'bg-[#4d8eff]'
                        : 'bg-[#4d8eff]/20 group-hover:bg-[#4d8eff]/40'
                    } ${bar.height}`}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1c2b3c] text-[#d4e4fa] border border-[#adc6ff]/30 px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-xl transition-all z-10 duration-200 ${
                        isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100'
                      }`}
                    >
                      {bar.displayVal}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold cursor-pointer ${
                      isSelected ? 'text-[#adc6ff] font-bold' : 'text-[#c2c6d6] group-hover:text-[#d4e4fa]'
                    }`}
                  >
                    {bar.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Monthly Leads Intake Bar Chart */}
        <div className="bg-[#122131]/80 border border-[#424754]/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-[#d4e4fa] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#ffb786]" />
              <span>Monthly Leads Intake</span>
            </h3>
            <span className="text-[9px] bg-[#3e495d] text-[#ffb786] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Historical Trend</span>
          </div>

          <div className="relative h-[220px] flex items-end justify-between px-1 pb-2 border-b border-[#424754]/40 gap-1">
            {monthlyLeadsData.map((item) => {
              const heightPercent = maxMonthlyCount > 0 ? (item.count / maxMonthlyCount) * 100 : 0;
              return (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col justify-end items-center gap-2 group h-full cursor-pointer"
                >
                  <div className="relative w-full flex justify-center items-end h-full">
                    <div
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      className={`w-full max-w-[14px] rounded-t-sm transition-all duration-300 relative ${
                        item.count > 0 
                          ? 'bg-[#ffb786] shadow-md shadow-[#ffb786]/20' 
                          : 'bg-[#ffb786]/15 group-hover:bg-[#ffb786]/30'
                      }`}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1c2b3c] text-[#d4e4fa] border border-[#ffb786]/40 px-2 py-1 rounded text-[9px] font-bold whitespace-nowrap opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all z-10 shadow-lg">
                        {item.count} Leads
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-[#c2c6d6] group-hover:text-[#d4e4fa]">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Lead Status Pie/Donut Chart */}
        <div className="bg-[#122131]/80 border border-[#424754]/50 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-base font-bold text-[#d4e4fa] flex items-center gap-2">
              <LucidePieChart className="w-5 h-5 text-[#4ade80]" />
              <span>Lead Status Share</span>
            </h3>
            <span className="text-[9px] bg-[#3e495d] text-[#4ade80] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Status Slice</span>
          </div>

          <div className="flex flex-col items-center justify-center py-2 flex-1">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90 absolute" viewBox="0 0 100 100">
                {donutSegments.map((seg, idx) => (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth="11"
                    strokeDasharray="251.2"
                    strokeDashoffset={seg.offset}
                    className="origin-center transition-all duration-300 ease-out hover:stroke-[13px] cursor-pointer"
                    title={`${seg.label}: ${seg.count}`}
                  />
                ))}
              </svg>

              <div className="text-center z-10">
                <span className="text-2xl font-extrabold text-[#d4e4fa]">{totalLeadsCount}</span>
                <p className="text-[9px] uppercase font-bold text-[#c2c6d6] tracking-wider mt-0.5">Total</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] pt-3 border-t border-[#424754]/40 font-semibold">
            {donutSegments.map((seg, idx) => (
              <div key={idx} className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }}></span>
                  <span className="text-[#c2c6d6] truncate">{seg.label}</span>
                </div>
                <span className="text-[#d4e4fa] pl-1 font-bold">{seg.count} ({seg.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-ups Widget & Upcoming Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Today's Follow-up Active Dashboard (Requirement 2 & 3) */}
        <div className="bg-[#122131]/80 border border-[#424754]/50 rounded-2xl lg:col-span-8 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#424754] flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-[#0d1c2d] gap-3">
            <h3 className="font-bold text-[#d4e4fa] flex items-center gap-2.5">
              <CheckSquare className="w-5 h-5 text-[#ffb786]" />
              <span>Interactive Follow-up Calendar & Tasks</span>
            </h3>
            
            <div className="flex flex-wrap gap-2 items-center">
              {/* Slicers for standard List and Calendar layout toggles */}
              <div className="flex bg-[#122131] p-0.5 rounded-lg border border-[#424754] text-xs font-bold">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                    viewMode === 'list' ? 'bg-[#3e495d] text-[#adc6ff]' : 'text-[#8c909f] hover:text-[#d4e4fa]'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                    viewMode === 'calendar' ? 'bg-[#3e495d] text-[#adc6ff]' : 'text-[#8c909f] hover:text-[#d4e4fa]'
                  }`}
                >
                  Month Calendar
                </button>
              </div>

              {viewMode === 'list' && (
                <div className="flex bg-[#122131] p-0.5 rounded-lg border border-[#424754] text-xs font-bold">
                  <button
                    onClick={() => setTaskFilter('Today')}
                    className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                      taskFilter === 'Today' ? 'bg-[#3e495d] text-[#adc6ff]' : 'text-[#8c909f] hover:text-[#d4e4fa]'
                    }`}
                  >
                    Today Only
                  </button>
                  <button
                    onClick={() => setTaskFilter('Week')}
                    className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                      taskFilter === 'Week' ? 'bg-[#3e495d] text-[#adc6ff]' : 'text-[#8c909f] hover:text-[#d4e4fa]'
                    }`}
                  >
                    Weekly View
                  </button>
                </div>
              )}
            </div>
          </div>


          {viewMode === 'calendar' ? (
            <div className="p-4 bg-[#0d1c2d] animate-fade-in flex flex-col justify-between">
              {/* Calendar Month Header Controller */}
              <div className="flex items-center justify-between pb-4 border-b border-[#424754]/40 mb-4 gap-2">
                <button
                  type="button"
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                  className="px-3 py-1.5 bg-[#122131] hover:bg-[#1c2b3c] hover:text-white border border-[#424754] rounded-lg text-xs font-bold text-[#adc6ff] transition-all cursor-pointer"
                >
                  &larr; Prev Month
                </button>
                <div className="text-xs font-black text-white px-4 py-1.5 bg-[#122131] rounded-xl border border-[#424754] text-center tracking-tight shrink-0 uppercase tracking-widest font-mono">
                  📅 {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <button
                  type="button"
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                  className="px-3 py-1.5 bg-[#122131] hover:bg-[#1c2b3c] hover:text-white border border-[#424754] rounded-lg text-xs font-bold text-[#adc6ff] transition-all cursor-pointer"
                >
                  Next Month &rarr;
                </button>
              </div>

              {/* Day Headers (Sun-Sat) */}
              <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-[10px] text-[#8c909f] tracking-wider uppercase mb-1.5">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Grid block */}
              <div className="grid grid-cols-7 gap-1 bg-[#122131]/20 p-1.5 rounded-2xl border border-[#424754]/30">
                {getDaysInMonthCalendar(calendarDate).map((cell, idx) => {
                  const cellFollowUps = followUps.filter(f => f.followUpDate === cell.dateStr);
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setNewFollowUpDate(cell.dateStr);
                        alert(`Date selected: ${cell.dateStr}.\nscheduled focus set inside the 'Quick Followup Scheduler' form on your right.`);
                      }}
                      className={`min-h-[85px] p-2 transition-all flex flex-col justify-between border cursor-pointer group rounded-xl ${
                        cell.isCurrentMonth 
                          ? 'bg-[#122131]/60 hover:bg-[#1c2b3c]/80 text-[#d4e4fa]' 
                          : 'bg-[#122131]/15 text-[#8c909f] opacity-35 hover:opacity-50'
                      } ${
                        cell.isToday 
                          ? 'border-[#adc6ff] bg-[#adc6ff]/5 relative ring-1 ring-[#adc6ff]/20' 
                          : 'border-[#424754]/30 hover:border-[#adc6ff]/30'
                      }`}
                    >
                      {/* Cell Day Header */}
                      <div className="flex justify-between items-center">
                        <span className={`text-[11px] font-extrabold ${
                          cell.isToday 
                            ? 'bg-[#4d8eff] text-[#002f10] w-5 h-5 rounded-full flex items-center justify-center font-black' 
                            : 'text-[#d4e4fa] group-hover:text-white'
                        }`}>
                          {cell.dayNum}
                        </span>
                        {cellFollowUps.length > 0 && (
                          <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-[#adc6ff] font-extrabold px-1.5 py-0.2 rounded-full leading-none">
                            {cellFollowUps.length}
                          </span>
                        )}
                      </div>

                      {/* Day's followups */}
                      <div className="mt-1.5 space-y-0.5">
                        {cellFollowUps.slice(0, 2).map((f) => (
                          <div
                            key={f.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFollowUp(f.id);
                            }}
                            className={`text-[8.5px] font-bold py-0.5 px-1 rounded truncate flex items-center gap-1 select-none cursor-pointer transition-colors ${
                              f.status === 'Completed'
                                ? 'bg-green-500/10 text-green-400 hover:bg-green-500/15 border border-green-500/10'
                                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/15 border border-amber-500/10'
                            }`}
                            title={`Click to mark complete/pending: ${f.customerName}`}
                          >
                            <span 
                              className="w-1.5 h-1.5 rounded-full shrink-0" 
                              style={{ backgroundColor: f.status === 'Completed' ? '#4ade80' : '#ffb786' }}
                            ></span>
                            <span className="truncate">{f.customerName}</span>
                          </div>
                        ))}
                        {cellFollowUps.length > 2 && (
                          <span className="text-[7.5px] text-[#8c909f] font-bold text-right pt-0.5 block leading-none">
                            +{cellFollowUps.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#424754]/40 max-h-[400px] overflow-y-auto custom-scrollbar">
              {activeFollowUps.length === 0 ? (
                <div className="p-12 text-center text-sm text-[#c2c6d6] space-y-2">
                  <p>No active follow-ups found for this view period.</p>
                  <p className="text-xs text-[#8c909f]">Click on a customer profile or schedule a new follow-up below.</p>
                </div>
              ) : (
                activeFollowUps.map((follow) => {
                  const isOverdue = new Date(follow.followUpDate) < new Date(todayStr) && follow.status === 'Pending';
                  
                  return (
                    <div
                      key={follow.id}
                      className={`p-5 flex items-center justify-between gap-4 transition-colors ${
                        follow.status === 'Completed' ? 'bg-[#122131]/25 opacity-50' : 'hover:bg-[#273647]/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Interactive circular checkbox to trigger real-time completion state updates */}
                        <button
                          onClick={() => onToggleFollowUp(follow.id)}
                          className={`w-5.5 h-5.5 rounded-full border-2 transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                            follow.status === 'Completed'
                              ? 'bg-[#4ade80] border-[#4ade80] text-[#002f10]'
                              : isOverdue
                              ? 'border-red-500 hover:border-red-400 bg-red-500/10'
                              : 'border-[#424754] hover:border-[#adc6ff]'
                          }`}
                          title={follow.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
                        >
                          {follow.status === 'Completed' && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-semibold transition-all ${
                                follow.status === 'Completed' ? 'line-through text-[#8c909f]' : 'text-[#d4e4fa]'
                              }`}
                            >
                              {follow.customerName}
                            </p>
                            {isOverdue && (
                              <span className="text-[9px] bg-red-500/20 text-red-400 font-bold px-1.5 py-0.5 rounded border border-red-500/30 font-mono">
                                OVERDUE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#c2c6d6] max-w-lg mt-1 truncate">{follow.remark || "No objective notes logged."}</p>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-[#424754] bg-[#0c1825] text-[#a1acc3]">
                              Lead Officer: {follow.assignedTo || 'Unassigned'}
                            </span>
                            <span className="text-xs text-[#8c909f] flex items-center gap-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5 text-[#ffb786]" />
                              <span>Date limit: {follow.followUpDate}</span>
                            </span>
                            {follow.city && (
                              <span className="text-xs text-[#8c909f] font-medium">• {follow.city}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectCustomer(follow.customerId)}
                        className="text-xs font-bold text-[#adc6ff] hover:text-[#4d8eff] hover:underline shrink-0 cursor-pointer"
                      >
                        Open Profile
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Quick Follow-up Seeder / Scheduler form (Dashboard level) */}
        <div className="lg:col-span-4 bg-[#122131]/80 border border-[#424754]/50 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#424754] bg-[#0d1c2d]">
            <h3 className="font-bold text-[#d4e4fa] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ffb786]" />
              <span>Quick Followup Scheduler</span>
            </h3>
          </div>

          <form onSubmit={handleCreateDashboardFollowUp} className="p-5 space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-[#8c909f] tracking-widest block mb-1">Target Customer Profile</label>
              <select
                value={newFollowUpCust}
                onChange={(e) => {
                  setNewFollowUpCust(e.target.value);
                  const selectedObj = customers.find(c => c.id === e.target.value);
                  if (selectedObj) setNewFollowUpName(selectedObj.name);
                }}
                className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg p-2.5 text-xs text-[#d4e4fa] font-semibold outline-none focus:border-[#4d8eff]"
              >
                <option value="">-- Choose Contact --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#8c909f] tracking-widest block mb-1">Backup Name Input</label>
              <input
                type="text"
                value={newFollowUpName}
                onChange={(e) => setNewFollowUpName(e.target.value)}
                placeholder="Or type unregistered client..."
                className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg p-2.5 text-xs text-[#d4e4fa] focus:outline-none focus:border-[#4d8eff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#8c909f] tracking-widest block mb-1">Schedule date</label>
              <input
                type="date"
                value={newFollowUpDate}
                onChange={(e) => setNewFollowUpDate(e.target.value)}
                style={{ colorScheme: 'dark' }}
                className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg p-2.5 text-xs text-[#d4e4fa] focus:outline-none focus:border-[#4d8eff]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-[#8c909f] tracking-widest block mb-1">Action Note Description</label>
              <textarea
                value={newFollowUpRemark}
                onChange={(e) => setNewFollowUpRemark(e.target.value)}
                placeholder="Purpose of negotiation call..."
                rows={2}
                className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg p-2.5 text-xs text-[#d4e4fa] outline-none placeholder-[#8c909f]/60 focus:border-[#4d8eff]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#4d8eff] hover:bg-[#4d8eff]/90 text-[#002f10] font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-[#4d8eff]/10"
            >
              Schedule Follow-up Task
            </button>
          </form>
        </div>

      </div>

      {/* Recent Notifications & Activity summary block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Notifications Widget */}
        <div className="bg-[#122131]/80 border border-[#424754]/50 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-5 border-b border-[#424754] flex justify-between items-center bg-[#0d1c2d]">
            <h3 className="font-bold text-[#d4e4fa] flex items-center gap-2.5">
              <BellRing className="w-5 h-5 text-[#adc6ff]" />
              <span>Lead Alerts</span>
            </h3>
            <button
              onClick={handleMarkAllRead}
              className="text-xs font-semibold text-[#adc6ff] hover:underline cursor-pointer"
            >
              Reset Unread
            </button>
          </div>

          <div className="divide-y divide-[#424754]/40 max-h-[250px] overflow-y-auto custom-scrollbar">
            {notifications.slice(0, 3).map((notif) => {
              const categoryColor =
                notif.category === 'Hot Lead'
                  ? 'text-[#adc6ff] bg-[#adc6ff]/10 border-[#adc6ff]/20'
                  : notif.category === 'Revenue'
                  ? 'text-[#ffb786] bg-[#ffb786]/10 border-[#ffb786]/20'
                  : notif.category === 'Urgent'
                  ? 'text-[#ffb4ab] bg-[#ffb4ab]/10 border-[#ffb4ab]/20'
                  : 'text-[#bcc7de] bg-[#bcc7de]/10 border-[#bcc7de]/20';

              return (
                <div
                  key={notif.id}
                  className={`p-4 flex gap-4 transition-all hover:bg-[#273647]/30 ${
                    notif.isUnread ? 'opacity-100 border-l-4 border-[#4d8eff]' : 'opacity-60'
                  }`}
                >
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="text-sm text-[#d4e4fa] leading-relaxed">
                      <span className="font-bold">{notif.title}:</span> {notif.message}
                    </p>
                    <div className="flex items-center gap-2.5 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${categoryColor}`}>
                        {notif.category}
                      </span>
                      <span className="text-xs text-[#8c909f]">•</span>
                      <span className="text-xs text-[#8c909f]">{notif.timeRel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Corporate Activity Logs timeline */}
        <div className="bg-[#122131]/80 border border-[#424754]/50 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#d4e4fa]">Enterprise Activity Feed</h3>
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">LIVE STATUS</span>
            </div>
            <ul className="space-y-4">
              {activityLogs.slice(0, 3).map((log) => {
                const dotColor =
                  log.type === 'primary'
                    ? 'bg-[#4d8eff]'
                    : log.type === 'secondary'
                    ? 'bg-[#bcc7de]'
                    : 'bg-[#ffb786]';

                return (
                  <li key={log.id} className="flex gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`}></div>
                    <div>
                      <p className="text-xs text-[#d4e4fa] font-medium">{log.text}</p>
                      <p className="text-[10px] text-[#8c909f] mt-0.5">{log.timeRel}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
