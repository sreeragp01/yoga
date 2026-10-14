/**
 * Design Tokens for Yoga Platform
 * Aesthetic: Calm, spacious, uplifting, humanist editorial.
 */

export const colors = {
  // Backgrounds
  bgCanvas: '#FAF8F5',         // Warm linen / cream canvas
  bgSurface: '#FFFFFF',        // Pure clean white card surface
  bgMuted: '#F3EFE9',          // Warm sand / secondary background
  bgSageLight: '#E5ECE7',      // Soft sage tint for highlights & badges
  bgSageSelected: '#425F51',   // Active selected slot / button (forest sage)
  bgSageActive: '#31493E',     // Primary brand button dark sage

  // Borders
  borderLight: '#E8E3DC',      // Subtle card border
  borderMuted: '#DDD7CE',      // Section divider
  borderActive: '#425F51',     // Active button outline / border
  borderFocus: '#283D32',      // Focused ring

  // Text
  textPrimary: '#1A231E',      // Deep charcoal green-black
  textSecondary: '#536058',    // Muted slate green
  textTertiary: '#86928B',     // Soft stone caption
  textInverse: '#FAF8F5',      // Cream white text on dark buttons
  textAccent: '#283D32',       // Editorial accent

  // Status Colors
  statusSuccessBg: '#EAF3ED',
  statusSuccessText: '#235937',
  statusWarningBg: '#FAF2E6',
  statusWarningText: '#875317',
  statusErrorBg: '#FCEBEA',
  statusErrorText: '#A12B26',
};

export const typography = {
  fontSerif: '"Playfair Display", "Cormorant Garamond", Georgia, serif',
  fontSans: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontMono: '"JetBrains Mono", monospace',
};

export const shadows = {
  soft: '0 2px 8px -2px rgba(35, 47, 40, 0.05), 0 1px 4px -1px rgba(35, 47, 40, 0.03)',
  card: '0 4px 16px -4px rgba(35, 47, 40, 0.07), 0 1px 3px rgba(35, 47, 40, 0.04)',
  elevated: '0 12px 32px -8px rgba(35, 47, 40, 0.12), 0 4px 12px -2px rgba(35, 47, 40, 0.06)',
};
