import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Route, Check, Users, ChevronLeft } from 'lucide-react';

export default function AdminTripCreate({ vehicles, students }) {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const defaultDate = d.toISOString().slice(0, 10);
    const defaultTime = d.toISOString().slice(11, 16);

    const { data, setData, post, processing, errors } = useForm({
        vehicle_id: '', trip_date: defaultDate,
        start_time: defaultTime, vehicle_type: 'car',
        student_ids: [], notes: '',
    });

    const toggleStudent = (id) => {
        setData('student_ids', data.student_ids.includes(id)
            ? data.student_ids.filter(s => s !== id)
            : [...data.student_ids, id]);
    };

    const filteredVehicles = vehicles.filter(v => v.type === data.vehicle_type);
    const filteredStudents = students.filter(s =>
        s.vehicle_type === data.vehicle_type || s.vehicle_type === 'both'
    );

    const submit = (e) => { e.preventDefault(); post(route('admin.trips.store')); };

    return (
        <AppLayout title="Schedule Trip">
            <Head title="Schedule Trip" />

            <div className="max-w-3xl mx-auto">
                <form onSubmit={submit}>
                    <div className="nm-card p-6 space-y-5" data-aos="fade-up">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Route size={18} className="text-[#D4AF37]" /> Schedule a New Trip
                            </h2>
                        </div>

                        {/* Vehicle type */}
                        <div>
                            <label className="text-xs text-muted mb-2 block font-medium uppercase tracking-wider">Vehicle Type *</label>
                            <div className="flex gap-3">
                                {['car', 'bike'].map(t => (
                                    <button type="button" key={t}
                                        onClick={() => { setData('vehicle_type', t); setData('vehicle_id', ''); setData('student_ids', []); }}
                                        className={`flex-1 py-3.5 rounded-xl border-2 text-sm capitalize font-bold transition-all ${
                                            data.vehicle_type === t
                                                ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                                                : 'border-white/10 text-muted hover:border-white/20'
                                        }`}>{t === 'car' ? '🚗' : '🛵'} {t}</button>
                                ))}
                            </div>
                            {errors.vehicle_type && <p className="text-red-400 text-xs mt-1">{errors.vehicle_type}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                            <div>
                                <label className="text-xs text-muted mb-1.5 block font-medium">Vehicle *</label>
                                <select className={`field ${errors.vehicle_id ? 'border-red-500/50' : ''}`}
                                    value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)}>
                                    <option value="">Select {data.vehicle_type}</option>
                                    {filteredVehicles.map(v => (
                                        <option key={v.id} value={v.id}>{v.make} {v.model} ({v.registration_number})</option>
                                    ))}
                                </select>
                                {errors.vehicle_id && <p className="text-red-400 text-xs mt-1">{errors.vehicle_id}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-muted mb-1.5 block font-medium">Trip Date *</label>
                                <input type="date" className={`field ${errors.trip_date ? 'border-red-500/50' : ''}`}
                                    min={new Date().toISOString().slice(0, 10)}
                                    value={data.trip_date} onChange={e => setData('trip_date', e.target.value)} />
                                {errors.trip_date && <p className="text-red-400 text-xs mt-1">{errors.trip_date}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-muted mb-1.5 block font-medium">Start Time *</label>
                                <input type="time" className={`field ${errors.start_time ? 'border-red-500/50' : ''}`}
                                    value={data.start_time} onChange={e => setData('start_time', e.target.value)} />
                                {errors.start_time && <p className="text-red-400 text-xs mt-1">{errors.start_time}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-muted mb-1.5 block font-medium">Notes</label>
                                <input type="text" className="field" placeholder="Optional route or notes"
                                    value={data.notes} onChange={e => setData('notes', e.target.value)} />
                            </div>
                        </div>

                        {/* Student selector */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs text-muted font-medium flex items-center gap-1.5">
                                    <Users size={14} /> Select Students * 
                                    <span className="text-[#D4AF37]">({data.student_ids.length} selected)</span>
                                </label>
                                {errors.student_ids && <p className="text-red-400 text-xs">{errors.student_ids}</p>}
                            </div>

                            {filteredStudents.length === 0 ? (
                                <div className="text-center py-10 text-muted text-sm rounded-xl border border-dashed border-white/10" 
                                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    No active {data.vehicle_type} students found
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto scrollbar-hide p-0.5">
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
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <Link href={route('admin.trips.index')} className="btn-ghost flex items-center gap-2">
                             Cancel
                        </Link>
                        <button type="submit" disabled={processing} className="btn-gold px-8 flex items-center gap-2">
                            {processing ? 'Scheduling…' : '✓ Schedule Trip'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
