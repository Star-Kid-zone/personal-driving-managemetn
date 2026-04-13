import { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard, Users, UserCircle, Car, Route, CreditCard,
    FileText, Bell, ChevronLeft, Menu, X, LogOut, Settings,
    GraduationCap, Shield, BookOpen, TrendingUp
} from 'lucide-react';
import FlashMessage from '@/Components/UI/FlashMessage';

export default function AppLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = auth.user;
    const isAdmin   = user?.role === 'admin';
    const isTeacher = user?.role === 'teacher';

    const adminNav = [
        { href: route('admin.dashboard'),        label: 'Dashboard',   icon: LayoutDashboard },
        { href: route('admin.students.index'),   label: 'Students',    icon: Users },
        { href: route('admin.teachers.index'),   label: 'Teachers',    icon: UserCircle },
        { href: route('admin.vehicles.index'),   label: 'Vehicles',    icon: Car },
        { href: route('admin.trips.index'),      label: 'Trips',       icon: Route },
        { href: route('admin.payments.index'),   label: 'Payments',    icon: CreditCard },
        { href: route('admin.llr.index'),        label: 'LLR & DL',    icon: BookOpen },
        { href: route('admin.analytics'),        label: 'Analytics',   icon: TrendingUp },
    ];

    const teacherNav = [
        { href: route('teacher.dashboard'),      label: 'Dashboard',   icon: LayoutDashboard },
        { href: route('teacher.students.index'), label: 'My Students', icon: Users },
        { href: route('teacher.trips.index'),    label: 'Trips',       icon: Route },
        { href: route('teacher.llr.list'),       label: 'LLR & DL',   icon: BookOpen },
    ];

    const navItems = isAdmin ? adminNav : teacherNav;

    const current = (href) => {
        try { return window.location.pathname.startsWith(new URL(href).pathname); }
        catch { return false; }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#060614]">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:relative inset-y-0 left-0 z-50 flex flex-col
                transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'w-64' : 'w-18'}
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
                style={{ background: 'linear-gradient(180deg, #080822 0%, #050518 100%)', borderRight: '1px solid rgba(212,175,55,0.1)' }}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'overflow-hidden'}`}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #000666, #1a1a8e)' }}>
                            <GraduationCap size={18} className="text-[#D4AF37]" />
                        </div>
                        {sidebarOpen && (
                            <div>
                                <div className="font-bold text-white text-sm leading-tight">DriveMaster</div>
                                <div className="text-[10px] text-muted">
                                    {isAdmin ? '⚡ Admin' : '🎯 Teacher'}
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden lg:flex p-1.5 rounded-lg text-muted hover:text-[#D4AF37] transition-colors">
                        <ChevronLeft size={16} className={`transition-transform ${!sidebarOpen && 'rotate-180'}`} />
                    </button>
                    <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 rounded-lg text-muted">
                        <X size={16} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href}
                            className={`nav-item ${current(href) ? 'active' : ''}`}
                            title={!sidebarOpen ? label : undefined}>
                            <Icon size={18} className="flex-shrink-0" />
                            {sidebarOpen && <span>{label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* User footer */}
                <div className="p-3 border-t" style={{ borderColor: 'rgba(212,175,55,0.1)' }}>
                    <div className={`flex items-center gap-3 p-3 rounded-xl ${sidebarOpen ? '' : 'justify-center'}`}
                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <img src={user?.photo_url} alt={user?.name}
                            className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-white text-sm truncate">{user?.name}</div>
                                <div className="text-muted text-xs truncate">{user?.email}</div>
                            </div>
                        )}
                    </div>
                    {sidebarOpen && (
                        <Link href={route('logout')} method="post" as="button"
                            className="nav-item w-full mt-1 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <LogOut size={16} />
                            <span>Sign Out</span>
                        </Link>
                    )}
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
                    style={{ background: 'rgba(6,6,20,0.95)', borderColor: 'rgba(212,175,55,0.08)', backdropFilter: 'blur(10px)' }}>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-muted hover:text-white">
                            <Menu size={20} />
                        </button>
                        {title && <h1 className="text-lg font-semibold text-white">{title}</h1>}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-xl text-muted hover:text-[#D4AF37] transition-colors relative"
                            style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <Bell size={18} />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                        </button>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                            <Shield size={14} className="text-[#D4AF37]" />
                            <span className="text-xs text-muted capitalize">{user?.role}</span>
                        </div>
                    </div>
                </header>

                {/* Flash messages */}
                <FlashMessage flash={flash} />

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
