import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

export default function FlashMessage({ flash }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const m = flash?.success || flash?.error || flash?.warning;
        if (m) {
            const type = flash?.success ? 'success' : flash?.error ? 'error' : 'warning';
            const id = Date.now();
            setItems(prev => [...prev, { id, text: m, type }]);
            setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 5000);
        }
    }, [flash]);

    if (!items.length) return null;

    const colors = {
        success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#10b981', Icon: CheckCircle },
        error:   { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  text: '#f87171', Icon: XCircle },
        warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b', Icon: AlertTriangle },
    };

    return (
        <div className="px-6 pt-4 space-y-2">
            {items.map(item => {
                const { bg, border, text, Icon } = colors[item.type];
                return (
                    <div key={item.id} className="flex items-center gap-3 p-4 rounded-xl border"
                        style={{ background: bg, borderColor: border }}>
                        <Icon size={16} style={{ color: text }} className="flex-shrink-0" />
                        <span className="flex-1 text-sm" style={{ color: text }}>{item.text}</span>
                        <button onClick={() => setItems(p => p.filter(i => i.id !== item.id))}
                            className="text-muted hover:text-white transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
