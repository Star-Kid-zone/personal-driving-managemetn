import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Car } from 'lucide-react';
import FormField from '@/Components/UI/FormField';

const COLORS = ['White', 'Silver', 'Black', 'Blue', 'Red', 'Grey', 'Brown', 'Green', 'Yellow', 'Orange'];
const FUELS  = ['petrol', 'diesel', 'electric', 'cng'];

export default function VehicleCreate() {
    const { data, setData, post, processing, errors } = useForm({
        registration_number: '',
        make: '', model: '', year: new Date().getFullYear(),
        type: 'car', color: '', fuel_type: 'petrol',
        insurance_expiry: '', pollution_expiry: '', fitness_expiry: '',
        notes: '',
    });

    const submit = (e) => { e.preventDefault(); post(route('admin.vehicles.store')); };

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
                            <FormField label="Registration Number" required error={errors.registration_number}
                                placeholder="TN58 AX 1234" value={data.registration_number}
                                onChange={e => setData('registration_number', e.target.value)} />

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

                            <FormField label="Make" required error={errors.make}
                                placeholder="Maruti, Honda, TVS…" value={data.make}
                                onChange={e => setData('make', e.target.value)} />

                            <FormField label="Model" required error={errors.model}
                                placeholder="Alto, Activa, Jupiter…" value={data.model}
                                onChange={e => setData('model', e.target.value)} />

                            <FormField label="Year" type="number" required error={errors.year}
                                placeholder="2022" value={data.year}
                                onChange={e => setData('year', e.target.value)} />

                            <FormField label="Colour" error={errors.color}>
                                <select className="field" value={data.color} onChange={e => setData('color', e.target.value)}>
                                    <option value="">Select colour</option>
                                    {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </FormField>

                            <FormField label="Fuel Type" error={errors.fuel_type}>
                                <select className="field" value={data.fuel_type} onChange={e => setData('fuel_type', e.target.value)}>
                                    {FUELS.map(f => (
                                        <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                                    ))}
                                </select>
                            </FormField>

                            <FormField label="Insurance Expiry" type="date" error={errors.insurance_expiry}
                                value={data.insurance_expiry} onChange={e => setData('insurance_expiry', e.target.value)} />

                            <FormField label="PUC / Pollution Expiry" type="date" error={errors.pollution_expiry}
                                value={data.pollution_expiry} onChange={e => setData('pollution_expiry', e.target.value)} />

                            <FormField label="Fitness Expiry" type="date" error={errors.fitness_expiry}
                                value={data.fitness_expiry} onChange={e => setData('fitness_expiry', e.target.value)} />

                            <div className="sm:col-span-2">
                                <FormField label="Notes" error={errors.notes}>
                                    <textarea className="field h-16 resize-none" placeholder="Optional remarks"
                                        value={data.notes || ''} onChange={e => setData('notes', e.target.value)} />
                                </FormField>
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
