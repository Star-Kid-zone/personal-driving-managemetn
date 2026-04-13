import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { User } from 'lucide-react';

export default function StudentEdit({ student, teachers, vehicles }) {
    const { data, setData, put, processing, errors } = useForm({
        name:            student.name,
        phone:           student.phone,
        alt_phone:       student.alt_phone       || '',
        email:           student.email           || '',
        address:         student.address,
        city:            student.city            || '',
        pincode:         student.pincode         || '',
        gender:          student.gender,
        vehicle_type:    student.vehicle_type,
        total_sessions:  student.total_sessions,
        teacher_id:      student.teacher_id      || '',
        vehicle_id:      student.vehicle_id      || '',
        status:          student.status,
    });

    const submit = (e) => { e.preventDefault(); put(route('admin.students.update', student.id)); };

    const Field = ({ label, name, type = 'text', placeholder, children }) => (
        <div>
            <label className="text-xs text-muted mb-1.5 block font-medium">{label}</label>
            {children || (
                <input type={type} className={`field ${errors[name] ? 'border-red-500/50' : ''}`}
                    placeholder={placeholder} value={data[name] || ''}
                    onChange={e => setData(name, e.target.value)} />
            )}
            {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

    return (
        <AppLayout title={`Edit — ${student.name}`}>
            <Head title={`Edit ${student.name}`} />

            <div className="max-w-2xl mx-auto">
                <form onSubmit={submit}>
                    <div className="nm-card p-6 space-y-4" data-aos="fade-up">
                        <div className="flex items-center gap-3 mb-2">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&color=D4AF37&background=000666&size=64`}
                                className="w-12 h-12 rounded-2xl" alt={student.name} />
                            <div>
                                <h2 className="text-lg font-semibold text-white">{student.name}</h2>
                                <div className="text-[#D4AF37] font-mono text-sm">{student.student_id}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Full Name" name="name" />
                            <Field label="Phone" name="phone" />
                            <Field label="Alt Phone" name="alt_phone" />
                            <Field label="Email" name="email" type="email" />
                            <div className="sm:col-span-2">
                                <Field label="Address" name="address">
                                    <textarea className="field h-16 resize-none" value={data.address}
                                        onChange={e => setData('address', e.target.value)} />
                                </Field>
                            </div>
                            <Field label="City" name="city" />
                            <Field label="Pincode" name="pincode" />
                            <Field label="Gender" name="gender">
                                <select className="field" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </Field>
                            <Field label="Vehicle Type" name="vehicle_type">
                                <select className="field" value={data.vehicle_type} onChange={e => setData('vehicle_type', e.target.value)}>
                                    <option value="bike">Bike</option>
                                    <option value="car">Car</option>
                                    <option value="both">Both</option>
                                </select>
                            </Field>
                            <Field label="Total Sessions" name="total_sessions" type="number" />
                            <Field label="Status" name="status">
                                <select className="field" value={data.status} onChange={e => setData('status', e.target.value)}>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="on_hold">On Hold</option>
                                    <option value="dropped">Dropped</option>
                                </select>
                            </Field>
                            <Field label="Assign Teacher" name="teacher_id">
                                <select className="field" value={data.teacher_id} onChange={e => setData('teacher_id', e.target.value)}>
                                    <option value="">None</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name}</option>)}
                                </select>
                            </Field>
                            <Field label="Assign Vehicle" name="vehicle_id">
                                <select className="field" value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)}>
                                    <option value="">None</option>
                                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.registration_number})</option>)}
                                </select>
                            </Field>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <a href={route('admin.students.show', student.id)} className="btn-ghost">Cancel</a>
                        <button type="submit" disabled={processing} className="btn-gold flex items-center gap-2">
                            {processing ? 'Saving…' : '✓ Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
