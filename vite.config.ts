import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react() as unknown as any],
  test: {
    environment: 'jsdom',
    setupFiles: './src/testSetup.ts',
  },
});
