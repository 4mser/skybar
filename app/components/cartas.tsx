'use client'
import Image from 'next/image';
import Link from 'next/link';

export default function Cartas() {
  return (
    <main className='pt-3 left-0 w-full '>
      <p className='px-4 py-2 font-semibold'>Menús principales</p>

      {/* Contenedor con overflow-x y desplazamiento suave */}
      <div className="overflow-x-auto flex space-x-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-4">
        {/* Menú */}
        <div className="w-[38%] snap-center shrink-0">
          <Link href={'/menu'}>
            <div className='overflow-hidden rounded-lg shadow-md from-cyan-300 to-cyan-600'>
              <Image width={700} height={800} src="/images/comida.jpg" alt="Comida" className='w-full h-48 object-cover rounded-md' />
            </div>
            <p className='text-xs font-extralight py-1'>Menú</p>
          </Link>
        </div>

        {/* Tragos */}
        <div className="w-[38%] snap-center shrink-0">
          <Link href={'/tragos'}>
            <div className='overflow-hidden rounded-lg shadow-md from-red-600 to-red-800'>
              <Image width={700} height={800} src="/images/tragos2.png" alt="Tragos" className='w-full h-48 object-cover rounded-md scale-105' />
            </div>
            <p className='text-xs font-extralight py-1'>Tragos</p>
          </Link>
        </div>

        {/* Room Service */}
        <div className="w-[38%] snap-center shrink-0">
          <Link href={'/room'}>
            <div className='overflow-hidden rounded-lg shadow-md from-yellow-300 to-green-200'>
              <Image width={700} height={800} src="/images/room.jpeg" alt="Room Service" className='w-full h-48 object-cover rounded-md' />
            </div>
            <p className='text-xs font-extralight py-1'>Room Service</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
