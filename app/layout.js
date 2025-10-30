import './globals.css'

export const metadata = {
  title: 'Study DApp - On-Chain Learning Tracker',
  description: 'Track your learning journey on the blockchain',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
