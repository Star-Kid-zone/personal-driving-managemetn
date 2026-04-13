import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from 'react-hot-toast';

const appName = import.meta.env.VITE_APP_NAME || 'DriveMaster';

createInertiaApp({
    title: (title) => title ? `${title} — ${appName}` : appName,
    resolve: (name) => resolvePageComponent(
        `./Pages/${name}.jsx`,
        import.meta.glob('./Pages/**/*.jsx')
    ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#0d0d2b',
                            color: '#e8e8ff',
                            border: '1px solid #1a1a4e',
                            borderRadius: '12px',
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                        },
                        success: { iconTheme: { primary: '#D4AF37', secondary: '#0d0d2b' } },
                        error:   { iconTheme: { primary: '#ef4444', secondary: '#0d0d2b' } },
                    }}
                />
            </>
        );
    },
    progress: {
        color: '#D4AF37',
        showSpinner: true,
    },
});
