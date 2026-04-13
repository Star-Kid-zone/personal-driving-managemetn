import { Head, useForm, Link } from '@inertiajs/react';
import { GraduationCap, Search, ArrowRight } from 'lucide-react';

export default function PortalEntry({ errors }) {
    const { data, setData, post, processing } = useForm({ identifier: '' });
    const submit = (e) => { e.preventDefault(); post(route('student.portal.access')); };

    return (
        <>
            <Head title="Student Portal" />
            <div className="min-h-screen flex flex-col items-center justify-center p-6"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,6,102,0.4) 0%, #060614 60%)' }}>

                {/* Animated rings */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[400,600,800].map((s,i) => (
                        <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                            style={{ width: s, height: s, borderColor: `rgba(212,175,55,${0.04-i*0.01})`, animation: `ping ${3+i}s ease-in-out infinite`, animationDelay: `${i*0.5}s` }} />
                    ))}
                </div>

                <div className="relative z-10 w-full max-w-md" data-aos="fade-up">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            style={{ background: 'linear-gradient(135deg, #000666, #1a1a8e)', boxShadow: '0 0 40px rgba(0,6,102,0.6)' }}>
                            <GraduationCap size={28} className="text-[#D4AF37]" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">DriveMaster</h1>
                        <p className="text-muted mt-2 text-sm">Student Self-Service Portal</p>
                    </div>

                    {/* Card */}
                    <div className="nm-card p-8">
                        <h2 className="text-xl font-semibold text-white mb-2">Access Your Dashboard</h2>
                        <p className="text-muted text-sm mb-6">Enter your Student ID (e.g. DM-2024-0001) to view your progress, payments, and license status.</p>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="text-xs text-muted mb-1.5 block font-medium">Student ID</label>
                                <div className="relative">
                                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                    <input type="text" className={`field pl-10 ${errors?.identifier ? 'border-red-500/50' : ''}`}
                                        placeholder="DM-2024-0001"
                                        value={data.identifier}
                                        onChange={e => setData('identifier', e.target.value.toUpperCase())}
                                        autoFocus />
                                </div>
                                {errors?.identifier && <p className="text-red-400 text-xs mt-1">{errors.identifier}</p>}
                            </div>

                            <button type="submit" disabled={processing}
                                className="btn-gold w-full flex items-center justify-center gap-2 py-3">
                                {processing ? 'Searching…' : (<>Access Portal <ArrowRight size={16} /></>)}
                            </button>
                        </form>

                        <p className="text-center text-xs text-subtle mt-6">
                            Don't know your ID? Contact your driving instructor.
                        </p>
                    </div>

                    <p className="text-center text-xs text-subtle mt-6">
                        Tamil Nadu Licensed Driving School · Since 2020
                    </p>
                </div>
            </div>
        </>
    );
}
