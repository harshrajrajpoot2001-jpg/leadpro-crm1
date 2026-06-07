import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, Building, Mail, Phone, MapPin, Compass } from 'lucide-react';
import { Customer } from '../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: Partial<Customer>) => void;
  editCustomer?: Customer | null;
}

export default function AddLeadModal({
  isOpen,
  onClose,
  onSave,
  editCustomer
}: LeadModalProps) {
  // states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [office, setOffice] = useState('');
  const [leadSource, setLeadSource] = useState('Organic Search');
  const [status, setStatus] = useState<Customer['status']>('New');
  const [isVip, setIsVip] = useState(false);

  // Load editing properties if present
  useEffect(() => {
    if (editCustomer) {
      setName(editCustomer.name);
      setCompany(editCustomer.company);
      setEmail(editCustomer.email);
      setPhone(editCustomer.phone);
      setOffice(editCustomer.office);
      setLeadSource(editCustomer.leadSource);
      setStatus(editCustomer.status);
      setIsVip(editCustomer.isVip);
    } else {
      // blank form defaults
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setOffice('Seattle, WA, USA');
      setLeadSource('Direct Referral');
      setStatus('New');
      setIsVip(false);
    }
  }, [editCustomer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.trim() === '') {
      alert("Name is required");
      return;
    }
    if (!company || company.trim() === '') {
      alert("Company is required");
      return;
    }

    const payload: Partial<Customer> = {
      name: name.trim(),
      company: company.trim(),
      email: email.trim() || 'contact@company.com',
      phone: phone.trim() || '+1 (555) 000-0000',
      office: office.trim() || 'Seattle, WA, USA',
      leadSource,
      status,
      isVip
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#122131] border border-[#adc6ff]/20 rounded-2xl p-6 w-full max-w-lg shadow-2xl z-10 text-[#d4e4fa]">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#424754]/40">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ffb786]" />
            <span>{editCustomer ? 'Modify Lead Profile' : 'Add New Enterprise Lead'}</span>
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#273647] text-[#c2c6d6] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f] w-4 h-4" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg py-2 pl-10 pr-3 text-xs text-[#d4e4fa] focus:outline-none focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f] w-4 h-4" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Apex Global Logistics Inc."
                  className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg py-2 pl-10 pr-3 text-xs text-[#d4e4fa] focus:outline-none focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f] w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.smith@apexlogistics.com"
                  className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg py-2 pl-10 pr-3 text-xs text-[#d4e4fa] focus:outline-none focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f] w-4 h-4" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 982-3412"
                  className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg py-2 pl-10 pr-3 text-xs text-[#d4e4fa] focus:outline-none focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block">Office Location</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f] w-4 h-4" />
              <input
                type="text"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                placeholder="San Francisco, CA, USA"
                className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg py-2 pl-10 pr-3 text-xs text-[#d4e4fa] focus:outline-none focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block mb-1.5Packed">Lead Source</label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value)}
                className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg p-2.5 text-xs focus:border-[#4d8eff] text-[#d4e4fa] outline-none"
              >
                <option>Organic Search</option>
                <option>Google Ads</option>
                <option>LinkedIn outreach</option>
                <option>Partner Referral</option>
                <option>Direct Referral</option>
                <option>Cold Email</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#8c909f] uppercase tracking-widest block mb-1.5">Process Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Customer['status'])}
                className="w-full bg-[#0d1c2d] border border-[#424754] rounded-lg p-2.5 text-xs focus:border-[#4d8eff] text-[#d4e4fa] outline-none"
              >
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Lost</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isVip"
              checked={isVip}
              onChange={(e) => setIsVip(e.target.checked)}
              className="w-4 h-4 rounded border-[#424754] bg-[#0d1c2d] text-[#4d8eff] focus:ring-[#4d8eff] cursor-pointer"
            />
            <label htmlFor="isVip" className="text-xs text-[#c2c6d6] cursor-pointer selection">
              Mark this lead as a VIP high-value account (adds visually shiny markers)
            </label>
          </div>

          {/* Action buttons footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#424754]/40 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#1c2b3c] border border-[#424754] text-xs font-semibold rounded-lg hover:bg-[#273647] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#4d8eff] hover:bg-[#4d8eff]/90 text-[#00285d] text-xs font-bold rounded-lg transition-all cursor-pointer shadow-lg shadow-[#4d8eff]/10"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
