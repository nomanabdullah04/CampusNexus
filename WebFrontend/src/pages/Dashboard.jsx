import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { privateAPI } from '../api/api';
import { useUser } from '../context/UserContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Package, Star, ClipboardList, ArrowLeft, AlertCircle, CreditCard } from 'lucide-react';

const STATUS_COLORS = {
  REQUESTED: '#F59E0B',
  APPROVED: '#3B82F6',
  ACTIVE: '#10B981',
  RETURNED: '#8B5CF6',
  COMPLETED: '#059669',
  REJECTED: '#EF4444',
  CANCELLED: '#9CA3AF',
};

const PIE_COLORS = ['#2D6A4F', '#52B788', '#74C69D', '#95D5B2', '#B7E4C7', '#D8F3DC', '#40916C', '#1B4332'];

const StatCard = ({ icon, label, value, sub, color }) => (
  <div style={{
    background: 'white',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    border: '1px solid var(--color-ash)',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  }}>
    <div style={{ background: color + '20', borderRadius: 'var(--radius-md)', padding: '0.75rem', color, flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--color-slate)', fontSize: '0.8125rem', margin: 0 }}>{label}</p>
      <p style={{ color: 'var(--color-forest)', fontWeight: 800, fontSize: '1.5rem', margin: '0.125rem 0 0' }}>{value}</p>
      {sub && <p style={{ color: 'var(--color-slate)', fontSize: '0.75rem', margin: 0 }}>{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) { navigate('/sign-in'); return; }
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [statsRes, txRes] = await Promise.all([
        privateAPI.get('/dashboard/stats'),
        privateAPI.get('/transaction/my'),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (txRes.data.success) setTransactions(txRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statusChartData = stats
    ? Object.entries(stats.rentalCounts).map(([status, count]) => ({ status, count }))
    : [];

  if (loading) return (
    <div className="spinner-container" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="spinner" /><p className="text-slate">Loading dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="empty-state" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <AlertCircle style={{ color: 'var(--color-error)' }} />
      <p style={{ color: 'var(--color-error)' }}>{error}</p>
      <button className="btn btn-sage btn-sm" onClick={fetchAllData}>Retry</button>
    </div>
  );

  return (
    <div className="page-layout">
      {/* Header */}
      <div style={{ background: 'var(--color-forest)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>Dashboard</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.8125rem' }}>Welcome back, {user?.name?.split(' ')[0]}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-group" style={{ margin: '1rem 1rem 0' }}>
        <button className={`tab-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')} id="tab-overview">
          <ClipboardList size={15} /> Overview
        </button>
        <button className={`tab-btn ${tab === 'transactions' ? 'active' : ''}`} onClick={() => setTab('transactions')} id="tab-transactions">
          <CreditCard size={15} /> Transactions ({transactions.length})
        </button>
      </div>
      <div className="page-content" style={{ paddingBottom: '2rem' }}>
        {/* Overview Tab */}
        {tab === 'overview' && stats && (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <StatCard
                icon={<TrendingUp size={22} />}
                label="Total Earnings"
                value={`৳${stats.totalEarnings.toLocaleString()}`}
                sub="From completed rentals"
                color="#059669"
              />
              <StatCard
                icon={<ClipboardList size={22} />}
                label="Total Rentals"
                value={stats.totalRentals}
                sub="All time"
                color="#3B82F6"
              />
              <StatCard
                icon={<Star size={22} />}
                label="Avg. Rating"
                value={stats.averageRating || '—'}
                sub={`${stats.totalReviews} reviews`}
                color="#F59E0B"
              />
              <StatCard
                icon={<Package size={22} />}
                label="Active Rentals"
                value={stats.rentalCounts['ACTIVE'] || 0}
                sub={`${stats.rentalCounts['REQUESTED'] || 0} pending`}
                color="#8B5CF6"
              />
            </div>

            {/* Bar Chart — Rental Status */}
            {statusChartData.length > 0 && (
              <div className="card mb-4">
                <div className="card-body">
                  <h3 style={{ color: 'var(--color-forest)', marginBottom: '1.25rem', fontSize: '1rem' }}>Rentals by Status</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={statusChartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#6B7280' }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: 8, fontSize: '0.8125rem' }}
                        formatter={(v) => [v, 'Count']}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {statusChartData.map((entry) => (
                          <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#2D6A4F'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Pie Chart — Category Breakdown */}
            {stats.categoryBreakdown?.length > 0 && (
              <div className="card mb-4">
                <div className="card-body">
                  <h3 style={{ color: 'var(--color-forest)', marginBottom: '1.25rem', fontSize: '1rem' }}>Rentals by Category</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={stats.categoryBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={45}
                        paddingAngle={3}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {stats.categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => [v, 'Rentals']} contentStyle={{ borderRadius: 8, fontSize: '0.8125rem' }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '0.8rem' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Recent Rentals */}
            {stats.recentRentals?.length > 0 && (
              <div className="card">
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ color: 'var(--color-forest)', margin: 0, fontSize: '1rem' }}>Recent Rentals</h3>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/rentals')} style={{ fontSize: '0.75rem' }}>
                      View All
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {stats.recentRentals.map((r) => (
                      <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', background: '#F9FAFB', borderRadius: 'var(--radius-md)' }}>
                        {r.item?.picture ? (
                          <img src={r.item.picture} alt="" style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--color-ash)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={18} color="var(--color-slate)" />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, color: 'var(--color-forest)', margin: 0, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {r.item?.title || 'Untitled'}
                          </p>
                          <p style={{ color: 'var(--color-slate)', margin: 0, fontSize: '0.75rem' }}>
                            {r.renter?.name || 'Renter'} · {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span style={{
                          background: STATUS_COLORS[r.status] + '20',
                          color: STATUS_COLORS[r.status],
                          borderRadius: 999,
                          padding: '0.2rem 0.6rem',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          flexShrink: 0,
                        }}>
                          {r.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Transactions Tab */}
        {tab === 'transactions' && (
          <div className="card">
            <div className="card-body">
              <h3 style={{ color: 'var(--color-forest)', marginBottom: '1rem', fontSize: '1rem' }}>Transaction History</h3>
              {transactions.length === 0 ? (
                <div className="empty-state" style={{ minHeight: 180 }}>
                  <CreditCard size={36} />
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--color-ash)' }}>
                        <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>#</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>Description</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem 0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>Amount</th>
                        <th style={{ textAlign: 'center', padding: '0.5rem 0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>Status</th>
                        <th style={{ textAlign: 'right', padding: '0.5rem 0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t, i) => (
                        <tr key={t.id} style={{ borderBottom: '1px solid var(--color-ash)' }}>
                          <td style={{ padding: '0.625rem 0.75rem', color: 'var(--color-slate)' }}>{i + 1}</td>
                          <td style={{ padding: '0.625rem 0.75rem' }}>
                            <span style={{ background: t.type === 'PAYMENT' ? '#DBEAFE' : '#D1FAE5', color: t.type === 'PAYMENT' ? '#1E40AF' : '#065F46', borderRadius: 999, padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>
                              {t.type}
                            </span>
                          </td>
                          <td style={{ padding: '0.625rem 0.75rem', color: 'var(--color-slate)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {t.description || 'Rental transaction'}
                          </td>
                          <td style={{ padding: '0.625rem 0.75rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-forest)' }}>
                            ৳{Number(t.amount).toLocaleString()}
                          </td>
                          <td style={{ padding: '0.625rem 0.75rem', textAlign: 'center' }}>
                            <span style={{ background: t.status === 'COMPLETED' ? '#D1FAE5' : t.status === 'PENDING' ? '#FEF3C7' : '#FEE2E2', color: t.status === 'COMPLETED' ? '#065F46' : t.status === 'PENDING' ? '#92400E' : '#991B1B', borderRadius: 999, padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>
                              {t.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.625rem 0.75rem', textAlign: 'right', color: 'var(--color-slate)', fontSize: '0.8rem' }}>
                            {new Date(t.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
