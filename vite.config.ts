import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    cors: true,
    allowedHosts: true,
    middlewareMode: false, // ⚠️ garante que Vite use o middleware normalmente
  },
  // Use configurePreview para fallback quando necessário via `vite preview`
  preview: {
    port: 4173,
    host: '0.0.0.0'
  }
});