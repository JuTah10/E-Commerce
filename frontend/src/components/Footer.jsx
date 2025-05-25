import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

export default function Footer() {
    const navigate = useNavigate();
    return (
        <div className='mt-11'>
            <div className='relative'>
                <img
                    className='max-h-[394.41px] w-full object-cover'
                    style={{ objectPosition: "center 20%" }}
                    src="https://res.cloudinary.com/dc3gnvd4e/image/upload/v1748097618/footerWallPaper_gbd5bi.webp"
                    alt="Footer Wallpaper" />
                <div className='flex flex-col gap-4 w-full absolute top-[20%] sm:top-[30%] text-center text-white'>
                    <h1 className='text-4xl font-bold'>Ready to Find your Perfect Clothes?</h1>
                    <div className='max-w-[400px] mx-auto'>
                        Browse our online store or visit us in person to experience the beauty of fashion.
                    </div>

                    <button
                        onClick={() => navigate("/shop")}
                        className={`w-[200px] mx-auto bg-lime-600 text-white py-3 px-4 rounded-full hover:bg-lime-700 transition-all duration-500 flex justify-center items-center text-sm`}
                    >
                        Shop Now
                    </button>
                </div>
            </div>
            <div className="max-w-7xl mt-5 border-b mx-auto flex flex-col sm:flex-row justify-between items-center px-4 md:px-8 py-6 gap-2">
                <Link
                    to="/"
                    className="w-[20%] sm:w-[10%] text-xl font-bold items-center space-x-2 flex font-pacifico cursor-pointer hover:text-lime-600"
                >
                    VNWear
                </Link>

                <div className='w-[50%] sm:w-[25%] flex gap-4 justify-center items-center'>
                    <Link to="/" className='hover:text-lime-600'>Home</Link>
                    <Link to="/shop" className='hover:text-lime-600'>Shop</Link>
                    <Link to="/about" className='hover:text-lime-600'>About</Link>
                    <Link to="/contact" className='hover:text-lime-600'>Contact</Link>
                </div>

                <div className='w-[30%] sm:w-[10%] flex justify-between items-center'>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }}
                        href="#"
                    >
                        <FaFacebook className='hover:text-lime-600' />
                    </a>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }}
                        href="#"
                    >
                        <FaInstagram className='hover:text-lime-600' />
                    </a>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }}
                        href="#"
                    >
                        <FaYoutube className='hover:text-lime-600' />
                    </a>
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                        }}
                        href="#"
                    >
                        <FaTwitter className='hover:text-lime-600' />
                    </a>
                </div>
            </div>
            <div className="max-w-7xl mx-auto my-5 text-center text-gray-700">
                Copyright © 2025 Vu Nguyen eCommerce
            </div>
        </div>
    )
}
