import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { User, Car, CreditCard, Upload, ChevronRight, ChevronLeft } from 'lucide-react';
import FormField from '@/Components/UI/FormField';

const STEPS = ['Personal Info', 'Vehicle & Sessions', 'Payment', 'Documents'];

export default function CreateStudent({ teachers, vehicles }) {
    const [step, setStep] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        name: '', phone: '', alt_phone: '', email: '', address: '',
        city: '', pincode: '', date_of_birth: '', gender: '', aadhaar_number: '',
        vehicle_type: 'car',
        total_sessions: 20, enrollment_date: new Date().toISOString().slice(0,10),
        total_fee: '', amount_paid: '0', payment_type: 'full', payment_mode: 'cash',
        profile_photo: null, aadhaar_document: null, address_proof: null, age_proof: null,
    });

    const submit = (e) => { e.preventDefault(); post(route('admin.students.store')); };
    const feeMap = { bike: 2500, car: 4000, both: 6500 };

    return (
        <AppLayout title="Enroll Student">
            <Head title="Enroll Student" />

            <div className="max-w-3xl mx-auto">
                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-8" data-aos="fade-down">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                i === step ? 'bg-[#D4AF37] text-[#0a0a1a]' :
                                i < step  ? 'bg-emerald-500 text-white' : 'bg-white/10 text-muted'
                            }`}>{i < step ? '✓' : i + 1}</div>
                            <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-[#D4AF37]' : 'text-muted'}`}>{s}</span>
                            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-emerald-500/50' : 'bg-white/10'}`} />}
                        </div>
                    ))}
                </div>

                <form onSubmit={submit}>
                    <div className="nm-card p-6" data-aos="fade-up">

                        {/* Step 0: Personal Info */}
                        {step === 0 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                    <User size={18} className="text-[#D4AF37]" /> Personal Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField label="Full Name" required error={errors.name}
                                        placeholder="Student full name" value={data.name}
                                        onChange={e => setData('name', e.target.value)} />

                                    <FormField label="Phone Number" required error={errors.phone}>
                                        <input type="tel" className={`field ${errors.phone ? 'border-red-500/50' : ''}`}
                                            placeholder="9876543210" value={data.phone}
                                            onChange={e => setData('phone', e.target.value)} maxLength={10} />
                                    </FormField>

                                    <FormField label="Alternate Phone" error={errors.alt_phone}
                                        placeholder="Optional" value={data.alt_phone}
                                        onChange={e => setData('alt_phone', e.target.value)} />

                                    <FormField label="Email" type="email" error={errors.email}
                                        placeholder="Optional" value={data.email}
                                        onChange={e => setData('email', e.target.value)} />

                                    <FormField label="Date of Birth" type="date" required error={errors.date_of_birth}
                                        value={data.date_of_birth} onChange={e => setData('date_of_birth', e.target.value)} />

                                    <FormField label="Gender" required error={errors.gender}>
                                        <select className="field" value={data.gender} onChange={e => setData('gender', e.target.value)}>
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </FormField>

                                    <div className="sm:col-span-2">
                                        <FormField label="Address" required error={errors.address}>
                                            <textarea className="field h-20 resize-none" placeholder="Full address..."
                                                value={data.address} onChange={e => setData('address', e.target.value)} />
                                        </FormField>
                                    </div>

                                    <FormField label="City" error={errors.city}
                                        placeholder="Chennai" value={data.city}
                                        onChange={e => setData('city', e.target.value)} />

                                    <FormField label="Pincode" error={errors.pincode}
                                        placeholder="600001" value={data.pincode}
                                        onChange={e => setData('pincode', e.target.value)} />

                                    <FormField label="Aadhaar Number" error={errors.aadhaar_number}
                                        placeholder="12 digits (optional)" value={data.aadhaar_number}
                                        onChange={e => setData('aadhaar_number', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {/* Step 1: Vehicle & Sessions */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                    <Car size={18} className="text-[#D4AF37]" /> Vehicle & Training
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs text-muted mb-2 font-medium">Vehicle Type<span className="text-red-400 ml-0.5">*</span></label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['bike','car','both'].map(t => (
                                                <button type="button" key={t}
                                                    onClick={() => { setData('vehicle_type', t); setData('total_fee', feeMap[t]); }}
                                                    className={`p-4 rounded-xl border-2 font-medium text-sm transition-all capitalize ${
                                                        data.vehicle_type === t
                                                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                                                        : 'border-white/10 text-muted hover:border-white/20'
                                                    }`}>
                                                    {t === 'bike' ? '🛵' : t === 'car' ? '🚗' : '🛵🚗'} {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <FormField label="Total Sessions" required error={errors.total_sessions}>
                                        <input type="number" className="field" min="5" max="100"
                                            value={data.total_sessions} onChange={e => setData('total_sessions', e.target.value)} />
                                    </FormField>

                                    <FormField label="Enrollment Date" type="date" required error={errors.enrollment_date}
                                        value={data.enrollment_date} onChange={e => setData('enrollment_date', e.target.value)} />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Payment */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                    <CreditCard size={18} className="text-[#D4AF37]" /> Payment Details
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField label="Total Course Fee (₹)" required error={errors.total_fee}>
                                        <input type="number" className="field" placeholder="e.g. 4000"
                                            value={data.total_fee} onChange={e => setData('total_fee', e.target.value)} />
                                    </FormField>

                                    <FormField label="Amount Paid Now (₹)" error={errors.amount_paid}>
                                        <input type="number" className="field" placeholder="0"
                                            value={data.amount_paid} onChange={e => setData('amount_paid', e.target.value)} />
                                    </FormField>

                                    <FormField label="Payment Type" required error={errors.payment_type}>
                                        <select className="field" value={data.payment_type} onChange={e => setData('payment_type', e.target.value)}>
                                            <option value="full">Full Payment</option>
                                            <option value="half">Half Payment</option>
                                            <option value="partial">Partial Payment</option>
                                        </select>
                                    </FormField>

                                    <FormField label="Payment Mode" required error={errors.payment_mode}>
                                        <select className="field" value={data.payment_mode} onChange={e => setData('payment_mode', e.target.value)}>
                                            <option value="cash">Cash</option>
                                            <option value="upi">UPI</option>
                                            <option value="card">Card</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="cheque">Cheque</option>
                                        </select>
                                    </FormField>
                                </div>

                                {data.total_fee && (
                                    <div className="p-4 rounded-xl mt-2" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)' }}>
                                        <div className="text-xs text-muted mb-3 uppercase tracking-wider">Payment Summary</div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-muted">Course Fee</span><span className="text-white font-medium">₹{Number(data.total_fee).toLocaleString('en-IN')}</span></div>
                                            <div className="flex justify-between"><span className="text-muted">Paid Now</span><span className="text-emerald-400 font-medium">₹{Number(data.amount_paid||0).toLocaleString('en-IN')}</span></div>
                                            <div className="h-px bg-white/10" />
                                            <div className="flex justify-between"><span className="text-[#D4AF37] font-semibold">Balance Due</span><span className="text-[#D4AF37] font-bold">₹{(Number(data.total_fee) - Number(data.amount_paid||0)).toLocaleString('en-IN')}</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Documents */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                    <Upload size={18} className="text-[#D4AF37]" /> Documents (Optional)
                                </h2>
                                {[
                                    { name: 'profile_photo',    label: 'Profile Photo',    accept: 'image/*' },
                                    { name: 'aadhaar_document', label: 'Aadhaar Card',     accept: 'image/*,.pdf' },
                                    { name: 'address_proof',    label: 'Address Proof',    accept: 'image/*,.pdf' },
                                    { name: 'age_proof',        label: 'Age Proof',        accept: 'image/*,.pdf' },
                                ].map(({ name, label, accept }) => (
                                    <div key={name}>
                                        <label className="block text-xs text-muted mb-1.5 font-medium">{label}</label>
                                        <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(212,175,55,0.25)' }}>
                                            <Upload size={15} className="text-[#D4AF37]" />
                                            <span className="text-sm text-muted">
                                                {data[name] ? data[name].name : `Upload ${label}`}
                                            </span>
                                            <input type="file" className="hidden" accept={accept}
                                                onChange={e => setData(name, e.target.files[0])} />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                            <button type="button" onClick={() => setStep(s => s - 1)}
                                disabled={step === 0}
                                className={`btn-ghost flex items-center gap-2 ${step === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}>
                                <ChevronLeft size={16} /> Previous
                            </button>

                            {step < STEPS.length - 1 ? (
                                <button type="button" onClick={() => setStep(s => s + 1)}
                                    className="btn-gold flex items-center gap-2">
                                    Next <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button type="submit" disabled={processing}
                                    className="btn-gold flex items-center gap-2">
                                    {processing ? 'Enrolling...' : '✓ Enroll Student'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
