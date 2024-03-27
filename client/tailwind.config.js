/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                arima: ['"Arima"', 'sans-serif'],
                roboto: ['"Roboto"', 'sans-serif'],
            },
            colors: {
                main: '#65a30d',
                secondary: '#84cc16',
            },
            width: {
                main: '1200px',
            },
            flex: {
                2: '2 2 0%',
                3: '3 3 0%',
                4: '4 4 0%',
                5: '5 5 0%',
                6: '6 6 0%',
                7: '7 7 0%',
                8: '8 8 0%',
            },
            boxShadow: {
                default: '0 2px 6px 2px rgba(0, 0, 0, 0.3)',
                small: '0 1px 4px 1px rgba(0, 0, 0, 0.3)',
                large: '0 5px 12px 2px rgba(0, 0, 0, 0.3)',
            },

            screens: {
                phone: '0px',

                iPadmini: '640px',

                tablet: '768px',

                laptop: '1024px',

                desktop: '1280px',

                'max-phone': { max: '640px' },

                'max-iPadmini': { max: '768px' },

                'max-tablet': { max: '1024px' },

                'max-laptop': { max: '1280px' },
            },
            keyframes: {
                slide: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-right': {
                    '0%': {
                        '-webkit-transform': 'translateX(-500px);',
                        transform: 'translateX(-500px);',
                    },
                    ' 100%': {
                        '-webkit-transform': 'translateX(0);',
                        transform: 'translateX(0);',
                    },
                },
                'slide-scale-enter': {
                    '0%': {
                        '-webkit-opacity': '0',
                        opacity: '0',
                        scale: '95%',
                    },
                    '100%': {
                        '-webkit-opacity': '1',
                        opacity: '1',
                        scale: '100%',
                    },
                },
            },

            animation: {
                slide: 'slide 0.2s ease-in-out',
                'slide-right': 'slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;',
                'slide-scale-enter': 'slide-scale-enter 0.5s ease',
            },
            backgroundColor: {
                overlay: 'rgba(0,0,0,0.3)',
                overlay_preview: 'rgba(0,0,0,0.9)',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')({ strategy: 'class' })],
};
