import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Filter,
  TrendingUp,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Customer, ActivityLog, TimelineActivity } from '../types';
import WhatsAppModal from './WhatsAppModal';

interface CustomersProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  activityLogs: ActivityLog[];
  setActivityLogs?: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  setTimeline?: React.Dispatch<React.SetStateAction<TimelineActivity[]>>;
  onSelectCustomer: (id: string) => void;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onEditCustomerClick: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
}

export default function Customers({
  customers,
  setCustomers,
  activityLogs,
  setActivityLogs,
  setTimeline,
  onSelectCustomer,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  onEditCustomerClick,
  onDeleteCustomer
}: CustomersProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<string>(''); // Date-wise filtering state
  const [waCustomer, setWaCustomer] = useState<Customer | null>(null);
  const itemsPerPage = 5;

  const handleEdit = (e: React.MouseEvent, customer: Customer) => {
    e.stopPropagation();
    onEditCustomerClick(customer);
  };

  const handleDelete = (e: React.MouseEvent, customerId: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this customer?")) {
      if (onDeleteCustomer) {
        onDeleteCustomer(customerId);
      } else {
        setCustomers(prev => prev.filter(c => c.id !== customerId));
      }
    }
  };

  // Local filtering based on tabs, search queries, and date selection
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // 1. Tab Status matching
      if (statusFilter === 'Active' && customer.status === 'Lost') {
        return false;
      }
      if (statusFilter === 'Archived' && customer.status !== 'Lost') {
        return false;
      }

      // 2. Date-wise filtering: matches either registration date or followup date
      if (dateFilter) {
        const itemCreatedDate = customer.createdAt
          ? (typeof customer.createdAt.toDate === 'function' 
              ? customer.createdAt.toDate().toISOString().split('T')[0] 
              : new Date(customer.createdAt).toISOString().split('T')[0])
          : '';
        const followupDateStr = customer.lastFollowUpDate || '';
        
        if (itemCreatedDate !== dateFilter && followupDateStr !== dateFilter) {
          return false;
        }
      }

      // 3. Search query matching
      const query = searchQuery.toLowerCase();
      if (query.trim() === '') return true;

      return (
        customer.name.toLowerCase().includes(query) ||
        customer.company.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.status.toLowerCase().includes(query)
      );
    });
  }, [customers, statusFilter, searchQuery, dateFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const handlePageChange = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const getStatusClasses = (status: Customer['status']) => {
    switch (status) {
      case 'Qualified':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'New':
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'Contacted':
        return 'bg-[#df7412]/10 text-[#ffb786] border border-[#df7412]/20';
      case 'Lost':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Page Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#d4e4fa] tracking-tight">Customer Directory</h2>
          <p className="text-sm text-[#c2c6d6] mt-1">Manage and track your high-value enterprise leads</p>
        </div>

        {/* Filters and Search shortcuts */}
        <div className="flex flex-wrap gap-3 shrink-0 items-center">
          {/* Date Picker Input for Date-Wise Lead Filtering */}
          <div className="flex items-center gap-2 bg-[#122131] border border-[#424754] rounded-lg px-3 py-1.5">
            <span className="text-xs text-[#8c909f] font-semibold">Lead Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ colorScheme: 'dark' }}
              className="bg-transparent border-none text-xs text-[#d4e4fa] focus:outline-none focus:ring-0 cursor-pointer min-w-[120px]"
            />
            {dateFilter && (
              <button
                onClick={() => {
                  setDateFilter('');
                  setCurrentPage(1);
                }}
                className="text-[10px] bg-red-400/10 text-red-400 hover:bg-red-400/20 px-2 py-0.5 rounded font-bold cursor-pointer transition-colors"
                title="Clear Date"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex bg-[#122131] rounded-lg p-1 border border-[#424754]/80">
            {(['All', 'Active', 'Archived'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setStatusFilter(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-[#3e495d] text-[#adc6ff] shadow-sm'
                    : 'text-[#c2c6d6] hover:text-[#d4e4fa]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSearchQuery(searchQuery === '' ? 'Qualified' : '')}
            className="flex items-center gap-2 px-4 py-2 bg-[#122131] border border-[#424754] rounded-lg text-xs font-semibold text-[#d4e4fa] hover:bg-[#273647] hover:border-[#adc6ff]/40 transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#ffb786]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Widgets (Asymmetric Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-[#122131] border border-[#424754]/50 p-5 rounded-2xl flex flex-col justify-center">
          <p className="text-xs font-semibold text-[#8c909f] uppercase tracking-wider">Total Customers</p>
          <div className="flex items-baseline gap-2.5 mt-2">
            <span className="text-3xl font-extrabold text-[#d4e4fa]">{customers.length * 150 + 120}</span>
            <span className="text-xs text-[#4ade80] font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+12%</span>
            </span>
          </div>
        </div>

        <div className="md:col-span-1 bg-[#122131] border border-[#424754]/50 p-5 rounded-2xl flex flex-col justify-center">
          <p className="text-xs font-semibold text-[#8c909f] uppercase tracking-wider">Qualified Leads</p>
          <div className="flex items-baseline gap-2.5 mt-2">
            <span className="text-3xl font-extrabold text-[#d4e4fa]">
              {customers.filter(c => c.status === 'Qualified').length * 150 + 90}
            </span>
            <span className="text-xs text-[#ffb786] font-bold">Stable</span>
          </div>
        </div>

        {/* Circular Target Progress Bar Card */}
        <div className="md:col-span-2 bg-[#122131] border border-[#424754]/50 p-5 rounded-2xl flex justify-between items-center">
          <div>
            <p className="text-xs font-semibold text-[#8c909f] uppercase tracking-wider">Conversion Target</p>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl font-extrabold text-[#d4e4fa]">68%</span>
              <span className="text-sm text-[#c2c6d6]">of 75% goal</span>
            </div>
          </div>
          
          <div className="w-20 h-20 relative flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-[#273647]"
                cx="40"
                cy="40"
                fill="transparent"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
              ></circle>
              <circle
                className="text-[#adc6ff]"
                cx="40"
                cy="40"
                fill="transparent"
                r="32"
                stroke="currentColor"
                strokeDasharray="200.96" // 2 * pi * 32
                strokeDashoffset="64.3" // (1 - 0.68) * 200.96
                strokeWidth="6"
              ></circle>
            </svg>
            <span className="absolute text-xs font-bold text-[#adc6ff]">Q3</span>
          </div>
        </div>
      </div>

      {/* High-Density Customer Table Container */}
      <div className="bg-[#122131] border border-[#424754]/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1c2b3c] border-b border-[#424754]">
                <th className="px-6 py-4 text-xs font-bold text-[#8c909f] uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c909f] uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c909f] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c909f] uppercase tracking-wider">Last Follow-up</th>
                <th className="px-6 py-4 text-xs font-bold text-[#8c909f] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#424754]/30">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#c2c6d6]">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              ) : (
                currentItems.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => onSelectCustomer(customer.id)}
                    className="hover:bg-[#273647]/50 transition-colors group cursor-pointer"
                  >
                    {/* Name cell with Avatar representation */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                          customer.isVip ? 'bg-[#ffb786]/20 text-[#ffb786] border border-[#ffb786]/30' : 'bg-[#adc6ff]/20 text-[#adc6ff]'
                        }`}>
                          {customer.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate max-w-[160px]">{customer.name}</p>
                          <p className="text-xs text-[#c2c6d6] truncate max-w-[190px]">{customer.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Company cell */}
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#aeb9d0] font-medium truncate max-w-[200px]">{customer.company}</p>
                    </td>

                    {/* Status cell */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusClasses(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>

                    {/* Last Follow-up cell */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-[#d4e4fa]">{customer.lastFollowUpDate}</span>
                        <span className={`mt-0.5 ${customer.lastFollowUpRel === 'Overdue' ? 'text-red-400 font-bold' : 'text-[#c2c6d6]'}`}>
                          {customer.lastFollowUpRel}
                        </span>
                      </div>
                    </td>

                    {/* Actions cell */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setWaCustomer(customer);
                          }}
                          className="p-1.5 hover:bg-green-500/10 rounded-lg text-[#c2c6d6] hover:text-green-400 transition-colors cursor-pointer"
                          title="Send WhatsApp Message"
                        >
                          <MessageSquare className="w-4 h-4 text-green-500" />
                        </button>
                        <button
                          onClick={(e) => handleEdit(e, customer)}
                          className="p-1.5 hover:bg-[#1c2b3c] rounded-lg text-[#c2c6d6] hover:text-[#adc6ff] transition-colors cursor-pointer"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, customer.id)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg text-[#c2c6d6] hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination bar */}
        <div className="px-6 py-4 flex items-center justify-between bg-[#1c2b3c] border-t border-[#424754]">
          <p className="text-xs font-semibold text-[#c2c6d6]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} entries
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#424754] text-[#c2c6d6] hover:bg-[#273647] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#4d8eff] text-[#00285d] font-bold'
                    : 'border border-[#424754] text-[#c2c6d6] hover:bg-[#273647]'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#424754] text-[#c2c6d6] hover:bg-[#273647] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary content sections (Bento Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activity card */}
        <div className="bg-[#122131] border border-[#424754]/50 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#d4e4fa]">Recent Activity</h3>
              <button 
                onClick={() => alert("Activity log index complete.")}
                className="text-[#4d8eff] text-xs font-bold hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>
            <ul className="space-y-4">
              {activityLogs.map((log) => {
                const dotColor =
                  log.type === 'primary'
                    ? 'bg-[#4d8eff]'
                    : log.type === 'secondary'
                    ? 'bg-[#bcc7de]'
                    : 'bg-[#ffb786]';

                return (
                  <li key={log.id} className="flex gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`}></div>
                    <div>
                      <p className="text-sm text-[#d4e4fa] font-medium leadership">{log.text}</p>
                      <p className="text-xs text-[#8c909f] mt-0.5">{log.timeRel}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Sales Performance Review promo graphic card */}
        <div className="lg:col-span-2 relative overflow-hidden bg-[#0d1c2d] border border-[#424754]/50 p-6 rounded-2xl flex flex-col justify-end min-h-[220px]">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            {/* Elegant dark space background visual gradient */}
            <div className="w-full h-full bg-gradient-to-br from-[#4d8eff]/30 to-transparent"></div>
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-[#ffb786] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>LeadPro Intelligence</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">Sales Performance Review</h3>
            <p className="text-sm text-[#c2c6d6] max-w-md leading-relaxed">
              Analyze your customer acquisition metrics and lead conversion trends for the last quarter.
            </p>
            <button
              onClick={() => alert("Launching Sales Performance Report v2.1: Initializing data-led visualization modules...")}
              className="mt-4 px-6 py-2.5 bg-[#4d8eff] text-[#00285d] font-bold text-xs rounded-full hover:bg-[#adc6ff] transition-all duration-300 inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-[#4d8eff]/10"
            >
              <span>Launch Report</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {waCustomer && (
        <WhatsAppModal
          isOpen={!!waCustomer}
          onClose={() => setWaCustomer(null)}
          customer={waCustomer}
          onLogCommunication={(method, msg) => {
            if (setActivityLogs) {
              setActivityLogs(prev => [
                {
                  id: `log-${Date.now()}`,
                  text: `Sent WhatsApp to ${waCustomer.name}: "${msg.substring(0, 30)}..."`,
                  timeRel: 'Just now',
                  type: 'primary'
                },
                ...prev.slice(0, 2)
              ]);
            }
            if (setTimeline) {
              setTimeline(prev => [
                {
                  id: `tl-${Date.now()}`,
                  customerId: waCustomer.id,
                  type: 'followup',
                  title: 'WhatsApp Message Sent',
                  dateTimeStr: 'Just now',
                  description: msg
                },
                ...prev
              ]);
            }
          }}
        />
      )}
    </div>
  );
}
