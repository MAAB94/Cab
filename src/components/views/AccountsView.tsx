import React from 'react';
import { Building2, CreditCard, CheckCircle, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface AccountsViewProps {
  onSelectAccount: (accountName: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ onSelectAccount }) => {
  const corporateAccounts = [
    {
      id: 'acc-1',
      name: 'Barclays Private Wealth',
      code: 'BARC-01',
      billingEmail: 'accounts.travel@barclays.com',
      contactPerson: 'Veronica Hayes',
      phone: '+44 2071 161000',
      creditLimit: 25000,
      currentBalance: 8450.5,
      activeJobsToday: 4,
      terms: '30 Days Net',
      status: 'GOOD_STANDING',
    },
    {
      id: 'acc-2',
      name: 'Goldman Sachs International',
      code: 'GS-02',
      billingEmail: 'gs.logistics@gs.com',
      contactPerson: 'David Sterling',
      phone: '+44 2077 741000',
      creditLimit: 30000,
      currentBalance: 12240.0,
      activeJobsToday: 3,
      terms: '14 Days Net',
      status: 'GOOD_STANDING',
    },
    {
      id: 'acc-3',
      name: 'BBC Worldwide',
      code: 'BBC-03',
      billingEmail: 'production.transport@bbc.co.uk',
      contactPerson: 'Fiona Gallagher',
      phone: '+44 2087 438000',
      creditLimit: 15000,
      currentBalance: 4980.25,
      activeJobsToday: 2,
      terms: '30 Days Net',
      status: 'GOOD_STANDING',
    },
    {
      id: 'acc-4',
      name: 'NHS Health Partners',
      code: 'NHS-04',
      billingEmail: 'patient.transport@nhs.net',
      contactPerson: 'Dr. Arthur Campbell',
      phone: '+44 2073 777000',
      creditLimit: 20000,
      currentBalance: 6150.0,
      activeJobsToday: 3,
      terms: '45 Days Net',
      status: 'GOOD_STANDING',
    },
    {
      id: 'acc-5',
      name: 'American Express Global Business',
      code: 'AMEX-05',
      billingEmail: 'corporate.fleet@amex.com',
      contactPerson: 'Marcus Vance',
      phone: '+44 2079 450000',
      creditLimit: 50000,
      currentBalance: 18940.0,
      activeJobsToday: 5,
      terms: '7 Days Net',
      status: 'GOOD_STANDING',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-blue-700 text-white dark:bg-slate-800 border-b border-blue-800 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-200" />
          <h3 className="font-bold text-xs uppercase tracking-wide">
            Corporate Clients & B2B Billing Accounts
          </h3>
        </div>
        <span className="text-[10px] font-mono bg-blue-900/60 text-sky-200 px-2 py-0.5 rounded border border-blue-600">
          5 ACTIVE CONTRACTS
        </span>
      </div>

      {/* Grid of Accounts */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {corporateAccounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700 p-3 shadow-xs hover:border-blue-400 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {acc.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      Code: {acc.code} · {acc.contactPerson}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Balance:</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(acc.currentBalance)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Credit Limit:</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {formatCurrency(acc.creditLimit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Jobs Today:</span>
                    <span className="font-bold text-blue-600 dark:text-sky-300">
                      {acc.activeJobsToday} dispatches
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">Payment Terms:</span>
                    <span>{acc.terms}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button
                  onClick={() => onSelectAccount(acc.name)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded border border-blue-200 dark:border-blue-800 transition"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View Account Bookings</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
