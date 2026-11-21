import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  CheckCircle,
  CurrencyDollar,
  Buildings,
  Camera,
  X,
  Printer,
  ShieldCheck,
  MagnifyingGlass
} from '@phosphor-icons/react';
import { DispensingTransaction } from '../types';

export const TransactionsPage: React.FC = () => {
  const { transactions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState<DispensingTransaction | null>(null);

  const filteredTx = transactions.filter(
    t =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-dark-border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
              Audit & Settlement Ledger
            </span>
            <span className="caption-4 text-neutral-400">Step 7 of Safety Workflow</span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            Transaction & Payment Audit History
          </h1>
          <p className="body-5 text-neutral-400">
            Immutable cross pharmacy audit trail of all verified medicine disbursements, partial collections, and payments.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search by Tx ID, patient, or pharmacy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-xl pl-9 pr-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500 font-mono text-xs"
          />
          <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-neutral-400" />
        </div>
      </div>

      {/* LEDGER TABLE */}
      <section className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-base border-b border-dark-border caption-4 text-neutral-400 font-medium">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Medicine & Units</th>
                <th className="py-3 px-4">Remaining Balance</th>
                <th className="py-3 px-4">Pharmacy / Pharmacist</th>
                <th className="py-3 px-4">Amount & Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border caption-3 text-neutral-300">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-dark-surface/50 transition-hover">
                  <td className="py-4 px-4 font-mono text-white font-semibold">
                    {tx.id}
                    <div className="caption-5 text-neutral-400 font-normal">
                      {tx.timestamp.split('T')[0]}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-white font-medium">{tx.patientName}</div>
                    <div className="caption-5 text-neutral-400 font-mono">{tx.patientId}</div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-white font-medium">{tx.medicineName}</div>
                    <div className="caption-5 text-tealAccent-400 font-mono">
                      Dispensed: <strong>{tx.newlyDispensedQuantity}</strong> units
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono">
                    <span className="text-white font-bold">{tx.remainingQuantity}</span>
                    <span className="caption-5 text-neutral-400 block">of {tx.prescribedQuantity} prescribed</span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-neutral-200">{tx.pharmacyName}</div>
                    <div className="caption-5 text-neutral-400">{tx.pharmacistName}</div>
                  </td>

                  <td className="py-4 px-4 font-mono">
                    <div className="text-white font-semibold">${tx.paymentAmount.toFixed(2)}</div>
                    <span className="caption-5 px-1.5 py-0.2 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
                      {tx.paymentStatus}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="button-sm py-1.5 px-3 rounded-lg bg-dark-base hover:bg-dark-surface border border-dark-border text-white transition-hover"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* RECEIPT / AUDIT DETAIL MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg bg-dark-base border border-dark-border text-neutral-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={22} className="text-tealAccent-400" />
              <h3 className="title-2 text-white font-semibold">
                Official Dispensing Receipt
              </h3>
            </div>

            <div className="bg-dark-base border border-dark-border rounded-xl p-4 font-mono text-xs space-y-3 mb-6">
              <div className="flex justify-between border-b border-dark-border pb-2">
                <span className="text-neutral-400">Transaction ID:</span>
                <span className="text-white font-bold">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Date & Timestamp:</span>
                <span className="text-white">{selectedTx.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Patient Name:</span>
                <span className="text-white">{selectedTx.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Prescription Reference:</span>
                <span className="text-white">{selectedTx.prescriptionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Medicine:</span>
                <span className="text-white">{selectedTx.medicineName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Newly Handed Over:</span>
                <span className="text-tealAccent-400 font-bold">{selectedTx.newlyDispensedQuantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Remaining Balance:</span>
                <span className="text-white font-bold">{selectedTx.remainingQuantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Dispensing Pharmacy:</span>
                <span className="text-white">{selectedTx.pharmacyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Supervising Pharmacist:</span>
                <span className="text-white">{selectedTx.pharmacistName}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dark-border font-bold">
                <span className="text-neutral-300">Total Billed:</span>
                <span className="text-tealAccent-300">${selectedTx.paymentAmount.toFixed(2)} ({selectedTx.paymentMethod})</span>
              </div>
            </div>

            {selectedTx.evidencePhotoUrl && (
              <div className="mb-6">
                <span className="caption-4 text-neutral-400 block mb-1">
                  Attached Handover Photo Evidence
                </span>
                <div className="w-full h-32 rounded-xl overflow-hidden border border-dark-border">
                  <img
                    src={selectedTx.evidencePhotoUrl}
                    alt="Handover Evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="button-sm py-2 px-3 rounded-lg bg-dark-base border border-dark-border text-white flex items-center gap-1.5 transition-hover"
              >
                <Printer size={16} />
                <span>Print Copy</span>
              </button>
              <button
                onClick={() => setSelectedTx(null)}
                className="button-sm py-2 px-3 rounded-lg bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold transition-hover"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
