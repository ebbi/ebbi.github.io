// app/utils/osDetection.js
export async function getOSInstructionKey() {
    // 1️⃣ Client‑Hints if available
    if (navigator.userAgentData?.getHighEntropyValues) {
        try {
            const { platform } = await navigator.userAgentData.getHighEntropyValues(['platform']);
            const p = (platform || '').toLowerCase();

            if (p.includes('windows')) return 'installStepsWindows';
            if (p.includes('mac')) return 'installStepsMac';
            if (p.includes('ios')) return 'installStepsIOS';
            if (p.includes('android')) return 'installStepsAndroid';
            if (p.includes('linux')) return 'installStepsLinux';
            if (p.includes('chromeos')) return 'installStepsChromeOS';
            return 'installStepsGeneric';
        } catch (_) {
            // fall through to UA parsing
        }
    }

    // 2️⃣ Classic UA regex fallback (sync)
    const ua = navigator.userAgent || '';
    if (/Windows Phone|WPDesktop/.test(ua)) return 'installStepsWindows';
    if (/Win(dows)?/.test(ua)) return 'installStepsWindows';
    if (/CrOS/.test(ua)) return 'installStepsChromeOS';
    if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(ua)) return 'installStepsMac';
    if (/iPhone|iPad|iPod/.test(ua)) return 'installStepsIOS';
    if (/Android/.test(ua)) return 'installStepsAndroid';
    if (/Linux/.test(ua)) return 'installStepsLinux';
    if (/EdgA/.test(ua) && /Android/.test(ua)) return 'installStepsAndroid';
    if (/EdgiOS/.test(ua) && /iPhone|iPad/.test(ua)) return 'installStepsIOS';
    if (/SamsungBrowser/.test(ua) && /Android/.test(ua)) return 'installStepsAndroid';

    return 'installStepsGeneric';
}