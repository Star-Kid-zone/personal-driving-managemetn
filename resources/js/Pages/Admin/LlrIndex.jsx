import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Calendar, AlertCircle, X, ChevronDown } from 'lucide-react';
import FormField from '@/Components/UI/FormField';

function LlrUpdateModal({ student, llr, onClose }) {
    const { data, setData, put, processing } = useForm({
        llr_status:       llr?.llr_status       || 'not_applied',
        llr_applied_date: llr?.llr_applied_date || '',
        llr_test_date:    llr?.llr_test_date    || '',
        llr_issued_date:  llr?.llr_issued_date  || '',
        llr_number:       llr?.llr_number       || '',
        llr_expiry_date:  llr?.llr_expiry_date  || '',
        dl_status:        llr?.dl_status        || 'not_applied',
        dl_applied_date:  llr?.dl_applied_date  || '',
        dl_test_date:     llr?.dl_test_date     || '',
        dl_issued_date:   llr?.dl_issued_date   || '',
        dl_number:        llr?.dl_number        || '',
        rto_office:       llr?.rto_office       || '',
        notes:            llr?.notes            || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.llr.update', student.id), { onSuccess: onClose });
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)' }}>
            <div className="nm-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-white font-semibold">Update LLR / DL Record</h3>
                        <p className="text-muted text-xs mt-0.5">{student.name} · {student.student_id}</p>
                    </div>
                    <button onClick={onClose} className="text-muted hover:text-white p-1"><X size={18} /></button>
                </div>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="sm:col-span-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider pb-1 border-b"
                            style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
                            Learner Licence (LLR)
                        </div>

                        <FormField label="LLR Status" error={null}>
                            <select className="field" value={data.llr_status} onChange={e => setData('llr_status', e.target.value)}>
                                {['not_applied','documents_pending','applied','test_scheduled','passed','failed','expired']
                                    .map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                            </select>
                        </FormField>
                        <FormField label="LLR Number" error={null} value={data.llr_number || ''} onChange={e => setData('llr_number', e.target.value)} />
                        <FormField label="Applied Date" type="date" error={null} value={data.llr_applied_date || ''} onChange={e => setData('llr_applied_date', e.target.value)} />
                        <FormField label="Test Date" type="date" error={null} value={data.llr_test_date || ''} onChange={e => setData('llr_test_date', e.target.value)} />
                        <FormField label="Issued Date" type="date" error={null} value={data.llr_issued_date || ''} onChange={e => setData('llr_issued_date', e.target.value)} />
                        <FormField label="Expiry Date" type="date" error={null} value={data.llr_expiry_date || ''} onChange={e => setData('llr_expiry_date', e.target.value)} />

                        {data.llr_issued_date && (
                            <div className="sm:col-span-2 p-3 rounded-xl flex items-center gap-2"
                                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                                <Clock size={14} className="text-[#D4AF37]" />
                                <span className="text-xs text-[#D4AF37]">
                                    DL eligible from: {new Date(new Date(data.llr_issued_date).setDate(new Date(data.llr_issued_date).getDate() + 30)).toLocaleDateString('en-IN')}
                                    {' '}(Tamil Nadu 30-day rule)
                                </span>
                            </div>
                        )}

                        <div className="sm:col-span-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider pb-1 border-b mt-2"
                            style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
                            Driving Licence (DL)
                        </div>

                        <FormField label="DL Status" error={null}>
                            <select className="field" value={data.dl_status} onChange={e => setData('dl_status', e.target.value)}>
                                {['not_applied','waiting_period','documents_pending','applied','test_scheduled','passed','failed','issued']
                                    .map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                            </select>
                        </FormField>
                        <FormField label="DL Number" error={null} value={data.dl_number || ''} onChange={e => setData('dl_number', e.target.value)} />
                        <FormField label="DL Applied Date" type="date" error={null} value={data.dl_applied_date || ''} onChange={e => setData('dl_applied_date', e.target.value)} />
                        <FormField label="DL Test Date" type="date" error={null} value={data.dl_test_date || ''} onChange={e => setData('dl_test_date', e.target.value)} />
                        <FormField label="DL Issued Date" type="date" error={null} value={data.dl_issued_date || ''} onChange={e => setData('dl_issued_date', e.target.value)} />
                        <FormField label="RTO Office" error={null} value={data.rto_office || ''} onChange={e => setData('rto_office', e.target.value)} />
                        <div className="sm:col-span-2">
                            <FormField label="Notes" error={null}>
                                <textarea className="field h-16 resize-none" value={data.notes || ''}
                                    onChange={e => setData('notes', e.target.value)} />
                            </FormField>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
                        <button type="submit" disabled={processing} className="btn-gold flex-1">
                            {processing ? 'Saving…' : 'Save LLR Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function StudentLlrRow({ record, onEdit }) {
    const s = record.student;
    const testDate = record.llr_test_date || record.dl_test_date;
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s?.name||'?')}&color=D4AF37&background=000666`}
                className="w-9 h-9 rounded-xl" alt={s?.name} />
            <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">{s?.name}</div>
                <div className="text-xs text-muted">{s?.student_id} · {s?.phone}</div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                    record.llr_status === 'passed' ? 'badge-active' :
                    record.llr_status === 'not_applied' ? 'badge-danger' : 'badge-pending'
                }`}>LLR: {record.llr_status?.replace(/_/g,' ')}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                    record.dl_status === 'issued' ? 'badge-active' :
                    record.dl_eligible ? 'badge-active' :
                    record.dl_status === 'waiting_period' ? 'badge-pending' : 'badge-danger'
                }`}>DL: {record.dl_status?.replace(/_/g,' ')}</span>
                {testDate && (
                    <span className="text-xs text-[#D4AF37] flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(testDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                    </span>
                )}
                {record.dl_eligible && record.dl_status !== 'issued' && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle size={11} /> DL Ready
                    </span>
                )}
            </div>
            <button onClick={() => onEdit(s, record)}
                className="btn-ghost text-xs px-3 py-1.5 flex-shrink-0">Update</button>
        </div>
    );
}

export default function LlrIndex({ awaiting, eligible, allRecords, upcomingTests }) {
    const [editing, setEditing] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all',      label: 'All Records',      count: allRecords?.length },
        { id: 'awaiting', label: 'LLR Pending',      count: awaiting?.length, alert: true },
        { id: 'eligible', label: 'DL Eligible',      count: eligible?.length },
        { id: 'tests',    label: 'Upcoming Tests',   count: upcomingTests?.length },
    ];

    const currentData = {
        all:      allRecords,
        awaiting: awaiting,
        eligible: eligible,
        tests:    upcomingTests,
    }[activeTab] || [];

    return (
        <AppLayout title="LLR & DL Tracking">
            <Head title="LLR & DL Tracking" />

            {editing && (
                <LlrUpdateModal
                    student={editing.student}
                    llr={editing.llr}
                    onClose={() => setEditing(null)}
                />
            )}

            {/* Info banner */}
            <div className="nm-card p-4 mb-5 flex items-start gap-3" data-aos="fade-down"
                style={{ borderColor: 'rgba(212,175,55,0.25)' }}>
                <BookOpen size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                    <div className="text-sm font-semibold text-white">Tamil Nadu Licence Pipeline</div>
                    <div className="text-xs text-muted mt-0.5">
                        LLR Application → LLR Test → LLR Issued →{' '}
                        <span className="text-[#D4AF37] font-medium">30-Day Waiting Period</span>
                        {' '}→ DL Application → DL Test → DL Issued
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                    { label: 'LLR Pending', value: awaiting?.length || 0, color: '#f87171', icon: AlertCircle },
                    { label: 'DL Eligible', value: eligible?.length || 0, color: '#10b981', icon: CheckCircle },
                    { label: 'Upcoming Tests', value: upcomingTests?.length || 0, color: '#D4AF37', icon: Calendar },
                    { label: 'Total Records', value: allRecords?.length || 0, color: '#6366f1', icon: BookOpen },
                ].map(({ label, value, color, icon: Icon }, i) => (
                    <div key={i} className="stat-widget" data-aos="fade-up" data-aos-delay={i * 75}>
                        <div className="p-2 rounded-lg w-fit mb-2" style={{ background: `${color}18` }}>
                            <Icon size={15} style={{ color }} />
                        </div>
                        <div className="text-xl font-bold text-white">{value}</div>
                        <div className="text-xs text-muted">{label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                            activeTab === tab.id
                                ? 'bg-[#D4AF37] text-[#0a0a1a]'
                                : 'text-muted hover:text-white'
                        }`}>
                        {tab.label}
                        {tab.count > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                activeTab === tab.id ? 'bg-black/20 text-[#0a0a1a]' :
                                tab.alert ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-muted'
                            }`}>{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Records list */}
            <div className="nm-card p-4 space-y-2" data-aos="fade-up">
                {currentData?.length === 0 && (
                    <div className="text-center py-12 text-muted text-sm">
                        <BookOpen size={32} className="mx-auto mb-3 opacity-20" />
                        No records in this category
                    </div>
                )}
                {currentData?.map(record => (
                    <StudentLlrRow
                        key={record.id}
                        record={record}
                        onEdit={(student, llr) => setEditing({ student, llr })}
                    />
                ))}
            </div>
        </AppLayout>
    );
}
