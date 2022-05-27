import { ThemeName } from './../models/appconfig.model';

export const THEMES = [
  {
    theme: 'lara-light-blue' as ThemeName,
    dark: false,
    inputStyle: 'outlined',
    ripple: true
  },
  {
    theme: 'lara-dark-blue' as ThemeName,
    dark: true,
    inputStyle: 'outlined',
    ripple: true
  },
  {
    theme: 'tailwind-light' as ThemeName,
    dark: false,
    inputStyle: 'outlined',
    ripple: true
  }
]