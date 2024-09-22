
'use client'
import Link from 'next/link'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Cartas() {
  return (
   
    <main className='pt-3 left-0 w-full overflow-hidden px-4'>
        <p className='py-2 font-semibold'>Menús principales</p>
        <Swiper
        spaceBetween={10}
        slidesPerView={2.5}
        centeredSlides={false}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        className="mySwiper"
      >
        

        

        <SwiperSlide >
          <Link href={'/menu'}>
            <div className='overflow-hidden  rounded-lg shadow-md  from-cyan-300 to-cyan-600'>
              <img src="/images/comida.jpg" alt="" className='w-full h-full object-cover rounded-md' />
            </div>
            <p className='text-xs font-extralight py-1 '>Menú</p>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href={'/tragos'}>
            <div className='overflow-hidden  rounded-lg shadow-md  from-red-600 to-red-800'>
              <img src="/images/tragos2.png" alt="" className='w-full h-full object-cover rounded-md scale-105' />
            </div>
            <p className='text-xs font-extralight py-1 '>Tragos</p>
          </Link>
        </SwiperSlide>

        <SwiperSlide >
          <Link href={'/room'}>
            <div className='overflow-hidden rounded-lg  shadow-md   from-yellow-300 to-green-200'>

              <img src="/images/room.jpeg" alt="" className='w-full h-full object-cover rounded-md' />
            </div>
            <p className='text-xs font-extralight py-1 '>Room Service</p>
          </Link>
        </SwiperSlide>

      </Swiper>
    </main>

);
}
