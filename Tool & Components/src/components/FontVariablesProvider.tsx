'use client'

import { ReactNode } from 'react'
import {
  Inter,
  Playfair_Display,
  Poppins,
  Montserrat,
  Raleway,
  Nunito,
  Lato,
  Quicksand,
  Merriweather,
  Lora,
  Roboto_Slab,
  Comic_Neue,
} from 'next/font/google'

// Load preview fonts only when this component is mounted (Style & Colors step).
// Keep weights minimal for previews and enable swap for fast display.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-playfair', display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-poppins', display: 'swap' })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-montserrat', display: 'swap' })
const raleway = Raleway({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-raleway', display: 'swap' })
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-nunito', display: 'swap' })
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato', display: 'swap' })
const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-quicksand', display: 'swap' })
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather', display: 'swap' })
const lora = Lora({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lora', display: 'swap' })
const robotoSlab = Roboto_Slab({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-roboto-slab', display: 'swap' })
const comicNeue = Comic_Neue({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-comic-neue', display: 'swap' })

export default function FontVariablesProvider({ children }: { children: ReactNode }) {
  const cls = [
    inter.variable,
    playfair.variable,
    poppins.variable,
    montserrat.variable,
    raleway.variable,
    nunito.variable,
    lato.variable,
    quicksand.variable,
    merriweather.variable,
    lora.variable,
    robotoSlab.variable,
    comicNeue.variable,
  ].join(' ')

  return <div className={cls}>{children}</div>
}


