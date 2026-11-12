import React, { useState } from 'react';
import { Booking } from '../../types/dispatch';
import { Search, RotateCcw, Download, Eye } from 'lucide-react';
import { formatCurrency, getStatusBadgeClasses } from '../../utils/formatters';

interface AdvanceSearchPanelProps {
  allBookings: Booking[];
  onViewDetails: (booking: Booking) => void;
}

export const AdvanceSearchPanel: React.FC<AdvanceSearchPanelProps> = ({
  allBookings,
  onViewDetails,
}) => {
  const [paymentRef, setPaymentRef] = useState('');
  const [account, setAccount] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const handleReset = () => {
    setPaymentRef('');
    setAccount('');
    setOrderNumber('');
    setBookingRef('');
    setKeyword('');
    setIsSearched(false);
  };

  const results = allBookings.filter((b) => {
    if (paymentRef.trim() && !b.paymentReference?.toLowerCase().includes(paymentRef.toLowerCase().trim())) {
      return false;
    }
    if (account.trim() && !b.account.toLowerCase().includes(account.toLowerCase().trim())) {
      return false;
    }
    if (orderNumber.trim() && !b.orderNumber?.toLowerCase().includes(orderNumber.toLowerCase().trim())) {
      return false;
    }
    if (bookingRef.trim() && !b.reference.toLowerCase().includes(bookingRef.toLowerCase().trim())) {
      return false;
    }
    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      const match =
        b.passengerName.toLowerCase().includes(q) ||
        b.pickupAddress.toLowerCase().includes(q) ||
        b.destinationAddress.toLowerCase().includes(q) ||
        b.passengerPhone.toLowerCase().includes(q) ||
        b.specialInstructions?.toLowerCase().includes(q) ||
        b.assignedDriverNumber?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = [
      'Reference Number',
      'Booking Date',
      'Pickup Date',
      'Passenger',
      'Account',
      'Order Number',
      'From',
      'To',
      'Fare',
      'Driver',
      'Vehicle',
      'Mobile Number',
      'Status',
    ];

    const rows = results.map((b) => [
      b.reference,
      b.bookingDate,
      `${b.pickupDate} ${b.pickupTime}`,
      `"${b.passengerName}"`,
      `"${b.account}"`,
      b.orderNumber || '',
      `"${b.pickupAddress}"`,
      `"${b.destinationAddress}"`,
      b.fare.toFixed(2),
      b.assignedDriverNumber || 'Unassigned',
      b.vehicleType,
      b.passengerPhone,
      b.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dispatch_search_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Search Header Form */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-sky-300">
            <Search className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            <span className="uppercase tracking-wide">Advance Booking Search Query</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {results.length} results found
          </span>
        </div>

        {/* 5-Field Query Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
              Payment Reference
            </label>
            <input
              type="text"
              value={paymentRef}
              onChange={(e) => {
                setPaymentRef(e.target.value);
                setIsSearched(true);
              }}
              placeholder="e.g. PAY-ACC-40291"
              className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
              Account
            </label>
            <input
              type="text"
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
                setIsSearched(true);
              }}
              placeholder="e.g. Barclays, CASH"
              className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
              Order Number
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => {
                setOrderNumber(e.target.value);
                setIsSearched(true);
              }}
              placeholder="e.g. BPW-9921"
              className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
              Booking Ref No.
            </label>
            <input
              type="text"
              value={bookingRef}
              onChange={(e) => {
                setBookingRef(e.target.value);
                setIsSearched(true);
              }}
              placeholder="e.g. CT-9041"
              className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
              Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setIsSearched(true);
              }}
              placeholder="Passenger, address, notes..."
              className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>

          <button
            onClick={exportCSV}
            disabled={results.length === 0}
            className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded transition shadow-xs"
          >
            <Download className="w-3 h-3" />
            <span>Export CSV Results</span>
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
          <thead className="sticky top-0 z-20 bg-[#16375c] text-slate-100 font-semibold shadow-xs select-none">
            <tr className="h-8 text-[11px]">
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">REF NUMBER</th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">BOOKING DATE</th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">PICKUP DATE & TIME</th>
              <th className="px-3 py-1 border-r border-[#244c79] font-bold tracking-wider">PASSENGER</th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">ACCOUNT</th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">ORDER NUMBER</th>
              <th className="px-3 py-1 border-r border-[#244c79] min-w-[170px] font-bold tracking-wider">FROM</th>
              <th className="px-3 py-1 border-r border-[#244c79] min-w-[170px] font-bold tracking-wider">TO</th>
              <th className="px-2.5 py-1 border-r border-[#244c79] text-right font-bold tracking-wider">FARE (£)</th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">DRIVER</th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">VEHICLE</th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">MOBILE</th>
              <th className="px-2.5 py-1 border-r border-[#244c79] font-bold tracking-wider">STATUS</th>
              <th className="px-2.5 py-1 text-center font-bold tracking-wider">VIEW</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-[11px]">
            {results.length === 0 ? (
              <tr>
                <td colSpan={14} className="p-8 text-center text-slate-400">
                  No records match your search criteria
                </td>
              </tr>
            ) : (
              results.map((booking) => {
                const statusStyle = getStatusBadgeClasses(booking.status);

                return (
                  <tr
                    key={booking.id}
                    className="h-8 hover:bg-sky-50 dark:hover:bg-slate-800/60 transition"
                  >
                    <td className="px-2.5 font-mono font-bold text-blue-700 dark:text-sky-400 border-r border-slate-100 dark:border-slate-800">
                      {booking.reference}
                    </td>
                    <td className="px-2.5 font-mono text-slate-500 border-r border-slate-100 dark:border-slate-800">
                      {booking.bookingDate}
                    </td>
                    <td className="px-2.5 font-mono font-bold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800">
                      {booking.pickupDate} {booking.pickupTime}
                    </td>
                    <td className="px-3 font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800">
                      {booking.passengerName}
                    </td>
                    <td className="px-2.5 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">
                      {booking.account}
                    </td>
                    <td className="px-2.5 font-mono text-slate-500 border-r border-slate-100 dark:border-slate-800">
                      {booking.orderNumber || '-'}
                    </td>
                    <td className="px-3 text-slate-700 dark:text-slate-300 truncate max-w-[200px] border-r border-slate-100 dark:border-slate-800" title={booking.pickupAddress}>
                      {booking.pickupAddress}
                    </td>
                    <td className="px-3 text-slate-700 dark:text-slate-300 truncate max-w-[200px] border-r border-slate-100 dark:border-slate-800" title={booking.destinationAddress}>
                      {booking.destinationAddress}
                    </td>
                    <td className="px-2.5 font-mono font-bold text-right text-slate-900 dark:text-slate-100 border-r border-slate-100 dark:border-slate-800">
                      {formatCurrency(booking.fare)}
                    </td>
                    <td className="px-2.5 font-mono border-r border-slate-100 dark:border-slate-800">
                      {booking.assignedDriverNumber || 'Unassigned'}
                    </td>
                    <td className="px-2.5 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800 text-[10px]">
                      {booking.vehicleType}
                    </td>
                    <td className="px-2.5 font-mono text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800">
                      {booking.passengerPhone}
                    </td>
                    <td className="px-2.5 border-r border-slate-100 dark:border-slate-800">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-2.5 text-center">
                      <button
                        onClick={() => onViewDetails(booking)}
                        className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
