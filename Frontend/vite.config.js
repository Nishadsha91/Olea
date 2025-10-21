import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

export default defineConfig({
  plugins: [tailwindcss(),react()],
    server: {
    watch: {
      // ✅ Prevent reload when db.json is modified by JSON Server
      ignored: ['**/db.json'],
    },
  },

})