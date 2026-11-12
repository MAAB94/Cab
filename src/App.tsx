import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Booking,
  Driver,
  DriverMessage,
  ZoneSummary,
  TelephonyCall,
  BookingStatus,
  DriverStatus,
} from './types/dispatch';
import {
  INITIAL_BOOKINGS,
  INITIAL_DRIVERS,
  INITIAL_MESSAGES,
  INITIAL_ZONES,
  INITIAL_CALL_HISTORY,
} from './data/mockData';
import { soundManager } from './utils/sound';

// Layout & Navigation
import { Header } from './components/Header';
import { Sidebar, NavItemKey } from './components/Sidebar';
import { ShortcutBar } from './components/ShortcutBar';

// Dashboard Panels (Top Section)
import { DriversOnboardPanel } from './components/dashboard/DriversOnboardPanel';
import { DriversWaitingPanel } from './components/dashboard/DriversWaitingPanel';
import { OnlineDriversPanel } from './components/dashboard/OnlineDriversPanel';
import { DriverMessagesPanel } from './components/dashboard/DriverMessagesPanel';

// Bookings
import { BookingTabs, BookingTabKey } from './components/bookings/BookingTabs';
import { BookingTable } from './components/bookings/BookingTable';
import { BookingDetailsDrawer } from './components/bookings/BookingDetailsDrawer';
import { AdvanceSearchPanel } from './components/bookings/AdvanceSearchPanel';

// Modals
import { NewBookingModal } from './components/modals/NewBookingModal';
import { DispatchModal } from './components/modals/DispatchModal';
import { CancelModal } from './components/modals/CancelModal';
import { PrintVoucherModal } from './components/modals/PrintVoucherModal';
import { TrackingMapModal } from './components/modals/TrackingMapModal';
import { ShortcutsHelpModal } from './components/modals/ShortcutsHelpModal';

