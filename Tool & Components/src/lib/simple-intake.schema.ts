import { z } from "zod";

export const simpleIntakeSchema = z.object({
	name: z.string().min(2, "Name is required"),
	company: z.string().min(2, "Company is required"),
	role: z.enum(["owner", "manager", "employee", "investor", "other"]),
	email: z.string()
		.min(1, "Email is required")
		.refine((email) => email.includes('@'), "Email must contain @ symbol")
		.refine((email) => email.includes('.'), "Email must contain a domain (.)")
		.refine((email) => email.indexOf('@') < email.lastIndexOf('.'), "Invalid email format"),
	phone: z.string()
		.min(1, "Phone number is required")
		.refine((phone) => {
			// Remove all non-digit characters and check if it's at least 10 digits
			const digitsOnly = phone.replace(/\D/g, '');
			return digitsOnly.length >= 10;
		}, "Phone number must be at least 10 digits")
		.refine((phone) => {
			// Check if it contains only valid phone characters
			return /^[\d\s\(\)\-\+\.\-]+$/.test(phone);
		}, "Phone number contains invalid characters"),
	urgency: z.enum(["soon", "no_rush"]),
	turnstileToken: z.string().optional()
});

export type SimpleIntake = z.infer<typeof simpleIntakeSchema>;


