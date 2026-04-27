import type { Metadata, Viewport } from "next"
import "./globals.css"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "Estudo Bíblico JW",
  description: "App de estudo pessoal da Bíblia",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Bíblia JW" },
}

export const viewport: Viewport = {
  themeColor: "#1a56a4",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
