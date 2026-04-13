<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>" class="h-full">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000666" />

    
    <title inertia><?php echo e(config('app.name', 'DriveMaster')); ?></title>
    <meta name="description" content="Professional Driving School Management System - Tamil Nadu" />
    <meta name="keywords" content="driving school, LLR, DL, Tamil Nadu, driving lessons" />
    <meta name="author" content="DriveMaster" />
    <meta name="robots" content="noindex, nofollow" />

    
    <meta property="og:type" content="website" />
    <meta property="og:title" content="DriveMaster - Driving School System" />
    <meta property="og:description" content="Professional Driving School Management" />
    <meta property="og:image" content="<?php echo e(asset('og-image.jpg')); ?>" />

    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="DriveMaster" />

    
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "DrivingSchool",
        "name": "DriveMaster",
        "description": "Professional Driving School Management System",
        "address": { "@type": "PostalAddress", "addressRegion": "Tamil Nadu", "addressCountry": "IN" }
    }
    </script>

    
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display&display=swap" rel="stylesheet" />

    
    <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />

    <?php echo app('Tighten\Ziggy\BladeRouteGenerator')->generate(); ?>
    <?php echo app('Illuminate\Foundation\Vite')->reactRefresh(); ?>
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.jsx']); ?>
    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->head; } ?>
</head>
<body class="h-full font-jakarta antialiased bg-[#0a0a1a]">
    <?php if (!isset($__inertiaSsrDispatched)) { $__inertiaSsrDispatched = true; $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page); }  if ($__inertiaSsrResponse) { echo $__inertiaSsrResponse->body; } elseif (config('inertia.use_script_element_for_initial_page')) { ?><script data-page="app" type="application/json"><?php echo json_encode($page); ?></script><div id="app"></div><?php } else { ?><div id="app" data-page="<?php echo e(json_encode($page)); ?>"></div><?php } ?>
    <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
    <script>AOS.init({ duration: 600, once: true, offset: 50 });</script>
</body>
</html>
<?php /**PATH F:\practice\drivingschool\personal-driving-managemetn\resources\views/app.blade.php ENDPATH**/ ?>