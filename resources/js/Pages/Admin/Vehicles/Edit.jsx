import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { Car } from 'lucide-react';
import FormField from '@/Components/UI/FormField';

export default function VehicleEdit({ vehicle }) {
    const { data, setData, put, processing, errors } = useForm({
        status:           vehicle.status,
        insurance_expiry: vehicle.insurance_expiry || '',
        pollution_expiry: vehicle.pollution_expiry || '',
        fitness_expiry:   vehicle.fitness_expiry   || '',
        notes:            vehicle.notes            || '',
    });

    const submit = (e) => { e.preventDefault(); put(route('admin.vehicles.update', vehicle.id)); };

    return (
        <AppLayout title={`Edit — ${vehicle.registration_number}`}>
            <Head title={`Edit ${vehicle.registration_number}`} />
            <div className="max-w-xl mx-auto">
                <form onSubmit={submit}>
                    <div className="nm-card p-6 space-y-4" data-aos="fade-up">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                            <Car size={18} className="text-[#D4AF37]" />
                            {vehicle.make} {vehicle.model} — {vehicle.registration_number}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="text-xs text-muted mb-1.5 block font-medium">Status</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['active', 'maintenance', 'inactive'].map(s => (
                                        <button type="button" key={s} onClick={() => setData('status', s)}
                                            className={`py-2.5 rounded-xl border-2 text-xs capitalize font-medium transition-all ${
                                                data.status === s
                                                    ? s === 'active' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                                    : s === 'maintenance' ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                                    : 'border-red-500 bg-red-500/10 text-red-400'
                                                    : 'border-white/10 text-muted'
                                            }`}>{s.replace('_', ' ')}</button>
                                    ))}
                                </div>
                            </div>

                            <FormField label="Insurance Expiry" type="date" error={errors.insurance_expiry}
                                value={data.insurance_expiry} onChange={e => setData('insurance_expiry', e.target.value)} />

                            <FormField label="PUC / Pollution Expiry" type="date" error={errors.pollution_expiry}
                                value={data.pollution_expiry} onChange={e => setData('pollution_expiry', e.target.value)} />

                            <FormField label="Fitness Expiry" type="date" error={errors.fitness_expiry}
                                value={data.fitness_expiry} onChange={e => setData('fitness_expiry', e.target.value)} />

                            <div className="sm:col-span-2">
                                <FormField label="Notes" error={errors.notes}>
                                    <textarea className="field h-16 resize-none"
                                        value={data.notes || ''} onChange={e => setData('notes', e.target.value)} />
                                </FormField>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <a href={route('admin.vehicles.index')} className="btn-ghost">Cancel</a>
                        <button type="submit" disabled={processing} className="btn-gold flex items-center gap-2">
                            {processing ? 'Saving…' : '✓ Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
