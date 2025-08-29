import type { Metadata } from 'next'
import { ArrowRight, BarChart3, Target, Rocket, CheckCircle2, MapPin, RefreshCw, Layers, FileText, Gauge } from 'lucide-react'
import PricingNote from '@/components/PricingNote'

export const metadata: Metadata = {
	title: 'Google Ads Management | Your Agency Name',
	description: 'Drive qualified traffic and measurable ROI. Management fee: 10% of monthly ad spend.',
	openGraph: {
		title: 'Google Ads Management | Your Agency Name',
		description: 'Google Ads management for small businesses focused on measurable ROI.',
		type: 'website'
	}
}

export default function GoogleAdsPage() {
	return (
		<main className="min-h-screen">
			{/* SEO: JSON-LD Service schema */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'Service',
						name: 'Google Ads Management',
						description: 'Google Ads management for small businesses.',
						provider: {
							'@type': 'Organization',
							name: 'Your Agency Name'
						},
						areaServed: 'US',
						serviceType: 'Advertising',
						priceSpecification: {
							'@type': 'PriceSpecification',
							priceCurrency: 'USD',
							description: 'percentage: 10%'
						}
					})
				}}
			/>

			{/* Hero */}
			<section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl">
						<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
							Google Ads Management for Small Businesses
						</h1>
						<p className="text-xl text-gray-700 mb-8">
							Drive qualified traffic and measurable ROI with expert campaign strategy, setup, and ongoing optimization.
						</p>
						<div className="flex flex-col sm:flex-row gap-3 motion-reduce:transition-none">
							<a href="/start" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200">
								Start a Project
								<ArrowRight className="ml-2 w-5 h-5" />
							</a>
							<a href="#pricing" className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-800 font-semibold rounded-lg hover:border-gray-400 transition-all duration-200">View Pricing</a>
						</div>
					</div>
				</div>
			</section>

			{/* Capabilities */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-gray-900 mb-10">What We Do</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{ icon: Target, label: 'Account setup & structure' },
							{ icon: BarChart3, label: 'Conversion tracking' },
							{ icon: Layers, label: 'Keyword & RSA ad creation' },
							{ icon: FileText, label: 'Ad assets (sitelinks/callouts)' },
							{ icon: CheckCircle2, label: 'Negative keywords' },
							{ icon: Rocket, label: 'Landing-page alignment' },
							{ icon: MapPin, label: 'Geo & schedule controls' },
							{ icon: Gauge, label: 'Performance Max' },
							{ icon: RefreshCw, label: 'Remarketing' },
							{ icon: BarChart3, label: 'Budgets & pacing' },
							{ icon: FileText, label: 'Reporting' }
						].map((item, i) => (
							<div
								key={i}
								className="group rounded-xl border border-gray-200 p-5 hover:shadow-md transition-[transform,opacity] duration-200 will-change-transform motion-reduce:transition-none"
								style={{
									transitionDuration: '200ms'
								}}
							>
								<item.icon className="w-6 h-6 text-primary mb-3 opacity-90 group-hover:opacity-100 motion-reduce:opacity-100" />
								<div className="font-medium text-gray-900">{item.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Best-practice playbook */}
			<section className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-gray-900 mb-6">Our Best‑Practice Playbook</h2>
					<p className="text-gray-700 max-w-3xl">
						We implement Google‑recommended practices: Conversion tracking (Ads/GA4/GTM), themed ad groups with relevant ad copy, Quality Score fundamentals (ad relevance, expected CTR, landing‑page experience), Responsive Search Ads with multiple headlines/descriptions, ad assets for richer SERP coverage, Performance Max with audience signals and sufficient ramp time, and Smart Bidding options (tCPA/tROAS) where appropriate.
					</p>
				</div>
			</section>

			{/* Process */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-gray-900 mb-10">How We Work</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						{[
							{ step: 'Audit', desc: 'Review current account, site, and goals' },
							{ step: 'Build', desc: 'Structure campaigns, ad groups, and assets' },
							{ step: 'Launch', desc: 'Deploy with proper tracking and QA' },
							{ step: 'Optimize', desc: 'Iterate on bids, queries, and creative' }
						].map((s, i) => (
							<div key={i} className="rounded-xl border border-gray-200 p-5">
								<div className="text-sm uppercase tracking-wide text-gray-500">Step {i + 1}</div>
								<div className="text-xl font-semibold text-gray-900">{s.step}</div>
								<p className="mt-2 text-gray-700">{s.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Pricing */}
			<section id="pricing" className="py-16 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">Pricing</h2>
					<div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
						<div className="text-xl font-semibold text-gray-900">Management fee: 10% of monthly ad spend.</div>
						<PricingNote />
						<div className="mt-6">
							<a href="/start" className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
								Start a Project
								<ArrowRight className="ml-2 w-5 h-5" />
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-gray-900 mb-8">FAQ</h2>
					<div className="space-y-6">
						<div>
							<div className="font-semibold text-gray-900">What is the contract term?</div>
							<p className="text-gray-700">Month-to-month. Cancel anytime.</p>
						</div>
						<div>
							<div className="font-semibold text-gray-900">What budgets do you recommend?</div>
							<p className="text-gray-700">We typically recommend starting from $1,000–$3,000/month depending on market and goals.</p>
						</div>
						<div>
							<div className="font-semibold text-gray-900">How often do you report?</div>
							<p className="text-gray-700">We provide monthly reporting and check-ins, with on-demand updates available.</p>
						</div>
					</div>
					<div className="mt-10 flex flex-col sm:flex-row gap-3">
						<a href="/start" className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">Start a Project</a>
						<a href="mailto:hello@youragency.com" className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-800 font-semibold rounded-lg hover:border-gray-400 transition-colors">Email Us</a>
					</div>
				</div>
			</section>
		</main>
	)
}


