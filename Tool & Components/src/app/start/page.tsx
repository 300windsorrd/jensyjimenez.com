import { Metadata } from 'next'
import SimpleIntakeForm from '@/components/SimpleIntakeForm'

export const metadata: Metadata = {
	title: 'Start a Project | Your Agency Name',
	description: 'Kick off your project with our quick intake form.'
}

export default function StartPage() {
	return (
		<div className="min-h-screen py-16">
			<div className="container mx-auto px-4">
				<h1 className="text-4xl font-bold text-gray-900 mb-6">Start a Project</h1>
				<p className="text-gray-700 mb-10 max-w-2xl">Tell us about your business, goals, and preferences. We’ll follow up with a clear plan and next steps.</p>
				<SimpleIntakeForm />
			</div>
		</div>
	)
}


