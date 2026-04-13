import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { UserPlus } from 'lucide-react';

export default function TeacherCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '', email: '', phone: '', password: '',
        specialization: 'both', license_number: '', license_expiry: '',
        address: '', date_of_birth: '', gender: '',
        monthly_salary: '', joined_date: new Date().toISOString().slice(0, 10),
    });

    const submit = (e) => { e.preventDefault(); post(route('admin.teachers.store')); };

    const Field = ({ label, name, type = 'text', required, placeholder, children }) => (
        <div>
            <label className="text-xs text-muted mb-1.5 block font-medium">
                {label}{required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {children || (
                <input type={type} className={`field ${errors[name] ? 'border-red-500/50' : ''}`}
                    placeholder={placeholder} value={data[name] || ''}
                    onChange={e => setData(name, e.target.value)} />
            )}
            {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
        </div>
    );

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
                            <Field label="Full Name" name="name" required placeholder="Teacher full name" />
                            <Field label="Email" name="email" type="email" required placeholder="teacher@drivemaster.in" />
                            <Field label="Phone" name="phone" required placeholder="10-digit mobile" />
                            <Field label="Password" name="password" type="password" required placeholder="Min. 8 characters" />

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

                            <Field label="License Number" name="license_number" placeholder="TN58 20XXXX" />
                            <Field label="License Expiry" name="license_expiry" type="date" />
                            <Field label="Date of Birth" name="date_of_birth" type="date" />
                            <Field label="Gender" name="gender">
                                <select className="field" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </Field>
                            <Field label="Monthly Salary (₹)" name="monthly_salary" type="number" placeholder="e.g. 20000" />
                            <Field label="Joining Date" name="joined_date" type="date" />
                            <div className="sm:col-span-2">
                                <Field label="Address" name="address" placeholder="Full residential address">
                                    <textarea className="field h-20 resize-none" placeholder="Full residential address"
                                        value={data.address} onChange={e => setData('address', e.target.value)} />
                                </Field>
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
