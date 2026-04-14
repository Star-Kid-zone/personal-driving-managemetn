import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Route, Users, X, Check } from 'lucide-react';
import FormField from '@/Components/UI/FormField';

export default function TripCreate({ teachers, vehicles, students }) {
    const { data, setData, post, processing, errors } = useForm({
        teacher_id: '', vehicle_id: '', trip_date: '',
        start_time: '', vehicle_type: 'car', student_ids: [], notes: '',
    });

    const toggleStudent = (id) => {
        setData('student_ids', data.student_ids.includes(id)
            ? data.student_ids.filter(s => s !== id)
            : [...data.student_ids, id]);
    };

    const filteredStudents = students.filter(s =>
        s.vehicle_type === data.vehicle_type || s.vehicle_type === 'both'
    );
    const filteredVehicles = vehicles.filter(v => v.type === data.vehicle_type);

    const submit = (e) => { e.preventDefault(); post(route('admin.trips.store')); };

    return (
        <AppLayout title="Schedule Trip">
            <Head title="Schedule Trip" />

            <div className="max-w-3xl mx-auto">
                <form onSubmit={submit} className="space-y-4">
                    <div className="nm-card p-6" data-aos="fade-up">
                        <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                            <Route size={18} className="text-[#D4AF37]" /> Trip Details
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            {/* Vehicle type selector */}
                            <div className="sm:col-span-2">
                                <label className="text-xs text-muted mb-2 block font-medium">Vehicle Type *</label>
                                <div className="flex gap-3">
                                    {['car', 'bike'].map(t => (
                                        <button type="button" key={t}
                                            onClick={() => { setData('vehicle_type', t); setData('student_ids', []); setData('vehicle_id', ''); }}
                                            className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm capitalize transition-all ${
                                                data.vehicle_type === t
                                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                                                    : 'border-white/10 text-muted hover:border-white/20'
                                            }`}>
                                            {t === 'car' ? '🚗' : '🛵'} {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <FormField label="Teacher" required error={errors.teacher_id}>
                                <select className="field" value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)}>
                                    <option value="">Select teacher</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name} ({t.specialization})</option>)}
                                </select>
                            </FormField>

                            <FormField label="Vehicle" required error={errors.vehicle_id}>
                                <select className="field" value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)}>
                                    <option value="">Select vehicle</option>
                                    {filteredVehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.registration_number})</option>)}
                                </select>
                            </FormField>

                            <FormField label="Trip Date" required error={errors.trip_date}>
                                <input type="date" className="field" value={data.trip_date}
                                    min={new Date().toISOString().slice(0, 10)}
                                    onChange={e => setData('trip_date', e.target.value)} />
                            </FormField>

                            <FormField label="Start Time" required error={errors.start_time}>
                                <input type="time" className="field" value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)} />
                            </FormField>

                            <div className="sm:col-span-2">
                                <FormField label="Notes" error={errors.notes}>
                                    <textarea className="field h-16 resize-none" placeholder="Optional route or notes…"
                                        value={data.notes} onChange={e => setData('notes', e.target.value)} />
                                </FormField>
                            </div>
                        </div>

                        {/* Student selector */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs text-muted font-medium flex items-center gap-1.5">
                                    <Users size={13} /> Assign Students *
                                    <span className="text-[#D4AF37]">({data.student_ids.length} selected)</span>
                                </label>
                                {errors.student_ids && <p className="text-red-400 text-xs">{errors.student_ids}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto scrollbar-hide p-0.5">
                                {filteredStudents.length === 0 && (
                                    <div className="col-span-2 text-center py-6 text-muted text-sm">
                                        No active {data.vehicle_type} students available
                                    </div>
                                )}
                                {filteredStudents.map(s => {
                                    const selected = data.student_ids.includes(s.id);
                                    return (
                                        <button type="button" key={s.id} onClick={() => toggleStudent(s.id)}
                                            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                                                selected ? 'border-[#D4AF37] bg-[#D4AF37]/08' : 'border-white/08 hover:border-white/15'
                                            }`}>
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&color=D4AF37&background=000666&size=64`}
                                                className="w-8 h-8 rounded-lg" alt={s.name} />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm text-white font-medium truncate">{s.name}</div>
                                                <div className="text-xs text-muted">{s.remaining_sessions} sessions left</div>
                                            </div>
                                            {selected && <Check size={14} className="text-[#D4AF37] flex-shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <a href={route('admin.trips.index')} className="btn-ghost">Cancel</a>
                        <button type="submit" disabled={processing} className="btn-gold flex items-center gap-2">
                            {processing ? 'Scheduling…' : '✓ Schedule Trip'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
