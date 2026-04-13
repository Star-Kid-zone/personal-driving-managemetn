import { Head, Link } from '@inertiajs/react';
import { GraduationCap, Download, LogOut, Car, CreditCard, BookOpen, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';

function Card({ children, className = '' }) {
    return (
        <div className={`nm-card p-5 ${className}`} data-aos="fade-up">
            {children}
        </div>
    );
}

function InfoRow({ label, value, className = '' }) {
    return (
        <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <span className="text-xs text-muted">{label}</span>
            <span className={`text-sm font-medium text-white ${className}`}>{value || '—'}</span>
        </div>
    );
}

function StatusPill({ status, label }) {
    const map = {
        paid: 'badge-active', partial: 'badge-pending', pending: 'badge-danger',
        passed: 'badge-active', failed: 'badge-danger', issued: 'badge-completed',
        active: 'badge-active', completed: 'badge-completed', not_applied: 'badge-danger',
        applied: 'badge-pending', waiting_period: 'badge-pending', test_scheduled: 'badge-pending',
    };
    return <span className={map[status] || 'badge-pending'}>{label || status?.replace(/_/g,' ')}</span>;
}

export default function PortalDashboard({ student, drivingHistory }) {
    const payment = student.payment;
    const llr = student.llr_record;
    const progress = student.total_sessions > 0
        ? Math.round((student.completed_sessions / student.total_sessions) * 100) : 0;
    const paidPct = payment?.total_fee > 0
        ? Math.round((payment.amount_paid / payment.total_fee) * 100) : 0;

    return (
        <>
            <Head title={`${student.name} — My Dashboard`} />
            <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,6,102,0.3) 0%, #060614 70%)' }}>

                {/* Top Nav */}
                <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(212,175,55,0.1)', background: 'rgba(6,6,20,0.95)', backdropFilter: 'blur(10px)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #000666, #1a1a8e)' }}>
                            <GraduationCap size={16} className="text-[#D4AF37]" />
                        </div>
                        <span className="font-bold text-white text-sm">DriveMaster</span>
                        <span className="text-muted text-xs hidden sm:block">· Student Portal</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('student.portal.invoice.download')} className="btn-gold text-xs flex items-center gap-1.5 px-3 py-2">
                            <Download size={13} /> Invoice
                        </Link>
                        <Link href={route('student.portal.logout')} className="text-muted hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10">
                            <LogOut size={16} />
                        </Link>
                    </div>
                </nav>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

                    {/* Welcome */}
                    <div className="mb-8" data-aos="fade-up">
                        <div className="flex items-center gap-4">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&color=D4AF37&background=000666&size=128`}
                                className="w-14 h-14 rounded-2xl" alt={student.name} />
                            <div>
                                <h1 className="text-2xl font-bold text-white">Welcome, {student.name.split(' ')[0]}!</h1>
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                    <span className="text-[#D4AF37] font-mono text-sm">{student.student_id}</span>
                                    <StatusPill status={student.status} />
                                    <span className="text-muted text-xs capitalize">{student.vehicle_type} · {student.gender}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {[
                            { label: 'Sessions Done', value: student.completed_sessions, icon: CheckCircle, color: '#10b981' },
                            { label: 'Remaining', value: student.remaining_sessions, icon: Clock, color: '#6366f1' },
                            { label: 'Progress', value: `${progress}%`, icon: Car, color: '#D4AF37' },
                            { label: 'Balance Due', value: `₹${Number(payment?.balance_due||0).toLocaleString('en-IN')}`, icon: CreditCard, color: payment?.balance_due > 0 ? '#f87171' : '#10b981' },
                        ].map(({ label, value, icon: Icon, color }, i) => (
                            <div key={i} className="stat-widget" data-aos="fade-up" data-aos-delay={i * 75}>
                                <div className="p-2 rounded-lg w-fit mb-3" style={{ background: `${color}18` }}>
                                    <Icon size={16} style={{ color }} />
                                </div>
                                <div className="text-xl font-bold text-white">{value}</div>
                                <div className="text-xs text-muted mt-0.5">{label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                        {/* Progress */}
                        <Card className="lg:col-span-1">
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <Car size={14} className="text-[#D4AF37]" /> Training Progress
                            </h3>
                            <div className="text-center py-4">
                                <div className="relative inline-flex items-center justify-center">
                                    <svg width="120" height="120" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="#D4AF37" strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${(progress/100)*314} 314`}
                                            transform="rotate(-90 60 60)"
                                            style={{ transition: 'stroke-dasharray 1s ease' }}/>
                                        <text x="60" y="60" dominantBaseline="central" textAnchor="middle"
                                            fill="white" fontSize="22" fontWeight="700" fontFamily="Plus Jakarta Sans">{progress}%</text>
                                    </svg>
                                </div>
                                <div className="text-muted text-sm mt-2">{student.completed_sessions} of {student.total_sessions} sessions</div>
                            </div>
                            <InfoRow label="Teacher" value={student.teacher?.user?.name} />
                            <InfoRow label="Vehicle" value={student.vehicle ? `${student.vehicle.make} ${student.vehicle.model}` : null} />
                            <InfoRow label="Enrolled" value={student.enrollment_date} />
                        </Card>

                        {/* LLR & DL */}
                        <Card>
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <BookOpen size={14} className="text-[#D4AF37]" /> LLR & License
                            </h3>
                            {/* LLR block */}
                            <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-indigo-400">LEARNER LICENCE (LLR)</span>
                                    <StatusPill status={llr?.llr_status || 'not_applied'} />
                                </div>
                                {llr?.llr_number && <p className="text-xs text-muted">LLR No: <span className="text-white">{llr.llr_number}</span></p>}
                                {llr?.llr_test_date && <p className="text-xs text-muted mt-1">📅 Test Date: <span className="text-white">{llr.llr_test_date}</span></p>}
                                {llr?.llr_expiry_date && <p className="text-xs text-muted mt-1">⏳ Expiry: {llr.llr_expiry_date}</p>}
                                {!llr?.llr_number && <p className="text-xs text-muted mt-1">Contact your instructor to initiate LLR.</p>}
                            </div>

                            {/* 30-day waiting */}
                            {llr?.dl_eligible_date && !llr?.dl_eligible && (
                                <div className="p-3 rounded-xl mb-3 flex items-start gap-2"
                                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                                    <Clock size={13} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-amber-400">30-Day Waiting Period (TN Rule)</p>
                                        <p className="text-xs text-muted mt-0.5">DL eligible from: <span className="text-white">{llr.dl_eligible_date}</span></p>
                                        {llr.days_until_dl_eligible > 0 && <p className="text-xs text-amber-300 mt-0.5">{llr.days_until_dl_eligible} days remaining</p>}
                                    </div>
                                </div>
                            )}

                            {/* DL block */}
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-[#D4AF37]">DRIVING LICENCE (DL)</span>
                                    <StatusPill status={llr?.dl_status || 'not_applied'} />
                                </div>
                                {llr?.dl_eligible && <p className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle size={11} /> You are eligible to apply for DL!</p>}
                                {llr?.dl_number && <p className="text-xs text-muted mt-1">DL No: <span className="text-white">{llr.dl_number}</span></p>}
                                {llr?.dl_test_date && <p className="text-xs text-muted mt-1">📅 Test: <span className="text-white">{llr.dl_test_date}</span></p>}
                                {llr?.rto_office && <p className="text-xs text-muted mt-1">🏛 {llr.rto_office}</p>}
                            </div>
                        </Card>

                        {/* Payment */}
                        <Card>
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <CreditCard size={14} className="text-[#D4AF37]" /> Payment Details
                            </h3>
                            <div className="flex items-center justify-between mb-4">
                                <StatusPill status={payment?.payment_status || 'pending'} />
                                <span className="text-xs text-muted capitalize">{payment?.payment_mode}</span>
                            </div>

                            <div className="space-y-0">
                                <InfoRow label="Course Fee" value={`₹${Number(payment?.total_fee||0).toLocaleString('en-IN')}`} />
                                <InfoRow label="Amount Paid" value={`₹${Number(payment?.amount_paid||0).toLocaleString('en-IN')}`} className="text-emerald-400" />
                                <InfoRow label="Balance Due" value={`₹${Number(payment?.balance_due||0).toLocaleString('en-IN')}`} className={payment?.balance_due > 0 ? 'text-red-400' : 'text-emerald-400'} />
                            </div>

                            <div className="progress-bar mt-3 h-2">
                                <div className="progress-fill" style={{ width: `${paidPct}%`, background: paidPct === 100 ? 'linear-gradient(90deg,#10b981,#059669)' : undefined }} />
                            </div>
                            <p className="text-xs text-muted mt-1.5">{paidPct}% paid</p>

                            {(payment?.transactions || []).length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs text-muted uppercase tracking-wider mb-2">Transactions</p>
                                    <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-hide">
                                        {payment.transactions.map(t => (
                                            <div key={t.id} className="flex justify-between text-xs p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                <span className="text-muted">{t.paid_on}</span>
                                                <span className="text-emerald-400">+₹{Number(t.amount).toLocaleString('en-IN')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Link href={route('student.portal.invoice.download')}
                                className="mt-4 btn-ghost w-full flex items-center justify-center gap-2 text-sm py-2">
                                <Download size={14} /> Download Invoice
                            </Link>
                        </Card>
                    </div>

                    {/* Driving History */}
                    {Object.keys(drivingHistory || {}).length > 0 && (
                        <Card className="mt-4">
                            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                <Calendar size={14} className="text-[#D4AF37]" /> Driving History
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(drivingHistory).map(([month, sessions]) => (
                                    <div key={month}>
                                        <div className="text-xs text-muted uppercase tracking-wider mb-2">{month}</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {sessions.map(ts => (
                                                <div key={ts.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
                                                        <CheckCircle size={14} className="text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-white">{ts.trip?.trip_date}</div>
                                                        <div className="text-xs text-muted">
                                                            Session #{ts.session_number}
                                                            {ts.skill_rating && ` · ${ts.skill_rating}`}
                                                        </div>
                                                    </div>
                                                    {ts.performance_notes && (
                                                        <div className="ml-auto text-xs text-muted text-right max-w-24 truncate">{ts.performance_notes}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
