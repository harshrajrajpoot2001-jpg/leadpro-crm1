import React, { useState, useEffect } from 'react';
import { Customer, Task, Notification, TimelineActivity, ActivityLog, FollowUp, CallReminder } from './types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_TIMELINE,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS
} from './data';

import {
  subscribeCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  seedInitialCustomers,
  subscribeFollowUps,
  addFollowUp,
  updateFollowUp,
  deleteFollowUp,
  seedInitialFollowUps
} from './crmDb';

import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import CustomerDetail from './components/CustomerDetail';
import AddLeadModal from './components/AddLeadModal';
import ActivityCenter from './components/ActivityCenter';
import { auth } from './firebase';

export default function App() {
  // Session authentication states
  const [userRole, setUserRole] = useState<'admin' | 'staff' | null>(() => {
    const saved = localStorage.getItem('leadpro_session_role');
    return saved ? (saved as 'admin' | 'staff') : null;
  });

  const [sessionUid, setSessionUid] = useState<string | null>(() => {
    return localStorage.getItem('leadpro_session_uid');
  });

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Monitor Firebase Authentication state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // App core module navigation
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const saved = localStorage.getItem('leadpro_current_tab');
    return saved ? saved : 'dashboard';
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(() => {
    return localStorage.getItem('leadpro_selected_customer_id');
  });

  // Master persistent local states
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('leadpro_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem('leadpro_followups');
    if (saved) return JSON.parse(saved);
    // Seed default follow-ups for offline mode
    const mockDates = [
      new Date().toISOString().split('T')[0],
      new Date(Date.now() + 86400000).toISOString().split('T')[0],
      new Date(Date.now() - 86400000).toISOString().split('T')[0]
    ];
    return [
      {
        id: 'fup-1',
        customerId: 'as-1',
        customerName: 'Alex Sterling',
        phone: '+1 (555) 348-1124',
        city: 'Seattle, WA, USA',
        status: 'Pending',
        followUpDate: mockDates[0],
        assignedTo: 'admin@company.com',
        remark: 'Discuss fleet maintenance solution package terms',
        createdAt: new Date().toISOString()
      },
      {
        id: 'fup-2',
        customerId: 'mk-2',
        customerName: 'Maya Kovic',
        phone: '+1 (555) 789-3221',
        city: 'Austin, TX, USA',
        status: 'Pending',
        followUpDate: mockDates[0],
        assignedTo: 'staff@company.com',
        remark: 'Pitch Enterprise trial subscription option',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [timeline, setTimeline] = useState<TimelineActivity[]>(() => {
    const saved = localStorage.getItem('leadpro_timeline');
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('leadpro_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('leadpro_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('leadpro_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [callReminders, setCallReminders] = useState<CallReminder[]>(() => {
    const saved = localStorage.getItem('leadpro_call_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeAlarm, setActiveAlarm] = useState<CallReminder | null>(null);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Lead Modal states
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  // Sync state mutations to local storage for realistic persistent feel
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('leadpro_session_role', userRole);
    } else {
      localStorage.removeItem('leadpro_session_role');
    }
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('leadpro_current_tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    if (selectedCustomerId) {
      localStorage.setItem('leadpro_selected_customer_id', selectedCustomerId);
    } else {
      localStorage.removeItem('leadpro_selected_customer_id');
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    localStorage.setItem('leadpro_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('leadpro_followups', JSON.stringify(followUps));
  }, [followUps]);

  useEffect(() => {
    localStorage.setItem('leadpro_timeline', JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem('leadpro_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('leadpro_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('leadpro_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('leadpro_call_reminders', JSON.stringify(callReminders));
  }, [callReminders]);

  // Call Reminders Background alarm clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const h = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const timeStr = `${y}-${m}-${d}T${h}:${min}`;

      const dueReminders = callReminders.filter(rem => {
        if (rem.status !== 'Scheduled') return false;
        return rem.dateTime <= timeStr;
      });

      if (dueReminders.length > 0) {
        const reminder = dueReminders[0];

        // Synthesize dynamic triple audio beep waves (Web Audio completely safe in browsers)
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const playBeep = (delay: number, frequency: number, duration: number) => {
            setTimeout(() => {
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.type = 'sine';
              osc.frequency.value = frequency;
              gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
              osc.start();
              osc.stop(audioCtx.currentTime + duration);
            }, delay);
          };

          playBeep(0, 950, 0.2);
          playBeep(250, 950, 0.2);
          playBeep(500, 1300, 0.35);
        } catch (err) {
          console.warn('Browser Audio Context warning:', err);
        }

        // Trigger alarm states
        setActiveAlarm(reminder);
        setCallReminders(prev => prev.map(r => r.id === reminder.id ? { ...r, status: 'Notified' } : r));

        setNotifications(prev => [
          {
            id: `notif-alarm-${Date.now()}`,
            type: 'warning',
            title: '📞 CALL REMINDER ALARM',
            message: `Callback scheduled with ${reminder.customerName} (${reminder.customerPhone}) is waitlisted now! Note: "${reminder.notes}"`,
            timeRel: 'Just now',
            category: 'Urgent',
            isUnread: true
          },
          ...prev
        ]);

        setActivityLogs(prev => [
          {
            id: `log-rem-${Date.now()}`,
            text: `Call alarm ringed for ${reminder.customerName}`,
            timeRel: 'Just now',
            type: 'tertiary'
          },
          ...prev.slice(0, 2)
        ]);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [callReminders]);

  // Firestore Snapshots synchronization for real-time reactive boards
  useEffect(() => {
    if (!userRole) return;
    if (isAuthChecking) return;

    // Check if we are using a mock/local session, in which case we don't need Firebase Auth or Firestore
    const isMockSession = sessionUid?.startsWith('mock-');

    if (isMockSession) {
      console.log("Using high-fidelity local session. Skipping Firestore subscriptions.");
      return;
    }

    // If we don't have a Firebase user, DO NOT subscribe/seed yet!
    // This is because we would get an instant permission denied error as the unauthenticated user.
    if (!currentUser) {
      console.log("Waiting for firebase auth to settle. Skipping database subscriptions.");
      return;
    }

    console.log("Firebase context ready. Subscribing to collections...", currentUser?.uid || sessionUid);

    // A. Subscribe to Customers
    const unsubscribeCustomers = subscribeCustomers(
      (docs) => {
        if (docs && docs.length > 0) {
          setCustomers(docs);
        }
      },
      (err) => {
        console.warn("Firestore customer connection failed (offline mode fallback):", err);
      }
    );

    // B. Subscribe to Follow-ups
    const unsubscribeFollowUps = subscribeFollowUps(
      (docs) => {
        if (docs) {
          setFollowUps(docs);
        }
      },
      (err) => {
        console.warn("Firestore follow-ups connection failed (offline mode fallback):", err);
      }
    );

    // C. Fire initial seeding queries in background safely
    seedInitialCustomers(INITIAL_CUSTOMERS).then(() => {
      seedInitialFollowUps(INITIAL_CUSTOMERS);
    });

    return () => {
      unsubscribeCustomers();
      unsubscribeFollowUps();
    };
  }, [userRole, isAuthChecking, currentUser, sessionUid]);

  // Guard against stale userRole in localStorage when not authenticated
  useEffect(() => {
    if (!isAuthChecking && userRole && !currentUser) {
      const isMockSession = sessionUid?.startsWith('mock-');
      if (!isMockSession) {
        console.log("Stale userRole in localStorage found without auth. Logging out...");
        handleLogout();
      }
    }
  }, [isAuthChecking, userRole, currentUser, sessionUid]);

  // Handle successful login
  const handleLoginSuccess = (role: 'admin' | 'staff', userDetails?: { uid: string; email: string }) => {
    setUserRole(role);
    if (userDetails?.uid) {
      setSessionUid(userDetails.uid);
      localStorage.setItem('leadpro_session_uid', userDetails.uid);
    }
    setCurrentTab('dashboard');
  };

  // Handle logout session
  const handleLogout = async () => {
    setUserRole(null);
    setSessionUid(null);
    localStorage.clear();
    try {
      await auth.signOut();
    } catch (e) {
      console.warn("Sign out err:", e);
    }
    // reload items back to memory
    setCustomers(INITIAL_CUSTOMERS);
    setTimeline(INITIAL_TIMELINE);
    setTasks(INITIAL_TASKS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setSelectedCustomerId(null);
    setSearchQuery('');
  };

  // Select single customer detail
  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setCurrentTab('customer_detail');
  };

  // Return click on detail back to listing directory
  const handleBackToCustomers = () => {
    setSelectedCustomerId(null);
    setCurrentTab('customers');
  };

  // Open Lead edit form
  const handleEditCustomerClick = (customer: Customer) => {
    setEditCustomer(customer);
    setIsLeadModalOpen(true);
  };

  // Create or Update Lead handler
  const handleSaveLead = async (customerData: Partial<Customer>) => {
    if (editCustomer) {
      // 1. UPDATE MODE
      const success = await updateCustomer(editCustomer.id, customerData);
      if (!success) {
        // Fallback local update
        const updatedCustomers = customers.map(c => {
          if (c.id === editCustomer.id) {
            const initials = customerData.name
              ? customerData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
              : c.avatarInitials;

            return {
              ...c,
              ...customerData,
              avatarInitials: initials
            } as Customer;
          }
          return c;
        });
        setCustomers(updatedCustomers);
      }

      // Create update Activity Log entries
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        text: `Updated profile details for customer: ${customerData.name}`,
        timeRel: 'Just now',
        type: 'primary'
      };
      setActivityLogs(prev => [newLog, ...prev.slice(0, 2)]);
    } else {
      // 2. CREATE MODE
      const initials = customerData.name
        ? customerData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : 'NL';

      const payload: Partial<Customer> = {
        ...customerData,
        avatarInitials: initials,
        lastFollowUpDate: new Date().toISOString().split('T')[0],
        lastFollowUpRel: 'Today'
      };

      const newId = await addCustomer(payload);
      if (!newId) {
        // Fallback local creation
        const newCustomer: Customer = {
          id: `cust-${Date.now()}`,
          name: customerData.name || 'New Lead',
          company: customerData.company || 'Unknown Inc.',
          email: customerData.email || 'contact@company.com',
          phone: customerData.phone || '+1 (555) 000-0000',
          office: customerData.office || 'Seattle, WA, USA',
          leadSource: customerData.leadSource || 'Direct Referral',
          status: customerData.status || 'New',
          lastFollowUpDate: new Date().toISOString().split('T')[0],
          lastFollowUpRel: 'Today',
          avatarInitials: initials,
          isVip: !!customerData.isVip
        };
        setCustomers([newCustomer, ...customers]);
      }

      // Create new lead assigned alert notifications
      const newAlert: Notification = {
        id: `notif-${Date.now()}`,
        type: 'person_add',
        title: 'New customer profile registered',
        message: `${customerData.name || 'New Lead'} from ${customerData.company || 'Unknown Inc.'} was logged into your system pipeline. Check details.`,
        timeRel: 'Just now',
        category: 'Hot Lead',
        isUnread: true
      };
      setNotifications(prev => [newAlert, ...prev]);

      // Add to master feed history timeline
      const newTimelineActivity: TimelineActivity = {
        id: `tl-${Date.now()}`,
        customerId: newId || `cust-${Date.now()}`,
        type: 'qualification',
        title: 'Lead Profile Created',
        dateTimeStr: 'Just now',
        description: 'New enterprise contact logged manually from administration terminal.'
      };
      setTimeline(prev => [newTimelineActivity, ...prev]);

      // Create activity log
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        text: `New lead assigned: ${customerData.name}`,
        timeRel: 'Just now',
        type: 'secondary'
      };
      setActivityLogs(prev => [newLog, ...prev.slice(0, 2)]);
    }

    // close and cleanup modal trigger elements
    setIsLeadModalOpen(false);
    setEditCustomer(null);
  };

  const handleDeleteCustomer = async (id: string) => {
    const success = await deleteCustomer(id);
    if (!success) {
      setCustomers(prev => prev.filter(c => c.id !== id));
    }
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      text: `Deleted customer record.`,
      timeRel: 'Just now',
      type: 'tertiary'
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 2)]);
  };

  const handleToggleFollowUp = async (id: string) => {
    const item = followUps.find(f => f.id === id);
    if (!item) return;
    const nextStatus = item.status === 'Completed' ? 'Pending' : 'Completed';
    const success = await updateFollowUp(id, { status: nextStatus });
    if (!success) {
      setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: nextStatus } : f));
    }
  };

  const handleAddFollowUp = async (data: Partial<FollowUp>) => {
    const successId = await addFollowUp(data);
    if (!successId) {
      const localItem: FollowUp = {
        id: `fup-${Date.now()}`,
        customerId: data.customerId || `cust-${Date.now()}`,
        customerName: data.customerName || 'New Contact',
        phone: data.phone || '',
        city: data.city || '',
        status: data.status || 'Pending',
        followUpDate: data.followUpDate || new Date().toISOString().split('T')[0],
        assignedTo: data.assignedTo || 'staff@company.com',
        remark: data.remark || ''
      };
      setFollowUps(prev => [localItem, ...prev]);
    }
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      text: `Created new follow-up for client ${data.customerName}`,
      timeRel: 'Just now',
      type: 'secondary'
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 2)]);
  };

  const currentUnreadCount = notifications.filter(n => n.isUnread).length;

  // Render Login page if session is unauthenticated
  if (!userRole) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Find active customer if rendering details
  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  return (
    <Layout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      unreadCount={currentUnreadCount}
      onAddLeadClick={() => {
        setEditCustomer(null);
        setIsLeadModalOpen(true);
      }}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      userRole={userRole}
      onLogout={handleLogout}
    >
      {/* Dynamic Main view switcher */}
      {currentTab === 'dashboard' && (
        <Dashboard
          customers={customers}
          followUps={followUps}
          onToggleFollowUp={handleToggleFollowUp}
          onAddFollowUp={handleAddFollowUp}
          tasks={tasks}
          setTasks={setTasks}
          notifications={notifications}
          setNotifications={setNotifications}
          activityLogs={activityLogs}
          onSelectCustomer={handleSelectCustomer}
          setCurrentTab={setCurrentTab}
          userRole={userRole}
        />
      )}

      {currentTab === 'customers' && (
        <Customers
          customers={customers}
          setCustomers={setCustomers}
          activityLogs={activityLogs}
          setActivityLogs={setActivityLogs}
          setTimeline={setTimeline}
          onSelectCustomer={handleSelectCustomer}
          setCurrentTab={setCurrentTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onEditCustomerClick={handleEditCustomerClick}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}

      {currentTab === 'customer_detail' && activeCustomer && (
        <CustomerDetail
          customer={activeCustomer}
          onBack={handleBackToCustomers}
          timeline={timeline}
          setTimeline={setTimeline}
          setTasks={setTasks}
          setActivityLogs={setActivityLogs}
          onEditCustomerClick={handleEditCustomerClick}
          onScheduleCallReminder={(reminder) => {
            setCallReminders(prev => [...prev, reminder]);
            setActivityLogs(prev => [
              {
                id: `log-sch-${Date.now()}`,
                text: `Registered Call Reminder alert for ${reminder.customerName} at ${reminder.dateTime.replace('T', ' ')}`,
                timeRel: 'Just now',
                type: 'primary'
              },
              ...prev.slice(0, 2)
            ]);
          }}
        />
      )}

      {currentTab === 'settings' && (
        <ActivityCenter
          notifications={notifications}
          setNotifications={setNotifications}
          onSelectCustomer={handleSelectCustomer}
          setCurrentTab={setCurrentTab}
          searchQuery={searchQuery}
        />
      )}

      {/* Add / Edit Lead Popup overlays */}
      <AddLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          setIsLeadModalOpen(false);
          setEditCustomer(null);
        }}
        onSave={handleSaveLead}
        editCustomer={editCustomer}
      />

      {/* Active Call Reminder Alarm Modal */}
      {activeAlarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in text-[#d4e4fa]">
          <div className="bg-[#122131] border-2 border-red-500 rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center space-y-5 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
            
            <div className="flex flex-col items-center gap-1.5 pt-2">
              <span className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center border border-red-500/30 animate-bounce">
                <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <h3 className="text-lg font-black text-rose-400 mt-2 tracking-wide uppercase">📞 CALL REMINDER ALARM</h3>
              <p className="text-[11px] text-[#c2c6d6] max-w-xs mt-0.5">
                You have a scheduled backup call waitlisted right now:
              </p>
            </div>

            <div className="bg-[#0c1c2d] border border-[#273647] p-4.5 rounded-2xl text-center space-y-1">
              <p className="text-base font-extrabold text-white">{activeAlarm.customerName}</p>
              <p className="text-xs font-mono text-[#adc6ff] font-semibold select-all">{activeAlarm.customerPhone}</p>
              {activeAlarm.notes && (
                <p className="text-[11px] text-[#8c909f] border-t border-[#273647]/50 pt-2.5 mt-2.5 italic leading-normal">
                  "{activeAlarm.notes}"
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => {
                  try {
                    const link = `tel:${activeAlarm.customerPhone.replace(/[^\d+]/g, '')}`;
                    window.location.href = link;
                  } catch (e) {
                    console.warn(e);
                  }
                  setActivityLogs(prev => [
                    {
                      id: `started-call-${Date.now()}`,
                      text: `Dialing call line for ${activeAlarm.customerName}`,
                      timeRel: 'Just now',
                      type: 'primary'
                    },
                    ...prev.slice(0, 2)
                  ]);
                  setActiveAlarm(null);
                }}
                className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-green-500/10 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Dial Now</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const updatedTime = new Date(Date.now() + 120 * 1000);
                    const y = updatedTime.getFullYear();
                    const m = String(updatedTime.getMonth() + 1).padStart(2, '0');
                    const d = String(updatedTime.getDate()).padStart(2, '0');
                    const h = String(updatedTime.getHours()).padStart(2, '0');
                    const min = String(updatedTime.getMinutes()).padStart(2, '0');
                    const newDateTime = `${y}-${m}-${d}T${h}:${min}`;

                    setCallReminders(prev => prev.map(r => r.id === activeAlarm.id ? { ...r, dateTime: newDateTime, status: 'Scheduled' } : r));
                    setActiveAlarm(null);
                  }}
                  className="py-2.5 bg-[#1c2b3c] hover:bg-[#273647] text-[#adc6ff] border border-[#424754] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Snooze 2m
                </button>
                <button
                  onClick={() => {
                    setCallReminders(prev => prev.map(r => r.id === activeAlarm.id ? { ...r, status: 'Dismissed' } : r));
                    setActiveAlarm(null);
                  }}
                  className="py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
