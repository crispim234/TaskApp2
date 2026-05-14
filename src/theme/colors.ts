export interface ThemeColors {
  bg: string;
  card: string;
  border: string;
  input: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  danger: string;
  dangerBg: string;
  dangerBorder: string;
  success: string;
  successBg: string;
  switchTrackOff: string;
  placeholder: string;
}

export const darkColors: ThemeColors = {
  bg: '#0F1117',
  card: '#1A1D24',
  border: '#2A2D3A',
  input: '#222630',
  textPrimary: '#F4F4F5',
  textSecondary: '#8B8FA8',
  textMuted: '#4A4E65',
  accent: '#7C5CFC',
  accentBg: 'rgba(124,92,252,0.15)',
  accentBorder: 'rgba(124,92,252,0.3)',
  danger: '#FF4757',
  dangerBg: 'rgba(255,71,87,0.08)',
  dangerBorder: 'rgba(255,71,87,0.25)',
  success: '#22C55E',
  successBg: 'rgba(34,197,94,0.08)',
  switchTrackOff: '#2A2D3A',
  placeholder: '#4A4E65',
};

export const lightColors: ThemeColors = {
  bg: '#F4F6FA',
  card: '#FFFFFF',
  border: '#E8ECF4',
  input: '#EEF1F8',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  accent: '#7C5CFC',
  accentBg: 'rgba(124,92,252,0.08)',
  accentBorder: 'rgba(124,92,252,0.25)',
  danger: '#EF4444',
  dangerBg: 'rgba(239,68,68,0.06)',
  dangerBorder: 'rgba(239,68,68,0.2)',
  success: '#16A34A',
  successBg: 'rgba(22,163,74,0.06)',
  switchTrackOff: '#D1D5DB',
  placeholder: '#9CA3AF',
};
