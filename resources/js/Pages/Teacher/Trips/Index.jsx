import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Route, Eye, Users } from 'lucide-react';

export default function TeacherTripsIndex({ trips, filters }) {
    return (
        <AppLayout title="My Trips">
            <Head title="My Trips" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-white">My Trips</h1>
                    <p className="text-muted text-sm mt-0.5">{trips.total} total</p>
                </div>
                <Link href={route('teacher.trips.create')} className="btn-gold flex items-center gap-2">
                    <Plus size={16} /> Schedule Trip
                </Link>
            </div>



            <div className="nm-card overflow-hidden" data-aos="fade-up">
                <div className="overflow-x-auto">
                    <table className="dm-table">
                        <thead>
                            <tr>
                                <th>Trip</th>
                                <th>Vehicle</th>
                                <th>Date & Time</th>
                                <th>Type</th>
                                <th>Students</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.data?.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-12 text-muted">No trips found</td></tr>
                            )}
                            {trips.data?.map(t => (
                                <tr key={t.id}>
                                    <td className="font-mono text-xs text-[#D4AF37] font-semibold">{t.trip_number}</td>
                                    <td className="text-sm text-muted">{t.vehicle?.make} {t.vehicle?.model}</td>
                                    <td>
                                        <div className="text-sm text-white">{t.trip_date}</div>
                                        <div className="text-xs text-muted">{t.start_time}</div>
                                    </td>
                                    <td className="text-xs text-muted capitalize">{t.vehicle_type}</td>
                                    <td>
                                        <div className="flex items-center gap-1.5 text-sm text-white">
                                            <Users size={13} className="text-muted" /> {t.students_count}
                                        </div>
                                    </td>

                                    <td>
                                        <Link href={route('teacher.trips.show', t.id)}
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
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${link.active ? 'btn-gold' : link.url ? 'text-muted hover:text-white' : 'text-subtle cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
