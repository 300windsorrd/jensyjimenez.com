'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Header() {
	const [isScrolled, setIsScrolled] = useState(false)

	useEffect(() => {
		function onScroll() {
			setIsScrolled(window.scrollY > 4)
		}
		onScroll()
		window.addEventListener('scroll', onScroll)
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<header className={`sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 ${isScrolled ? 'border-b border-gray-200' : ''}`}>
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<Link href="/" className="font-semibold text-gray-900">Your Agency</Link>
				<nav className="hidden md:flex items-center gap-6 text-gray-700">
					<Link href="/google-ads" className="hover:text-gray-900 transition-colors">Google Ads</Link>
					<a href="/#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
				</nav>
				<div className="flex items-center gap-3">
					<Link href="/start" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
						Start a Project
					</Link>
				</div>
			</div>
		</header>
	)
}


