import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: 'ProyectoGrupo3-LenovoReact', // 👈 importante para rutas
  server: {
    proxy: {
      '/api': {
         target: 'https://backend-toti.onrender.com', // remoto
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
