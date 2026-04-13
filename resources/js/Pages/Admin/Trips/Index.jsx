import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Route, Eye, CheckCircle, Clock, Users, Car, X } from 'lucide-react';

export function TripsIndex({ trips, teachers, filters }) {
    const [status, setStatus] = useState(filters?.status || '');

    const applyFilter = (overrides = {}) => {
        router.get(route('admin.trips.index'), { status, ...filters, ...overrides }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout title="Trips">
            <Head title="Trips" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-white">Trip Schedule</h1>
                    <p className="text-muted text-sm mt-0.5">{trips.total} total trips</p>
                </div>
                <Link href={route('admin.trips.create')} className="btn-gold flex items-center gap-2">
                    <Plus size={16} /> Schedule Trip
                </Link>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 mb-4 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.04)' }}>
                {['', 'scheduled', 'in_progress', 'completed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => { setStatus(s); applyFilter({ status: s }); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                            status === s ? 'bg-[#D4AF37] text-[#0a0a1a]' : 'text-muted hover:text-white'
                        }`}>
                        {s || 'All'}
                    </button>
                ))}
            </div>

            <div className="nm-card overflow-hidden" data-aos="fade-up">
                <div className="overflow-x-auto">
                    <table className="dm-table">
                        <thead>
                            <tr>
                                <th>Trip</th>
                                <th>Teacher</th>
                                <th>Vehicle</th>
                                <th>Date & Time</th>
                                <th>Students</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.data?.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-12 text-muted">No trips found</td></tr>
                            )}
                            {trips.data?.map(t => (
                                <tr key={t.id}>
                                    <td>
                                        <div className="text-[#D4AF37] font-mono text-xs font-semibold">{t.trip_number}</div>
                                        <div className="text-muted text-xs capitalize">{t.vehicle_type}</div>
                                    </td>
                                    <td className="text-sm text-white">{t.teacher?.user?.name}</td>
                                    <td className="text-sm text-muted">{t.vehicle?.make} {t.vehicle?.model}</td>
                                    <td>
                                        <div className="text-sm text-white">{t.trip_date}</div>
                                        <div className="text-muted text-xs">{t.start_time}</div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1.5 text-sm text-white">
                                            <Users size={13} className="text-muted" />
                                            {t.students_count}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={
                                            t.status === 'completed' ? 'badge-active' :
                                            t.status === 'scheduled' ? 'badge-pending' :
                                            t.status === 'in_progress' ? 'badge-active' : 'badge-danger'
                                        }>{t.status?.replace('_', ' ')}</span>
                                    </td>
                                    <td>
                                        <Link href={route('admin.trips.show', t.id)}
                                            className="p-1.5 rounded-lg text-muted hover:text-[#D4AF37] hover:bg-white/5 transition-colors inline-flex">
                                            <Eye size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {trips.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-xs text-muted">Showing {trips.from}–{trips.to} of {trips.total}</span>
                        <div className="flex gap-1">
                            {trips.links?.map((link, i) => (
                                <button key={i} onClick={() => link.url && router.get(link.url)} disabled={!link.url}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${link.active ? 'btn-gold' : link.url ? 'text-muted hover:text-white hover:bg-white/5' : 'text-subtle cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

export default TripsIndex;
