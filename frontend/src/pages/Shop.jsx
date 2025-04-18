import React from 'react'
import { useProductStore } from '../store/useProductStore'
import LoadingScreen from '../components/LoadingScreen';
import { motion } from 'framer-motion';

export default function Shop() {
    const { products, fetchDisplayedProducts, loading } = useProductStore();

    React.useEffect(() => {
        fetchDisplayedProducts();
    }, [fetchDisplayedProducts])
    return (
        <div>
            <div className='relative'>
                <img
                    className='min-w-full max-h-[400px] object-cover'
                    style={{ objectPosition: 'center 10%' }}
                    src="/images/shopWallpaper.avif"
                    alt="shop wallpaper" />
                <h1 className='absolute w-screen h-[400px] top-0 flex justify-center items-center font-pacifico md:text-3xl sm:text-2xl text-white'>Shop</h1>
            </div>

            {loading
                ?
                <LoadingScreen />
                :
                <section className='max-w-7xl mx-auto py-16'>
                    <div
                        className='grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-16 mx-auto mt-10 max-w-[90%]'>
                        {products.map((product, index) => {
                            const delayIndex = index % 3; // reset every 3 items
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: -30 }}
                                    whileInView={{ opacity: 1, y: [-30,0] }}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    transition={{
                                        duration: 0.6,
                                

                                        delay: 0.6 * delayIndex,
                                        scale: { duration: 0 },       
                                        boxShadow: { duration: 0 },  
                                    }}
                                    viewport={{ once: true, amount: 0.5  }}

                                    key={product.id}
                                    className='max-h-[530px] rounded-b-lg cursor-pointer'>
                                    <img
                                        className='w-full max-w-[386px] h-[75%] rounded-t-lg'
                                        src={product.image}
                                        alt={product.name} />
                                    <div className='pt-3'>
                                        <h2 className="text-lg lg:text-xl truncate">{product.name}</h2>

                                        <div className='text-sm text-gray-500'>{product.categories}</div>

                                        <div>${product.price}</div>

                                        <div>{product.stock_quantity}
                                            <span className='text-sm text-gray-500'> in stocks
                                            </span>
                                        </div>
                                    </div>

                                </motion.div>

                            )

                        })}
                    </div>
                </section>
            }


        </div>
    )
}

