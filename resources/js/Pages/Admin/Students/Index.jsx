import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Car, Bike, Users } from 'lucide-react';

function VehicleBadge({ type }) {
    const map = { bike: { label: 'Bike', color: '#f59e0b' }, car: { label: 'Car', color: '#6366f1' }, both: { label: 'Both', color: '#10b981' } };
    const { label, color } = map[type] || map.car;
    return <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>{label}</span>;
}

function PayBadge({ status }) {
    const map = { paid: 'badge-active', partial: 'badge-pending', pending: 'badge-danger' };
    return <span className={map[status] || 'badge-pending'}>{status}</span>;
}

export default function StudentsIndex({ students, teachers, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [vehicleType, setVehicleType] = useState(filters?.vehicle_type || '');

    const applyFilters = (overrides = {}) => {
        router.get(route('admin.students.index'), { search, status, vehicle_type: vehicleType, ...overrides }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout title="Students">
            <Head title="Students" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-white">Students</h1>
                    <p className="text-muted text-sm mt-0.5">{students.total} total enrolled</p>
                </div>
                <Link href={route('admin.students.create')} className="btn-gold flex items-center gap-2">
                    <Plus size={16} /> Enroll Student
                </Link>
            </div>

            {/* Filters */}
            <div className="nm-card p-4 mb-4 flex flex-wrap gap-3 items-center" data-aos="fade-up">
                <div className="flex items-center gap-2 flex-1 min-w-48">
                    <Search size={15} className="text-muted flex-shrink-0 ml-3 absolute" />
                    <input className="field pl-8" placeholder="Search name, phone, ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters({ search: e.target.value })}
                    />
                </div>
                <select className="field w-auto" value={status} onChange={e => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}>
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                    <option value="on_hold">On Hold</option>
                </select>
                <select className="field w-auto" value={vehicleType} onChange={e => { setVehicleType(e.target.value); applyFilters({ vehicle_type: e.target.value }); }}>
                    <option value="">All Vehicles</option>
                    <option value="bike">Bike</option>
                    <option value="car">Car</option>
                    <option value="both">Both</option>
                </select>
                <button className="btn-ghost text-sm" onClick={() => applyFilters()}>
                    <Filter size={14} className="inline mr-1.5" /> Filter
                </button>
            </div>

            {/* Table */}
            <div className="nm-card overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                <div className="overflow-x-auto">
                    <table className="dm-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>ID</th>
                                <th>Contact</th>
                                <th>Vehicle</th>
                                <th>Sessions</th>
                                <th>Payment</th>
                                <th>LLR</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.data?.length === 0 && (
                                <tr><td colSpan={9} className="text-center py-12 text-muted">No students found</td></tr>
                            )}
                            {students.data?.map(s => (
                                <tr key={s.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&color=D4AF37&background=000666&size=64`}
                                                className="w-9 h-9 rounded-xl object-cover" alt={s.name} />
                                            <div>
                                                <div className="text-white font-medium text-sm">{s.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="text-[#D4AF37] font-mono text-xs">{s.student_id}</span></td>
                                    <td className="text-sm text-muted">{s.phone}</td>
                                    <td><VehicleBadge type={s.vehicle_type} /></td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="progress-bar w-16">
                                                <div className="progress-fill" style={{ width: `${s.progress_percentage || 0}%` }} />
                                            </div>
                                            <span className="text-xs text-muted whitespace-nowrap">
                                                {s.completed_sessions}/{s.total_sessions}
                                            </span>
                                        </div>
                                    </td>
                                    <td><PayBadge status={s.payment?.payment_status} /></td>
                                    <td>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            s.llr_record?.llr_status === 'passed' ? 'badge-active' :
                                            s.llr_record?.llr_status === 'not_applied' ? 'badge-danger' : 'badge-pending'
                                        }`}>
                                            {s.llr_record?.llr_status?.replace('_',' ') || 'N/A'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            s.status === 'active' ? 'badge-active' :
                                            s.status === 'completed' ? 'badge-completed' : 'badge-pending'
                                        }`}>{s.status}</span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1.5">
                                            <Link href={route('admin.students.show', s.id)}
                                                className="p-1.5 rounded-lg text-muted hover:text-[#D4AF37] hover:bg-white/5 transition-colors">
                                                <Eye size={14} />
                                            </Link>
                                            <Link href={route('admin.students.edit', s.id)}
                                                className="p-1.5 rounded-lg text-muted hover:text-blue-400 hover:bg-white/5 transition-colors">
                                                <Edit size={14} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {students.last_page > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-xs text-muted">
                            Showing {students.from}–{students.to} of {students.total}
                        </span>
                        <div className="flex gap-1">
                            {students.links?.map((link, i) => (
                                <button key={i}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        link.active ? 'btn-gold' :
                                        link.url ? 'text-muted hover:text-white hover:bg-white/5' : 'text-subtle cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