// Dedicated Views
import { CallHistoryView } from './components/views/CallHistoryView';
import { DriverManagementView } from './components/views/DriverManagementView';
import { VehicleManagementView } from './components/views/VehicleManagementView';
import { AccountsView } from './components/views/AccountsView';
import { FinanceView } from './components/views/FinanceView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  // Theme state (synced with HTML element for Tailwind v4 custom variant)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoDispatch, setAutoDispatch] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeNav, setActiveNav] = useState<NavItemKey>('dashboard');
  const [activeBookingTab, setActiveBookingTab] = useState<BookingTabKey>('today');

  // Core Data State
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [drivers, setDrivers] = useState<Driver[]>(INITIAL_DRIVERS);
  const [messages, setMessages] = useState<DriverMessage[]>(INITIAL_MESSAGES);
  const [zones] = useState<ZoneSummary[]>(INITIAL_ZONES);
  const [callHistory, setCallHistory] = useState<TelephonyCall[]>(INITIAL_CALL_HISTORY);

  // Selected Row & Active Entity State
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [activeDrawerBooking, setActiveDrawerBooking] = useState<Booking | null>(null);
  const [modalDispatchBooking, setModalDispatchBooking] = useState<Booking | null>(null);
  const [modalCancelBooking, setModalCancelBooking] = useState<Booking | null>(null);
  const [modalPrintBooking, setModalPrintBooking] = useState<Booking | null>(null);

  // Open / Close Modals
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState<boolean>(false);
  const [isTrackingMapOpen, setIsTrackingMapOpen] = useState<boolean>(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState<boolean>(false);

  // Notifications State
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      title: string;
      time: string;
      type: 'dispatch' | 'urgent' | 'driver' | 'info';
    }>
  >([
    { id: 'notif-1', title: 'Driver D-101 passenger on board (POB)', time: '08:18', type: 'dispatch' },
    { id: 'notif-2', title: 'New Corporate Booking CT-9048 received', time: '08:05', type: 'info' },
    { id: 'notif-3', title: 'Driver D-105 signaled Soon to Clear (STC)', time: '08:25', type: 'driver' },
  ]);

  // Sync theme class on <html> element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Push new notification helper
  const addNotification = (
    title: string,
    type: 'dispatch' | 'urgent' | 'driver' | 'info' = 'info'
  ) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    setNotifications((prev) => [{ id: `notif-${Date.now()}`, title, time, type }, ...prev]);
  };

  // Automated Dispatch Engine Simulation
  useEffect(() => {
    if (!autoDispatch) return;

    // Check for pending unassigned bookings
    const pendingBooking = bookings.find((b) => b.status === 'PENDING');
    if (!pendingBooking) return;

    // Find first available/waiting driver in the zone or closest
    const candidateDriver = drivers.find(
      (d) =>
        (d.status === 'AVAILABLE' || d.status === 'WAITING') &&
        (d.currentZone === pendingBooking.zone || true)
    );

    if (candidateDriver) {
      const timer = setTimeout(() => {
        handleConfirmDispatch(pendingBooking.id, candidateDriver, true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoDispatch, bookings, drivers]);

  // Filter Bookings according to 7 Booking Tabs
  const currentTabBookings = useMemo(() => {
    const todayStr = '2026-11-12';

    switch (activeBookingTab) {
      case 'today':
        return bookings.filter(
          (b) =>
            b.pickupDate === todayStr &&
            b.status !== 'COMPLETED' &&
            b.status !== 'CANCELLED' &&
            b.status !== 'NO_SHOW'
        );
      case 'pre_bookings':
        return bookings.filter(
          (b) =>
            b.pickupDate > todayStr ||
            (b.pickupDate === todayStr && b.status === 'PENDING' && b.pickupTime > '14:00')
        );
      case 'recent':
        return bookings.filter(
          (b) =>
            b.status === 'ALLOCATED' ||
            b.status === 'DISPATCHED' ||
            b.status === 'POB' ||
            b.status === 'STC'
        );
      case 'completed':
        return bookings.filter((b) => b.status === 'COMPLETED');
      case 'no_show':
        return bookings.filter((b) => b.status === 'NO_SHOW');
      case 'cancelled':
        return bookings.filter((b) => b.status === 'CANCELLED');
      case 'advance_search':
        return bookings;
      default:
        return bookings;
    }
  }, [activeBookingTab, bookings]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const todayStr = '2026-11-12';
    return {
      today: bookings.filter(
        (b) =>
          b.pickupDate === todayStr &&
          b.status !== 'COMPLETED' &&
          b.status !== 'CANCELLED' &&
          b.status !== 'NO_SHOW'
      ).length,
      pre: bookings.filter((b) => b.pickupDate > todayStr).length,
      recent: bookings.filter(
        (b) =>
          b.status === 'ALLOCATED' ||
          b.status === 'DISPATCHED' ||
          b.status === 'POB' ||
          b.status === 'STC'
      ).length,
      completed: bookings.filter((b) => b.status === 'COMPLETED').length,
      noShow: bookings.filter((b) => b.status === 'NO_SHOW').length,
      cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
    };
  }, [bookings]);

  // Unread messages count
  const unreadMessagesCount = useMemo(
    () => messages.filter((m) => !m.isRead).length,
    [messages]
  );

  // Missed calls count
  const missedCallsCount = useMemo(
    () => callHistory.filter((c) => c.status === 'MISSED').length,
    [callHistory]
  );

  // -------------------------------------------------------------
  // OPERATIONAL ACTION HANDLERS
  // -------------------------------------------------------------

  // Fast New Booking
  const handleCreateBooking = (newBookingData: Partial<Booking>) => {
    const nextNumber = 9050 + bookings.length;
    const ref = `CT-${nextNumber}`;
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const newBooking: Booking = {
      id: `b-${nextNumber}`,
      reference: ref,
      leadSource: newBookingData.leadSource || 'PHONE',
      pickupTime: newBookingData.pickupTime || '09:00',
      pickupDate: newBookingData.pickupDate || '2026-11-12',
      bookingTime: nowTime,
      bookingDate: '2026-11-12',
      zone: newBookingData.zone || 'W1',
      passengerName: newBookingData.passengerName || 'Customer',
      passengerPhone: newBookingData.passengerPhone || '',
      passengerCount: newBookingData.passengerCount || 1,
      luggageCount: newBookingData.luggageCount || 1,
      pickupAddress: newBookingData.pickupAddress || '',
      destinationAddress: newBookingData.destinationAddress || '',
      fare: newBookingData.fare || 25.0,
      account: newBookingData.account || 'CASH',
      paymentMethod: newBookingData.paymentMethod || 'CASH',
      vehicleType: newBookingData.vehicleType || 'Saloon',
      status: 'PENDING',
      flightNumber: newBookingData.flightNumber,
      specialInstructions: newBookingData.specialInstructions,
      activityHistory: [
        {
          id: `act-${Date.now()}`,
          timestamp: nowTime,
          action: 'Booking Created (Operational Entry)',
          operator: 'Dispatcher Sarah',
        },
      ],
    };

    setBookings((prev) => [newBooking, ...prev]);
    addNotification(`New booking ${ref} created for ${newBooking.passengerName}`, 'info');
  };

  // Dispatch Driver
  const handleConfirmDispatch = (
    bookingId: string,
    driver: Driver,
    isAuto: boolean = false
  ) => {
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          assignedDriverId: driver.id,
          assignedDriverNumber: driver.driverNumber,
          status: 'DISPATCHED',
          activityHistory: [
            ...b.activityHistory,
            {
              id: `act-${Date.now()}`,
              timestamp: nowTime,
              action: `${isAuto ? 'Auto-Dispatched' : 'Dispatched'} to Driver ${driver.driverNumber}`,
              operator: isAuto ? 'Auto Allocation Engine' : 'Dispatcher Sarah',
            },
          ],
        };
      })
    );

    // Update Driver status to ON_JOB
    const targetBooking = bookings.find((b) => b.id === bookingId);
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== driver.id) return d;
        return {
          ...d,
          status: 'ON_JOB',
          activeJobRef: targetBooking?.reference || 'DISPATCH',
          activeJobPickup: targetBooking?.pickupAddress,
          activeJobDestination: targetBooking?.destinationAddress,
          jobStatus: 'HEADING_TO_PICKUP',
          etaMinutes: 10,
          waitingDurationMinutes: 0,
        };
      })
    );

    addNotification(
      `${isAuto ? 'AUTO ' : ''}Dispatched ${targetBooking?.reference || 'Job'} to ${driver.driverNumber}`,
      'dispatch'
    );
  };

  // Release Driver (Free up driver from booking)
  const handleReleaseDriver = (booking: Booking) => {
    if (!booking.assignedDriverId) return;

    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // Release booking back to PENDING
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== booking.id) return b;
        return {
          ...b,
          assignedDriverId: undefined,
          assignedDriverNumber: undefined,
          status: 'PENDING',
          activityHistory: [
            ...b.activityHistory,
            {
              id: `act-${Date.now()}`,
              timestamp: nowTime,
              action: `Driver ${b.assignedDriverNumber} released`,
              operator: 'Dispatcher Sarah',
            },
          ],
        };
      })
    );

    // Return driver to AVAILABLE
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== booking.assignedDriverId) return d;
        return {
          ...d,
          status: 'AVAILABLE',
          activeJobRef: undefined,
          activeJobPickup: undefined,
          activeJobDestination: undefined,
          jobStatus: undefined,
          etaMinutes: undefined,
          waitingDurationMinutes: 1,
        };
      })
    );

    soundManager.playRadioClick();
    addNotification(`Driver ${booking.assignedDriverNumber} released from ${booking.reference}`, 'driver');
  };

  // FOJ / Free On Job (Soon To Clear toggle)
  const handleFojDriver = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id !== driverId) return d;
        const nextStatus = d.jobStatus === 'STC' ? 'POB' : 'STC';
        return {
          ...d,
          jobStatus: nextStatus,
        };
      })
    );

    // Sync booking status
    const driver = drivers.find((d) => d.id === driverId);
    if (driver?.activeJobRef) {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.reference !== driver.activeJobRef) return b;
          const next = b.status === 'STC' ? 'POB' : 'STC';
          return { ...b, status: next };
        })
      );
    }

    addNotification(`Driver ${driver?.driverNumber} signaled FOJ / Soon to Clear`, 'driver');
  };

  // Hold / Resume Booking
  const handleHoldToggle = (booking: Booking) => {
    const nextStatus: BookingStatus = booking.status === 'ON_HOLD' ? 'PENDING' : 'ON_HOLD';
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== booking.id) return b;
        return {
          ...b,
          status: nextStatus,
          activityHistory: [
            ...b.activityHistory,
            {
              id: `act-${Date.now()}`,
              timestamp: nowTime,
              action: nextStatus === 'ON_HOLD' ? 'Booking placed ON HOLD' : 'Booking RESUMED',
              operator: 'Dispatcher Sarah',
            },
          ],
        };
      })
    );

    soundManager.playRadioClick();
    addNotification(`Booking ${booking.reference} is now ${nextStatus}`, 'info');
  };

  // Cancel Booking
  const handleConfirmCancel = (bookingId: string, reason: string) => {
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const target = bookings.find((b) => b.id === bookingId);
    if (target?.assignedDriverId) {
      // Free the driver
      setDrivers((prev) =>
        prev.map((d) => {
          if (d.id !== target.assignedDriverId) return d;
          return {
            ...d,
            status: 'AVAILABLE',
            activeJobRef: undefined,
            activeJobPickup: undefined,
            activeJobDestination: undefined,
            jobStatus: undefined,
          };
        })
      );
    }

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        return {
          ...b,
          status: 'CANCELLED',
          cancellationReason: reason,
          cancelledBy: 'Dispatcher Sarah',
          cancelledAt: `${nowTime} (12 Nov 2026)`,
          activityHistory: [
            ...b.activityHistory,
            {
              id: `act-${Date.now()}`,
              timestamp: nowTime,
              action: `Cancelled: ${reason}`,
              operator: 'Dispatcher Sarah',
            },
          ],
        };
      })
    );

    addNotification(`Booking ${target?.reference} CANCELLED (${reason})`, 'urgent');
  };

  // Mark Completed
  const handleCompleteBooking = (booking: Booking) => {
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== booking.id) return b;
        return {
          ...b,
          status: 'COMPLETED',
          activityHistory: [
            ...b.activityHistory,
            {
              id: `act-${Date.now()}`,
              timestamp: nowTime,
              action: `Job completed £${b.fare.toFixed(2)}`,
              operator: 'Dispatcher Sarah',
            },
          ],
        };
      })
    );

    if (booking.assignedDriverId) {
      setDrivers((prev) =>
        prev.map((d) => {
          if (d.id !== booking.assignedDriverId) return d;
          return {
            ...d,
            status: 'AVAILABLE',
            activeJobRef: undefined,
            activeJobPickup: undefined,
            activeJobDestination: undefined,
            jobStatus: undefined,
            totalJobsToday: d.totalJobsToday + 1,
            earningsToday: d.earningsToday + booking.fare,
            waitingDurationMinutes: 0,
          };
        })
      );
    }

    soundManager.playDispatch();
    addNotification(`Job ${booking.reference} marked COMPLETED`, 'dispatch');
  };

  // Mark No Show
  const handleMarkNoShow = (booking: Booking) => {
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== booking.id) return b;
        return {
          ...b,
          status: 'NO_SHOW',
          noShowReason: 'Driver waited 15 mins at pickup location. Passenger unresponsive.',
          activityHistory: [
            ...b.activityHistory,
            {
              id: `act-${Date.now()}`,
              timestamp: nowTime,
              action: 'Marked NO SHOW by controller',
              operator: 'Dispatcher Sarah',
            },
          ],
        };
      })
    );

    if (booking.assignedDriverId) {
      setDrivers((prev) =>
        prev.map((d) => {
          if (d.id !== booking.assignedDriverId) return d;
          return {
            ...d,
            status: 'AVAILABLE',
            activeJobRef: undefined,
            activeJobPickup: undefined,
            activeJobDestination: undefined,
            jobStatus: undefined,
            waitingDurationMinutes: 0,
          };
        })
      );
    }

    addNotification(`Booking ${booking.reference} marked NO SHOW`, 'urgent');
  };

  // Driver MDT Message Send
  const handleSendMessage = (driverNumber: string, messageText: string) => {
    const driver = drivers.find((d) => d.driverNumber === driverNumber);
    const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const newMsg: DriverMessage = {
      id: `msg-${Date.now()}`,
      driverId: driver?.id || 'drv-gen',
      driverNumber,
      message: messageText,
      timestamp: nowTime,
      direction: 'OUTGOING',
      isRead: true,
    };

    setMessages((prev) => [newMsg, ...prev]);
    addNotification(`MDT message transmitted to ${driverNumber}`, 'driver');
  };

  // Mark message as read
  const handleMarkMessageRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isRead: true } : m))
    );
  };

  // Driver status shift (Available / Break / Suspended)
  const handleUpdateDriverStatus = (driverId: string, status: DriverStatus) => {
    setDrivers((prev) =>
      prev.map((d) => (d.id === driverId ? { ...d, status } : d))
    );
    soundManager.playRadioClick();
  };

  // Convert Telephony Call to Quick Booking
  const handleBookFromCall = (call: TelephonyCall) => {
    setIsNewBookingModalOpen(true);
    // Mark call as BOOKED
    setCallHistory((prev) =>
      prev.map((c) => (c.id === call.id ? { ...c, status: 'BOOKED' } : c))
    );
  };

  // -------------------------------------------------------------
  // KEYBOARD SHORTCUTS ENGINE (Section 7)
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard: Do not trigger when typing inside inputs, textareas or selects
      const activeElement = document.activeElement;
      const isInput =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          (activeElement as HTMLElement).isContentEditable);

      if (isInput) return;

      // CTRL + M = Tracking Map
      if ((e.ctrlKey || e.metaKey) && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setIsTrackingMapOpen((prev) => !prev);
        soundManager.playRadioClick();
        return;
      }

      // SPACE = New Booking
      if (e.code === 'Space') {
        e.preventDefault();
        setIsNewBookingModalOpen(true);
        soundManager.playRadioClick();
        return;
      }

      // Find the first selected booking or top pending booking
      const selectedBooking =
        bookings.find((b) => selectedBookingIds.includes(b.id)) ||
        bookings.find((b) => b.status === 'PENDING');

      // D = Dispatch
      if (e.key === 'd' || e.key === 'D') {
        if (selectedBooking && selectedBooking.status === 'PENDING') {
          e.preventDefault();
          setModalDispatchBooking(selectedBooking);
        }
        return;
      }

      // C = Cancel
      if (e.key === 'c' || e.key === 'C') {
        if (selectedBooking && selectedBooking.status !== 'CANCELLED') {
          e.preventDefault();
          setModalCancelBooking(selectedBooking);
        }
        return;
      }

      // H = Hold
      if (e.key === 'h' || e.key === 'H') {
        if (selectedBooking) {
          e.preventDefault();
          handleHoldToggle(selectedBooking);
        }
        return;
      }

      // E = Edit
      if (e.key === 'e' || e.key === 'E') {
        if (selectedBooking) {
          e.preventDefault();
          setActiveDrawerBooking(selectedBooking);
        }
        return;
      }

      // R = Release Driver
      if (e.key === 'r' || e.key === 'R') {
        if (selectedBooking && selectedBooking.assignedDriverId) {
          e.preventDefault();
          handleReleaseDriver(selectedBooking);
        }
        return;
      }

      // F = FOJ operation
      if (e.key === 'f' || e.key === 'F') {
        const onboardDriver = drivers.find((d) => d.status === 'ON_JOB');
        if (onboardDriver) {
          e.preventDefault();
          handleFojDriver(onboardDriver.id);
        }
        return;
      }

      // P = Pre Booking Tab
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setActiveNav('dashboard');
        setActiveBookingTab('pre_bookings');
        soundManager.playRadioClick();
        return;
      }

      // ESC = Close modal/drawer
      if (e.key === 'Escape') {
        setActiveDrawerBooking(null);
        setModalDispatchBooking(null);
        setModalCancelBooking(null);
        setModalPrintBooking(null);
        setIsNewBookingModalOpen(false);
        setIsTrackingMapOpen(false);
        setIsShortcutsHelpOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bookings, drivers, selectedBookingIds]);

  return (
    <div className="flex flex-col min-h-screen bg-[#edf3f8] dark:bg-[#060c16] text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP APPLICATION HEADER */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        autoDispatch={autoDispatch}
        setAutoDispatch={setAutoDispatch}
        theme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        notifications={notifications}
        onClearNotifications={() => setNotifications([])}
        onOpenNewBooking={() => setIsNewBookingModalOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex flex-1 items-stretch overflow-hidden">
        {/* 2. LEFT SIDEBAR */}
        <Sidebar
          activeNav={activeNav}
          setActiveNav={(nav) => {
            setActiveNav(nav);
            soundManager.playRadioClick();
          }}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          unreadMessagesCount={unreadMessagesCount}
          missedCallsCount={missedCallsCount}
          onOpenNewBooking={() => setIsNewBookingModalOpen(true)}
          onOpenTrackingMap={() => setIsTrackingMapOpen(true)}
        />

        {/* 3. CENTRAL CONTENT VIEWPORT */}
        <main className="flex-1 flex flex-col p-2 space-y-2 overflow-x-hidden overflow-y-auto">
          {/* Active Navigation Switch */}
          {activeNav === 'dashboard' && (
            <>
              {/* TOP COMMAND SECTION: 4 Operational Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 h-auto shrink-0">
                {/* Panel A: Drivers Onboard */}
                <div className="h-[185px]">
                  <DriversOnboardPanel
                    drivers={drivers}
                    onSelectDriver={(driver) => {
                      const job = bookings.find((b) => b.reference === driver.activeJobRef);
                      if (job) setActiveDrawerBooking(job);
                    }}
                    onFojDriver={handleFojDriver}
                  />
                </div>

                {/* Panel B: Drivers Waiting Queue */}
                <div className="h-[185px]">
                  <DriversWaitingPanel
                    drivers={drivers}
                    onSelectDriver={(driver) => {
                      addNotification(`Inspecting queue driver ${driver.driverNumber}`, 'driver');
                    }}
                    onQuickDispatch={(driver) => {
                      const firstPending = bookings.find((b) => b.status === 'PENDING');
                      if (firstPending) {
                        handleConfirmDispatch(firstPending.id, driver);
                      } else {
                        addNotification('No pending bookings available to dispatch', 'info');
                      }
                    }}
                  />
                </div>

                {/* Panel C: Online Drivers */}
                <div className="h-[185px]">
                  <OnlineDriversPanel
                    drivers={drivers}
                    zones={zones}
                    onSelectDriver={(driver) => {
                      setIsTrackingMapOpen(true);
                    }}
                  />
                </div>

                {/* Panel D: Driver Messages MDT */}
                <div className="h-[185px]">
                  <DriverMessagesPanel
                    messages={messages}
                    drivers={drivers}
                    onSendMessage={handleSendMessage}
                    onMarkRead={handleMarkMessageRead}
                  />
                </div>
              </div>

              {/* 7 BOOKING OPERATIONAL TABS */}
              <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
                <BookingTabs
                  activeTab={activeBookingTab}
                  setActiveTab={(tab) => {
                    setActiveBookingTab(tab);
                    setSelectedBookingIds([]);
                    soundManager.playRadioClick();
                  }}
                  counts={tabCounts}
                />

                {/* Tab View: Table vs Dedicated Advance Search */}
                <div className="flex-1 min-h-[360px] overflow-hidden">
                  {activeBookingTab === 'advance_search' ? (
                    <AdvanceSearchPanel
                      allBookings={bookings}
                      onViewDetails={(booking) => setActiveDrawerBooking(booking)}
                    />
                  ) : (
                    <BookingTable
                      bookings={currentTabBookings}
                      drivers={drivers}
                      selectedBookingIds={selectedBookingIds}
                      onToggleSelectBooking={(id) => {
                        setSelectedBookingIds((prev) =>
                          prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                        );
                      }}
                      onSelectAll={(ids) => setSelectedBookingIds(ids)}
                      onDispatch={(booking) => setModalDispatchBooking(booking)}
                      onEdit={(booking) => setActiveDrawerBooking(booking)}
                      onCancel={(booking) => setModalCancelBooking(booking)}
                      onHoldToggle={handleHoldToggle}
                      onViewDetails={(booking) => setActiveDrawerBooking(booking)}
                      onPrint={(booking) => setModalPrintBooking(booking)}
                      onMarkNoShow={handleMarkNoShow}
                      onComplete={handleCompleteBooking}
                      groupByTimeSlots={activeBookingTab === 'today'}
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {activeNav === 'call_history' && (
            <div className="flex-1 min-h-[500px]">
              <CallHistoryView
                calls={callHistory}
                onBookCall={handleBookFromCall}
              />
            </div>
          )}

          {activeNav === 'advance_booking' && (
            <div className="flex-1 min-h-[500px]">
              <BookingTable
                bookings={bookings.filter((b) => b.pickupDate > '2026-11-12')}
                drivers={drivers}
                selectedBookingIds={selectedBookingIds}
                onToggleSelectBooking={(id) =>
                  setSelectedBookingIds((prev) =>
                    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                  )
                }
                onSelectAll={(ids) => setSelectedBookingIds(ids)}
                onDispatch={(booking) => setModalDispatchBooking(booking)}
                onEdit={(booking) => setActiveDrawerBooking(booking)}
                onCancel={(booking) => setModalCancelBooking(booking)}
                onHoldToggle={handleHoldToggle}
                onViewDetails={(booking) => setActiveDrawerBooking(booking)}
                onPrint={(booking) => setModalPrintBooking(booking)}
                onMarkNoShow={handleMarkNoShow}
                onComplete={handleCompleteBooking}
                groupByTimeSlots={false}
              />
            </div>
          )}

          {activeNav === 'drivers' && (
            <div className="flex-1 min-h-[500px]">
              <DriverManagementView
                drivers={drivers}
                onUpdateDriverStatus={handleUpdateDriverStatus}
              />
            </div>
          )}

          {activeNav === 'vehicles' && (
            <div className="flex-1 min-h-[500px]">
              <VehicleManagementView drivers={drivers} />
            </div>
          )}

          {activeNav === 'accounts' && (
            <div className="flex-1 min-h-[500px]">
              <AccountsView
                onSelectAccount={(accountName) => {
                  setActiveNav('dashboard');
                  setActiveBookingTab('today');
                }}
              />
            </div>
          )}

          {activeNav === 'finance' && (
            <div className="flex-1 min-h-[500px]">
              <FinanceView />
            </div>
          )}

          {activeNav === 'reports' && (
            <div className="flex-1 min-h-[500px]">
              <ReportsView />
            </div>
          )}

          {activeNav === 'messages' && (
            <div className="flex-1 min-h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4">
              <DriverMessagesPanel
                messages={messages}
                drivers={drivers}
                onSendMessage={handleSendMessage}
                onMarkRead={handleMarkMessageRead}
              />
            </div>
          )}

          {activeNav === 'settings' && (
            <div className="flex-1 min-h-[500px]">
              <SettingsView
                autoDispatch={autoDispatch}
                setAutoDispatch={setAutoDispatch}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
              />
            </div>
          )}
        </main>
      </div>

      {/* 4. FIXED BOTTOM SHORTCUT BAR */}
      <ShortcutBar
        onOpenHelp={() => setIsShortcutsHelpOpen(true)}
        onOpenNewBooking={() => setIsNewBookingModalOpen(true)}
        onOpenTrackingMap={() => setIsTrackingMapOpen(true)}
        selectedCount={selectedBookingIds.length}
      />

      {/* 5. SLIDE-OUT BOOKING DETAILS DRAWER */}
      <BookingDetailsDrawer
        booking={activeDrawerBooking}
        onClose={() => setActiveDrawerBooking(null)}
        onDispatch={(b) => {
          setActiveDrawerBooking(null);
          setModalDispatchBooking(b);
        }}
        onPrint={(b) => setModalPrintBooking(b)}
        onHoldToggle={handleHoldToggle}
      />

      {/* 6. OPERATIONAL MODALS */}
      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        onCreateBooking={handleCreateBooking}
      />

      <DispatchModal
        isOpen={!!modalDispatchBooking}
        booking={modalDispatchBooking}
        drivers={drivers}
        onClose={() => setModalDispatchBooking(null)}
        onConfirmDispatch={handleConfirmDispatch}
      />

      <CancelModal
        isOpen={!!modalCancelBooking}
        booking={modalCancelBooking}
        onClose={() => setModalCancelBooking(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      <PrintVoucherModal
        isOpen={!!modalPrintBooking}
        booking={modalPrintBooking}
        onClose={() => setModalPrintBooking(null)}
      />

      <TrackingMapModal
        isOpen={isTrackingMapOpen}
        onClose={() => setIsTrackingMapOpen(false)}
        drivers={drivers}
        activeBookings={bookings.filter((b) => b.status === 'POB' || b.status === 'STC')}
      />

      <ShortcutsHelpModal
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />
    </div>
  );
}
