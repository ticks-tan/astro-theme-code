/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: ['selector', '[data-theme="dark"]'],
    theme: {
        fontFamily: {
            mono: [
                'system-ui',
                '-apple-system',
                'JetBrainsMono',
                'Roboto',
                'Segoe UI',
                'Helvetica',
                'Noto Sans SC',
                'Microsoft Yahei',
                'PingFang SC',
                'sans-serif',
            ],
        },
        extend: {
            colors: {
                bgColor: 'var(--theme-bg)',
                textColor: 'var(--theme-text)',
                link: 'var(--theme-link)',
                accent: 'var(--theme-accent)',
                'accent-2': 'var(--theme-accent-2)',
                surface: 'var(--theme-surface)',
                quote: 'var(--theme-quote)',
                highlight: 'var(--theme-highlight)',
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
