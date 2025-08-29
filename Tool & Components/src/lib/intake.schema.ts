import { z } from "zod";

export const IntakeSchema = z.object({
  business_name: z.string().min(2),
  industry: z.string().min(2),
  address: z.string().min(1),
  phone: z.string().min(7),
  domain: z.string().url().optional(),

  goals: z.array(z.enum(["Calls","Bookings","Orders","Lead Form","not_sure"])).min(1),
  pages: z.array(z.enum(["Home","Services","Blog","Products","About","Contact","Menu","not_sure"])).min(1),

  color: z.object({
    selected: z.string(),
    mode: z.enum(["Complementary","Analogous","Split","Triad","Tetrad","Monochrome","Monochrome Tints"]),
    palette: z.array(z.string())
  }),
  typography: z.object({
    headings: z.string(),
    body: z.string(),
    style: z.string().optional()
  }),

  templates: z.array(z.enum(["Style A","Style B"])).min(1),
  inspiration_urls: z.array(z.string().url()).max(2).optional(),

  features: z.array(z.enum([
    "Booking","Gift Cards","Gallery","FAQ","Hours","Chat",
    "Menu Catalog","Testimonials","Blog","Map","Contact Form","Analytics"
  ])).optional(),

  timeline: z.string().optional(),
  plan: z.string().optional(),

  organization: z.object({
    name: z.string().min(2),
    website: z.string().url().optional(),
    phone: z.string().optional(),
    address: z.string().min(1).optional(),
    domain: z.string().optional()
  }),

  turnstileToken: z.string()
});

export type IntakePayload = z.infer<typeof IntakeSchema>;
