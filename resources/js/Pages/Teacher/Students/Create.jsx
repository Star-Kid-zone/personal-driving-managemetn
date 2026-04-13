import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { User, Car, CreditCard, Upload, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = ['Personal Info', 'Vehicle & Sessions', 'Payment'];

export default function TeacherStudentCreate({ vehicles }) {
    const [step, setStep] = useState(0);
    const { data, setData, post, processing, errors } = useForm({
        name: '', phone: '', alt_phone: '', email: '', address: '',
        city: '', pincode: '', date_of_birth: '', gender: '',
        vehicle_type: 'car', vehicle_id: '',
        total_sessions: 20, enrollment_date: new Date().toISOString().slice(0, 10),
        total_fee: '', amount_paid: '0', payment_type: 'full', payment_mode: 'cash',
    });

    const feeMap = { bike: 2500, car: 4000, both: 6500 };
    const submit = (e) => { e.preventDefault(); post(route('teacher.students.store')); };

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
        <AppLayout title="Enroll Student">
            <Head title="Enroll Student" />

            <div className="max-w-2xl mx-auto">
                {/* Steps */}
                <div className="flex items-center gap-2 mb-6" data-aos="fade-down">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 flex-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                i === step ? 'bg-[#D4AF37] text-[#0a0a1a]' :
                                i < step   ? 'bg-emerald-500 text-white' : 'bg-white/10 text-muted'
                            }`}>{i < step ? '✓' : i + 1}</div>
                            <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-[#D4AF37]' : 'text-muted'}`}>{s}</span>
                            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-emerald-500/50' : 'bg-white/10'}`} />}
                        </div>
                    ))}
                </div>

                <form onSubmit={submit}>
                    <div className="nm-card p-6" data-aos="fade-up">

                        {step === 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <User size={16} className="text-[#D4AF37]" /> Personal Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Full Name" name="name" required placeholder="Student full name" />
                                    <Field label="Phone" name="phone" required placeholder="9876543210">
                                        <input type="tel" className={`field ${errors.phone ? 'border-red-500/50' : ''}`}
                                            placeholder="9876543210" value={data.phone}
                                            onChange={e => setData('phone', e.target.value)} maxLength={10} />
                                    </Field>
                                    <Field label="Alt Phone" name="alt_phone" placeholder="Optional" />
                                    <Field label="Email" name="email" type="email" placeholder="Optional" />
                                    <Field label="Date of Birth" name="date_of_birth" type="date" required />
                                    <Field label="Gender" name="gender" required>
                                        <select className="field" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </Field>
                                    <div className="sm:col-span-2">
                                        <Field label="Address" name="address" required>
                                            <textarea className="field h-16 resize-none" value={data.address}
                                                onChange={e => setData('address', e.target.value)} placeholder="Full address" />
                                        </Field>
                                    </div>
                                    <Field label="City" name="city" placeholder="Chennai" />
                                    <Field label="Pincode" name="pincode" placeholder="600001" />
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Car size={16} className="text-[#D4AF37]" /> Vehicle & Training
                                </h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {['bike', 'car', 'both'].map(t => (
                                        <button type="button" key={t}
                                            onClick={() => { setData('vehicle_type', t); setData('total_fee', feeMap[t]); }}
                                            className={`py-4 rounded-xl border-2 font-medium text-sm capitalize transition-all ${
                                                data.vehicle_type === t ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-white/10 text-muted hover:border-white/20'
                                            }`}>{t === 'bike' ? '🛵' : t === 'car' ? '🚗' : '🛵🚗'} {t}</button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Assign Vehicle" name="vehicle_id">
                                        <select className="field" value={data.vehicle_id} onChange={e => setData('vehicle_id', e.target.value)}>
                                            <option value="">Auto-assign</option>
                                            {vehicles.filter(v => data.vehicle_type === 'both' || v.type === data.vehicle_type)
                                                .map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.registration_number})</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Total Sessions" name="total_sessions" required>
                                        <input type="number" className="field" min="5" max="100"
                                            value={data.total_sessions} onChange={e => setData('total_sessions', e.target.value)} />
                                    </Field>
                                    <Field label="Enrollment Date" name="enrollment_date" type="date" required />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <CreditCard size={16} className="text-[#D4AF37]" /> Payment Details
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Total Fee (₹)" name="total_fee" required>
                                        <input type="number" className="field" value={data.total_fee}
                                            onChange={e => setData('total_fee', e.target.value)} />
                                    </Field>
                                    <Field label="Amount Paid Now (₹)" name="amount_paid">
                                        <input type="number" className="field" value={data.amount_paid}
                                            onChange={e => setData('amount_paid', e.target.value)} />
                                    </Field>
                                    <Field label="Payment Type" name="payment_type">
                                        <select className="field" value={data.payment_type} onChange={e => setData('payment_type', e.target.value)}>
                                            <option value="full">Full</option>
                                            <option value="half">Half</option>
                                            <option value="partial">Partial</option>
                                        </select>
                                    </Field>
                                    <Field label="Payment Mode" name="payment_mode">
                                        <select className="field" value={data.payment_mode} onChange={e => setData('payment_mode', e.target.value)}>
                                            {['cash','upi','card','bank_transfer','cheque'].map(m => <option key={m} value={m}>{m.replace('_',' ')}</option>)}
                                        </select>
                                    </Field>
                                </div>
                                {data.total_fee && (
                                    <div className="p-4 rounded-xl" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted">Course Fee</span>
                                            <span className="text-white">₹{Number(data.total_fee).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted">Paid Now</span>
                                            <span className="text-emerald-400">₹{Number(data.amount_paid || 0).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="h-px bg-white/10 my-2" />
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-[#D4AF37]">Balance Due</span>
                                            <span className="text-[#D4AF37]">₹{(Number(data.total_fee) - Number(data.amount_paid || 0)).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-6 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                            <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}
                                className={`btn-ghost flex items-center gap-2 ${step === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}>
                                <ChevronLeft size={16} /> Back
                            </button>
                            {step < STEPS.length - 1 ? (
                                <button type="button" onClick={() => setStep(s => s + 1)} className="btn-gold flex items-center gap-2">
                                    Next <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button type="submit" disabled={processing} className="btn-gold flex items-center gap-2">
                                    {processing ? 'Enrolling…' : '✓ Enroll Student'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
