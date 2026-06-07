import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Edit,
  User,
  Building,
  Calendar,
  Clock,
  History,
  FileText,
  CheckCircle2,
  PhoneCall,
  Video,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Contact,
  MessageSquare
} from 'lucide-react';
import { Customer, TimelineActivity, Task, ActivityLog, CallReminder } from '../types';
import WhatsAppModal from './WhatsAppModal';

interface CustomerDetailProps {
  customer: Customer;
  onBack: () => void;
  timeline: TimelineActivity[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineActivity[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
  onEditCustomerClick: (customer: Customer) => void;
  onScheduleCallReminder?: (reminder: CallReminder) => void;
}

export default function CustomerDetail({
  customer,
  onBack,
  timeline,
  setTimeline,
  setTasks,
  setActivityLogs,
  onEditCustomerClick,
  onScheduleCallReminder
}: CustomerDetailProps) {
  // Plan Follow-up states
  const [followUpType, setFollowUpType] = useState('Video Conference');
  const [date, setDate] = useState('2026-06-07');
  const [time, setTime] = useState('20:00');
  const [notes, setNotes] = useState('');
  const [buttonFeedback, setButtonFeedback] = useState('Schedule Event');
  const [buttonColor, setButtonColor] = useState('bg-[#4d8eff] text-[#00285d]');
  const [isWaOpen, setIsWaOpen] = useState(false);
  const [callReminderCheck, setCallReminderCheck] = useState(true);

  // Filter individual customers timeline activities
  const customerTimeline = timeline.filter(act => act.customerId === customer.id);

  const handleScheduleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes || notes.trim() === '') {
      alert("Please add some notes to outline your session's objectives.");
      return;
    }

    const activityTitle = `${followUpType} Scheduled`;
    const formatDateTime = `${new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })}, ${time}`;

    // 1. Add to Customer's Timeline
    const newActivity: TimelineActivity = {
      id: `act-${Date.now()}`,
      customerId: customer.id,
      type: 'followup',
      title: activityTitle,
      dateTimeStr: formatDateTime,
      description: notes
    };

    setTimeline(prev => [newActivity, ...prev]);

    // Check if we should register an active alert warning call reminder!
    if (followUpType === 'Phone Call' && callReminderCheck && onScheduleCallReminder) {
      onScheduleCallReminder({
        id: `rem-${Date.now()}`,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        dateTime: `${date}T${time}`,
        notes: notes,
        status: 'Scheduled'
      });
    }

    // 2. Add as an Upcoming Task on Dashboard
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      title: `${followUpType} with ${customer.name} (${customer.company})`,
      priority: followUpType === 'Video Conference' ? 'High Priority' : 'Follow-up',
      time: time,
      dueDate: 'Today',
      isCompleted: false,
      assignees: [
        'https://lh3.googleusercontent.com/aida/AP1WRLskjx1cf--H3qZN-eX7X2mL_Tx0xNbcm1FMDkLJxoTs-AaPFad1voyufLTdOct5NXpM4TSUJAPmkBly6b0M_Pb5rx6uNZE6okzlAgSfJ5dzZXvTe2WbrxGsnJRaqea-001VlX2GsPNONnaEgo1DN2cLuIyt3IiBXYeNXsnbG92ms64CrDhsAgkdVQFR3T-yXK0vYj9hgal0LM12cYQ23y3r50haXC35V1Am6qRsTMLZGvffUAfiiCZFZA'
      ]
    };
    setTasks(prev => [newTask, ...prev]);

