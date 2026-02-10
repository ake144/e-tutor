import { useState } from "react";

interface BookingModalProps {
  tutorName: string;
  open: boolean;
  onClose: () => void;
  onBook: (date: string, time: string, frequencyPerWeek: number, contractMonths: number) => void;
}

const times = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];

export default function BookingModal({ tutorName, open, onClose, onBook }: BookingModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [frequencyPerWeek, setFrequencyPerWeek] = useState<number>(2);
  const [contractMonths, setContractMonths] = useState<number>(12);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleBook() {
    if (!date || !time) {
      setError("Please select a date and time.");
      return;
    }
    setError(null);
    onBook(date, time, frequencyPerWeek, contractMonths);
  }

  const baseMonthly = 80;
  const perSessionWeekly = 20;
  const monthlyPrice = baseMonthly + perSessionWeekly * frequencyPerWeek;
  const totalContract = monthlyPrice * contractMonths;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-blue-700">Book a Session</h2>
        <p className="mb-4 text-gray-600">with <span className="font-semibold text-blue-600">{tutorName}</span></p>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Frequency per Week</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={frequencyPerWeek}
            onChange={(e) => setFrequencyPerWeek(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} session{n > 1 ? "s" : ""} / week</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Contract Length</label>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={contractMonths}
            onChange={(e) => setContractMonths(Number(e.target.value))}
          >
            <option value={1}>1 Month</option>
            <option value={12}>1 Year (12 Months)</option>
            <option value={24}>2 Years (24 Months)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Billing is monthly. You can choose the contract length upfront.</p>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Time</label>
          <select className="w-full border rounded-lg px-3 py-2" value={time} onChange={e => setTime(e.target.value)}>
            <option value="">Select a time</option>
            {times.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="mb-3 bg-gray-50 border border-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Monthly price</span>
            <span className="font-semibold text-gray-800">${monthlyPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
            <span>Total for {contractMonths} month{contractMonths > 1 ? "s" : ""}</span>
            <span className="font-semibold text-gray-800">${totalContract.toFixed(2)}</span>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button className="w-full py-2 mt-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-bold text-lg shadow hover:from-blue-600 hover:to-green-500 transition" onClick={handleBook}>Book Now</button>
      </div>
    </div>
  );
}
