'use client'

import { useEffect, useState } from 'react'
import './ThemeToggle.css'

interface ThemeToggleProps {
	className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		if (typeof document === 'undefined') return
		const root = document.documentElement
		const sync = () => setIsDark(root.dataset.theme ? root.dataset.theme === 'dark' : root.classList.contains('dark'))
		sync()
		const observer = new MutationObserver(sync)
		observer.observe(root, { attributes: true, attributeFilter: ['data-theme', 'class'] })
		return () => observer.disconnect()
	}, [])

	const setTheme = (dark: boolean) => {
		if (typeof document === 'undefined') return
		const root = document.documentElement
		root.classList.add('theme-switching')
		const next = dark ? 'dark' : 'light'
		root.dataset.theme = next
		root.style.colorScheme = dark ? 'dark' : 'light'
		if (dark) root.classList.add('dark')
		else root.classList.remove('dark')
		setIsDark(dark)
		try { localStorage.setItem('theme', next) } catch {}
		requestAnimationFrame(() => root.classList.remove('theme-switching'))
	}

	return (
		<button
			id="theme-toggle"
			className={`theme-toggle-icon ${className}`}
			aria-label="Toggle dark mode"
			aria-pressed={isDark}
			title="Toggle theme"
			data-background-customization="true"
			onClick={() => setTheme(!isDark)}
		>
			<svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
				<defs>
					<radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#ffe066"/>
						<stop offset="60%" stopColor="#ffca3a"/>
						<stop offset="100%" stopColor="#ffb703"/>
					</radialGradient>
					<radialGradient id="moonGrad" cx="50%" cy="45%" r="60%">
						<stop offset="0%" stopColor="#dbe3ff"/>
						<stop offset="70%" stopColor="#a8b6ff"/>
						<stop offset="100%" stopColor="#7e8df4"/>
					</radialGradient>
				</defs>
				<g className="sun">
					<circle className="sun-core" cx="12" cy="12" r="5" fill="url(#sunGrad)" />
					<g className="sun-rays">
						<line x1="12" y1="1"  x2="12" y2="4"/>
						<line x1="12" y1="20" x2="12" y2="23"/>
						<line x1="1"  y1="12" x2="4"  y2="12"/>
						<line x1="20" y1="12" x2="23" y2="12"/>
						<line x1="4.2" y1="4.2" x2="6.6" y2="6.6"/>
						<line x1="17.4" y1="17.4" x2="19.8" y2="19.8"/>
						<line x1="4.2" y1="19.8" x2="6.6" y2="17.4"/>
						<line x1="17.4" y1="6.6"  x2="19.8" y2="4.2"/>
					</g>
				</g>
				<g className="moon">
					<circle className="moon-core" cx="12" cy="12" r="5" fill="url(#moonGrad)" />
					<circle className="moon-bite" cx="14" cy="10" r="5"></circle>
				</g>
			</svg>
		</button>
	)
}