    // 3. Append to Recent Activity Log feed
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      text: `Scheduled ${followUpType} with ${customer.name}`,
      timeRel: 'Just now',
      type: 'primary'
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 2)]);

    // Button visual feedback triggers
    setButtonFeedback('Scheduled!');
    setButtonColor('bg-green-600 text-white font-bold');

    // Reset notes
    setNotes('');

    // Restore button style after delay
    setTimeout(() => {
      setButtonFeedback('Schedule Event');
      setButtonColor('bg-[#4d8eff] text-[#00285d]');
    }, 2000);
  };

  const completedFollowUps = [
    { title: 'Intro Call', date: 'Completed Oct 15', desc: 'Confirmed budget range and decision-making timeline...' },
    { title: 'Demo Prep', date: 'Completed Oct 12', desc: 'Tailored demo environment for logistics workflow...' }
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Back to directory navigation breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-[#adc6ff] hover:text-[#4d8eff] font-semibold cursor-pointer py-1.5 transition-colors self-start"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to customer directory</span>
      </button>

      {/* Customer Master Block Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#424754]/40">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#adc6ff]/10 flex items-center justify-center text-[#adc6ff] shrink-0 border border-[#adc6ff]/30">
            <User className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-3.5 mb-1.5">
              <h2 className="text-3xl font-extrabold text-[#d4e4fa] tracking-tight">{customer.name}</h2>
              {customer.isVip && (
                <span className="px-3 py-0.5 bg-[#df7412]/15 text-[#ffb786] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#df7412]/30">
                  VIP Client
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-[#c2c6d6] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#8c909f]" />
              <span>{customer.company}</span>
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setIsWaOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold rounded-lg hover:bg-green-500/20 hover:text-green-300 transition-colors cursor-pointer animate-fade-in"
          >
            <MessageSquare className="w-4 h-4 text-green-400" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => alert(`Creating draft email address placeholder: to ${customer.email}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1c2b3c] border border-[#424754] text-xs font-semibold rounded-lg hover:bg-[#273647] hover:text-white transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#adc6ff]" />
            <span>Email</span>
          </button>
          <button
            onClick={() => alert(`Initializing digital calling lines... Dialing: ${customer.phone}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1c2b3c] border border-[#424754] text-xs font-semibold rounded-lg hover:bg-[#273647] hover:text-white transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#adc6ff]" />
            <span>Call</span>
          </button>
          <button
            onClick={() => onEditCustomerClick(customer)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4d8eff] hover:bg-[#4d8eff]/90 text-[#00285d] text-xs font-extrabold rounded-lg transition-all cursor-pointer shadow-lg shadow-[#4d8eff]/10"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Detail Layout Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Client contact & Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Contact Information card */}
          <section className="bg-[#122131] border border-[#424754]/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[#d4e4fa] mb-6 flex items-center gap-2.5">
              <Contact className="w-5 h-5 text-[#adc6ff]" />
              <span>Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest mb-1.5">Email Address</p>
                  <p className="text-sm font-semibold text-[#adc6ff] select-all truncate">{customer.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest mb-1.5">Phone Number</p>
                  <p className="text-sm font-semibold text-white select-all">{customer.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest mb-1.5">Office Location</p>
                  <p className="text-sm font-semibold text-white">{customer.office}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest mb-1.5">Lead Source</p>
                  <p className="text-sm font-semibold text-white">{customer.leadSource}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Activity History timeline list */}
          <section className="bg-[#122131] border border-[#424754]/50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#d4e4fa] flex items-center gap-2.5">
                <History className="w-5 h-5 text-[#adc6ff]" />
                <span>Activity History</span>
              </h3>
              <button 
                onClick={() => alert("Loading historic timeline stack complete.")}
                className="text-xs font-semibold text-[#adc6ff] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-[#424754]/40">
              {customerTimeline.length === 0 ? (
                <div className="p-4 pl-12 text-xs text-[#c2c6d6]">No past logged activities found. Add follow-up prompts using the planner form.</div>
              ) : (
                customerTimeline.map((act) => {
                  return (
                    <div key={act.id} className="relative flex items-start gap-4 pl-10">
                      <div className="absolute left-0 w-10 h-10 rounded-full bg-[#1c2b3c] border-2 border-[#4d8eff] flex items-center justify-center z-10 text-[#adc6ff]">
                        <FileText className="w-4 h-4 shrink-0" />
                      </div>
                      <div className="flex-1 bg-[#0d1c2d] border border-[#424754]/50 p-4 rounded-xl">
                        <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">{act.title}</span>
                          <span className="text-[10px] text-[#8c909f] font-semibold">{act.dateTimeStr}</span>
                        </div>
                        <p className="text-xs text-[#c2c6d6] leading-relaxed select-text">{act.description}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Plan Follow-up & Completed tasks summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Plan follow-up scheduler form */}
          <section className="bg-[#122131] border border-[#424754]/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#d4e4fa] mb-6 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#ffb786]" />
              <span>Plan Follow-up</span>
            </h3>

            <form onSubmit={handleScheduleEvent} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block mb-1.5Packed">Follow-up Type</label>
                <select
                  value={followUpType}
                  onChange={(e) => setFollowUpType(e.target.value)}
                  className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg p-2.5 text-xs focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] outline-none text-[#d4e4fa] font-semibold"
                >
                  <option>Video Conference</option>
                  <option>Phone Call</option>
                  <option>Email Outreach</option>
                  <option>In-Person Meeting</option>
                </select>
              </div>

              {followUpType === 'Phone Call' && (
                <div className="flex items-center gap-2 bg-[#0c1c2a] border border-[#273647] p-2.5 rounded-xl animate-fade-in">
                  <input
                    type="checkbox"
                    id="callReminderCheck"
                    checked={callReminderCheck}
                    onChange={(e) => setCallReminderCheck(e.target.checked)}
                    className="w-4 h-4 rounded text-green-500 bg-[#0d1c2d] border-[#424754] focus:ring-green-500 cursor-pointer"
                  />
                  <label htmlFor="callReminderCheck" className="text-[10px] font-bold text-green-400 uppercase tracking-wide cursor-pointer w-full select-none">
                     Enable active audio Call Reminder warning alarm alert
                  </label>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block mb-1.5 bg-clip-text">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg p-2.5 text-xs focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] outline-none text-[#d4e4fa]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block mb-1.5">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg p-2.5 text-xs focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] outline-none text-[#d4e4fa]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block mb-1.5">Action Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What are the goals for this session?"
                  rows={3}
                  className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg p-2.5 text-xs focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] outline-none text-[#d4e4fa] placeholder-[#8c909f]/60"
                ></textarea>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-lg text-xs font-bold transition-all hover:brightness-110 cursor-pointer shadow-lg shadow-[#4d8eff]/5 ${buttonColor}`}
              >
                {buttonFeedback}
              </button>
            </form>
          </section>

          {/* Recent Completed List */}
          <section className="bg-[#122131] border border-[#424754]/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[#d4e4fa] mb-6 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
              <span>Recent Completed</span>
            </h3>

            <div className="space-y-4">
              {completedFollowUps.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => alert(`Archively opening records regarding historical completed target point: ${item.title}`)}
                  className="p-4 rounded-xl bg-[#1c2b3c] border-l-4 border-[#8c909f] hover:bg-[#273647] hover:border-[#adc6ff] transition-all cursor-pointer group/item flex justify-between items-start"
                >
                  <div>
                    <span className="text-xs font-bold text-white block">{item.title}</span>
                    <span className="text-[10px] text-[#8c909f] mt-1 block">{item.date}</span>
                    <p className="text-xs text-[#c2c6d6] mt-2 line-clamp-1">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8c909f] group-hover/item:text-[#adc6ff] shrink-0 mt-0.5" />
                </div>
              ))}

              <button
                onClick={() => alert("Showing archived customer log history...")}
                className="w-full text-center py-2.5 text-xs font-semibold text-[#c2c6d6] hover:text-[#adc6ff] transition-colors mt-2 cursor-pointer"
              >
                Show More History
              </button>
            </div>
          </section>
        </div>

      </div>

      {isWaOpen && (
        <WhatsAppModal
          isOpen={isWaOpen}
          onClose={() => setIsWaOpen(false)}
          customer={customer}
          onLogCommunication={(method, msg) => {
            setActivityLogs(prev => [
              {
                id: `log-${Date.now()}`,
                text: `Sent WhatsApp to ${customer.name}: "${msg.substring(0, 30)}..."`,
                timeRel: 'Just now',
                type: 'primary'
              },
              ...prev.slice(0, 2)
            ]);
            setTimeline(prev => [
              {
                id: `tl-${Date.now()}`,
                customerId: customer.id,
                type: 'followup',
                title: 'WhatsApp Message Sent',
                dateTimeStr: 'Just now',
                description: msg
              },
              ...prev
            ]);
          }}
        />
      )}
    </div>
  );
}
