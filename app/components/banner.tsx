
'use client'
import Link from 'next/link'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

export default function Banner() {
  return (
   
    <main className='absolute top-[50px] left-0 w-full overflow-hidden'>
        <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={false}
        modules={[Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
            <Link href={'/tragos'} >
                <div className='h-12 w-full bg-gradient-to-r from-teal-500 to-cyan-500 flex justify-center gap-2 px-4 py-2 items-center  '>

                    <p>Conoce los tragos de autor</p>
                    <Image width={30} height={30} src="/icons/cocktail-glass.svg" alt="" className='w-6' />

                </div>
            </Link>
        </SwiperSlide>
        
        <SwiperSlide>
            <Link href={'/sushi'} >
                <div className='h-12 w-full bg-gradient-to-r from-cyan-500 to-indigo-500 flex justify-center gap-2 px-4 py-2 items-center  '>

                    <p>Explora la nueva barra de sushi</p>
                    <Image width={30} height={30} src="/icons/sushi.svg" alt="" className='w-6' />
                    <p>{`->`}</p>

                </div>
            </Link>
        </SwiperSlide>

        

        <SwiperSlide>
            <Link href={'/carta'} >
                <div className='h-12 w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex justify-center gap-2 px-4 py-2 items-center  '>

                    <p>Descubre nuevos sabores</p>
                    <Image width={30} height={10} src="/icons/spaghetti.svg" alt="" className='w-6' />

                </div>
            </Link>
        </SwiperSlide>

        <SwiperSlide>
            <Link href={'/carta'} >
                <div className='h-12 w-full bg-gradient-to-r from-fuchsia-500 to-red-800 flex justify-center gap-2 px-4 py-2 items-center  '>

                    <p>Date un gusto con nuestros postres</p>
                    <Image width={30} height={10} src="/icons/pie.svg" alt="" className='w-6' />

                </div>
            </Link>
        </SwiperSlide>

        <SwiperSlide>
            <Link href={'/carta'} >
                <div className='h-12 w-full bg-gradient-to-r from-lime-600 to-green-900 flex justify-center gap-2 px-4 py-2 items-center  '>

                    <p>Conoce nuestro menú vegano</p>
                    <Image width={30} height={30} src="/icons/vegan.svg" alt="" className='w-6' />

                </div>
            </Link>
        </SwiperSlide>
      </Swiper>
    </main>
    
  );
}
