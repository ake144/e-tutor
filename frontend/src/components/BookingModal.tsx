import { useState } from "react";

interface BookingModalProps {
  tutorName: string;
  open: boolean;
  onClose: () => void;
  onBook: (date: string, time: string) => void;
}

const times = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];

export default function BookingModal({ tutorName, open, onClose, onBook }: BookingModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleBook() {
    if (!date || !time) {
      setError("Please select a date and time.");
      return;
    }
    setError(null);
    onBook(date, time);
  }

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
          <label className="block text-sm font-medium mb-1">Time</label>
          <select className="w-full border rounded-lg px-3 py-2" value={time} onChange={e => setTime(e.target.value)}>
            <option value="">Select a time</option>
            {times.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button className="w-full py-2 mt-2 bg-gradient-to-r from-blue-500 to-green-400 text-white rounded-lg font-bold text-lg shadow hover:from-blue-600 hover:to-green-500 transition" onClick={handleBook}>Book Now</button>
      </div>
    </div>
  );
}
