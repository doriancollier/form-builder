import type { Metadata } from 'next'
import { ViewTransitions } from 'next-view-transitions'
import { Toaster } from 'sonner'
import localFont from 'next/font/local'

import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="17f8a974-0a7f-426d-857a-daa8d80cc12e"
          ></script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div>
            <Toaster />

            <main className="min-h-[70vh]">{children}</main>
          </div>
        </body>
      </html>
    </ViewTransitions>
  )
}
