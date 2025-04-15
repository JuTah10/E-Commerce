import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';
import FeaturedSlider from '../components/FeaturedSlider';

import { CreditCard, Truck, Box, Heart } from "lucide-react"

import { useProductStore } from '../store/useProductStore';

function HomePage() {
  const navigate = useNavigate();

  const { products, fetchFeaturedProducts } = useProductStore();

  React.useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts])

  return (
    <>
      {/* Wallpaper / Intro */}
      <div className='absolute top-0 left-0 w-full h-screen z-[-1]'>
        <img
          src="/images/homePagewallpaper.avif"
          alt='wallpaper'
          className='object-cover w-full h-full' />
      </div>

      <section className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-white transition-all duration-300 ease-in-out -translate-y-16">
        <h1 className='font-pacifico md:text-3xl sm:text-2xl'> WELCOME TO VNWear
        </h1>
        <h1 className='font-pacifico'>Naturally Styled. Authentically You.</h1>
        {/* <button className='mt-5' onClick={() => navigate("/shop")}>Shop Now</button> */}
      </section>

      {/* Actual content */}


      <section className="max-w-7xl mx-auto py-16 flex flex-col gap-4 justify-evenly items-center lg:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className='w-full h-full md:w-1/6 flex flex-col justify-center items-center rounded-full'>
          <CreditCard color='white' size={60} className='m-5 p-3 bg-[rgb(59,91,53)] rounded-full' />
          <div className='text-center'>
            <div className='font-medium text-xl'>Secure Payment</div>
            <div className='text-gray-500'>Elementum feugiat diam</div>
          </div>

        </motion.div >


        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className='w-full h-full sm:w-1/6 flex flex-col justify-center items-center rounded-full'>
          <Truck color='white' size={60} className='m-5 p-3 bg-[rgb(59,91,53)] rounded-full' />
          <div className='text-center'>
            <div className='font-medium text-xl'>Free Shipping</div>
            <div className='text-gray-500'>For $50 order</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          className='w-full h-full sm:w-1/6 flex flex-col justify-center items-center rounded-full'>
          <Box color='white' size={60} className='m-5 p-3 bg-[rgb(59,91,53)] rounded-full' />
          <div className='text-center'>
            <div className='font-medium text-xl'>Delivered with Care</div>
            <div className='text-gray-500'>Lacinia pellentesque leo</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          className='w-full h-full sm:w-1/6 flex flex-col justify-center items-center rounded-full'>
          <Heart color='white' size={60} className='m-5 p-3 bg-[rgb(59,91,53)] rounded-full' />
          <div className='text-center'>
            <div className='font-medium text-xl'>Excellent Service</div>
            <div className='text-gray-500'>Blandit gravida viverra</div>
          </div>
        </motion.div>
      </section>

      <hr className='max-w-[80%] 2xl:max-w-7xl mx-auto border-t-emerald-500' />
      <section className='max-w-7xl mx-auto py-16 flex flex-col justify-center items-center'>
        <h1 className='font-pacifico md:text-3xl sm:text-2xl'>Feature Product</h1>
        {/* slide featured section */}
        <FeaturedSlider products={products} />
      </section>

    </>
  )
}

export default HomePage
// object-cover w-full h-full absolute top-0 left-0 w-full h-screen z-[-1]