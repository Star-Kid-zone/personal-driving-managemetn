import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Users, Route, BookOpen, Clock, CheckCircle, AlertCircle, Calendar, ArrowRight } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color = '#D4AF37', delay = 0 }) {
    return (
        <div className="stat-widget" data-aos="fade-up" data-aos-delay={delay}>
            <div className="p-2.5 rounded-xl w-fit mb-3" style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
                <Icon size={18} style={{ color }} />
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-muted mt-0.5">{label}</div>
        </div>
    );
}

export default function TeacherDashboard({
    myStudents, activeStudents, todaysTrips, totalTrips,
    llrPending, dlEligible, incompleteStudents, upcomingTests,
    todayTrips, upcomingTrips,
}) {
    return (
        <AppLayout title="My Dashboard">
            <Head title="Teacher Dashboard" />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="My Students" value={myStudents} icon={Users} color="#6366f1" delay={0} />
                <StatCard label="Active Students" value={activeStudents} icon={Users} color="#10b981" delay={100} />
                <StatCard label="Today's Trips" value={todaysTrips} icon={Route} color="#D4AF37" delay={200} />
                <StatCard label="Total Trips Done" value={totalTrips} icon={CheckCircle} color="#06b6d4" delay={300} />
            </div>

            {/* LLR alerts */}
            {(llrPending > 0 || dlEligible > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {llrPending > 0 && (
                        <Link href={route('teacher.llr.list')}
                            className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.01]"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                            <div>
                                <div className="text-white font-medium text-sm">{llrPending} students need LLR</div>
                                <div className="text-muted text-xs">LLR not yet applied → action required</div>
                            </div>
                            <ArrowRight size={16} className="text-red-400 ml-auto" />
                        </Link>
                    )}
                    {dlEligible > 0 && (
                        <Link href={route('teacher.llr.list')}
                            className="flex items-center gap-3 p-4 rounded-xl transition-all hover:scale-[1.01]"
                            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
                            <CheckCircle size={20} className="text-[#D4AF37] flex-shrink-0" />
                            <div>
                                <div className="text-white font-medium text-sm">{dlEligible} students DL eligible</div>
                                <div className="text-muted text-xs">30-day wait complete → ready to apply</div>
                            </div>
                            <ArrowRight size={16} className="text-[#D4AF37] ml-auto" />
                        </Link>
                    )}
                </div>
            )}

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Today's trips */}
                <div className="nm-card p-5" data-aos="fade-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <Calendar size={15} className="text-[#D4AF37]" /> Today's Schedule
                        </h3>
                        <Link href={route('teacher.trips.create')} className="text-xs btn-gold px-3 py-1.5">+ New Trip</Link>
                    </div>
                    {(todayTrips || []).length === 0 && (
                        <div className="text-center py-8 text-muted text-sm">
                            <Route size={28} className="mx-auto mb-2 opacity-30" />
                            No trips scheduled today
                        </div>
                    )}
                    <div className="space-y-3">
                        {(todayTrips || []).map(trip => (
                            <Link key={trip.id} href={route('teacher.trips.show', trip.id)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="p-2 rounded-lg" style={{ background: 'rgba(212,175,55,0.12)' }}>
                                    <Route size={14} className="text-[#D4AF37]" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-white font-medium">{trip.trip_number}</div>
                                    <div className="text-xs text-muted">{trip.start_time} · {trip.vehicle?.make} {trip.vehicle?.model} · {trip.students_count} students</div>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${trip.status === 'completed' ? 'badge-active' : trip.status === 'in_progress' ? 'badge-pending' : 'badge-pending'}`}>
                                    {trip.status}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Incomplete students */}
                <div className="nm-card p-5" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <Clock size={15} className="text-[#D4AF37]" /> Incomplete Students
                        </h3>
                        <Link href={route('teacher.students.index')} className="text-xs text-[#D4AF37] hover:underline">View all →</Link>
                    </div>
                    {(incompleteStudents || []).length === 0 && (
                        <div className="text-center py-8 text-muted text-sm">
                            <CheckCircle size={28} className="mx-auto mb-2 opacity-30 text-emerald-400" />
                            All students on track!
                        </div>
                    )}
                    <div className="space-y-2">
                        {(incompleteStudents || []).map(s => {
                            const prog = Math.round((s.completed_sessions / s.total_sessions) * 100);
                            return (
                                <Link key={s.id} href={route('teacher.students.show', s.id)}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all">
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&color=D4AF37&background=000666`}
                                        className="w-8 h-8 rounded-lg" alt={s.name} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white font-medium truncate">{s.name}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="progress-bar flex-1">
                                                <div className="progress-fill" style={{ width: `${prog}%` }} />
                                            </div>
                                            <span className="text-xs text-muted whitespace-nowrap">{s.remaining_sessions} left</span>
                                        </div>
                                    </div>
                                    {s.payment?.payment_status !== 'paid' && (
                                        <AlertCircle size={13} className="text-amber-400 flex-shrink-0" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming tests */}
                <div className="nm-card p-5" data-aos="fade-up" data-aos-delay="150">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <BookOpen size={15} className="text-[#D4AF37]" /> Upcoming Tests
                        </h3>
                        <Link href={route('teacher.llr.list')} className="text-xs text-[#D4AF37] hover:underline">Manage →</Link>
                    </div>
                    {(upcomingTests || []).length === 0 && (
                        <div className="text-center py-8 text-muted text-sm">No upcoming tests</div>
                    )}
                    <div className="space-y-2">
                        {(upcomingTests || []).map(rec => {
                            const testDate = rec.llr_test_date || rec.dl_test_date;
                            const type = rec.llr_test_date ? 'LLR' : 'DL';
                            return (
                                <div key={rec.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="p-2 rounded-lg" style={{ background: type === 'LLR' ? 'rgba(99,102,241,0.15)' : 'rgba(212,175,55,0.15)' }}>
                                        <BookOpen size={13} style={{ color: type === 'LLR' ? '#818cf8' : '#D4AF37' }} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm text-white">{rec.student?.name}</div>
                                        <div className="text-xs text-muted">{type} Test</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-white">{new Date(testDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming trips */}
                <div className="nm-card p-5" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <Route size={15} className="text-[#D4AF37]" /> Upcoming Trips
                        </h3>
                        <Link href={route('teacher.trips.index')} className="text-xs text-[#D4AF37] hover:underline">View all →</Link>
                    </div>
                    <div className="space-y-2">
                        {(upcomingTrips || []).slice(0, 5).map(trip => (
                            <Link key={trip.id} href={route('teacher.trips.show', trip.id)}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all">
                                <div className="text-center min-w-[40px]">
                                    <div className="text-[#D4AF37] font-bold text-sm">{new Date(trip.trip_date).getDate()}</div>
                                    <div className="text-muted text-xs">{new Date(trip.trip_date).toLocaleString('default', { month: 'short' })}</div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-white">{trip.trip_number}</div>
                                    <div className="text-xs text-muted">{trip.start_time} · {trip.students_count} students</div>
                                </div>
                                <span className="text-xs capitalize text-muted">{trip.vehicle_type}</span>
                            </Link>
                        ))}
                        {(!upcomingTrips || upcomingTrips.length === 0) && (
                            <div className="text-center py-6 text-muted text-sm">No upcoming trips</div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
