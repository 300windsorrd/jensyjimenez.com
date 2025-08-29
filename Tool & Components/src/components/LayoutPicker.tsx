'use client'

import { useMemo, useRef, useState, useEffect } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useBackground } from '@/contexts/BackgroundContext'
import GradientText from '@/TextAnimations/GradientText/GradientText'
import '@/TextAnimations/GradientText/GradientText.css'
import { Fredoka } from 'next/font/google'

const fredoka = Fredoka({
	subsets: ['latin'],
	weight: ['400', '600', '700'],
	variable: '--font-fredoka',
	display: 'swap',
})

export type FeaturesLayout = 'grid' | 'magic-bento' | 'scroll-stack' | 'chroma-grid'

interface LayoutPickerProps {
	current: FeaturesLayout
	onPick: (layout: FeaturesLayout) => void
}

const COLLAPSE_AFTER_MS = 250

export default function LayoutPicker({ current, onPick }: LayoutPickerProps) {
	const { getButtonColor, getButtonTextColor } = useBackground()
	const [expanded, setExpanded] = useState(false)
	const collapseTimerRef = useRef<number | null>(null)

	useEffect(() => () => {
		if (collapseTimerRef.current) window.clearTimeout(collapseTimerRef.current)
	}, [])

	const buttonStyles = useMemo(() => ({
		backgroundColor: getButtonColor(),
		color: getButtonTextColor(),
		borderColor: getButtonColor(),
	}), [getButtonColor, getButtonTextColor])

	const options: ReadonlyArray<{ value: FeaturesLayout; label: string }> = useMemo(
		() => [
			{ value: 'grid', label: 'Grid' },
			{ value: 'magic-bento', label: 'Magic Bento' },
			{ value: 'scroll-stack', label: 'Scroll Stack' },
			{ value: 'chroma-grid', label: 'Chroma Grid' },
		],
		[]
	)

	const handlePick = (value: FeaturesLayout) => {
		onPick(value)
		if (collapseTimerRef.current) window.clearTimeout(collapseTimerRef.current)
		collapseTimerRef.current = window.setTimeout(() => setExpanded(false), COLLAPSE_AFTER_MS) as unknown as number
	}

	return (
		<LayoutGroup id="layout-picker">
			<div className="w-full flex items-center justify-center">
				<AnimatePresence initial={false} mode="wait">
					{!expanded ? (
						<motion.button
							key="lp-min"
							layoutId="lp-toggle"
							aria-expanded={false}
							aria-controls="layout-options"
							onClick={() => setExpanded(true)}
							className="px-6 py-3 rounded-full border text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
							style={{ ...buttonStyles }}
							initial={{ opacity: 0.95 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.18 }}
						>
							<div className={`${fredoka.className}`}>
								<GradientText animationSpeed={6}>Customize Layout</GradientText>
							</div>
						</motion.button>
					) : (
						<motion.div
							key="lp-exp"
							layoutId="lp-toggle"
							id="layout-options"
							className="rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 p-4"
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.96 }}
							transition={{ duration: 0.2 }}
						>
							<div className="flex items-center justify-center mb-3">
								<div className={`${fredoka.className} text-xl font-extrabold text-gray-800 text-center`}>
									<GradientText animationSpeed={6}>Customize Layout</GradientText>
								</div>
							</div>
							<div className="flex flex-wrap gap-2 justify-center">
								{options.map((opt) => {
									const isActive = opt.value === current
									return (
										<motion.button
											key={opt.value}
											type="button"
											onClick={() => handlePick(opt.value)}
											className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${isActive ? 'shadow-lg' : 'hover:shadow'} ${isActive ? '' : 'border-gray-300'}`}
											style={isActive ? buttonStyles : {}}
											aria-pressed={isActive}
											whileHover={isActive ? { scale: 1.03 } : { scale: 1.05, y: -1 }}
											whileTap={{ scale: 0.97 }}
										>
											<span className={isActive ? '' : 'text-gray-700'}>{opt.label}</span>
										</motion.button>
									)
								})}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</LayoutGroup>
	)
}


