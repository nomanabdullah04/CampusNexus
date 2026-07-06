import React, { useEffect, useState, useCallback } from 'react';
import { publicAPI } from '../api/api';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const AvailabilityCalendar = ({ itemId, onRangeSelect }) => {
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    if (itemId) fetchAvailability();
  }, [itemId]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await publicAPI.get(`/rental/availability/${itemId}`);
      if (res.data.success) setBookedRanges(res.data.data);
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const isBooked = useCallback((date) => {
    return bookedRanges.some(({ startDate: s, endDate: e }) => {
      const start = new Date(s);
      const end = new Date(e);
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);
      return date >= start && date <= end;
    });
  }, [bookedRanges]);

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    return date < today;
  };

  const isInRange = (date) => {
    const rangeEnd = endDate || hoveredDate;
    if (!startDate || !rangeEnd) return false;
    const [s, e] = startDate <= rangeEnd ? [startDate, rangeEnd] : [rangeEnd, startDate];
    return date > s && date < e;
  };

  const isSelected = (date) => {
    return (startDate && date.toDateString() === startDate.toDateString()) ||
           (endDate && date.toDateString() === endDate.toDateString());
  };

  const handleDateClick = (date) => {
    if (isPast(date) || isBooked(date)) return;
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      onRangeSelect?.({ startDate: startDate < date ? startDate : date, endDate: startDate < date ? date : startDate });
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-ash)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-forest)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
        >
          <ChevronLeft size={16} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
          <CalendarDays size={18} />
          <span style={{ fontWeight: 600 }}>{MONTHS[month]} {year}</span>
        </div>
        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-slate)' }}>Loading calendar...</div>
      ) : (
        <div style={{ padding: '1rem' }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '0.5rem' }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate)', padding: '0.25rem 0' }}>{d}</div>
            ))}
          </div>

          {/* Date cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {cells.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} />;
              const booked = isBooked(date);
              const past = isPast(date);
              const selected = isSelected(date);
              const inRange = isInRange(date);
              const disabled = booked || past;

              let bg = 'transparent';
              let color = 'var(--color-forest)';
              let cursor = 'pointer';

              if (disabled) { bg = booked ? '#FEE2E2' : 'transparent'; color = booked ? '#EF4444' : '#CBD5E1'; cursor = 'not-allowed'; }
              if (inRange) { bg = 'rgba(96, 165, 91, 0.15)'; }
              if (selected) { bg = 'var(--color-forest)'; color = 'white'; }

              return (
                <div
                  key={date.toDateString()}
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => !disabled && setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  style={{
                    padding: '0.4rem 0',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: selected ? 700 : 400,
                    background: bg,
                    color,
                    cursor,
                    borderRadius: 'var(--radius-sm)',
                    transition: 'all 0.15s',
                    userSelect: 'none',
                  }}
                  title={booked ? 'Already booked' : past ? 'Past date' : ''}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--color-slate)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: 12, height: 12, background: '#FEE2E2', borderRadius: 2, display: 'inline-block' }} /> Booked
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: 12, height: 12, background: 'var(--color-forest)', borderRadius: 2, display: 'inline-block' }} /> Selected
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: 12, height: 12, background: 'rgba(96, 165, 91, 0.15)', borderRadius: 2, display: 'inline-block' }} /> Range
            </span>
          </div>

          {/* Selected range display */}
          {startDate && (
            <div style={{ marginTop: '0.75rem', padding: '0.625rem', background: '#F0FDF4', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', color: 'var(--color-forest)', fontWeight: 500 }}>
              📅 {startDate.toLocaleDateString()} {endDate ? `→ ${endDate.toLocaleDateString()}` : '→ pick end date'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
