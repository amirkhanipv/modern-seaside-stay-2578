// Check environment variables on startup
console.log('🔍 ENV CHECK:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? '✓ Loaded' : '✗ Missing',
  VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? '✓ Loaded' : '✗ Missing',
});

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
