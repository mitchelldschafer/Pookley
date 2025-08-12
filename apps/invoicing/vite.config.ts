import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@pookley/ui': '/packages/ui/src',
      '@pookley/supabase': '/packages/supabase/src',
      '@pookley/billing': '/packages/billing/src',
      '@pookley/utils': '/packages/utils/src'
    }
  }
});