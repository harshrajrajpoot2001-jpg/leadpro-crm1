import React, { useState } from 'react';
import {
  Bell,
  Check,
  UserPlus,
  Compass,
  AlertTriangle,
  Download,
  Send,
  Shield,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Notification, CommentReply } from '../types';

interface ActivityCenterProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  onSelectCustomer: (id: string) => void;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
}

export default function ActivityCenter({
  notifications,
  setNotifications,
  onSelectCustomer,
  setCurrentTab,
  searchQuery
}: ActivityCenterProps) {
  const [activeSubTab, setActiveSubTab] = useState<'All' | 'Unread' | 'Reminders'>('All');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  const handleSubTabChange = (tab: 'All' | 'Unread' | 'Reminders') => {
    setActiveSubTab(tab);
  };

  const handleNotificationClick = (notifId: string) => {
    // Mark single notification as read on click
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, isUnread: false } : n))
    );
  };

  const handleDismiss = (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const handleReplyChange = (notifId: string, val: string) => {
    setReplyInputs(prev => ({ ...prev, [notifId]: val }));
  };

  const handleSendReply = (e: React.FormEvent, notifId: string) => {
    e.preventDefault();
    const replyText = replyInputs[notifId];
    if (!replyText || replyText.trim() === '') return;

    const newReply: CommentReply = {
      id: `rep-${Date.now()}`,
      author: 'Alex Mercer', // Logged in profile standard name
      timeRel: 'Just now',
      text: replyText,
      avatarSrc: "https://lh3.googleusercontent.com/aida/AP1WRLskjx1cf--H3qZN-eX7X2mL_Tx0xNbcm1FMDkLJxoTs-AaPFad1voyufLTdOct5NXpM4TSUJAPmkBly6b0M_Pb5rx6uNZE6okzlAgSfJ5dzZXvTe2WbrxGsnJRaqea-001VlX2GsPNONnaEgo1DN2cLuIyt3IiBXYeNXsnbG92ms64CrDhsAgkdVQFR3T-yXK0vYj9hgal0LM12cYQ23y3r50haXC35V1Am6qRsTMLZGvffUAfiiCZFZA"
    };

    setNotifications(prev =>
      prev.map(notif => {
        if (notif.id === notifId) {
          return {
            ...notif,
            replies: [...(notif.replies || []), newReply],
            isUnread: false // Auto marks as read when replied!
          };
        }
        return notif;
      })
    );

    // Clear input
    setReplyInputs(prev => ({ ...prev, [notifId]: '' }));
  };

  // Filter based on sub-tab and optionally on header search queries!
  const filteredNotifications = notifications.filter(notif => {
    // Sub-tab filter
    if (activeSubTab === 'Unread' && !notif.isUnread) return false;
    if (activeSubTab === 'Reminders' && notif.type !== 'warning') return false;

    // Optional Search filter matching title or message
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return notif.title.toLowerCase().includes(q) || notif.message.toLowerCase().includes(q);
    }

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 select-none">
      {/* Activity Center Header page */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#d4e4fa] tracking-tight">Activity Center</h2>
          <p className="text-sm text-[#c2c6d6] mt-1">Manage your system updates, reminders, and team mentions.</p>
        </div>

        {/* Toggles bar */}
        <div className="flex bg-[#122131] rounded-lg p-1 border border-[#424754]/80 self-start sm:self-auto">
          {(['All', 'Unread', 'Reminders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => handleSubTabChange(tab)}
              className={`px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeSubTab === tab
                  ? 'bg-[#3e495d] text-[#adc6ff] shadow-sm font-bold'
                  : 'text-[#c2c6d6] hover:bg-[#273647] hover:text-[#d4e4fa]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications listing stack */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-[#122131] border border-[#424754]/50 p-12 text-center rounded-2xl text-[#c2c6d6] space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-[#4ade80]" />
            <p className="font-semibold text-white">All caught up!</p>
            <p className="text-xs">No notifications matching this filter are pending.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = notif.isUnread;
            const hasReplies = notif.replies && notif.replies.length > 0;

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id)}
                className={`transition-all duration-300 rounded-2xl p-6 flex gap-6 items-start border relative overflow-hidden group/item ${
                  notif.type === 'security'
                    ? 'bg-[#93000a]/10 border-[#93000a]/30 hover:bg-[#93000a]/15 text-[#ffb4ab]'
                    : isUnread
                    ? 'bg-[#1c2b3c] border-[#424754] hover:shadow-lg hover:border-[#adc6ff]/40'
                    : 'bg-[#122131]/70 border-[#424754]/40 opacity-75 hover:opacity-100 hover:border-[#424754]/65'
                }`}
              >
                {/* Visual Accent bar for timers */}
                {notif.type === 'warning' && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#df7412]" />
                )}

                {/* Left Dynamic Indicator Icon container */}
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 shadow-md ${
                  notif.type === 'person_add'
                    ? 'bg-[#adc6ff]/10 text-[#adc6ff]'
                    : notif.type === 'paid'
                    ? 'bg-[#ffb786]/10 text-[#ffb786]'
                    : notif.type === 'warning'
                    ? 'bg-[#df7412]/10 text-[#ffb786]'
                    : notif.type === 'task_alt'
                    ? 'bg-[#4ade80]/10 text-[#4ade80]'
                    : notif.type === 'security'
                    ? 'bg-[#93000a]/20 text-[#ffb4ab]'
                    : 'bg-[#bcc7de]/10 text-[#bcc7de]'
                }`}>
                  {notif.type === 'comment' && notif.avatarSrc ? (
                    <img
                      src={notif.avatarSrc}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover border-2 border-[#adc6ff]/20"
                    />
                  ) : notif.type === 'person_add' ? (
                    <UserPlus className="w-5 h-5" />
                  ) : notif.type === 'paid' ? (
                    <CheckSquareIcon />
                  ) : notif.type === 'warning' ? (
                    <Clock className="w-5 h-5" />
                  ) : notif.type === 'security' ? (
                    <Shield className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>

                {/* Notification Core Content details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <h3 className={`text-base font-bold tracking-tight ${
                      notif.type === 'security' ? 'text-red-400' : 'text-white'
                    }`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-[#8c909f] font-medium shrink-0">
                      {notif.type === 'warning' ? 'Next: 2:30 PM' : notif.timeRel}
                    </span>
                  </div>

                  <p className={`text-sm leading-relaxed mb-4 ${
                    notif.type === 'comment' ? 'italic text-[#c2c6d6]' : 'text-[#aeb9d0]'
                  }`}>
                    {notif.message}
                  </p>

                  {/* Context specific Action buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {notif.type === 'person_add' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Select first customer as demo or open customer tab
                            onSelectCustomer('js-5'); // opens VIP customer John Smith
                          }}
                          className="px-4 py-1.5 rounded bg-[#4d8eff]/10 hover:bg-[#4d8eff]/20 text-[#adc6ff] text-xs font-semibold cursor-pointer transition-colors"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={(e) => handleDismiss(e, notif.id)}
                          className="px-4 py-1.5 rounded hover:bg-[#273647] text-[#c2c6d6] text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Dismiss
                        </button>
                      </>
                    )}

                    {notif.type === 'warning' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Opening video link... Loading visual room secure transport pipelines.");
                          }}
                          className="px-4 py-1.5 rounded bg-[#df7412]/20 hover:bg-[#df7412]/35 text-[#ffb786] text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Join Meeting
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Snoozed for 15 minutes.");
                          }}
                          className="px-4 py-1.5 rounded hover:bg-[#273647] text-[#c2c6d6] text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Snooze
                        </button>
                      </>
                    )}

                    {notif.type === 'inventory_2' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert("Initiated download sequence... Monthly report package: 'LeadConversion_August.csv' saved.");
                        }}
                        className="px-4 py-1.5 rounded border border-[#424754] hover:bg-[#273647] text-[#d4e4fa] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download report</span>
                      </button>
                    )}

                    {notif.type === 'security' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Redirecting to secure configuration credentials console. Two-factor challenge active.");
                          }}
                          className="px-4 py-1.5 rounded bg-red-600 hover:brightness-110 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Secure Account
                        </button>
                        <button
                          onClick={(e) => handleDismiss(e, notif.id)}
                          className="px-4 py-1.5 rounded hover:bg-neutral-850 text-[#ffb4ab] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          It was me
                        </button>
                      </>
                    )}
                  </div>

                  {/* Render Nested Comments / Replies list */}
                  {hasReplies && (
                    <div className="mt-4 pt-4 border-t border-[#424754]/40 space-y-3">
                      {notif.replies?.map((rep) => (
                        <div key={rep.id} className="flex gap-3 items-start text-xs bg-[#0d1c2d] p-3 rounded-xl border border-[#424754]/30">
                          {rep.avatarSrc && (
                            <img
                              src={rep.avatarSrc}
                              alt={rep.author}
                              className="w-6.5 h-6.5 rounded-full object-cover shrink-0 border border-[#adc6ff]/20"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold text-white">{rep.author}</span>
                              <span className="text-[10px] text-[#8c909f]">{rep.timeRel}</span>
                            </div>
                            <p className="text-[#c2c6d6] leading-relaxed select-text">{rep.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dynamic reply inputs form for mentioned comments */}
                  {notif.type === 'comment' && (
                    <form
                      onSubmit={(e) => handleSendReply(e, notif.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-4 flex items-center gap-3"
                    >
                      <div className="flex-1 bg-[#0d1c2d] rounded-lg border border-[#424754] overflow-hidden focus-within:border-[#4d8eff] transition-all">
                        <input
                          type="text"
                          value={replyInputs[notif.id] || ''}
                          onChange={(e) => handleReplyChange(notif.id, e.target.value)}
                          placeholder="Reply to Elena..."
                          className="w-full bg-transparent border-none py-2 px-3 text-xs text-[#d4e4fa] focus:ring-0 placeholder-[#8c909f]/60 outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="p-2 text-[#4d8eff] hover:bg-[#adc6ff]/10 rounded-lg cursor-pointer transition-colors"
                        title="Send reply"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>

                {/* Right hand blue dot for unread status highlight */}
                {isUnread && (
                  <div className="w-2 h-2 rounded-full bg-[#4d8eff] shrink-0 mt-2 self-start md:self-auto" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer view notification history trigger link */}
      <div className="text-center">
        <button
          onClick={() => alert("Loading historic notifications log... Enterprise archives fetched successfully.")}
          className="text-xs font-semibold text-[#adc6ff] hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>View notification history</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// Sparkle/Award mini Helper SVG
function CheckSquareIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
