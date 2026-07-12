import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/weatherglass-card.ts',
      formats: ['es'],
      fileName: () => 'weatherglass-card.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
});
