import './globals.css'

export const metadata = {
  title: 'Daily MoMA Art',
  description: 'Discover a new piece of art from MoMA\'s collection every day',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
