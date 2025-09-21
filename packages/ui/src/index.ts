export const tokens = {
  colors: {
    primary: '#00A8E8',
    secondary: '#FFBA08',
    danger: '#FF6B6B',
    neutralDark: '#333333',
    neutralMedium: '#666666',
    neutralLight: '#F5F5F5',
    white: '#FFFFFF'
  },
  typography: {
    heading: {
      fontFamily: 'Poppins',
      fontWeight: '700'
    },
    body: {
      fontFamily: 'Inter',
      fontWeight: '400'
    },
    label: {
      fontFamily: 'Inter',
      fontWeight: '500'
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20
  }
} as const;

export type DesignTokens = typeof tokens;
