'use client'

import { Info } from 'lucide-react'

export default function PricingNote() {
	return (
		<div className="mt-4 inline-flex items-start gap-2 text-sm text-gray-600">
			<Info className="w-4 h-4 mt-0.5 text-gray-500" />
			<p>
				Management fee: 10% of monthly ad spend. <span className="block sm:inline">Ad spend is paid directly to Google; our fee is billed monthly.</span>
			</p>
		</div>
	)
}


