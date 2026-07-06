import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Check, CheckCheck, Package } from 'lucide-react';
import { privateAPI } from '../api/api';
import { useUser } from '../context/UserContext';

const POLL_INTERVAL = 30000; // 30 seconds

const NotificationBell = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const intervalRef = useRef(null);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await privateAPI.get('/notification');
      if (res.data.success) setNotifications(res.data.data);
    } catch (err) {
      // silent fail for polling
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    intervalRef.current = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [user, fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await privateAPI.patch(`/notification/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {}
  };

  const markAllRead = async () => {
    try {
      await privateAPI.patch('/notification/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  const typeIcon = (type) => {
    switch (type) {
      case 'RENTAL_REQUEST': return '📥';
      case 'RENTAL_UPDATE': return '🔄';
      case 'REVIEW_RECEIVED': return '⭐';
      default: return '🔔';
    }
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        id="notification-bell-btn"
        onClick={() => { setOpen(o => !o); if (!open) fetchNotifications(); }}
        style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          borderRadius: '50%',
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          transition: 'background 0.2s',
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 2,
            right: 2,
            background: '#EF4444',
            color: 'white',
            borderRadius: '50%',
            width: 17,
            height: 17,
            fontSize: '0.65rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          width: 320,
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1px solid var(--color-ash)',
        }}>
          {/* Dropdown Header */}
          <div style={{ background: 'var(--color-forest)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={16} /> Notifications
              {unreadCount > 0 && <span style={{ background: '#EF4444', borderRadius: 999, padding: '0 6px', fontSize: '0.7rem' }}>{unreadCount}</span>}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.5rem', cursor: 'pointer', color: 'white', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <CheckCheck size={12} /> All read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-slate)' }}>
                <Package size={32} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
                <p style={{ fontSize: '0.875rem' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--color-ash)',
                    background: n.isRead ? 'white' : '#F0FDF4',
                    display: 'flex',
                    gap: '0.625rem',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                >
                  <span style={{ fontSize: '1.25rem', flexShrink: 0, lineHeight: 1 }}>{typeIcon(n.type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--color-forest)', margin: 0, lineHeight: 1.4, fontWeight: n.isRead ? 400 : 600 }}>
                      {n.message}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-slate)', margin: '0.2rem 0 0', }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-forest)', marginTop: 4, flexShrink: 0 }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
