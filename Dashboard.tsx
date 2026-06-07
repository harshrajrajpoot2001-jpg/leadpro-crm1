import React, { useState } from 'react';
import { LayoutDashboard, Users, Settings, Plus, Search, Bell, CircleHelp, LogIn, ChevronRight, Menu, LogOut, CheckCircle } from 'lucide-react';

interface LayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  unreadCount: number;
  onAddLeadClick: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  userRole: 'admin' | 'staff';
  onLogout: () => void;
  children: React.ReactNode;
}

export default function Layout({
  currentTab,
  setCurrentTab,
  unreadCount,
  onAddLeadClick,
  searchQuery,
  setSearchQuery,
  userRole,
  onLogout,
  children
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Activity Center', icon: Bell, indicator: unreadCount > 0 ? unreadCount : undefined },
  ];

  const adminAvatar = "https://lh3.googleusercontent.com/aida/AP1WRLt0MYuWili5xpDACw69oRA12PqlOCXe7SnG0AwtJYRGeRcZqYDb31Eu0HUEC8GOnP9YG3gQbGMACgbyfjbykhlRew0DKvjiNYlmcoGr3szNqIKIeeDnSlaEl64_XebwjTiNJ5vVL2XWTPkmYbTPlaEfa1DocCI4jyLsQd_unAxkFmn3vDUwYmcWcF_MMiLFegzvl7LgqpJTkQ1SQL5maFbhJZTddXlmoWPrDuZIvcIYaWuz8XhGNFSvp5s";
  const staffAvatar = "https://lh3.googleusercontent.com/aida/AP1WRLskjx1cf--H3qZN-eX7X2mL_Tx0xNbcm1FMDkLJxoTs-AaPFad1voyufLTdOct5NXpM4TSUJAPmkBly6b0M_Pb5rx6uNZE6okzlAgSfJ5dzZXvTe2WbrxGsnJRaqea-001VlX2GsPNONnaEgo1DN2cLuIyt3IiBXYeNXsnbG92ms64CrDhsAgkdVQFR3T-yXK0vYj9hgal0LM12cYQ23y3r50haXC35V1Am6qRsTMLZGvffUAfiiCZFZA";

  const userAvatar = userRole === 'admin' ? adminAvatar : staffAvatar;
  const userName = userRole === 'admin' ? 'Admin User' : 'Staff Member';
  const userTitle = userRole === 'admin' ? 'Enterprise Admin' : 'Sales Representative';
  const userEmail = userRole === 'admin' ? 'admin@leadpro.io' : 'staff@leadpro.io';

  return (
    <div className="flex h-screen overflow-hidden bg-[#051424] text-[#d4e4fa]">
      {/* Sidebar - Desktop */}
      <aside className="w-[280px] h-full bg-[#122131] border-r border-[#424754] hidden md:flex flex-col z-20 shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl font-bold bg-gradient-to-r from-[#adc6ff] to-[#4d8eff] bg-clip-text text-transparent">
              LeadPro CRM
            </span>
          </div>

          {/* User Profile Summary */}
          <div className="flex items-center gap-3 p-3 bg-[#1c2b3c] rounded-xl mb-6 border border-[#273647]">
            <img
              src={userAvatar}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border border-[#424754] object-cover"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-[#d4e4fa] truncate">{userName}</p>
              <p className="text-xs text-[#c2c6d6] truncate">{userTitle}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id || (item.id === 'customers' && currentTab === 'customer_detail');
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#adc6ff] border-l-4 border-[#adc6ff] bg-[#3e495d]/30 font-semibold'
                      : 'text-[#c2c6d6] hover:bg-[#273647] hover:text-[#d4e4fa]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.indicator && (
                    <span className="bg-[#df7412] text-[#461f00] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.indicator}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-6 mt-auto border-t border-[#424754]">
          <button
            onClick={onAddLeadClick}
            id="sidebar-add-lead-btn"
            className="w-full bg-[#4d8eff] hover:bg-[#4d8eff]/90 text-[#00285d] font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#4d8eff]/10"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Lead</span>
          </button>

          <button
            onClick={onLogout}
            id="sidebar-logout-btn"
            className="w-full mt-4 text-[#c2c6d6] hover:text-white text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout session ({userRole})</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#051424]">
        {/* Header - Shared Top Bar */}
        <header className="flex justify-between items-center w-full px-6 py-4 h-16 bg-[#051424] border-b border-[#424754] sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#c2c6d6] hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Title / Logo for mobile */}
            <span className="font-bold text-[#adc6ff] md:hidden">LeadPro CRM</span>

            {/* Search leads Input */}
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c2c6d6] w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                aria-label="Search"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  currentTab === 'customers'
                    ? 'Search customers, companies...'
                    : 'Search activities, leads, or tasks...'
                }
                className="w-full bg-[#0d1c2d] border border-[#424754] rounded-full py-1.5 pl-10 pr-4 text-sm text-[#d4e4fa] placeholder-[#c2c6d6]/60 focus:outline-none focus:border-[#4d8eff] focus:ring-1 focus:ring-[#4d8eff] transition-all"
              />
            </div>
          </div>

          {/* Right Header Navigation Actions */}
          <div className="flex items-center gap-4">
            {/* Bell shortcut to Activity Center */}
            <button
              onClick={() => setCurrentTab('settings')}
              className="p-2 text-[#c2c6d6] hover:text-[#adc6ff] transition-colors relative cursor-pointer"
              title="View Activity Center"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#df7412] rounded-full border-2 border-[#051424]"></span>
              )}
            </button>

            {/* Context help */}
            <button className="p-2 text-[#c2c6d6] hover:text-[#adc6ff] transition-colors hidden sm:block">
              <CircleHelp className="w-5 h-5" />
            </button>

            <div className="h-6 w-[1px] bg-[#424754] mx-2 hidden sm:block"></div>

            <button
              onClick={onAddLeadClick}
              className="bg-[#4d8eff]/10 text-[#adc6ff] border border-[#4d8eff]/30 hover:bg-[#4d8eff]/20 px-4 py-2 rounded-lg text-xs font-semibold hover:brightness-110 transition-all cursor-pointer"
            >
              Add New
            </button>

            <img
              src={userAvatar}
              alt="User profile"
              className="w-8 h-8 rounded-full border border-[#424754] ml-2 cursor-pointer object-cover"
              onClick={() => setCurrentTab('settings')}
            />
          </div>
        </header>

        {/* Mobile slide-out nav drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-[280px] bg-[#122131] h-full flex flex-col p-6 border-r border-[#424754]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold bg-gradient-to-r from-[#adc6ff] to-[#4d8eff] bg-clip-text text-transparent">
                  LeadPro CRM
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-[#c2c6d6] border border-[#424754] px-2 py-1 rounded"
                >
                  Close
                </button>
              </div>

              {/* Summary user info */}
              <div className="flex items-center gap-3 p-3 bg-[#1c2b3c] rounded-xl mb-6 border border-[#273647]">
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full border border-[#424754]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#d4e4fa]">{userName}</p>
                  <p className="text-xs text-[#c2c6d6]">{userTitle}</p>
                </div>
              </div>

              {/* Navigation list */}
              <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm cursor-pointer ${
                        isActive
                          ? 'text-[#adc6ff] border-l-4 border-[#adc6ff] bg-[#3e495d]/30 font-semibold'
                          : 'text-[#c2c6d6] hover:bg-[#273647] hover:text-[#d4e4fa]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>
                      {item.indicator && (
                        <span className="bg-[#df7412] text-[#461f00] text-xs px-2 py-0.5 rounded-full">
                          {item.indicator}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Footer mobile actions */}
              <div className="mt-auto border-t border-[#424754] pt-4">
                <button
                  onClick={() => {
                    onAddLeadClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#4d8eff] text-[#00285d] font-semibold py-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Lead</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-4 text-[#c2c6d6] text-xs text-center cursor-pointer hover:text-white"
                >
                  Logout ({userRole})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Render View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>

        {/* Mobile Bottom Navigation (Responsive Pivot) */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#122131] border-t border-[#424754] md:hidden flex justify-around py-2 z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === 'customers' && currentTab === 'customer_detail');
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex flex-col items-center gap-1 cursor-pointer py-1 ${
                  isActive ? 'text-[#adc6ff] font-bold' : 'text-[#c2c6d6]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
