'use client'

import Image from 'next/image'
import darkNormal from '../../images/bg-removed/3.png'
import darkHover from '../../images/bg-removed/2.png'
import lightNormal from '../../images/bg-removed/7.png'
import lightHover from '../../images/bg-removed/8.png'

const LogoSwap = () => {
  return (
    <span className="logo-content" style={{ display: 'block', width: '100%', height: '100%' }}>
      <Image className="logo-img is-dark state-normal" src={darkNormal} alt="logo" fill sizes="120px" priority />
      <Image className="logo-img is-dark state-hover" src={darkHover} alt="logo hover" fill sizes="120px" priority />
      <Image className="logo-img is-light state-normal" src={lightNormal} alt="logo" fill sizes="120px" priority />
      <Image className="logo-img is-light state-hover" src={lightHover} alt="logo hover" fill sizes="120px" priority />
    </span>
  )
}

export default LogoSwap


