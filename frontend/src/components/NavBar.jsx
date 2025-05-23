
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, User, LogOut, Signature, SearchSlash, Store, House } from "lucide-react"
import ShoppingCartPanel from './ShoppingCartPanel';
import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore';

import { RiAdminFill } from "react-icons/ri";



function NavBar() {
    const { user, logOut } = useUserStore();
    const { cart, getCartItems, totalCartItem } = useCartStore();
    const location = useLocation();
    const currentLocation = location.pathname;
    let textColor = "text-black";


    //for cart panel
    const [isOpen, setIsOpen] = React.useState(false);
    //for menu button in mobile screen
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    //to keep track if user scrolled past the wallpaper in the homepage
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMenuOpen(false);
            if (window.innerWidth < 768) setIsOpen(false);

        }
        const handleScroll = () => {
            if (currentLocation === "/" && window.scrollY >= (window.innerHeight - 30)) {
                console.log("zzz")
                setScrolled(true);
            }
            else if (currentLocation === "/about" && window.scrollY > 0) {
                console.log("true")
                setScrolled(true);
            }
            else {
                setScrolled(false);
            }
        }
        window.addEventListener('resize', handleResize);
        window.addEventListener("scroll", handleScroll);

        const fetchCart = async () => {
            if (user.email && user.userName) {
                await getCartItems();
            }
        }
        fetchCart();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [user, getCartItems, location.pathname]
    )
    if ((currentLocation === "/" || currentLocation === "/about") && !scrolled) {
        textColor = "text-white";
    }

    return (
        <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300
            ${(currentLocation === "/" || currentLocation === "/about") ? `${scrolled ? 'bg-white text-black shadow-md border-b' : 'bg-transparent text-white'} ` : 'bg-white text-black shadow-md border-b'}`}>

            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-6">
                <div className="text-xl font-bold items-center space-x-2 flex font-pacifico hover:text-green-500"><Link to="/">VNWear</Link></div>

                {/* Desktop Nav */}

                <ul className="hidden md:flex space-x-6 items-center">
                    <li className='hover:text-green-500'><Link to="/" className={`hover:text-green-500 ${currentLocation === '/' ? 'text-green-600' : textColor}`} >Home</Link></li>
                    <li className='hover:text-green-500'><Link to="/shop" className={`hover:text-green-500 ${currentLocation === '/shop' ? 'text-green-600' : textColor}`} >Shop</Link></li>
                    <li className='hover:text-green-500'><Link to="/about" className={`hover:text-green-500 ${currentLocation === '/about' ? 'text-green-600' : textColor}`} >About</Link></li>
                    <li className='hover:text-green-500'><Link to="/contact" className={`hover:text-green-500 ${currentLocation === '/contact' ? 'text-green-600' : textColor}`} >Contact</Link></li>
                    {(user.email && user.userName) ?
                        <>
                            {user.userRole === "admin" &&
                                <li>
                                    <Link
                                        to="/admin"
                                        className="hover:text-green-500 transition duration-200"><RiAdminFill size={20} /></Link>
                                </li>
                            }
                            <li>
                                <button onClick={() => setIsOpen(true)} className="block hover:text-green-500 relative">
                                    <ShoppingCart size={20} />
                                    <span className='absolute -top-2 -right-1 bg-green-500 text-white text-xs w-[1.0rem] h-[1.0rem] rounded-full flex items-center justify-center'>
                                        {totalCartItem}
                                    </span>
                                </button>
                            </li>
                            <li onClick={() => logOut()} className='hover:text-green-500 cursor-pointer'><LogOut size={20} /></li>
                        </>
                        :
                        <li className='hover:text-green-500'><Link to="/login" className={`hover:text-green-500 ${currentLocation === '/signup' ? 'text-green-600' : textColor}`}><User size={20} /></Link></li>

                    }

                </ul>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav Panel */}
            {
                isMenuOpen && (
                    <div className={`md:hidden px-6 pb-6 pt-4 shadow-lg bg-white`}>
                        <ul className="space-y-4">

                            <li className='hover:text-green-500' onClick={() => setIsMenuOpen(false)}><Link to="/" className={`hover:text-green-500 ${currentLocation === '/' ? 'text-green-600' : 'text-black'} flex justify-start items-center gap-1`} ><House size={20} />Home</Link></li>
                            <li className='hover:text-green-500' onClick={() => setIsMenuOpen(false)}><Link to="/shop" className={`hover:text-green-500 ${currentLocation === '/shop' ? 'text-green-600' : 'text-black'} flex justify-start items-center gap-1`} ><Store size={20} /> Shop</Link></li>
                            <li className='hover:text-green-500' onClick={() => setIsMenuOpen(false)}><Link to="/about" className={`hover:text-green-500 ${currentLocation === '/about' ? 'text-green-600' : 'text-black'} flex justify-start items-center gap-1`} ><SearchSlash size={20} /> About</Link></li>
                            <li className='hover:text-green-500' onClick={() => setIsMenuOpen(false)}><Link to="/contact" className={`hover:text-green-500 ${currentLocation === '/contact' ? 'text-green-600' : 'text-black'} flex justify-start items-center gap-1`} ><Signature size={20} /> Contact</Link></li>

                            {(user.email && user.userName) ?
                                <>
                                    {user.userRole === "admin" &&
                                        <li>
                                            <Link
                                                to="/admin"
                                                className="hover:text-green-500 transition duration-200 text-black flex justify-start items-center gap-1"><RiAdminFill size={20} /> Admin Dashboard</Link>
                                        </li>
                                    }
                                    <li className='hover:text-green-500' onClick={() => setIsMenuOpen(false)}><Link to="/cart" className={`hover:text-green-500 ${currentLocation === '/cart' ? 'text-green-600' : 'text-black'} flex justify-start items-center gap-1`} ><ShoppingCart size={20} /> Cart</Link></li>
                                    <li onClick={() => logOut()} className='hover:text-green-500 cursor-pointer flex justify-start items-center gap-1 text-black'><LogOut size={20} /> Log out</li>
                                </>

                                :
                                <li className='hover:text-green-500' onClick={() => setIsMenuOpen(false)}><Link to="/signup" className={`hover:text-green-500 ${currentLocation === '/signup' ? 'text-green-600' : textColor} flex justify-start items-center gap-1`} ><User /> Sign up</Link></li>
                            }
                        </ul>
                    </div>
                )
            }
            <ShoppingCartPanel cartItem={cart} isOpen={isOpen} setIsOpen={setIsOpen} />
        </header >
    )
}

export default NavBar

