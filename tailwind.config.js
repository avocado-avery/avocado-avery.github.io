module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'ub-grey': '#0c0c0c',
      'ub-warm-grey': "#7c7c7c",
      'ub-cool-grey': "#1a1a1a",
      'ub-orange': "#1793D1",
      'ub-lite-abrgn': "#141414",
      'ub-med-abrgn': "#111111",
      'ub-drk-abrgn': "#0c0c0c",
      'ub-window-title': "#181818",
      'ub-gedit-dark': "#0a0a0a",
      'ub-gedit-light': "#1a1a1a",
      'ub-gedit-darker': "#060606",
    }),
    textColor: theme => ({
      ...theme('colors'),
      'ubt-grey': '#c5c8c6',
      'ubt-warm-grey': "#7c7c7c",
      'ubt-cool-grey': "#555555",
      'ubt-blue': "#1793D1",
      'ubt-green': "#4E9A06",
      'ubt-gedit-orange': "#cc6633",
      'ubt-gedit-blue': "#1793D1",
      'ubt-gedit-dark': "#1793D1",
    }),
    borderColor: theme => ({
      ...theme('colors'),
      DEFAULT: theme('colors.gray.300', 'currentColor'),
      'ubb-orange': '#1793D1'
    }),
    minWidth: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
    },
    minHeight: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
    },
    extend: {
      zIndex: {
        '-10': '-10',
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', '"Source Code Pro"', 'monospace'],
        'sans': ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
