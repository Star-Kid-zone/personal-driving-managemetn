import { Head, useForm, Link } from '@inertiajs/react';
import { GraduationCap, LogIn, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPass, setShowPass] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '', password: '', remember: false,
    });

    const submit = (e) => { e.preventDefault(); post(route('login')); };

    return (
        <>
            <Head title="Sign In" />
            <div className="min-h-screen flex" style={{ background: '#060614' }}>

                {/* Left decorative panel */}
                <div className="hidden lg:flex flex-col justify-center items-center flex-1 relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #000666 0%, #050525 100%)' }}>

                    {/* Animated rings */}
                    <div className="absolute inset-0">
                        {[300,500,700,900].map((s,i) => (
                            <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                                style={{ width:s, height:s, borderColor:`rgba(212,175,55,${0.08-i*0.015})` }} />
                        ))}
                    </div>

                    <div className="relative z-10 text-center px-12">
                        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}>
                            <GraduationCap size={36} className="text-[#D4AF37]" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-3 font-serif">DriveMaster</h1>
                        <p className="text-lg" style={{ color: 'rgba(212,175,55,0.7)' }}>
                            Professional Driving School Management
                        </p>
                        <p className="text-muted text-sm mt-3">Tamil Nadu · Since 2020</p>

                        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
                            {[
                                { val: '500+', label: 'Students' },
                                { val: '98%',  label: 'Pass Rate' },
                                { val: '5★',   label: 'Rating' },
                            ].map(({ val, label }) => (
                                <div key={label} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                                    <div className="text-2xl font-bold text-[#D4AF37]">{val}</div>
                                    <div className="text-xs text-muted mt-0.5">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right login form */}
                <div className="flex flex-col justify-center items-center flex-1 p-8 lg:max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #000666, #1a1a8e)' }}>
                            <GraduationCap size={20} className="text-[#D4AF37]" />
                        </div>
                        <span className="text-white font-bold text-lg">DriveMaster</span>
                    </div>

                    <div className="w-full max-w-sm">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                            <p className="text-muted text-sm mt-1">Sign in to your admin or teacher account</p>
                        </div>

                        {status && (
                            <div className="mb-4 p-3 rounded-xl text-sm text-emerald-400"
                                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="text-xs text-muted mb-1.5 block font-medium">Email Address</label>
                                <input type="email" className={`field ${errors.email ? 'border-red-500/50' : ''}`}
                                    placeholder="admin@drivemaster.in"
                                    value={data.email} onChange={e => setData('email', e.target.value)}
                                    autoFocus autoComplete="email" />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="text-xs text-muted mb-1.5 block font-medium">Password</label>
                                <div className="relative">
                                    <input type={showPass ? 'text' : 'password'}
                                        className={`field pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                                        placeholder="••••••••"
                                        value={data.password} onChange={e => setData('password', e.target.value)}
                                        autoComplete="current-password" />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-white/20 bg-white/5 text-[#D4AF37]"
                                        checked={data.remember} onChange={e => setData('remember', e.target.checked)} />
                                    <span className="text-xs text-muted">Remember me</span>
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-xs text-[#D4AF37] hover:underline">
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <button type="submit" disabled={processing}
                                className="btn-gold w-full flex items-center justify-center gap-2 py-3 mt-2">
                                {processing ? (
                                    <div className="w-4 h-4 border-2 border-[#0a0a1a]/30 border-t-[#0a0a1a] rounded-full animate-spin" />
                                ) : (
                                    <><LogIn size={16} /> Sign In</>
                                )}
                            </button>
                        </form>

                        {/* Student portal link */}
                        <div className="mt-6 p-4 rounded-xl text-center"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-xs text-muted mb-2">Are you a student?</p>
                            <Link href={route('student.portal.entry')}
                                className="text-sm text-[#D4AF37] font-medium hover:underline">
                                Access Student Portal →
                            </Link>
                        </div>

                        <p className="text-center text-xs text-subtle mt-6">
                            © {new Date().getFullYear()} DriveMaster. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
