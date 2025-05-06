import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore'
import LoadingScreen from '../components/LoadingScreen';
import { motion } from 'framer-motion';
import AddToCartIcon from '../components/AddToCartIcon';

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";


export default function Shop() {
    const { products, fetchDisplayedProducts, loading } = useProductStore();
    const navigate = useNavigate();
    const [sortMenu, setSortMenu] = React.useState(false);
    const [activeHover, setActiveHover] = React.useState("default")
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const query = new URLSearchParams(location.search);
        const page = query.get('page');
        const sort = query.get('sort');
        if (sort === "price_desc") {
            setActiveHover("high-to-low");
        } else if (sort === "price_asc") {
            setActiveHover("low-to-high");
        }
        fetchDisplayedProducts(sort);

    }, [fetchDisplayedProducts, location.search])

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current.contains(event.target)) {
                setSortMenu(false);
            }
        }
        const handleScroll = () => {
            setSortMenu(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll);
        };
    }, [])

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
                    <div className='max-w-[90%] mx-auto flex justify-between items-center'>
                        <div>Showing all {products.length} results</div>
                        <div>
                            <div
                                ref={dropdownRef}
                                onClick={() => setSortMenu(!sortMenu)}
                                className='relative cursor-pointer select-none'
                            >
                                <div className={`w-[200px] sm:w-[250px] flex items-center justify-between ${sortMenu ? 'border border-black border-dotted' : "border border-white"} py-1`}>
                                    <div className='pl-4'>
                                        {activeHover === "default"
                                            ? "Default sorting"
                                            : activeHover === "low-to-high"
                                                ? "Sort by price: low to high"
                                                : activeHover === "high-to-low"
                                                    ? "Sort by price: high to low"
                                                    : ""}
                                    </div>
                                    {sortMenu ?
                                        <IoIosArrowUp className='' />
                                        :
                                        <IoIosArrowDown className='' />
                                    }
                                </div>

                                <div className={`w-[200px] sm:w-[250px] bg-white ${!sortMenu && "hidden"} absolute z-50 border border-gray-500 rounded-lg `}>
                                    <ul>
                                        <li
                                            onMouseEnter={() => setActiveHover('default')}
                                            onClick={() => {
                                                navigate("/shop")
                                            }}
                                            className={`block w-full px-4 rounded-t-lg cursor-pointer ${activeHover === 'default' ? 'bg-lime-600 text-white' : 'hover:bg-lime-600 hover:text-white'}`}
                                        >
                                            Default sorting
                                        </li>
                                        <li
                                            onMouseEnter={() => setActiveHover('low-to-high')}
                                            onClick={() => {
                                                navigate("/shop?sort=price_asc")
                                            }}
                                            className={`block w-full px-4 cursor-pointer ${activeHover === 'low-to-high' ? 'bg-lime-600 text-white' : 'hover:bg-lime-600 hover:text-white'}`}
                                        >
                                            Sort by price: low to high
                                        </li>
                                        <li
                                            onMouseEnter={() => setActiveHover('high-to-low')}
                                            onClick={() => {
                                                navigate("/shop?sort=price_desc")
                                            }}
                                            className={`block w-full px-4 rounded-b-lg cursor-pointer ${activeHover === 'high-to-low' ? 'bg-lime-600 text-white' : 'hover:bg-lime-600 hover:text-white'}`}
                                        >
                                            Sort by price: high to low
                                        </li>

                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div
                        className='grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-16 mx-auto mt-10 max-w-[90%]'>
                        {products.map((product, index) => {
                            const delayIndex = index % 3; // reset every 3 items
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: -30 }}
                                    whileInView={{ opacity: 1, y: [-30, 0] }}
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.6 * delayIndex,
                                        scale: { duration: 0.6 },
                                        boxShadow: { duration: 0.6 },
                                    }}
                                    viewport={{ once: true, amount: 0.5 }}

                                    key={product.id}
                                    className='relative group max-h-[530px] rounded-b-lg cursor-pointer'
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >

                                    <AddToCartIcon productId={product.id} />

                                    <img
                                        className='w-full max-w-[386px] h-[75%] rounded-t-lg'
                                        src={product.image}
                                        alt={product.name} />
                                    <div className='pt-3 transition-all group-hover:translate-x-2 lg:group-hover:translate-x-3 duration-600'>
                                        <h2 className="text-sm sm:text-lg lg:text-xl truncate">{product.name}</h2>

                                        <div className='text-xs lg:text-sm text-gray-500'>{product.categories}</div>

                                        <div className='text-xs lg:text-sm'>${product.price}</div>

                                        <div>{product.stock_quantity}
                                            <span className='text-xs lg:text-sm text-gray-500'> in stocks
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

