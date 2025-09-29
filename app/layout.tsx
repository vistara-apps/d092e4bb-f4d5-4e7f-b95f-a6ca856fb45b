import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'

export const metadata: Metadata = {
  title: 'FloodAlert NG - Hyperlocal Flood Alerts',
  description: 'Get hyperlocal flood risk notifications and actionable preparedness guidance using predictive weather and satellite data.',
  keywords: ['flood', 'alert', 'weather', 'preparedness', 'emergency', 'base', 'miniapp'],
  authors: [{ name: 'FloodAlert NG Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="default">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
