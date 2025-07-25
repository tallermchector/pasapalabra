import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rosco - Juego de Palabras',
  description: 'El juego de palabras más emocionante. Responde todas las letras del alfabeto.',
  keywords: ['juego', 'palabras', 'rosco', 'pasapalabra', 'trivia'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}