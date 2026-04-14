import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Eye, AlertCircle, Edit, Filter } from 'lucide-react';

export default function TeacherStudentsIndex({ students, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [vehicleType, setVehicleType] = useState(filters?.vehicle_type || '');

    const applyFilters = (overrides = {}) => {
        router.get(route('teacher.students.index'), { search, status, vehicle_type: vehicleType, ...overrides }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout title="My Students">
            <Head title="My Students" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-white">My Students</h1>
                    <p className="text-muted text-sm mt-0.5">{students.total} total</p>
                </div>
                <Link href={route('teacher.students.create')} className="btn-gold flex items-center gap-2">
                    <Plus size={16} /> Enroll Student
                </Link>
            </div>

            {/* Filters */}
            <div className="nm-card p-4 mb-4 flex flex-wrap gap-3" data-aos="fade-up">
                <div className="flex-1 min-w-48 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input className="field pl-9" placeholder="Search name or ID…"
                        value={search} onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters({ search: e.target.value })} />
                </div>
                <select className="field w-auto" value={status}
                    onChange={e => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>
                <select className="field w-auto" value={vehicleType} onChange={e => { setVehicleType(e.target.value); applyFilters({ vehicle_type: e.target.value }); }}>
                    <option value="">All Vehicles</option>
                    <option value="bike">Bike</option>
                    <option value="car">Car</option>
                    <option value="both">Both</option>
                </select>
            </div>

            <div className="nm-card overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                <div className="overflow-x-auto">
                    <table className="dm-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Vehicle</th>
                                <th>Progress</th>
                                <th>Payment</th>
                                <th>LLR</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.data?.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-12 text-muted">No students found</td></tr>
                            )}
                            {students.data?.map(s => {
                                const prog = Math.round((s.completed_sessions / s.total_sessions) * 100);
                                return (
                                    <tr key={s.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&color=D4AF37&background=000666&size=64`}
                                                    className="w-9 h-9 rounded-xl" alt={s.name} />
                                                <div>
                                                    <div className="text-sm text-white font-medium">{s.name}</div>
                                                    <div className="text-xs text-muted">{s.student_id} · {s.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-xs text-muted capitalize">{s.vehicle_type}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="progress-bar w-16">
                                                    <div className="progress-fill" style={{ width: `${prog}%` }} />
                                                </div>
                                                <span className="text-xs text-muted whitespace-nowrap">{s.remaining_sessions} left</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1.5">
                                                <span className={s.payment?.payment_status === 'paid' ? 'badge-active' : s.payment?.payment_status === 'partial' ? 'badge-pending' : 'badge-danger'}>
                                                    {s.payment?.payment_status || 'N/A'}
                                                </span>
                                                {s.payment?.balance_due > 0 && (
                                                    <span className="text-xs text-red-400">₹{Number(s.payment.balance_due).toLocaleString('en-IN')}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                s.llr_record?.llr_status === 'passed' ? 'badge-active' :
                                                s.llr_record?.llr_status === 'not_applied' ? 'badge-danger' : 'badge-pending'
                                            }`}>{s.llr_record?.llr_status?.replace(/_/g, ' ') || 'N/A'}</span>
                                        </td>
                                        <td>
                                            <span className={s.status === 'active' ? 'badge-active' : s.status === 'completed' ? 'badge-completed' : 'badge-pending'}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={route('teacher.students.show', s.id)}
                                                className="p-1.5 rounded-lg text-muted hover:text-[#D4AF37] hover:bg-white/5 transition-colors inline-flex">
                                                <Eye size={14} />
                                            </Link>
                                            <Link href={route('teacher.students.edit', s.id)}
                                                className="p-1.5 rounded-lg text-muted hover:text-blue-400 hover:bg-white/5 transition-colors inline-flex">
                                                <Edit size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {students.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-xs text-muted">Showing {students.from}–{students.to} of {students.total}</span>
                        <div className="flex gap-1">
                            {students.links?.map((link, i) => (
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
