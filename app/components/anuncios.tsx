
'use client'
import Link from 'next/link'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';


export default function Anuncios() {
  return (
   
    <main className='pt-[120px] left-0 w-full overflow-hidden px-4'>
        <Swiper
        spaceBetween={10}
        slidesPerView={1}
        centeredSlides={false}
        pagination={{
          clickable: true,
        }}
        /* autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }} */

        autoplay={false}
        navigation={false}
        modules={[Autoplay]}
        className="mySwiper"
      >
        

        <SwiperSlide>
          <Link href={'/carta'}>
            <div className='h-52 overflow-hidden rounded-lg  shadow-md  bg-gradient-to-br flex items-center from-zinc-800 to-transparent '>
                    <Image width={1200} height={800} src="/images/skybar.jpg" alt="" className='w-full h-full object-cover' />
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide >
          <Link href={'/tragos'}>
            <div className='h-52 overflow-hidden  rounded-lg shadow-md bg-gradient-to-br flex items-center  from-zinc-800 to-transparent '>
            <Image width={1200} height={800} src="/images/skybar2.jpg" alt="" className='w-full h-full object-cover' />
            </div>
          </Link>
        </SwiperSlide>

        <SwiperSlide>
          <Link href={'/sushi'}>
            <div className='h-52 overflow-hidden  rounded-lg shadow-md  bg-gradient-to-br flex items-center  from-zinc-800 to-transparent '>
            <Image width={1200} height={800} src="/images/skybar3.jpg" alt="" className='w-full h-full object-cover' />
            </div>
          </Link>
        </SwiperSlide>

      </Swiper>
    </main>

);
}
