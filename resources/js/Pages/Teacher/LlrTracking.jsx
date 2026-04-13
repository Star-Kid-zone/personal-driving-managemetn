import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Calendar, AlertCircle, X } from 'lucide-react';

function UpdateModal({ student, llr, onClose }) {
    const { data, setData, put, processing } = useForm({
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

    const submit = (e) => {
        e.preventDefault();
        put(route('teacher.students.llr', student.id), { onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)' }}>
            <div className="nm-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">Update LLR / DL — {student.name}</h3>
                    <button onClick={onClose}><X size={18} className="text-muted" /></button>
                </div>
                <form onSubmit={submit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'LLR Status', name: 'llr_status', type: 'select', opts: ['not_applied','documents_pending','applied','test_scheduled','passed','failed','expired'] },
                            { label: 'LLR Number', name: 'llr_number' },
                            { label: 'Applied Date', name: 'llr_applied_date', type: 'date' },
                            { label: 'Test Date', name: 'llr_test_date', type: 'date' },
                            { label: 'Issued Date', name: 'llr_issued_date', type: 'date' },
                            { label: 'DL Status', name: 'dl_status', type: 'select', opts: ['not_applied','waiting_period','documents_pending','applied','test_scheduled','passed','failed','issued'] },
                            { label: 'DL Test Date', name: 'dl_test_date', type: 'date' },
                            { label: 'RTO Office', name: 'rto_office' },
                        ].map(({ label, name, type = 'text', opts }) => (
                            <div key={name}>
                                <label className="text-xs text-muted mb-1 block">{label}</label>
                                {type === 'select' ? (
                                    <select className="field text-xs py-2" value={data[name]} onChange={e => setData(name, e.target.value)}>
                                        {opts.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
                                    </select>
                                ) : (
                                    <input type={type} className="field text-xs py-2" value={data[name] || ''} onChange={e => setData(name, e.target.value)} />
                                )}
                            </div>
                        ))}
                        <div className="col-span-2">
                            <label className="text-xs text-muted mb-1 block">Notes</label>
                            <textarea className="field text-xs h-14 resize-none" value={data.notes || ''} onChange={e => setData('notes', e.target.value)} />
                        </div>
                    </div>
                    {data.llr_issued_date && (
                        <div className="p-3 rounded-xl text-xs flex items-center gap-2"
                            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                            <Clock size={12} className="text-[#D4AF37]" />
                            <span className="text-[#D4AF37]">DL eligible: {new Date(new Date(data.llr_issued_date).setDate(new Date(data.llr_issued_date).getDate() + 30)).toLocaleDateString('en-IN')} (30-day TN rule)</span>
                        </div>
                    )}
                    <div className="flex gap-2 pt-1">
                        <button type="button" onClick={onClose} className="btn-ghost flex-1 text-sm py-2">Cancel</button>
                        <button type="submit" disabled={processing} className="btn-gold flex-1 text-sm py-2">
                            {processing ? 'Saving…' : 'Update Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function LlrTracking({ awaiting, eligible, tests }) {
    const [editing, setEditing] = useState(null);
    const [tab, setTab] = useState('awaiting');

    const sections = {
        awaiting: { data: awaiting, label: 'Awaiting LLR', color: '#f87171', Icon: AlertCircle },
        eligible: { data: eligible, label: 'DL Eligible',  color: '#10b981', Icon: CheckCircle },
        tests:    { data: tests,    label: 'Upcoming Tests',color: '#D4AF37', Icon: Calendar },
    };

    return (
        <AppLayout title="LLR & DL Tracking">
            <Head title="LLR Tracking" />

            {editing && (
                <UpdateModal student={editing.student} llr={editing.llr} onClose={() => setEditing(null)} />
            )}

            {/* TN Rule Banner */}
            <div className="nm-card p-4 mb-5 flex gap-3" data-aos="fade-down" style={{ borderColor: 'rgba(212,175,55,0.25)' }}>
                <BookOpen size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                    <div className="text-sm font-semibold text-white">Tamil Nadu Licence Pipeline</div>
                    <div className="text-xs text-muted mt-0.5">
                        LLR → 30-day wait → DL Application. Update each student's status as they progress.
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl w-fit mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {Object.entries(sections).map(([key, { label, data }]) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === key ? 'bg-[#D4AF37] text-[#0a0a1a]' : 'text-muted hover:text-white'}`}>
                        {label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-black/20' : 'bg-white/10'}`}>{data?.length || 0}</span>
                    </button>
                ))}
            </div>

            {/* Records */}
            <div className="nm-card p-4 space-y-2" data-aos="fade-up">
                {sections[tab].data?.length === 0 && (
                    <div className="text-center py-12 text-muted text-sm">
                        <CheckCircle size={32} className="mx-auto mb-3 opacity-20 text-emerald-400" />
                        No students in this category
                    </div>
                )}
                {sections[tab].data?.map(rec => (
                    <div key={rec.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
                        style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(rec.student?.name||'?')}&color=D4AF37&background=000666`}
                            className="w-9 h-9 rounded-xl" alt={rec.student?.name} />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium truncate">{rec.student?.name}</div>
                            <div className="text-xs text-muted">{rec.student?.student_id} · {rec.student?.phone}</div>
                        </div>
                        <div className="text-xs text-right space-y-1">
                            <div>LLR: <span className={rec.llr_status === 'passed' ? 'text-emerald-400' : 'text-amber-400'}>{rec.llr_status?.replace(/_/g,' ')}</span></div>
                            <div>DL: <span className={rec.dl_status === 'issued' ? 'text-emerald-400' : 'text-muted'}>{rec.dl_status?.replace(/_/g,' ')}</span></div>
                        </div>
                        {rec.dl_eligible_date && !rec.dl_eligible && (
                            <div className="text-xs text-amber-400 text-center">
                                <Clock size={11} className="mx-auto mb-0.5" />
                                {rec.days_until_dl_eligible}d
                            </div>
                        )}
                        <button onClick={() => setEditing({ student: rec.student, llr: rec })}
                            className="btn-ghost text-xs px-3 py-1.5 flex-shrink-0">Update</button>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
