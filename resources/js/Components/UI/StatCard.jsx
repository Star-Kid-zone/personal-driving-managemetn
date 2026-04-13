export function StatCard({ label, value, sub, icon: Icon, trend, color = '#D4AF37', delay = 0 }) {
    const trendUp = trend > 0;
    return (
        <div className="stat-widget" data-aos="fade-up" data-aos-delay={delay}>
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl" style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
                    {Icon && <Icon size={18} style={{ color }} />}
                </div>
                {trend !== undefined && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trendUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                        {trendUp ? '▲' : '▼'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm font-medium text-muted">{label}</div>
            {sub && <div className="text-xs text-subtle mt-1">{sub}</div>}
        </div>
    );
}

export function StatusBadge({ status }) {
    const map = {
        active: 'badge-active', completed: 'badge-completed',
        paid: 'badge-active', partial: 'badge-pending', pending: 'badge-pending',
        passed: 'badge-active', failed: 'badge-danger', issued: 'badge-completed',
        dropped: 'badge-danger', on_hold: 'badge-pending',
        scheduled: 'badge-pending', in_progress: 'badge-active', cancelled: 'badge-danger',
        not_applied: 'badge-danger', applied: 'badge-pending', waiting_period: 'badge-pending',
    };
    return (
        <span className={map[status] || 'badge-pending'}>
            {status?.replace(/_/g, ' ')}
        </span>
    );
}

export function ProgressCircle({ percent, size = 64, strokeWidth = 5, color = '#D4AF37' }) {
    const r    = (size - strokeWidth * 2) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (percent / 100) * circ;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
                strokeLinecap="round" strokeDasharray={`${dash} ${circ}`}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dasharray 0.7s ease' }} />
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
                fill="white" fontSize={size * 0.22} fontWeight="700" fontFamily="Plus Jakarta Sans">
                {Math.round(percent)}%
            </text>
        </svg>
    );
}

export default StatCard;
