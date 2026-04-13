<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000666" />

    {{-- SEO Meta --}}
    <title inertia>{{ config('app.name', 'DriveMaster') }}</title>
    <meta name="description" content="Professional Driving School Management System - Tamil Nadu" />
    <meta name="keywords" content="driving school, LLR, DL, Tamil Nadu, driving lessons" />
    <meta name="author" content="DriveMaster" />
    <meta name="robots" content="noindex, nofollow" />

    {{-- OpenGraph --}}
    <meta property="og:type" content="website" />
    <meta property="og:title" content="DriveMaster - Driving School System" />
    <meta property="og:description" content="Professional Driving School Management" />
    <meta property="og:image" content="{{ asset('og-image.jpg') }}" />

    {{-- Twitter Card --}}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="DriveMaster" />

    {{-- JSON-LD --}}
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@@type": "DrivingSchool",
        "name": "DriveMaster",
        "description": "Professional Driving School Management System",
        "address": { "@@type": "PostalAddress", "addressRegion": "Tamil Nadu", "addressCountry": "IN" }
    }
    </script>

    {{-- Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display&display=swap" rel="stylesheet" />

    {{-- AOS --}}
    <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="h-full font-jakarta antialiased bg-[#0a0a1a]">
    @inertia
    <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
    <script>AOS.init({ duration: 600, once: true, offset: 50 });</script>
</body>
</html>
