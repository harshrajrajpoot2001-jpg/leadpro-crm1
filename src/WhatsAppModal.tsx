import React, { useState } from 'react';
import { X, Send, Copy, Check, MessageSquare, Sparkles } from 'lucide-react';
import { Customer } from '../types';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onLogCommunication: (method: string, message: string) => void;
}

export default function WhatsAppModal({ isOpen, onClose, customer, onLogCommunication }: WhatsAppModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [sentFeedback, setSentFeedback] = useState(false);

  if (!isOpen) return null;

  const templates = [
    {
      id: 1,
      name: 'Introduction & Greetings',
      text: `Hi ${customer.name},\n\nThis is the sales team at LeadPro. We noticed your interest in our fleet management and enterprise pipeline solutions. Let us know a convenient time to sync up this week!\n\nBest regards,\nLeadPro Solutions`
    },
    {
      id: 2,
      name: 'Follow-up Call Request',
      text: `Hi ${customer.name},\n\nI hope you are doing well! Following up on our previous conversation regarding the custom CRM integrations for ${customer.company || "your company"}. Do you have 10 minutes for a quick callback tomorrow?\n\nRegards,\nLeadPro CRM`
    },
    {
      id: 3,
      name: 'Enterprise Pricing Proposal',
      text: `Hello ${customer.name},\n\nWe have compiled the custom pricing sheet and technical requirements document based on your team size at ${customer.company || "your organization"}. Please review it at your convenience and let us know if you have any questions.\n\nBest,\nLeadPro Enterprise Support`
    },
    {
      id: 4,
      name: 'Meeting Agenda Details',
      text: `Hi ${customer.name},\n\nConfirming our scheduled catchup for tomorrow. Our agenda covers:\n1. CRM pipeline diagnostic\n2. Real-time Firestore synchronizations\n3. Q&A\n\nLooking forward to speaking with you then!\n\nBest regards,\nLeadPro team`
    }
  ];

  const handleSelectTemplate = (id: number, text: string) => {
    setSelectedTemplate(id);
    setMessage(text);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhoneNumber = (phoneStr: string) => {
    // Remove characters except digits and the plus symbol at start
    return phoneStr.replace(/[^\d+]/g, '');
  };

  const getWaLink = () => {
    const cleaned = cleanPhoneNumber(customer.phone);
    // Remove plus if any for wa.me format
    const digitsOnly = cleaned.startsWith('+') ? cleaned.substring(1) : cleaned;
    return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
  };

  const handleSend = () => {
    onLogCommunication('WhatsApp Message', message);
    setSentFeedback(true);
    setTimeout(() => {
      setSentFeedback(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#122131] border border-[#424754] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-[#424754] flex justify-between items-center bg-[#0d1c2d]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-green-500/10 text-green-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-[#d4e4fa]">WhatsApp Integration Module</h3>
              <p className="text-[11px] text-[#c2c6d6] mt-0.5">Send instant template scripts to {customer.name} ({customer.phone})</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-[#1c2b3c] rounded-lg text-[#8c909f] hover:text-[#d4e4fa] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* Presets Grid */}
          <div>
            <span className="text-[10px] uppercase font-extrabold text-[#8c909f] tracking-widest block mb-2.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-green-400" />
              <span>Select Messaging Scripts / Templates</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {templates.map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl.id, tpl.text)}
                  className={`p-3 text-left rounded-xl border text-xs transition-all cursor-pointer flex flex-col justify-between gap-1 h-[78px] ${
                    selectedTemplate === tpl.id
                      ? 'bg-green-500/10 border-green-500/50 text-[#d4e4fa] font-semibold'
                      : 'bg-[#0d1c2d] border-[#424754]/60 text-[#c2c6d6] hover:bg-[#1c2b3c] hover:border-green-500/30'
                  }`}
                >
                  <span className="font-bold block truncate w-full text-green-400">{tpl.name}</span>
                  <p className="line-clamp-2 text-[11px] text-[#c2c6d6] leading-normal">{tpl.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea Code */}
          <div>
            <label className="text-[10px] uppercase font-bold text-[#8c909f] tracking-widest block mb-1.5">Compose WhatsApp Body</label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setSelectedTemplate(null);
              }}
              rows={5}
              placeholder="Type your tailored WhatsApp message right here, or select a template preset above..."
              className="w-full bg-[#0d1c2d] border border-[#424754] rounded-xl p-3.5 text-xs text-[#d4e4fa] placeholder-[#8c909f]/60 outline-none focus:border-green-500/70 focus:ring-1 focus:ring-green-500/30 transition-all font-sans leading-relaxed"
            />
          </div>

          {/* Customer stats block */}
          <div className="bg-[#0c1c2a] border border-[#273647] p-3 rounded-xl flex items-center justify-between text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#8c909f] uppercase">Recipient Name</span>
              <span className="font-semibold text-white mt-0.5">{customer.name}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-[#8c909f] uppercase">Cleaned WhatsApp Phone</span>
              <span className="font-mono text-[#adc6ff] mt-0.5">{cleanPhoneNumber(customer.phone)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#424754] bg-[#0d1c2d] flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handleCopyText}
              disabled={!message}
              className="flex items-center gap-1.5 bg-[#122131] hover:bg-[#1c2b3c] disabled:opacity-40 text-[#c2c6d6] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-[#424754] cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="flex gap-2">
            {sentFeedback ? (
              <span className="bg-green-500/20 border border-green-500/40 text-green-400 px-5 py-2 rounded-xl text-xs font-bold animate-pulse">
                Logged & Linked!
              </span>
            ) : (
              <a
                href={message ? getWaLink() : undefined}
                target="_blank"
                rel="noreferrer"
                onClick={message ? handleSend : (e) => e.preventDefault()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-lg ${
                  message
                    ? 'bg-green-500 text-white font-extrabold hover:bg-green-400 shadow-green-500/10'
                    : 'bg-[#273647] text-[#8c909f] border border-[#424754] cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Open WhatsApp Web & Send</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
