import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { CreditCard, AlertCircle, TrendingUp, X } from 'lucide-react';

function RecordModal({ payment, onClose }) {
    const { data, setData, post, processing } = useForm({
        amount: '', payment_mode: 'cash',
        paid_on: new Date().toISOString().slice(0, 10),
        notes: '', student_id: payment.student_id,
        payment_status: payment.payment_status,
    });
    const submit = (e) => {
        e.preventDefault();
        post(route('admin.payments.record', payment.id), { onSuccess: onClose });
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
            <div className="nm-card p-6 w-full max-w-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Record Payment</h3>
                    <button onClick={onClose}><X size={16} className="text-muted" /></button>
                </div>
                <p className="text-xs text-muted mb-4">
                    {payment.student?.name} · Balance: <span className="text-red-400 font-semibold">₹{Number(payment.balance_due || 0).toLocaleString('en-IN')}</span>
                </p>
                <form onSubmit={submit} className="space-y-3">
                    {[
                        { label: 'Amount (₹)', name: 'amount', type: 'number', placeholder: 'Enter amount' },
                        { label: 'Date', name: 'paid_on', type: 'date' },
                        { label: 'Notes', name: 'notes', type: 'text', placeholder: 'Optional' },
                    ].map(({ label, name, type, placeholder }) => (
                        <div key={name}>
                            <label className="text-xs text-muted mb-1 block">{label}</label>
                            <input type={type} className="field" placeholder={placeholder}
                                max={name === 'amount' ? payment.balance_due : undefined}
                                value={data[name]} onChange={e => setData(name, e.target.value)} required={name === 'amount'} />
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-muted mb-1 block">Mode</label>
                            <select className="field text-sm" value={data.payment_mode} onChange={e => setData('payment_mode', e.target.value)}>
                                {['cash', 'upi', 'card', 'bank_transfer', 'cheque'].map(m => (
                                    <option key={m} value={m}>{m.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-muted mb-1 block">New Status</label>
                            <select className="field text-sm" value={data.payment_status} onChange={e => setData('payment_status', e.target.value)}>
                                {['pending', 'partial', 'paid'].map(s => (
                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button type="button" onClick={onClose} className="btn-ghost flex-1 text-sm">Cancel</button>
                        <button type="submit" disabled={processing} className="btn-gold flex-1 text-sm">
                            {processing ? 'Saving…' : 'Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function PaymentsIndex({ payments, pendingPayments, revenueStats }) {
    const [modal, setModal] = useState(null);
    const [tab, setTab] = useState('all');

    const displayData = tab === 'pending'
        ? pendingPayments
        : payments.data;

    return (
        <AppLayout title="Payments">
            <Head title="Payments" />

            {modal && <RecordModal payment={modal} onClose={() => setModal(null)} />}

            {/* Revenue stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Monthly Revenue', value: `₹${((revenueStats?.monthly || 0) / 1000).toFixed(1)}K`, color: '#10b981' },
                    { label: 'Yearly Revenue', value: `₹${((revenueStats?.yearly || 0) / 1000).toFixed(1)}K`, color: '#D4AF37' },
                    { label: 'Pending Dues', value: `₹${((revenueStats?.pending || 0) / 1000).toFixed(1)}K`, color: '#f87171' },
                    { label: 'Pending Count', value: pendingPayments?.length || 0, color: '#f59e0b' },
                ].map(({ label, value, color }, i) => (
                    <div key={i} className="stat-widget" data-aos="fade-up" data-aos-delay={i * 75}>
                        <div className="text-2xl font-bold text-white" style={{ color }}>{value}</div>
                        <div className="text-xs text-muted mt-1">{label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl w-fit mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {[
                    { id: 'all', label: 'All Payments' },
                    { id: 'pending', label: `Pending Dues (${pendingPayments?.length || 0})` },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            tab === t.id ? 'bg-[#D4AF37] text-[#0a0a1a]' : 'text-muted hover:text-white'
                        }`}>{t.label}</button>
                ))}
            </div>

            <div className="nm-card overflow-hidden" data-aos="fade-up">
                <div className="overflow-x-auto">
                    <table className="dm-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Payment #</th>
                                <th>Total Fee</th>
                                <th>Paid</th>
                                <th>Balance</th>
                                <th>Mode</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!displayData || displayData.length === 0) && (
                                <tr><td colSpan={8} className="text-center py-12 text-muted">No payments found</td></tr>
                            )}
                            {(displayData || []).map(p => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="text-sm text-white font-medium">{p.student?.name}</div>
                                        <div className="text-xs text-muted">{p.student?.student_id}</div>
                                    </td>
                                    <td className="font-mono text-xs text-[#D4AF37]">{p.payment_number}</td>
                                    <td className="text-sm text-white">₹{Number(p.total_fee).toLocaleString('en-IN')}</td>
                                    <td className="text-sm text-emerald-400">₹{Number(p.amount_paid).toLocaleString('en-IN')}</td>
                                    <td className={`text-sm font-semibold ${p.balance_due > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        ₹{Number(p.balance_due || 0).toLocaleString('en-IN')}
                                    </td>
                                    <td className="text-xs text-muted capitalize">{p.payment_mode?.replace('_', ' ')}</td>
                                    <td>
                                        <span className={p.payment_status === 'paid' ? 'badge-active' : p.payment_status === 'partial' ? 'badge-pending' : 'badge-danger'}>
                                            {p.payment_status}
                                        </span>
                                    </td>
                                    <td>
                                        {p.payment_status !== 'paid' && (
                                            <button onClick={() => setModal(p)}
                                                className="text-xs text-[#D4AF37] hover:underline whitespace-nowrap">
                                                + Record
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {tab === 'all' && payments.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-xs text-muted">Showing {payments.from}–{payments.to} of {payments.total}</span>
                        <div className="flex gap-1">
                            {payments.links?.map((link, i) => (
                                <button key={i} onClick={() => link.url && router.get(link.url)} disabled={!link.url}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${link.active ? 'btn-gold' : link.url ? 'text-muted hover:text-white' : 'text-subtle cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
