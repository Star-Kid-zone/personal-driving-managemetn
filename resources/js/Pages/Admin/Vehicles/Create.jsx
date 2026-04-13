import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Car } from 'lucide-react';

export default function VehicleCreate() {
    const { data, setData, post, processing, errors } = useForm({
        registration_number: '',
        make: '', model: '', year: new Date().getFullYear(),
        type: 'car', color: '', fuel_type: 'petrol',
        insurance_expiry: '', pollution_expiry: '', fitness_expiry: '',
        chassis_number: '', engine_number: '', notes: '',
    });

    const submit = (e) => { e.preventDefault(); post(route('admin.vehicles.store')); };

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
        <AppLayout title="Register Vehicle">
            <Head title="Register Vehicle" />
            <div className="max-w-2xl mx-auto">
                <form onSubmit={submit}>
                    <div className="nm-card p-6 space-y-4" data-aos="fade-up">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                            <Car size={18} className="text-[#D4AF37]" /> Register Vehicle
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Registration Number" name="registration_number" required placeholder="TN58 AX 1234" />

                            <div>
                                <label className="text-xs text-muted mb-2 block font-medium">Vehicle Type *</label>
                                <div className="flex gap-3">
                                    {['car', 'bike'].map(t => (
                                        <button type="button" key={t} onClick={() => setData('type', t)}
                                            className={`flex-1 py-3 rounded-xl border-2 text-sm capitalize font-medium transition-all ${
                                                data.type === t ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-white/10 text-muted hover:border-white/20'
                                            }`}>
                                            {t === 'car' ? '🚗' : '🛵'} {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Field label="Make" name="make" required placeholder="Maruti, Honda, TVS..." />
                            <Field label="Model" name="model" required placeholder="Alto, Activa, Jupiter..." />
                            <Field label="Year" name="year" type="number" required placeholder="2022" />
                            <Field label="Color" name="color" placeholder="White, Black, Blue..." />
                            <Field label="Fuel Type" name="fuel_type">
                                <select className="field" value={data.fuel_type} onChange={e => setData('fuel_type', e.target.value)}>
                                    <option value="petrol">Petrol</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electric">Electric</option>
                                    <option value="cng">CNG</option>
                                </select>
                            </Field>
                            <Field label="Insurance Expiry" name="insurance_expiry" type="date" />
                            <Field label="PUC / Pollution Expiry" name="pollution_expiry" type="date" />
                            <Field label="Fitness Expiry" name="fitness_expiry" type="date" />
                            <Field label="Chassis Number" name="chassis_number" placeholder="Optional" />
                            <Field label="Engine Number" name="engine_number" placeholder="Optional" />
                            <div className="sm:col-span-2">
                                <Field label="Notes" name="notes" placeholder="Optional remarks">
                                    <textarea className="field h-16 resize-none" placeholder="Optional remarks"
                                        value={data.notes || ''} onChange={e => setData('notes', e.target.value)} />
                                </Field>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <a href={route('admin.vehicles.index')} className="btn-ghost">Cancel</a>
                        <button type="submit" disabled={processing} className="btn-gold flex items-center gap-2">
                            {processing ? 'Saving...' : '✓ Register Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
