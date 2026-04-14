import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';
import FormField from '@/Components/UI/FormField';

export default function TeacherCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone: '', password: '',
        specialization: 'both',
        address: '', date_of_birth: '', gender: '',
    });

    const submit = (e) => { e.preventDefault(); post(route('admin.teachers.store')); };

    return (
        <AppLayout title="Add Teacher">
            <Head title="Add Teacher" />

            <div className="max-w-2xl mx-auto">
                <form onSubmit={submit}>
                    <div className="nm-card p-6 space-y-4" data-aos="fade-up">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                            <UserPlus size={18} className="text-[#D4AF37]" /> Add New Teacher
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Full Name" required error={errors.name}
                                placeholder="Teacher full name" value={data.name}
                                onChange={e => setData('name', e.target.value)} />

                            <FormField label="Email" type="email" required error={errors.email}
                                placeholder="teacher@drivemaster.in" value={data.email}
                                onChange={e => setData('email', e.target.value)} />

                            <FormField label="Phone" required error={errors.phone}
                                placeholder="10-digit mobile" value={data.phone}
                                onChange={e => setData('phone', e.target.value)} />

                            <FormField label="Password" type="password" required error={errors.password}
                                placeholder="Min. 8 characters" value={data.password}
                                onChange={e => setData('password', e.target.value)} />

                            <div className="sm:col-span-2">
                                <label className="text-xs text-muted mb-2 block font-medium">Specialization *</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['bike', 'car', 'both'].map(s => (
                                        <button type="button" key={s} onClick={() => setData('specialization', s)}
                                            className={`py-3 rounded-xl border-2 text-sm capitalize font-medium transition-all ${
                                                data.specialization === s
                                                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                                                    : 'border-white/10 text-muted hover:border-white/20'
                                            }`}>
                                            {s === 'bike' ? '🛵' : s === 'car' ? '🚗' : '🛵🚗'} {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <FormField label="Date of Birth" type="date" error={errors.date_of_birth}
                                value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} />

                            <FormField label="Gender" error={errors.gender}>
                                <select className="field" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </FormField>

                            <div className="sm:col-span-2">
                                <FormField label="Address" error={errors.address}>
                                    <textarea className="field h-20 resize-none" placeholder="Full residential address"
                                        value={data.address} onChange={e => setData('address', e.target.value)} />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <a href={route('admin.teachers.index')} className="btn-ghost">Cancel</a>
                        <button type="submit" disabled={processing} className="btn-gold flex items-center gap-2">
                            {processing ? 'Adding…' : '✓ Add Teacher'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
