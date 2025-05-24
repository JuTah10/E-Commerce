import React, { useState, useRef } from 'react';
import { FaExternalLinkAlt, FaGithub, FaLinkedin } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
    const [activeCard, setActiveCard] = useState(null);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const leftCardRef = useRef(null);
    const rightCardRef = useRef(null);

    const handleCardClick = (card, ref) => {
        if (activeCard === card) {
            setActiveCard(null);
            return;
        }
        const rect = ref.current.getBoundingClientRect();
        setCardPosition({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });
        setActiveCard(card);
    };

    const handleOverlayClick = () => {
        setActiveCard(null);
    };

    return (
        <div className='max-w-7xl mt-10 mx-auto px-6 py-12 relative'>
            <h1 className='font-pacifico md:text-3xl sm:text-2xl text-center mb-12'>Contact Us</h1>

            {/* Backdrop overlay */}
            <AnimatePresence>
                {activeCard && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 cursor-pointer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleOverlayClick}
                    />
                )}
            </AnimatePresence>

            <div className='flex flex-wrap justify-center gap-8 relative'>

                {/* Left Card Placeholder */}
                <div ref={leftCardRef} className='relative w-full md:w-[30%] h-[500px]'>
                    <motion.div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick('left', leftCardRef);
                        }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            scale: { duration: 0.3 },
                        }}
                        className='relative w-full h-full bg-cover bg-center text-white shadow-xl rounded-lg cursor-pointer'
                        style={{ backgroundImage: 'url(https://res.cloudinary.com/dc3gnvd4e/image/upload/v1748097815/ContactPage_omnuju.png)' }}
                    >
                        <div className='absolute inset-0 bg-black bg-opacity-50 rounded-lg'></div>
                        <div className='relative z-10 flex flex-col items-center justify-center h-full p-6 text-center'>
                            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mb-4">
                                <img
                                    className='w-full h-full object-cover'
                                    src="https://avatars.githubusercontent.com/u/126214032?v=4"
                                    alt="CEO VU"
                                />
                            </div>
                            <div className='max-w-full max-h-32 overflow-y-auto break-words mb-4'>
                                <div className='font-bold'>Name: Vu Nguyen</div>
                                <p>I worked on frontend customer's user-experiences, creating APIs, handling backend logic, and designing database structures.</p>
                            </div>
                            <div className='flex flex-col gap-2 text-sm'>
                                <div className='flex items-center gap-2'>
                                    <FaExternalLinkAlt /> Website
                                </div>
                                <div className='flex items-center gap-2'>
                                    <MdOutlineEmail /> Email
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaLinkedin /> LinkedIn
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaGithub /> GitHub
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Card Placeholder */}
                <div ref={rightCardRef} className='relative w-full md:w-[30%] h-[500px]'>
                    <motion.div
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick('right', rightCardRef);
                        }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.2,
                            scale: { duration: 0.3 },
                        }}
                        style={{ backgroundImage: 'url(https://res.cloudinary.com/dc3gnvd4e/image/upload/v1748097815/ContactPage_omnuju.png)' }}
                        className='relative w-full h-full text-white shadow-xl rounded-lg cursor-pointer flex flex-col items-center justify-center'
                    >
                        <div className='absolute inset-0 bg-green-700 bg-opacity-50 rounded-lg'></div>
                        <div className='relative z-10 flex flex-col items-center justify-center h-full p-6 text-center'>
                            <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mb-4">
                                <img
                                    className='w-full h-full object-cover'
                                    src="https://thumbs.dreamstime.com/b/vector-illustration-depicts-young-male-programmer-engaged-laptop-wearing-glasses-emphasizing-coding-346344547.jpg"
                                    alt="CEO VU"
                                />
                            </div>
                            <div className='max-w-full max-h-32 overflow-y-auto break-words mb-4'>
                                <div className='font-bold'>Name: Tung Tran</div>
                                <p>I worked on: Full-stack projects, interactive web apps, and many other cool systems!</p>
                            </div>
                            <div className='flex flex-col gap-2 text-sm'>
                                <div className='flex items-center gap-2'>
                                    <FaExternalLinkAlt /> Website
                                </div>
                                <div className='flex items-center gap-2'>
                                    <MdOutlineEmail /> Email
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaLinkedin /> LinkedIn
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaGithub /> GitHub
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Active Card */}
                <AnimatePresence>
                    {activeCard && (
                        <motion.div
                            className='fixed bg-cover bg-center text-white shadow-xl rounded-lg z-50'
                            style={{
                                top: cardPosition.top,
                                left: cardPosition.left,
                                width: cardPosition.width,
                                height: cardPosition.height,
                                backgroundImage:

                                    'url(https://res.cloudinary.com/dc3gnvd4e/image/upload/v1748097815/ContactPage_omnuju.png)'
                                ,
                            }}
                            initial={{
                                top: cardPosition.top,
                                left: cardPosition.left,
                                width: cardPosition.width,
                                height: cardPosition.height,
                            }}
                            animate={{
                                top: '50%',
                                left: '50%',
                                width: '90vw',
                                height: '600px',
                                transform: 'translate(-50%, -50%)',
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{ duration: 0.4 }}
                            onClick={(e) => e.stopPropagation()}
                        >

                            {activeCard === 'left' ? (
                                <>
                                    <div className='absolute inset-0 bg-black bg-opacity-50 rounded-lg'></div>
                                    <div className='relative z-10 flex flex-col items-center justify-center h-full p-6 text-center'>
                                        <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mb-4">
                                            <img
                                                className='w-full h-full object-cover'
                                                src="https://avatars.githubusercontent.com/u/126214032?v=4"
                                                alt="CEO VU"
                                            />
                                        </div>
                                        <div className='max-w-full max-h-32 overflow-y-auto break-words mb-4'>
                                            <div className='font-bold'>Name: Vu Nguyen</div>
                                            <p>I worked on: Amazing e-commerce projects, interactive React apps, and cool backend systems!</p>
                                        </div>
                                        <div className='flex flex-col gap-2 text-sm'>
                                            <div className='flex items-center gap-2'>
                                                <FaExternalLinkAlt /> Website
                                            </div>
                                            <a href="mailto:vn22dy@brocku.ca" className="flex items-center gap-2 hover:underline cursor-pointer">
                                                <MdOutlineEmail /> Email
                                            </a>
                                            <a
                                                href="https://www.linkedin.com/in/vu-nguyen-5a739026b/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:underline cursor-pointer"
                                            >
                                                <FaLinkedin /> LinkedIn
                                            </a>
                                            <a
                                                href="https://github.com/JuTah10"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:underline cursor-pointer"
                                            >
                                                <FaGithub /> GitHub
                                            </a>

                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='absolute inset-0 bg-green-700 bg-opacity-50 rounded-lg'></div>
                                    <div className='relative z-10 flex flex-col items-center justify-center h-full p-6 text-center'>
                                        <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mb-4">
                                            <img
                                                className='w-full h-full object-cover'
                                                src="https://thumbs.dreamstime.com/b/vector-illustration-depicts-young-male-programmer-engaged-laptop-wearing-glasses-emphasizing-coding-346344547.jpg"
                                                alt="CEO VU"
                                            />
                                        </div>
                                        <div className='max-w-full max-h-32 overflow-y-auto break-words mb-4'>
                                            <div className='font-bold'>Name: Tung Tran</div>
                                           <p>I worked on: Full-stack projects, interactive web apps, and many other cool systems!</p>
                                        </div>
                                        <div className='flex flex-col gap-2 text-sm'>
                                            <div className='flex items-center gap-2'>
                                                <FaExternalLinkAlt /> Website
                                            </div>
                                            <a href="mailto:thanhtungtran112233@gmail.com" className="flex items-center gap-2 hover:underline cursor-pointer">
                                                <MdOutlineEmail /> Email
                                            </a>
                                            <a
                                                href="https://www.linkedin.com/in/tungtrann/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:underline cursor-pointer"
                                            >
                                                <FaLinkedin /> LinkedIn
                                            </a>
                                            <a
                                                href="https://github.com/tungtuhoccode"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 hover:underline cursor-pointer"
                                            >
                                                <FaGithub /> GitHub
                                            </a>

                                        </div>
                                    </div>
                                </>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div >
    );
}
