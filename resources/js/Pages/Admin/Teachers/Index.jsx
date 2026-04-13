import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Eye, Edit, User, Phone, Car, Shield } from 'lucide-react';

export default function TeachersIndex({ teachers, filters }) {
    return (
        <AppLayout title="Teachers">
            <Head title="Teachers" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-white">Teachers</h1>
                    <p className="text-muted text-sm mt-0.5">{teachers.total} total</p>
                </div>
                <Link href={route('admin.teachers.create')} className="btn-gold flex items-center gap-2">
                    <Plus size={16} /> Add Teacher
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-aos="fade-up">
                {teachers.data?.map(t => (
                    <Link key={t.id} href={route('admin.teachers.show', t.id)}
                        className="nm-card-hover p-5 block">
                        <div className="flex items-center gap-3 mb-4">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.user?.name||'?')}&color=D4AF37&background=000666&size=128`}
                                className="w-12 h-12 rounded-2xl object-cover" alt={t.user?.name} />
                            <div>
                                <div className="text-white font-semibold">{t.user?.name}</div>
                                <div className="text-[#D4AF37] font-mono text-xs">{t.employee_id}</div>
                            </div>
                            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${t.is_active ? 'badge-active' : 'badge-danger'}`}>
                                {t.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-muted">
                                <Phone size={11} /> {t.user?.phone || '—'}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted capitalize">
                                <Car size={11} /> {t.specialization}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted">
                                <Shield size={11} /> {t.license_number || 'No license on file'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="text-center">
                                <div className="text-lg font-bold text-white">{t.students_count}</div>
                                <div className="text-xs text-muted">Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-[#D4AF37]">{t.trips_count}</div>
                                <div className="text-xs text-muted">Trips</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {teachers.last_page > 1 && (
                <div className="flex justify-center gap-1 mt-6">
                    {teachers.links?.map((link, i) => (
                        <button key={i} onClick={() => link.url && router.get(link.url)} disabled={!link.url}
                            className={`px-3 py-1.5 rounded-lg text-xs ${link.active ? 'btn-gold' : 'text-muted hover:text-white'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }} />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
