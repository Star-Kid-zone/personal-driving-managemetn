import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { User } from 'lucide-react';
import FormField from '@/Components/UI/FormField';

export default function StudentEdit({ student, teachers, vehicles }) {
    const { data, setData, put, processing, errors } = useForm({
        name:           student.name,
        phone:          student.phone,
        alt_phone:      student.alt_phone      || '',
        email:          student.email          || '',
        address:        student.address,
        city:           student.city           || '',
        pincode:        student.pincode        || '',
        gender:         student.gender,
        vehicle_type:   student.vehicle_type,
        total_sessions: student.total_sessions,
        status:         student.status,
    });

    const submit = (e) => { e.preventDefault(); put(route('teacher.students.update', student.id)); };

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
                            <FormField label="Full Name" error={errors.name}
                                value={data.name} onChange={e => setData('name', e.target.value)} />

                            <FormField label="Phone" error={errors.phone}
                                value={data.phone} onChange={e => setData('phone', e.target.value)} />

                            <FormField label="Alt Phone" error={errors.alt_phone}
                                value={data.alt_phone} onChange={e => setData('alt_phone', e.target.value)} />

                            <FormField label="Email" type="email" error={errors.email}
                                value={data.email} onChange={e => setData('email', e.target.value)} />

                            <div className="sm:col-span-2">
                                <FormField label="Address" error={errors.address}>
                                    <textarea className="field h-16 resize-none" value={data.address}
                                        onChange={e => setData('address', e.target.value)} />
                                </FormField>
                            </div>

                            <FormField label="City" error={errors.city}
                                value={data.city} onChange={e => setData('city', e.target.value)} />

                            <FormField label="Pincode" error={errors.pincode}
                                value={data.pincode} onChange={e => setData('pincode', e.target.value)} />

                            <FormField label="Gender" error={errors.gender}>
                                <select className="field" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </FormField>

                            <FormField label="Vehicle Type" error={errors.vehicle_type}>
                                <select className="field" value={data.vehicle_type} onChange={e => setData('vehicle_type', e.target.value)}>
                                    <option value="bike">Bike</option>
                                    <option value="car">Car</option>
                                    <option value="both">Both</option>
                                </select>
                            </FormField>

                            <FormField label="Total Sessions" type="number" error={errors.total_sessions}
                                value={data.total_sessions} onChange={e => setData('total_sessions', e.target.value)} />

                            <FormField label="Status" error={errors.status}>
                                <select className="field" value={data.status} onChange={e => setData('status', e.target.value)}>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="on_hold">On Hold</option>
                                    <option value="dropped">Dropped</option>
                                </select>
                            </FormField>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <a href={route('teacher.students.show', student.id)} className="btn-ghost">Cancel</a>
                        <button type="submit" disabled={processing} className="btn-gold flex items-center gap-2">
                            {processing ? 'Saving…' : '✓ Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
