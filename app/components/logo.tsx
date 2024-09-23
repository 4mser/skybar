'use client'
import Link from 'next/link';
import Image from 'next/image'



const Logo = () => {
  return (
    <Link href={'/'}>
        <Image
            src={'/images/skybar.png'}
            alt='logo'
            width={160}
            height={40}
            className='-translate-y-[2px]'
        />
    </Link>
  )
}

export default Logo