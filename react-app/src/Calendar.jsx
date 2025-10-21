import React, { useEffect, useMemo, useState } from "react";

export default function Calendar() {
  const [now, setNow] = useState(() => new Date());
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const monthLabel = useMemo(() =>
    cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })
  , [cursor]);

  const weeks = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const startDay = firstOfMonth.getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Fill leading days from prev month
    for (let i = 0; i < startDay; i++) {
      const d = new Date(year, month, -i);
      days.unshift({ date: d, inMonth: false });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ date: new Date(year, month, d), inMonth: true });
    }
    // Fill trailing days to complete 6x7 grid
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1].date;
      const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
      days.push({ date: next, inMonth: next.getMonth() === month });
    }
    while (days.length < 42) {
      const last = days[days.length - 1].date;
      const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
      days.push({ date: next, inMonth: next.getMonth() === month });
    }

    const result = [];
    for (let i = 0; i < days.length; i += 7) result.push(days.slice(i, i + 7));
    return result;
  }, [year, month]);

  const isSameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  return (
    <div className="calendar-widget">
      <div className="cal-header">
        <div className="cal-title">{monthLabel}</div>
        <div className="cal-clock">{now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div className="cal-weekdays">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (<div key={d} className="cal-wd">{d}</div>))}
      </div>
      <div className="cal-grid">
        {weeks.flat().map((cell, idx) => {
          const d = cell.date;
          const isToday = isSameDay(d, now);
          const isSelected = isSameDay(d, selected);
          const className = [
            "cal-cell",
            cell.inMonth ? "in-month" : "other-month",
            isToday ? "is-today" : "",
            isSelected ? "is-selected" : "",
          ].filter(Boolean).join(" ");
          return (
            <button
              key={idx}
              className={className}
              onClick={() => setSelected(d)}
              aria-label={d.toDateString()}
            >
              <span className="cal-num">{d.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
