import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { TrendingUp, Users, CreditCard, Car } from 'lucide-react';

const COLORS = ['#D4AF37', '#6366f1', '#10b981', '#f87171', '#06b6d4', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div className="nm-card p-3 text-xs min-w-32">
                <div className="text-muted mb-1">{label}</div>
                {payload.map((p, i) => (
                    <div key={i} style={{ color: p.color }} className="font-bold">
                        {p.name}: {typeof p.value === 'number' && p.name?.includes('Revenue')
                            ? `₹${p.value.toLocaleString('en-IN')}`
                            : p.value}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function Analytics({
    monthlyRevenue, vehicleTypeBreakdown, studentStatusBreakdown,
    enrollmentTrend, paymentStatusBreakdown, topTeachers,
    yearlyRevenue, totalStudents, activeStudents,
}) {
    return (
        <AppLayout title="Analytics">
            <Head title="Analytics" />

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Yearly Revenue', value: `₹${((yearlyRevenue||0)/1000).toFixed(1)}K`, icon: CreditCard, color: '#D4AF37' },
                    { label: 'Total Students', value: totalStudents || 0, icon: Users, color: '#6366f1' },
                    { label: 'Active Students', value: activeStudents || 0, icon: Users, color: '#10b981' },
                    { label: 'Avg. Per Student', value: totalStudents ? `₹${Math.round((yearlyRevenue||0)/totalStudents).toLocaleString('en-IN')}` : '—', icon: TrendingUp, color: '#06b6d4' },
                ].map(({ label, value, icon: Icon, color }, i) => (
                    <div key={i} className="stat-widget" data-aos="fade-up" data-aos-delay={i * 75}>
                        <div className="p-2.5 rounded-xl w-fit mb-3" style={{ background: `${color}18` }}>
                            <Icon size={16} style={{ color }} />
                        </div>
                        <div className="text-2xl font-bold text-white">{value}</div>
                        <div className="text-sm text-muted mt-0.5">{label}</div>
                    </div>
                ))}
            </div>

            {/* Charts row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Monthly Revenue */}
                <div className="lg:col-span-2 nm-card p-5" data-aos="fade-up">
                    <h3 className="text-white font-semibold mb-4">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={monthlyRevenue || []}>
                            <defs>
                                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false}
                                tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#D4AF37" strokeWidth={2}
                                fill="url(#grad1)" dot={false} activeDot={{ r: 4, fill: '#D4AF37' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Vehicle Type Pie */}
                <div className="nm-card p-5" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="text-white font-semibold mb-4">Vehicle Types</h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={vehicleTypeBreakdown || []} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                                dataKey="value" paddingAngle={3}>
                                {(vehicleTypeBreakdown || []).map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-3 mt-2">
                        {(vehicleTypeBreakdown || []).map((d, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-muted">
                                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                                {d.name}: <span className="text-white font-medium">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charts row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Enrollment trend */}
                <div className="nm-card p-5" data-aos="fade-up">
                    <h3 className="text-white font-semibold mb-4">Enrollment Trend</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={enrollmentTrend || []}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" name="Enrollments" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment status */}
                <div className="nm-card p-5" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="text-white font-semibold mb-4">Payment Status Breakdown</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={paymentStatusBreakdown || []} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="status" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="count" name="Students" radius={[0, 4, 4, 0]}>
                                {(paymentStatusBreakdown || []).map((d, i) => (
                                    <Cell key={i} fill={d.status === 'paid' ? '#10b981' : d.status === 'partial' ? '#f59e0b' : '#f87171'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Teachers */}
            <div className="nm-card p-5" data-aos="fade-up">
                <h3 className="text-white font-semibold mb-4">Teacher Performance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(topTeachers || []).map((t, i) => (
                        <div key={t.id} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                                    style={{ background: `${COLORS[i % COLORS.length]}20`, color: COLORS[i % COLORS.length] }}>
                                    {i + 1}
                                </div>
                                <div>
                                    <div className="text-sm text-white font-medium">{t.user?.name}</div>
                                    <div className="text-xs text-muted capitalize">{t.specialization}</div>
                                </div>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-muted">Total Students</span>
                                    <span className="text-white font-medium">{t.students_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">Active</span>
                                    <span className="text-emerald-400 font-medium">{t.active_students_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">Trips Done</span>
                                    <span className="text-[#D4AF37] font-medium">{t.completed_trips_count}</span>
                                </div>
                            </div>
                            <div className="progress-bar mt-3">
                                <div className="progress-fill" style={{ width: `${Math.min((t.active_students_count / Math.max(t.students_count, 1)) * 100, 100)}%`, background: COLORS[i % COLORS.length] }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
