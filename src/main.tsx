import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import { ThemeProvider } from "@/components/theme-provider"
import App from './App.tsx'
import { Toaster } from "@/components/ui/toaster"
import './index.css'

Amplify.configure(outputs);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <App />
    <Toaster />
  </ThemeProvider>
  </StrictMode>,
)
