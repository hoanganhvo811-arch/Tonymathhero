import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isSingle = process.env.BUILD_SINGLE === 'true' || mode === 'single' || mode === 'production'

  return {
    base: './', // Đường dẫn tương đối giúp mở trực tiếp file html không bị lỗi CORS/Path
    plugins: [
      react(),
      ...(isSingle ? [viteSingleFile()] : []),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0', // Cho phép truy cập từ localhost và mạng LAN (tablet, máy tính khác)
      port: 3388,      // Cổng riêng biệt mới, hoàn toàn tránh xung đột cổng 5173
      strictPort: false,
    },
    preview: {
      host: '0.0.0.0',
      port: 3388,
      strictPort: false,
    },
    build: {
      cssCodeSplit: !isSingle,
      assetsInlineLimit: isSingle ? 100000000 : 4096,
      chunkSizeWarningLimit: 3000,
      rollupOptions: isSingle
        ? {
            output: {
              inlineDynamicImports: true,
            },
          }
        : {
            output: {
              manualChunks(id) {
                if (id.includes('node_modules/three')) {
                  return 'three-vendor'
                }
                if (id.includes('node_modules/lucide-react')) {
                  return 'icons-vendor'
                }
              },
            },
          },
    },
  }
})

