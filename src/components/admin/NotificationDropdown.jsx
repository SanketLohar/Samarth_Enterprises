import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function NotificationDropdown({ notifications, onClose }) {

  const handleMarkAllRead = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const unreadItems = notifications.filter(n => n.status === 'unread');
      await Promise.all(
        unreadItems.map(item =>
          updateDoc(doc(db, "notifications", item.id), { status: 'read' })
        )
      );
    } catch (err) {
      console.error("Failed to batch clean notifications:", err);
    }
  };

  const handleMarkSingleRead = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await updateDoc(doc(db, "notifications", id), { status: 'read' });
    } catch (err) {
      console.error("Failed to update single notification element:", err);
    }
  };

  return (
    <div
      className="absolute right-0 mt-2 w-96 rounded-2xl bg-white shadow-xl border border-gray-100 py-2 z-[100] text-slate-800"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-50">
        <h3 className="font-semibold text-sm">Notifications</h3>
        <button
          onClick={handleMarkAllRead}
          className="text-[10px] font-bold text-brand-cyan hover:text-brand-deep transition px-2 py-1 rounded hover:bg-gray-50 uppercase"
        >
          MARK ALL READ
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto scrollbar-thin">
        {notifications && notifications.length > 0 ? (
          notifications.slice(0, 15).map((item) => (
            <div
              key={item.id}
              className={`flex items-start justify-between p-4 border-b border-gray-50 transition relative group ${item.status === 'unread' ? 'bg-blue-50/40 font-medium' : 'bg-white opacity-65'
                }`}
            >
              <div className="flex-1 pr-3">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold mb-1 tracking-wide ${item.type === 'pending_billing' || item.type === 'partial_payment'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : item.type === 'warranty_job'
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                    : item.type === 'job_completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                  {item.title || (item.type === 'new_inquiry' ? 'New Inquiry' : 'System Alert')}
                </span>
                <p className="text-xs text-gray-700 leading-normal">{item.message}</p>
                {item.remarks && <p className="text-[11px] text-gray-400 italic mt-1">"{item.remarks}"</p>}

                {item.paymentMode && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Payment:</span>
                    <span className="text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">{item.paymentMode}</span>
                    {item.amountCollected > 0 && <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">₹{item.amountCollected}</span>}
                  </div>
                )}

                <p className="text-[10px] text-gray-400 mt-2 font-medium">
                  {new Date(item.timestamp?.toDate?.() || item.timestamp).toLocaleString()}
                </p>
              </div>

              {item.status === 'unread' && (
                <button
                  onClick={(e) => handleMarkSingleRead(e, item.id)}
                  title="Mark as Read"
                  className="p-1 rounded-full bg-white hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 border border-gray-100 shadow-sm transition self-center"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-xs text-gray-400">
            <p>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}