import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { CreditCard, BookOpen, Car, CheckCircle, Clock, X, Download, ChevronDown } from 'lucide-react';

function formatDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function Section({ title, icon: Icon, children, action }) {
    return (
        <div className="nm-card p-5" data-aos="fade-up">
            <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Icon size={14} className="text-[#D4AF37]" /> {title}
                </h3>
                {action}
            </div>
            {children}
        </div>
    );
}

function InfoRow({ label, value, className = '' }) {
    return (
        <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <span className="text-xs text-muted">{label}</span>
            <span className={`text-sm font-medium text-white ${className}`}>{value || '—'}</span>
        </div>
    );
}

export default function TeacherStudentShow({ student }) {
    const [showPayForm, setShowPayForm] = useState(false);
    const [showLlrForm, setShowLlrForm] = useState(false);
    const payment = student.payment;
    const llr     = student.llr_record;
    const prog    = student.total_sessions > 0
        ? Math.round((student.completed_sessions / student.total_sessions) * 100) : 0;

    const { data: payData, setData: setPayData, post: submitPay, processing: payProcessing } = useForm({
        amount: '', payment_mode: 'cash',
        paid_on: new Date().toISOString().slice(0, 10), notes: '',
        student_id: student.id,
    });

    const { data: llrData, setData: setLlrData, put: submitLlr, processing: llrProcessing } = useForm({
        llr_status:       llr?.llr_status       || 'not_applied',
        llr_applied_date: llr?.llr_applied_date || '',
        llr_test_date:    llr?.llr_test_date    || '',
        llr_issued_date:  llr?.llr_issued_date  || '',
        llr_number:       llr?.llr_number       || '',
        dl_status:        llr?.dl_status        || 'not_applied',
        dl_test_date:     llr?.dl_test_date     || '',
        rto_office:       llr?.rto_office       || 'RTO Madurai - TN',
        notes:            llr?.notes            || '',
    });

    return (
        <AppLayout title={student.name}>
            <Head title={student.name} />

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&color=D4AF37&background=000666&size=128`}
                        className="w-14 h-14 rounded-2xl" alt={student.name} />
                    <div>
                        <h1 className="text-xl font-bold text-white">{student.name}</h1>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-[#D4AF37] font-mono text-sm">{student.student_id}</span>
                            <span className={student.status === 'active' ? 'badge-active' : 'badge-completed'}>{student.status}</span>
                            <span className="text-muted text-xs capitalize">{student.vehicle_type}</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => router.get(route('teacher.students.invoice', student.id))}
                    className="btn-ghost text-sm flex items-center gap-2">
                    <Download size={14} /> Invoice
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Progress */}
                <Section title="Session Progress" icon={Car}>
                    <div className="text-center py-4">
                        <svg width="110" height="110" viewBox="0 0 110 110">
                            <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
                            <circle cx="55" cy="55" r="46" fill="none" stroke="#D4AF37" strokeWidth="7"
                                strokeLinecap="round"
                                strokeDasharray={`${(prog/100)*289} 289`}
                                transform="rotate(-90 55 55)" style={{ transition: 'stroke-dasharray 1s ease' }}/>
                            <text x="55" y="55" dominantBaseline="central" textAnchor="middle"
                                fill="white" fontSize="20" fontWeight="700" fontFamily="Plus Jakarta Sans">{prog}%</text>
                        </svg>
                        <div className="text-muted text-sm mt-2">{student.completed_sessions} of {student.total_sessions} sessions</div>
                    </div>
                    <InfoRow label="Phone" value={student.phone} />
                    <InfoRow label="Enrolled" value={formatDate(student.enrollment_date)} />
                    <InfoRow label="Remaining" value={`${student.remaining_sessions} sessions`} className="text-[#D4AF37]" />

                    {/* Recent trips */}
                    {(student.trips || []).length > 0 && (
                        <div className="mt-4">
                            <div className="text-xs text-muted uppercase tracking-wider mb-2">Recent Sessions</div>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-hide">
                                {student.trips.slice(0, 6).map(ts => (
                                    <div key={ts.id} className="flex items-center gap-2 text-xs p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <CheckCircle size={11} className="text-emerald-400 flex-shrink-0" />
                                        <span className="text-muted">{ts.trip?.trip_date}</span>
                                        <span className="ml-auto text-white">#{ts.session_number}</span>
                                        {ts.skill_rating && <span className="text-muted capitalize">{ts.skill_rating}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Section>

                {/* Payment */}
                <Section title="Payment" icon={CreditCard}
                    action={<button onClick={() => setShowPayForm(!showPayForm)} className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
                        + Record <ChevronDown size={12} className={`transition-transform ${showPayForm ? 'rotate-180' : ''}`} />
                    </button>}>

                    <div className="flex items-center justify-between mb-3">
                        <span className={payment?.payment_status === 'paid' ? 'badge-active' : payment?.payment_status === 'partial' ? 'badge-pending' : 'badge-danger'}>
                            {payment?.payment_status || 'pending'}
                        </span>
                    </div>
                    <InfoRow label="Total Fee" value={`₹${Number(payment?.total_fee||0).toLocaleString('en-IN')}`} />
                    <InfoRow label="Paid" value={`₹${Number(payment?.amount_paid||0).toLocaleString('en-IN')}`} className="text-emerald-400" />
                    <InfoRow label="Balance" value={`₹${Number(payment?.balance_due||0).toLocaleString('en-IN')}`}
                        className={payment?.balance_due > 0 ? 'text-red-400' : 'text-emerald-400'} />

                    <div className="progress-bar mt-2 h-1.5">
                        <div className="progress-fill" style={{ width: `${payment?.total_fee > 0 ? Math.round((payment.amount_paid/payment.total_fee)*100) : 0}%` }} />
                    </div>

                    {showPayForm && (
                        <form onSubmit={e => { e.preventDefault(); submitPay(route('teacher.students.payment', student.id), { onSuccess: () => setShowPayForm(false) }); }}
                            className="mt-4 p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)' }}>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-muted mb-1 block">Amount (₹) *</label>
                                    <input type="number" className="field text-sm py-2" required placeholder="0"
                                        value={payData.amount} onChange={e => setPayData('amount', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs text-muted mb-1 block">Mode</label>
                                    <select className="field text-sm py-2" value={payData.payment_mode} onChange={e => setPayData('payment_mode', e.target.value)}>
                                        {['cash','upi','card','bank_transfer','cheque'].map(m => <option key={m} value={m}>{m.replace('_',' ')}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-muted mb-1 block">Date</label>
                                    <input type="date" className="field text-sm py-2" value={payData.paid_on} onChange={e => setPayData('paid_on', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs text-muted mb-1 block">Notes</label>
                                    <input type="text" className="field text-sm py-2" placeholder="Optional" value={payData.notes} onChange={e => setPayData('notes', e.target.value)} />
                                </div>
                            </div>
                            <button type="submit" disabled={payProcessing} className="btn-gold w-full text-sm py-2">
                                {payProcessing ? 'Saving…' : 'Record Payment'}
                            </button>
                        </form>
                    )}

                    {(payment?.transactions || []).length > 0 && (
                        <div className="mt-3 space-y-1.5">
                            <div className="text-xs text-muted uppercase tracking-wider mb-1">History</div>
                            {payment.transactions.map(t => (
                                <div key={t.id} className="flex justify-between text-xs p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <span className="text-muted">{formatDate(t.paid_on)} · {t.payment_mode}</span>
                                    <span className="text-emerald-400">+₹{Number(t.amount).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                {/* LLR & DL */}
                <div className="lg:col-span-2">
                    <Section title="LLR & DL Status (Tamil Nadu)" icon={BookOpen}
                        action={<button onClick={() => setShowLlrForm(!showLlrForm)} className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
                            Update <ChevronDown size={12} className={`transition-transform ${showLlrForm ? 'rotate-180' : ''}`} />
                        </button>}>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* LLR */}
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">LLR</div>
                                <div className={`text-sm font-semibold mb-2 ${llr?.llr_status === 'passed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                                    {llr?.llr_status?.replace(/_/g,' ') || 'Not Applied'}
                                </div>
                                {llr?.llr_number && <div className="text-xs text-muted">No: {llr.llr_number}</div>}
                                {llr?.llr_test_date && <div className="text-xs text-muted mt-1">📅 Test: {llr.llr_test_date}</div>}
                                {llr?.llr_issued_date && <div className="text-xs text-muted mt-1">✅ Issued: {llr.llr_issued_date}</div>}
                            </div>

                            {/* 30-day wait */}
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">30-Day Rule (TN)</div>
                                {llr?.dl_eligible_date ? (
                                    <>
                                        <div className="text-sm font-semibold text-white mb-1">{llr.dl_eligible_date}</div>
                                        {llr.dl_eligible
                                            ? <div className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle size={11}/> DL eligible now!</div>
                                            : <div className="text-xs text-amber-400 flex items-center gap-1"><Clock size={11}/> {llr.days_until_dl_eligible} days remaining</div>
                                        }
                                    </>
                                ) : (
                                    <div className="text-xs text-muted">Issue LLR to start countdown</div>
                                )}
                            </div>

                            {/* DL */}
                            <div className="p-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
                                <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">DL</div>
                                <div className={`text-sm font-semibold mb-2 ${llr?.dl_status === 'issued' ? 'text-emerald-400' : 'text-muted'}`}>
                                    {llr?.dl_status?.replace(/_/g,' ') || 'Not Applied'}
                                </div>
                                {llr?.dl_number && <div className="text-xs text-muted">No: {llr.dl_number}</div>}
                                {llr?.dl_test_date && <div className="text-xs text-muted mt-1">📅 Test: {llr.dl_test_date}</div>}
                                {llr?.rto_office && <div className="text-xs text-muted mt-1">🏛 {llr.rto_office}</div>}
                            </div>
                        </div>

                        {showLlrForm && (
                            <form onSubmit={e => { e.preventDefault(); submitLlr(route('teacher.students.llr', student.id), { onSuccess: () => setShowLlrForm(false) }); }}
                                className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.15)' }}>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                                    {[
                                        { l:'LLR Status', n:'llr_status', type:'select', opts:['not_applied','documents_pending','applied','test_scheduled','passed','failed','expired'] },
                                        { l:'LLR Number', n:'llr_number' },
                                        { l:'Applied Date', n:'llr_applied_date', type:'date' },
                                        { l:'Test Date', n:'llr_test_date', type:'date' },
                                        { l:'Issued Date', n:'llr_issued_date', type:'date' },
                                        { l:'DL Status', n:'dl_status', type:'select', opts:['not_applied','waiting_period','documents_pending','applied','test_scheduled','passed','failed','issued'] },
                                        { l:'DL Test Date', n:'dl_test_date', type:'date' },
                                        { l:'RTO Office', n:'rto_office' },
                                    ].map(({ l, n, type = 'text', opts }) => (
                                        <div key={n}>
                                            <label className="text-xs text-muted mb-1 block">{l}</label>
                                            {type === 'select' ? (
                                                <select className="field text-xs py-2" value={llrData[n]} onChange={e => setLlrData(n, e.target.value)}>
                                                    {opts.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
                                                </select>
                                            ) : (
                                                <input type={type} className="field text-xs py-2" value={llrData[n] || ''} onChange={e => setLlrData(n, e.target.value)} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" disabled={llrProcessing} className="btn-gold text-sm py-2 px-6">
                                    {llrProcessing ? 'Saving…' : 'Update LLR Record'}
                                </button>
                            </form>
                        )}
                    </Section>
                </div>
            </div>
        </AppLayout>
    );
}
