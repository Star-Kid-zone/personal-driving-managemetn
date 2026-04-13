import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Car, AlertTriangle } from 'lucide-react';

function ExpiryBadge({ date, label }) {
    if (!date) return <span className="text-subtle text-xs">—</span>;
    const days = Math.ceil((new Date(date) - new Date()) / 86400000);
    const color = days < 0 ? 'text-red-400' : days < 30 ? 'text-amber-400' : 'text-emerald-400';
    return (
        <div>
            <div className={`text-xs font-medium ${color}`}>{date}</div>
            <div className={`text-xs ${color}`}>{days < 0 ? 'Expired' : days < 30 ? `${days}d left` : 'Valid'}</div>
        </div>
    );
}

export default function VehiclesIndex({ vehicles }) {
    return (
        <AppLayout title="Vehicles">
            <Head title="Vehicles" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-white">Fleet</h1>
                    <p className="text-muted text-sm mt-0.5">{vehicles.total} vehicles</p>
                </div>
                <Link href={route('admin.vehicles.create')} className="btn-gold flex items-center gap-2">
                    <Plus size={16} /> Add Vehicle
                </Link>
            </div>

            <div className="nm-card overflow-hidden" data-aos="fade-up">
                <div className="overflow-x-auto">
                    <table className="dm-table">
                        <thead>
                            <tr>
                                <th>Vehicle</th>
                                <th>Type</th>
                                <th>Registration</th>
                                <th>Insurance</th>
                                <th>Pollution</th>
                                <th>Fitness</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.data?.length === 0 && (
                                <tr><td colSpan={8} className="text-center py-12 text-muted">No vehicles registered</td></tr>
                            )}
                            {vehicles.data?.map(v => (
                                <tr key={v.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                                                style={{ background: v.type === 'car' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)' }}>
                                                <Car size={16} style={{ color: v.type === 'car' ? '#818cf8' : '#f59e0b' }} />
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-sm">{v.make} {v.model}</div>
                                                <div className="text-muted text-xs">{v.year} · {v.color}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${v.type === 'car' ? 'text-indigo-400 bg-indigo-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                                            {v.type}
                                        </span>
                                    </td>
                                    <td className="font-mono text-xs text-[#D4AF37]">{v.registration_number}</td>
                                    <td><ExpiryBadge date={v.insurance_expiry} label="Insurance" /></td>
                                    <td><ExpiryBadge date={v.pollution_expiry} label="PUC" /></td>
                                    <td><ExpiryBadge date={v.fitness_expiry} label="Fitness" /></td>
                                    <td>
                                        <span className={v.status === 'active' ? 'badge-active' : v.status === 'maintenance' ? 'badge-pending' : 'badge-danger'}>
                                            {v.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Link href={route('admin.vehicles.edit', v.id)}
                                            className="text-xs text-muted hover:text-[#D4AF37] transition-colors">Edit</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
