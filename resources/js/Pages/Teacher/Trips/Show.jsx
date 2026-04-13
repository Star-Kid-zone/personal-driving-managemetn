import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, XCircle, Route, Clock } from 'lucide-react';

export default function TeacherTripShow({ trip }) {
    const [attendance, setAttendance] = useState(() => {
        const init = {};
        (trip.trip_students || []).forEach(ts => {
            init[ts.student_id] = {
                attended: ts.attended,
                notes: ts.performance_notes || '',
                skill_rating: ts.skill_rating || '',
            };
        });
        return init;
    });
    const [completing, setCompleting] = useState(false);

    const toggle = (id) => {
        setAttendance(prev => ({ ...prev, [id]: { ...prev[id], attended: !prev[id]?.attended } }));
    };

    const complete = () => {
        setCompleting(true);
        router.post(route('teacher.trips.complete', trip.id), { attendance }, {
            onFinish: () => setCompleting(false),
        });
    };

    return (
        <AppLayout title={trip.trip_number}>
            <Head title={trip.trip_number} />

            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
                        <Route size={22} className="text-[#D4AF37]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">{trip.trip_number}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={trip.status === 'completed' ? 'badge-active' : 'badge-pending'}>{trip.status}</span>
                            <span className="text-muted text-xs">{trip.trip_date} · {trip.start_time}</span>
                            <span className="text-muted text-xs capitalize">{trip.vehicle_type}</span>
                        </div>
                    </div>
                </div>
                {trip.status === 'scheduled' && (
                    <button onClick={complete} disabled={completing} className="btn-gold flex items-center gap-2">
                        <CheckCircle size={16} />
                        {completing ? 'Completing…' : 'Complete Trip'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Trip info */}
                <div className="nm-card p-5" data-aos="fade-up">
                    <h3 className="text-sm font-semibold text-white mb-4">Trip Details</h3>
                    {[
                        { label: 'Vehicle', value: `${trip.vehicle?.make} ${trip.vehicle?.model}` },
                        { label: 'Reg. No', value: trip.vehicle?.registration_number },
                        { label: 'Date', value: trip.trip_date },
                        { label: 'Start', value: trip.start_time },
                        { label: 'End', value: trip.end_time || 'Ongoing' },
                        { label: 'Students', value: trip.trip_students?.length || 0 },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                            <span className="text-xs text-muted">{label}</span>
                            <span className="text-sm text-white font-medium">{value || '—'}</span>
                        </div>
                    ))}
                </div>

                {/* Attendance */}
                <div className="lg:col-span-2 nm-card p-5" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="text-sm font-semibold text-white mb-4">
                        Student Attendance ({trip.trip_students?.length || 0} students)
                    </h3>

                    <div className="space-y-3">
                        {(trip.trip_students || []).map(ts => {
                            const att = attendance[ts.student_id]?.attended ?? ts.attended;
                            return (
                                <div key={ts.id} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                                    style={{
                                        background: att ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                                        border: `1px solid ${att ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                                    }}>
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ts.student?.name||'?')}&color=D4AF37&background=000666`}
                                        className="w-9 h-9 rounded-xl" alt={ts.student?.name} />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white font-medium">{ts.student?.name}</div>
                                        <div className="text-xs text-muted">{ts.student?.student_id} · Session #{ts.session_number}</div>
                                    </div>

                                    {trip.status === 'scheduled' && (
                                        <select
                                            className="text-xs rounded-lg px-2 py-1.5 mr-2 bg-white/5 border border-white/10 text-muted"
                                            value={attendance[ts.student_id]?.skill_rating || ''}
                                            onChange={e => setAttendance(prev => ({ ...prev, [ts.student_id]: { ...prev[ts.student_id], skill_rating: e.target.value } }))}>
                                            <option value="">Rating</option>
                                            {['poor','average','good','excellent'].map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    )}

                                    {trip.status === 'scheduled' ? (
                                        <button onClick={() => toggle(ts.student_id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                att
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            }`}>
                                            {att ? <><CheckCircle size={12} /> Present</> : <><XCircle size={12} /> Absent</>}
                                        </button>
                                    ) : (
                                        <span className={`text-xs px-2 py-1 rounded-full ${ts.attended ? 'badge-active' : 'badge-danger'}`}>
                                            {ts.attended ? 'Present' : 'Absent'}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {trip.status === 'scheduled' && (
                        <div className="mt-4 p-3 rounded-xl flex items-center gap-2 text-xs"
                            style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                            <Clock size={13} className="text-[#D4AF37]" />
                            <span className="text-muted">Completing will deduct 1 session from each <strong className="text-white">present</strong> student.</span>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
