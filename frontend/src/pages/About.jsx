import React from 'react'
import { motion } from 'framer-motion'
import { FiBox } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

import { coreValue } from '@/constants/coreValue';

export default function About() {
  return (
    <div>
      {/* Subtle background image */}
      <img
        src="https://res.cloudinary.com/dc3gnvd4e/image/upload/v1748096936/AboutPageWallPaper_rhedgo.png"
        alt=""
        className="absolute top-0 left-0 w-full h-[calc(100%-28.5rem)] z-[-1]"
      />

      <div className="max-w-7xl mt-20 mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left image side */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ amount: 0.2 }}
        >
          <img
            src="https://res.cloudinary.com/dc3gnvd4e/image/upload/v1748097002/AboutPage1_ukj1xi.webp"
            alt=""
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Right text side */}
        <motion.div
          className="text-white space-y-6"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ amount: 0.2 }}
        >
          <div>
            <h1 className="font-pacifico text-4xl mb-2">About</h1>
            <h2 className="font-pacifico text-2xl">
              We are Passionate About Our Work
            </h2>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              We strive to provide our customers with the highest quality
            </h3>
            <p className="leading-relaxed">
              <span className="font-pacifico">VNTTWear</span> was founded in 1960
              by a group of fashion enthusiasts who recognized the positive impact
              that great style can have on our lives. Whether it’s boosting
              confidence, expressing individuality, or simply adding a touch of
              beauty to your everyday look, clothing is more than just
              fabric—it’s a lifestyle.
            </p>
          </div>

          <hr className="border-t border-gray-300 opacity-50" />

          <div className="space-y-2">
            <p className="italic text-lg">
              “We love what we do & create partnerships with our clients to ensure
              their digital transformation is positioned for long-term success.”
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <img
                  className='rounded-full object-cover'
                  src="https://avatars.githubusercontent.com/u/126214032?v=4"
                  alt="CEO VU" />

              </div>
              <div>
                <div className="font-semibold">Vu Nguyen</div>
                <div className="text-sm text-gray-300">CEO & Co-founder @ 2 people company</div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                 <img
                  className='rounded-full object-cover'
                  src="https://thumbs.dreamstime.com/b/vector-illustration-depicts-young-male-programmer-engaged-laptop-wearing-glasses-emphasizing-coding-346344547.jpg"
                  alt="CEO VU" />
              </div>
              <div>
                <div className="font-semibold">Tung Tran</div>
                <div className="text-sm text-gray-300">Vu Nguyen's Boss & Co-founder @ 2 people company</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="border-y border-green-600  py-40 flex justify-center items-center text-white"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0 }}
        viewport={{ amount: 0.2 }}
      >
        <div className="max-w-7xl w-full px-6 ">
          <h1 className="text-center text-3xl font-pacifico mb-12 ">
            Our Core Values that Drive Everything We Do
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {coreValue.map(({ title, description }, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <FiBox size={40} className="text-green-400 flex" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{title}</h3>
                  <p className="text-sm ">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mt-20 mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left text side */}
        <motion.div
          className="text-white space-y-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ amount: 0.2 }}
        >
          <div>
            <h1 className="font-pacifico text-4xl mb-2">Our mission</h1>
          </div>

          <div className="space-y-4">
            <p className="leading-relaxed">
              Our mission is to make the world a greener place, one plant at a time. We strive to provide our customers with the highest quality plants and plant care products, along with the knowledge and support to help them thrive.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2'>
            {["Quality and Variety",
              "Expert Guidance",
              "Sustainable Practices",
              "Experienced Team"].map((item) => {
                return (
                  <div className='flex items-center gap-2'>
                    <FaCheckCircle className='text-lime-600' />
                    <div>{item}</div>
                  </div>
                )
              })}
          </div>
        </motion.div>

        {/* Right image side */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ amount: 0.2 }}
        >
          <img
            src="https://res.cloudinary.com/dc3gnvd4e/image/upload/v1748097037/AboutPage2_a2rqqd.avif"
            alt=""
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </motion.div>
      </div>

    </div >

  )
}
