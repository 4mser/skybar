'use client'
import Link from 'next/link';
import Image from 'next/image'

import { usePathname } from "next/navigation"


const Logo = () => {
  const pathname = usePathname()
  return (
    <Link href={'/'}>
        <Image
            src={'/images/skybar.png'}
            alt='logo'
            width={160}
            height={40}
            className=''
        />
    </Link>
  )
}

export default Logo