import React from 'react'
import { motion } from "framer-motion"
import { Mail, Lock, MoveLeft, LoaderCircle } from "lucide-react"
import { useNavigate } from 'react-router-dom';

import { useUserStore } from '../store/useUserStore.js';

import { IoEyeSharp } from "react-icons/io5";
import { BsFillEyeSlashFill } from "react-icons/bs";

function LogInPage() {
    const navigate = useNavigate();
    const { loading, error, signIn } = useUserStore();

    const [switchPage, setSwitchPage] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    })
    const [password, setPassword] = React.useState(true);

    function handleSubmit(e) {
        e.preventDefault();
        signIn(formData);

    }
    return (
        <div className='min-h-[calc(100vh-5rem)] flex items-center justify-center bg-emerald-500'>
            <div className="bg-white rounded-lg p-8 flex w-11/12 max-w-4xl mx-auto">


                {/* for user sign up page */}

                <form onSubmit={handleSubmit} className='w-full md:w-1/2 flex flex-col items-center justify-center p-4 '>
                    <div className='w-full'>
                        <motion.div
                            initial={!switchPage ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
                            animate={!switchPage ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <h2 className='mt-36 mb-16 text-center text-3xl font-bold '>Member Login</h2>


                            <div className='space-y-4'>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none'>
                                        <Mail className="h-5 w-4 text-gray-400" aria-hidden
                                            ="true" />
                                    </div>
                                    <input
                                        type='text'
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className='block w-full py-4 pl-12 bg-gray-200 border border-white rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                                        placeholder='Email'
                                    />
                                </div>

                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none'>
                                        <Lock className="h-5 w-4 text-gray-400" aria-hidden
                                            ="true" />
                                    </div>
                                    <input
                                        type={`${password ? 'password' : 'text'}`}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className='block w-full py-4 pl-12 bg-gray-200 border border-white rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm '
                                        placeholder='Password'
                                    />
                                    <span
                                        onClick={() => setPassword(!password)}
                                        className='absolute right-2 inset-y-0  pr-3 flex items-center cursor-pointer opacity-25 hover:opacity-100'
                                    >
                                        {password ? <IoEyeSharp size={20} /> : <BsFillEyeSlashFill size={20} />}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={!switchPage ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                            animate={!switchPage ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={!switchPage ? { duration: 0.8, delay: 1.0 } : { duration: 0.8 }}
                        >
                            <div className={`${!error && "hidden"} flex justify-center items-center pt-5 text-red-600`}>{error}</div>
                            <button
                                className={`block w-full py-4 text-white ${loading ? "bg-gray-800" : "bg-green-400"} rounded-3xl shadow-md hover:bg-gray-800 sm:text-sm mt-6 mb-3 flex justify-center items-center disabled:opacity-50 `}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle size={20} className={loading && "animate-spin"} />
                                    </>
                                ) : (
                                    "Log In"
                                )}
                            </button>

                            {/* forget password and sign in */}
                            <div className='h-36 flex flex-col justify-between items-center sm:text-sm'>
                                <div className='text-gray-400'>Forgot Username / Password?</div>
                                <div className='text-gray-400'>
                                    <div
                                        onClick={() => {
                                            setSwitchPage(true);
                                            setTimeout(() => navigate("/signup"), 2000)
                                        }}
                                        className='text-gray-400 hover:text-green-500 cursor-pointer flex justify-center items-center gap-1'
                                    >
                                        <MoveLeft size={20} /> Create you Account
                                    </div>
                                </div>
                            </div>


                        </motion.div>
                    </div>
                </form>

                {/* for logo */}
                <motion.div className='hidden md:flex md:w-1/2 justify-center items-center '
                    initial={!switchPage ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                    animate={!switchPage ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={!switchPage ? { duration: 0.8 } : { duration: 0.8, delay: 1.0 }} //could include delay here to delay when it will show up
                >
                    <img src="https://res.cloudinary.com/dc3gnvd4e/image/upload/v1748097470/hoodiesSignInPage_pod1u9.webp" alt="Sneakers" className="h-full object-cover rounded-2xl" />
                </motion.div>

            </div >


        </div >
    )
}

export default LogInPage
