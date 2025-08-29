export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <div className="border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-10 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>&copy; 2025 BiteSites. All rights reserved.</div>
        <nav aria-label="Footer" className="flex items-center gap-4">
          <a href="/" className="hover:underline">Home</a>
          <a href="/about" className="hover:underline">About</a>
          <a href="/pricing" className="hover:underline">Pricing</a>
          <a href="/start" className="hover:underline">Start a Project</a>
        </nav>
      </div>
    </div>
  )
}


