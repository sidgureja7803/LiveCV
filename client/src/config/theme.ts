// Theme configuration for consistent styling across the application
export const theme = {
  colors: {
    primary: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712',
    },
  },
  gradients: {
    primary: {
      start: 'from-indigo-600',
      end: 'to-violet-600',
      hover: {
        start: 'from-indigo-700',
        end: 'to-violet-700',
      },
    },
    background: {
      light: 'from-indigo-50 via-purple-50 to-blue-50',
      dark: 'from-indigo-900 via-purple-900 to-blue-900',
    },
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },
  animation: {
    fadeIn: 'animate-fade-in',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
  },
};

// Common component styles
export const componentStyles = {
  button: {
    primary: `bg-gradient-to-r ${theme.gradients.primary.start} ${theme.gradients.primary.end} 
              hover:${theme.gradients.primary.hover.start} hover:${theme.gradients.primary.hover.end} 
              text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 
              focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-lg 
              hover:shadow-xl transform hover:scale-[1.02]`,
    secondary: `bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-6 
                rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 
                focus:ring-gray-200 border border-gray-200 hover:border-gray-300 
                shadow hover:shadow-md`,
    outline: `bg-transparent hover:bg-gray-50 text-indigo-600 font-semibold py-3 px-6 
              rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 
              focus:ring-indigo-500/20 border border-indigo-500 hover:border-indigo-600`,
  },
  input: {
    base: `w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none 
           focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 
           transition-all duration-200 bg-white/50 backdrop-blur-sm`,
    label: 'text-gray-700 font-semibold text-sm mb-2',
    error: 'text-red-600 text-xs mt-1',
  },
  card: {
    base: `bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 relative`,
    header: 'text-center mb-8',
    title: 'text-3xl font-heading font-bold text-gray-900 mb-2',
    subtitle: 'text-gray-600 font-medium',
  },
  layout: {
    container: 'w-full max-w-md relative z-10',
    pageBackground: `min-h-screen bg-gradient-to-br ${theme.gradients.background.light} flex items-center justify-center p-4 relative overflow-hidden`,
  },
};

export default { theme, componentStyles };
