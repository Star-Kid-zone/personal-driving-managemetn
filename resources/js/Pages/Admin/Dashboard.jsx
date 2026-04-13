import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Users, TrendingUp, CreditCard, AlertCircle,
    Calendar, Car, BookOpen, ArrowRight, Clock
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid
} from 'recharts';

function StatCard({ label, value, sub, icon: Icon, color = '#D4AF37', trend, delay = 0 }) {
    return (
        <div className="stat-widget" data-aos="fade-up" data-aos-delay={delay}>
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl" style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
                    <Icon size={18} style={{ color }} />
                </div>
                {trend !== undefined && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trend >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                        {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm font-medium text-muted">{label}</div>
            {sub && <div className="text-xs text-subtle mt-1">{sub}</div>}
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="nm-card p-3 text-xs">
                <div className="text-muted mb-1">{label}</div>
                <div className="text-[#D4AF37] font-bold">₹{payload[0].value?.toLocaleString('en-IN')}</div>
            </div>
        );
    }
    return null;
};

export default function Dashboard({
    totalStudents, activeStudents, newThisMonth,
    yearlyRevenue, monthlyRevenue, revenueGrowth,
    pendingPayments, monthlyBreakdown,
    upcomingTests, recentStudents, teacherStats,
}) {
    return (
        <AppLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Students" value={totalStudents} sub={`${newThisMonth} new this month`}
                    icon={Users} color="#6366f1" trend={newThisMonth > 0 ? 12 : 0} delay={0} />
                <StatCard label="Active Students" value={activeStudents}
                    sub={`${Math.round((activeStudents/Math.max(totalStudents,1))*100)}% of total`}
                    icon={TrendingUp} color="#10b981" delay={100} />
                <StatCard label="Monthly Revenue" value={`₹${(monthlyRevenue/1000).toFixed(1)}K`}
                    sub="This month" icon={CreditCard} color="#D4AF37" trend={revenueGrowth} delay={200} />
                <StatCard label="Pending Dues" value={`₹${(pendingPayments/1000).toFixed(1)}K`}
                    sub="Needs collection" icon={AlertCircle} color="#f87171" delay={300} />
            </div>

            {/* Main bento grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

                {/* Revenue Chart - 2 cols */}
                <div className="lg:col-span-2 nm-card p-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-white font-semibold">Revenue Overview</h2>
                            <p className="text-muted text-xs mt-0.5">{new Date().getFullYear()} · ₹{(yearlyRevenue/1000).toFixed(1)}K total</p>
                        </div>
                        <div className="text-xs text-muted px-3 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            Monthly
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={monthlyBreakdown} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#D4AF37" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false}
                                tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2}
                                fill="url(#goldGrad)" dot={false} activeDot={{ r: 4, fill: '#D4AF37' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Teacher Performance */}
                <div className="nm-card p-5" data-aos="fade-up" data-aos-delay="150">
                    <h2 className="text-white font-semibold mb-4">Teacher Performance</h2>
                    <div className="space-y-3">
                        {(teacherStats || []).slice(0,4).map((t) => (
                            <div key={t.id} className="flex items-center gap-3">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.user?.name)}&color=D4AF37&background=000666`}
                                    className="w-8 h-8 rounded-lg object-cover" alt={t.user?.name} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-white font-medium truncate">{t.user?.name}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="progress-bar flex-1 h-1">
                                            <div className="progress-fill" style={{ width: `${Math.min((t.active_students_count/10)*100,100)}%` }} />
                                        </div>
                                        <span className="text-muted text-xs whitespace-nowrap">{t.students_count} students</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Lower row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Upcoming Tests */}
                <div className="nm-card p-5" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold flex items-center gap-2">
                            <Calendar size={16} className="text-[#D4AF37]" /> Upcoming Tests
                        </h2>
                        <Link href={route('admin.llr.index')} className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {(upcomingTests || []).length === 0 && (
                            <div className="text-center py-8 text-muted text-sm">No upcoming tests</div>
                        )}
                        {(upcomingTests || []).map((rec) => {
                            const testDate = rec.llr_test_date || rec.dl_test_date;
                            const testType = rec.llr_test_date ? 'LLR' : 'DL';
                            return (
                                <div key={rec.id} className="flex items-center gap-3 p-3 rounded-xl"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="p-2 rounded-lg" style={{ background: testType === 'LLR' ? 'rgba(99,102,241,0.15)' : 'rgba(212,175,55,0.15)' }}>
                                        <BookOpen size={14} style={{ color: testType === 'LLR' ? '#818cf8' : '#D4AF37' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white font-medium truncate">{rec.student?.name}</div>
                                        <div className="text-xs text-muted">{testType} Test · {rec.student?.student_id}</div>
                                    </div>
                                    <div className="text-xs text-right">
                                        <div className="text-white font-medium">{new Date(testDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</div>
                                        <div className="text-muted">{new Date(testDate).getFullYear()}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Students */}
                <div className="nm-card p-5" data-aos="fade-up" data-aos-delay="250">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold flex items-center gap-2">
                            <Users size={16} className="text-[#D4AF37]" /> Recent Enrollments
                        </h2>
                        <Link href={route('admin.students.index')} className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
                            View all <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {(recentStudents || []).map((s) => (
                            <Link key={s.id} href={route('admin.students.show', s.id)}
                                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
                                style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                                <img src={s.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&color=D4AF37&background=000666`}
                                    className="w-9 h-9 rounded-xl object-cover" alt={s.name} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-white font-medium truncate">{s.name}</div>
                                    <div className="text-xs text-muted">{s.student_id} · {s.vehicle_type}</div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        s.payment?.payment_status === 'paid' ? 'badge-active' :
                                        s.payment?.payment_status === 'partial' ? 'badge-pending' : 'badge-danger'
                                    }`}>
                                        {s.payment?.payment_status || 'pending'}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
