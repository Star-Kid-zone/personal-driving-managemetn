import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import FormField from '@/Components/UI/FormField';

export default function TeacherEdit({ teacher }) {
    const { data, setData, put, processing, errors } = useForm({
        name:           teacher.user?.name        || '',
        phone:          teacher.user?.phone       || '',
        specialization: teacher.specialization    || 'both',
        is_active:      teacher.is_active         ?? true,
    });

    const submit = (e) => { e.preventDefault(); put(route('admin.teachers.update', teacher.id)); };

    return (
        <AppLayout title={`Edit — ${teacher.user?.name}`}>
            <Head title={`Edit ${teacher.user?.name}`} />

            <div className="max-w-2xl mx-auto">
                <form onSubmit={submit}>
                    <div className="nm-card p-6 space-y-4" data-aos="fade-up">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                            <Edit size={18} className="text-[#D4AF37]" /> Edit Teacher — {teacher.user?.name}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Full Name" error={errors.name}
                                value={data.name} onChange={e => setData('name', e.target.value)} />

                            <FormField label="Phone" error={errors.phone}
                                value={data.phone} onChange={e => setData('phone', e.target.value)} />

                            <div className="sm:col-span-2">
                                <label className="text-xs text-muted mb-2 block font-medium">Specialization</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['bike', 'car', 'both'].map(s => (
                                        <button type="button" key={s} onClick={() => setData('specialization', s)}
                                            className={`py-3 rounded-xl border-2 text-sm capitalize font-medium transition-all ${
                                                data.specialization === s
                                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                                                    : 'border-white/10 text-muted'
                                            }`}>
                                            {s === 'bike' ? '🛵' : s === 'car' ? '🚗' : '🛵🚗'} {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-xs text-muted mb-1.5 block font-medium">Status</label>
                                <div className="flex gap-3">
                                    {[true, false].map(v => (
                                        <button type="button" key={v.toString()} onClick={() => setData('is_active', v)}
                                            className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                                                data.is_active === v
                                                    ? v ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                                        : 'border-red-500 bg-red-500/10 text-red-400'
                                                    : 'border-white/10 text-muted'
                                            }`}>
                                            {v ? 'Active' : 'Inactive'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <a href={route('admin.teachers.show', teacher.id)} className="btn-ghost">Cancel</a>
                        <button type="submit" disabled={processing} className="btn-gold flex items-center gap-2">
                            {processing ? 'Saving…' : '✓ Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
