import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { User, Phone, Car, Shield, Users, Route, Edit } from 'lucide-react';

function InfoRow({ label, value, highlight }) {
    return (
        <div className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <span className="text-xs text-muted">{label}</span>
            <span className={`text-sm font-medium ${highlight ? 'text-[#D4AF37]' : 'text-white'}`}>{value || '—'}</span>
        </div>
    );
}

export default function TeacherShow({ teacher }) {
    const user = teacher.user;
    return (
        <AppLayout title={user?.name}>
            <Head title={user?.name} />

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '?')}&color=D4AF37&background=000666&size=128`}
                        className="w-16 h-16 rounded-2xl" alt={user?.name} />
                    <div>
                        <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[#D4AF37] font-mono text-sm">{teacher.employee_id}</span>
                            <span className={teacher.is_active ? 'badge-active' : 'badge-danger'}>
                                {teacher.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-muted text-xs capitalize">{teacher.specialization}</span>
                        </div>
                    </div>
                </div>
                <Link href={route('admin.teachers.edit', teacher.id)} className="btn-ghost flex items-center gap-2 text-sm">
                    <Edit size={15} /> Edit
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 lg:col-span-3">
                    {[
                        { label: 'Total Students', value: teacher.students_count, icon: Users, color: '#6366f1' },
                        { label: 'Active Students', value: teacher.active_students_count, icon: Users, color: '#10b981' },
                        { label: 'Total Trips', value: teacher.trips_count, icon: Route, color: '#D4AF37' },
                    ].map(({ label, value, icon: Icon, color }, i) => (
                        <div key={i} className="stat-widget" data-aos="fade-up" data-aos-delay={i * 75}>
                            <div className="p-2 rounded-lg w-fit mb-3" style={{ background: `${color}18` }}>
                                <Icon size={16} style={{ color }} />
                            </div>
                            <div className="text-xl font-bold text-white">{value}</div>
                            <div className="text-xs text-muted">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Personal info */}
                <div className="nm-card p-5" data-aos="fade-up">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <User size={14} className="text-[#D4AF37]" /> Personal Info
                    </h3>
                    <InfoRow label="Email" value={user?.email} />
                    <InfoRow label="Phone" value={user?.phone} />
                    <InfoRow label="Gender" value={teacher.gender} />
                    <InfoRow label="Date of Birth" value={teacher.date_of_birth} />
                    <InfoRow label="Address" value={teacher.address} />
                    <InfoRow label="Emergency Contact" value={teacher.emergency_contact} />
                </div>

                {/* Professional info */}
                <div className="nm-card p-5" data-aos="fade-up" data-aos-delay="100">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Shield size={14} className="text-[#D4AF37]" /> Professional Details
                    </h3>
                    <InfoRow label="Specialization" value={teacher.specialization} />
                    <InfoRow label="Aadhaar" value={teacher.aadhaar_number ? '••••' + teacher.aadhaar_number.slice(-4) : null} />
                </div>

                {/* Recent students */}
                <div className="nm-card p-5" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <Users size={14} className="text-[#D4AF37]" /> Students
                        </h3>
                        <Link href={route('admin.students.index', { teacher_id: teacher.id })}
                            className="text-xs text-[#D4AF37] hover:underline">View all →</Link>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                        {(teacher.students || []).slice(0, 8).map(s => (
                            <Link key={s.id} href={route('admin.students.show', s.id)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-all">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&color=D4AF37&background=000666&size=64`}
                                    className="w-7 h-7 rounded-lg" alt={s.name} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs text-white font-medium truncate">{s.name}</div>
                                    <div className="text-xs text-muted">{s.student_id}</div>
                                </div>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${s.status === 'active' ? 'badge-active' : 'badge-pending'}`}>
                                    {s.status}
                                </span>
                            </Link>
                        ))}
                        {teacher.students?.length === 0 && (
                            <div className="text-center py-4 text-muted text-xs">No students assigned</div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
