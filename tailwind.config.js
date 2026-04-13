import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                jakarta: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
                serif:   ['DM Serif Display', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                teal: { DEFAULT: '#000666', light: '#1a1a8e', dark: '#00044d' },
                gold: { DEFAULT: '#D4AF37', light: '#f0d060', dark: '#b8960f' },
                grey: { DEFAULT: '#4F4F4F' },
                border: 'rgba(212, 175, 55, 0.15)',
            },
            animation: {
                'fade-in':   'fadeIn 0.5s ease-in-out',
                'slide-up':  'slideUp 0.4s ease-out',
                'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
                'ping-slow': 'ping 3s cubic-bezier(0,0,0.2,1) infinite',
            },
            keyframes: {
                fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern':    'radial-gradient(ellipse at 50% 0%, rgba(0,6,102,0.4) 0%, #060614 60%)',
            },
            borderColor: {
                DEFAULT: 'rgba(212,175,55,0.1)',
            },
        },
    },

    plugins: [forms],
};
