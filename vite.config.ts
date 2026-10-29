import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Cast plugin to any to bridge Vite 6 / Vitest bundled types
  plugins: [react() as unknown as any],
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts',
  },
});
