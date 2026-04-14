import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Edit, Download, CreditCard, BookOpen, Car, Calendar, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';

function formatDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function Section({ title, icon: Icon, children }) {
    return (
        <div className="nm-card p-5" data-aos="fade-up">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-4 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <Icon size={15} className="text-[#D4AF37]" /> {title}
            </h3>
            {children}
        </div>
    );
}

function InfoRow({ label, value, highlight }) {
    return (
        <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <span className="text-xs text-muted">{label}</span>
            <span className={`text-sm font-medium ${highlight ? 'text-[#D4AF37]' : 'text-white'}`}>{value || '—'}</span>
        </div>
    );
}

function PaymentModal({ student, payment, onClose }) {
    const { data, setData, post, processing } = useForm({
        amount: '', payment_mode: 'cash', paid_on: new Date().toISOString().slice(0,10), notes: '',
        student_id: student.id,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.payments.record', payment.id), { onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
            <div className="nm-card p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-white font-semibold">Record Payment</h3>
                    <button onClick={onClose} className="text-muted hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="text-xs text-muted mb-1 block">Amount (₹) *</label>
                        <input type="number" className="field" placeholder="Enter amount" required
                            value={data.amount} onChange={e => setData('amount', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs text-muted mb-1 block">Payment Mode</label>
                        <select className="field" value={data.payment_mode} onChange={e => setData('payment_mode', e.target.value)}>
                            {['cash','upi','card','bank_transfer','cheque'].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-muted mb-1 block">Date</label>
                        <input type="date" className="field" value={data.paid_on} onChange={e => setData('paid_on', e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs text-muted mb-1 block">Notes</label>
                        <input type="text" className="field" placeholder="Optional note" value={data.notes} onChange={e => setData('notes', e.target.value)} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
                        <button type="submit" disabled={processing} className="btn-gold flex-1">
                            {processing ? 'Saving…' : 'Record Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function StudentShow({ student }) {
    const [showPayModal, setShowPayModal] = useState(false);
    const llr = student.llr_record;
    const payment = student.payment;

    const progress = student.total_sessions > 0
        ? Math.round((student.completed_sessions / student.total_sessions) * 100)
        : 0;

    const paidPct = payment?.total_fee > 0
        ? Math.round((payment.amount_paid / payment.total_fee) * 100)
        : 0;

    return (
        <AppLayout title={student.name}>
            <Head title={student.name} />

            {showPayModal && payment && (
                <PaymentModal student={student} payment={payment} onClose={() => setShowPayModal(false)} />
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&color=D4AF37&background=000666&size=128`}
                        className="w-16 h-16 rounded-2xl object-cover" alt={student.name} />
                    <div>
                        <h1 className="text-2xl font-bold text-white">{student.name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[#D4AF37] font-mono text-sm">{student.student_id}</span>
                            <span className={`badge-${student.status === 'active' ? 'active' : student.status === 'completed' ? 'completed' : 'pending'}`}>
                                {student.status}
                            </span>
                            <span className="text-muted text-xs capitalize">{student.vehicle_type} · {student.gender}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={route('admin.students.edit', student.id)} className="btn-ghost flex items-center gap-2 text-sm">
                        <Edit size={15} /> Edit
                    </Link>
                    <button onClick={() => router.post(route('admin.students.invoice', student.id))}
                        className="btn-gold flex items-center gap-2 text-sm">
                        <Download size={15} /> Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Left col */}
                <div className="space-y-4">
                    <Section title="Personal Info" icon={Car}>
                        <InfoRow label="Phone" value={student.phone} />
                        <InfoRow label="Alt Phone" value={student.alt_phone} />
                        <InfoRow label="Email" value={student.email} />
                        <InfoRow label="Date of Birth" value={formatDate(student.date_of_birth)} />
                        <InfoRow label="Age" value={student.age ? `${student.age} Years` : null} />
                        <InfoRow label="Aadhaar" value={student.aadhaar_number ? '••••' + student.aadhaar_number.slice(-4) : null} />
                        <InfoRow label="Address" value={student.address} />
                        <InfoRow label="City" value={`${student.city} ${student.pincode ? '- ' + student.pincode : ''}`} />
                    </Section>

                    <Section title="Assignment" icon={Car}>
                        <InfoRow label="Enrolled" value={formatDate(student.enrollment_date)} />
                    </Section>
                </div>

                {/* Middle col */}
                <div className="space-y-4">
                    {/* Sessions */}
                    <Section title="Session Progress" icon={Calendar}>
                        <div className="text-center py-2">
                            <div className="text-5xl font-bold text-white mb-1">{student.completed_sessions}</div>
                            <div className="text-muted text-sm">of {student.total_sessions} sessions</div>
                            <div className="progress-bar mt-4 h-2">
                                <div className="progress-fill" style={{ width: `${progress}%` }} />
                            </div>
                            <div className="text-[#D4AF37] font-semibold mt-2">{progress}% complete</div>
                        </div>

                        {/* Trip history */}
                        <div className="mt-4 space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                            {(student.trips || []).slice(0,5).map((ts) => (
                                <div key={ts.id} className="flex items-center gap-2 text-xs p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                                    <span className="text-muted">{ts.trip?.trip_date}</span>
                                    <span className="text-white ml-auto">Session #{ts.session_number}</span>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Payment */}
                    <Section title="Payment" icon={CreditCard}>
                        <div className="flex items-center justify-between mb-3">
                            <span className={payment?.payment_status === 'paid' ? 'badge-active' : payment?.payment_status === 'partial' ? 'badge-pending' : 'badge-danger'}>
                                {payment?.payment_status || 'pending'}
                            </span>
                            <button onClick={() => setShowPayModal(true)} className="text-xs text-[#D4AF37] hover:underline">
                                + Record Payment
                            </button>
                        </div>
                        <InfoRow label="Total Fee" value={`₹${Number(payment?.total_fee||0).toLocaleString('en-IN')}`} />
                        <InfoRow label="Paid" value={`₹${Number(payment?.amount_paid||0).toLocaleString('en-IN')}`} />
                        <InfoRow label="Balance" value={`₹${Number(payment?.balance_due||0).toLocaleString('en-IN')}`} highlight />

                        <div className="progress-bar mt-3">
                            <div className="progress-fill" style={{ width: `${paidPct}%`, background: paidPct === 100 ? 'linear-gradient(90deg,#10b981,#059669)' : undefined }} />
                        </div>
                        <div className="text-xs text-muted mt-1">{paidPct}% paid</div>

                        {(payment?.transactions || []).length > 0 && (
                            <div className="mt-3 space-y-1.5">
                                <div className="text-xs text-muted uppercase tracking-wider mb-2">Transaction History</div>
                                {payment.transactions.map(t => (
                                    <div key={t.id} className="flex justify-between text-xs p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                        <span className="text-muted">{formatDate(t.paid_on)} · {t.payment_mode}</span>
                                        <span className="text-emerald-400 font-medium">+₹{Number(t.amount).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>

                {/* Right col - LLR */}
                <div className="space-y-4">
                    <Section title="LLR & DL Status" icon={BookOpen}>
                        {/* LLR */}
                        <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">LLR</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    llr?.llr_status === 'passed' ? 'badge-active' :
                                    llr?.llr_status === 'not_applied' ? 'badge-danger' : 'badge-pending'
                                }`}>{llr?.llr_status?.replace('_',' ') || 'Not Applied'}</span>
                            </div>
                            {llr?.llr_number && <div className="text-xs text-muted">LLR No: <span className="text-white">{llr.llr_number}</span></div>}
                            {llr?.llr_applied_date && <div className="text-xs text-muted mt-1">Applied: {llr.llr_applied_date}</div>}
                            {llr?.llr_test_date && <div className="text-xs text-muted mt-1">Test: {llr.llr_test_date}</div>}
                            {llr?.llr_issued_date && <div className="text-xs text-muted mt-1">Issued: {llr.llr_issued_date}</div>}
                            {llr?.llr_expiry_date && <div className="text-xs text-muted mt-1">Expiry: {llr.llr_expiry_date}</div>}
                        </div>

                        {/* DL eligibility notice */}
                        {llr?.dl_eligible_date && !llr?.dl_eligible && (
                            <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                                    <Clock size={13} /> 30-Day Waiting Period (TN Rule)
                                </div>
                                <div className="text-xs text-muted">DL eligible from: <span className="text-white">{llr.dl_eligible_date}</span></div>
                                <div className="text-xs text-amber-400 mt-1">{llr.days_until_dl_eligible} days remaining</div>
                            </div>
                        )}

                        {/* DL */}
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">DL</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    llr?.dl_status === 'issued' ? 'badge-active' :
                                    llr?.dl_status === 'not_applied' ? 'badge-danger' :
                                    llr?.dl_status === 'waiting_period' ? 'badge-pending' : 'badge-pending'
                                }`}>{llr?.dl_status?.replace('_',' ') || 'Not Applied'}</span>
                            </div>
                            {llr?.dl_eligible && <div className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle size={12} /> Eligible for DL test</div>}
                            {llr?.dl_number && <div className="text-xs text-muted mt-1">DL No: <span className="text-white">{llr.dl_number}</span></div>}
                            {llr?.dl_test_date && <div className="text-xs text-muted mt-1">Test: {llr.dl_test_date}</div>}
                            {llr?.dl_issued_date && <div className="text-xs text-muted mt-1">Issued: {llr.dl_issued_date}</div>}
                            {llr?.rto_office && <div className="text-xs text-muted mt-1">RTO: {llr.rto_office}</div>}
                        </div>

                        <Link href={route('admin.llr.index')} className="mt-3 text-xs text-[#D4AF37] hover:underline block text-center">
                            Manage LLR / DL records →
                        </Link>
                    </Section>
                </div>
            </div>
        </AppLayout>
    );
}
