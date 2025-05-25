import React from 'react'
import { useCartStore } from '../store/useCartStore'

import { CircleX, LoaderCircle, ShoppingBasket } from "lucide-react"

import { useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios.js"



const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Cart() {
    const { cart, loading, getCartItems, subtotal, deleteFromCart, updateCart, applyCoupon, couponError, discountPercentage } = useCartStore();
    const [initialQuantities, setInitialQuantities] = React.useState({});
    const [quantities, setQuantities] = React.useState({});
    const [couponCode, setCouponCode] = React.useState("");
    const [stripeCouponCode, setStripeCouponCode] = React.useState("");
    const [checkoutLoading, setCheckoutLoading] = React.useState(false);
    const navigate = useNavigate();


    React.useEffect(() => {
        getCartItems();

    }, [getCartItems])

    React.useEffect(() => {
        const map = Object.fromEntries(cart.map(item => [item.id, item.quantity]));
        setQuantities(map);
        setInitialQuantities(map);
    }, [cart])

    function quantitiesChange() {
        for (const id in quantities) {
            if (quantities[id] !== initialQuantities[id]) {
                return true;
            }
        }
        return false;
    }

    async function handlePayment() {
        setCheckoutLoading(true);
        const stripe = await stripePromise;
        const response = await axios.post(`/payment/create-checkout-session`, {
            couponInfor: discountPercentage ?
                {
                    couponCode: stripeCouponCode,
                    discountAmount: discountPercentage
                }
                :
                null
        })
        const session = response.data;
        setCheckoutLoading(false);
        window.location = session.url;
    }


    return (
        <section className='max-w-7xl mx-auto py-16'>
            <div className='w-[95%] mx-auto'>
                <h1 className='text-3xl font-semibold text-gray-700 mb-5'>Cart</h1>
                <div className='hidden'>Cart updated</div>
                {Object.keys(quantities).length === 0 ?
                    <div>
                        <div className='bg-gray-100 p-5 border-t-2 border-t-green-500 flex justify-start items-center gap-2'><ShoppingBasket className='text-green-500' />Your cart is currently empty.</div>
                        <button
                            onClick={(() => navigate("/shop"))}
                            className='bg-lime-600 text-white font-medium py-3 px-7 rounded-full hover:bg-lime-700 transition-all duration-500 mt-3'>Return to shop</button>
                    </div>
                    :
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 '>
                        <div className="col-span-2 border text-sm ">
                            <table className='w-full table-fixed'>

                                <thead>
                                    <tr className="bg-gray-100 text-center text-gray-600 hidden lg:table-row">
                                        <th className="w-20 p-4"></th>
                                        <th className="w-24 p-4"></th>
                                        <th className="p-4">Product</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">Quantity</th>
                                        <th className="p-4">Subtotal</th>
                                    </tr>


                                </thead>
                                <tbody>
                                    {loading ?
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className={`text-center`}
                                                style={{ height: `${97 * cart.length}px` }}
                                            >
                                                <LoaderCircle className="mx-auto animate-spin text-green-500" size={40} />

                                            </td>

                                        </tr>
                                        :
                                        cart.map((cartItem) => {
                                            return (

                                                <tr
                                                    key={cartItem.id}
                                                    className="flex flex-col lg:table-row border-t text-center">

                                                    <td className="border-b p-6 items-center flex justify-end lg:table-cell lg:border-b-0">

                                                        <CircleX
                                                            onClick={() => {
                                                                deleteFromCart(cartItem.id);
                                                            }}
                                                            size={20}
                                                            className='text-gray-400 hover:text-green-600 cursor-pointer' />
                                                    </td>

                                                    <td className="border-b p-4 flex justify-center items-center lg:border-b-0">
                                                        <img src={cartItem.image} alt="Product" className="w-16 h-16 object-cover" />
                                                    </td>

                                                    <td className="border-b p-4 text-green-600 font-medium flex justify-between items-center lg:table-cell lg:border-b-0">
                                                        <div className='lg:hidden text-gray-900'>Product:</div>
                                                        <div>{cartItem.name}</div>
                                                    </td>



                                                    <td className="border-b p-4 flex justify-between items-center lg:table-cell lg:border-b-0">
                                                        <div className='lg:hidden font-medium text-gray-900'>Price:</div>
                                                        <div>${cartItem.price}</div>
                                                    </td>



                                                    <td className="border-b p-4 flex justify-between items-center lg:table-cell lg:border-b-0">
                                                        <div className='lg:hidden font-medium text-gray-900'>Quantity:</div>
                                                        <input
                                                            type="number"
                                                            value={quantities[cartItem.id] || 0}
                                                            onChange={(e) => {
                                                                setQuantities(prev => ({ ...prev, [cartItem.id]: Number(e.target.value) }))
                                                            }}
                                                            className="w-16 border border-gray-300 p-1 rounded"
                                                        />
                                                    </td>



                                                    <td className="p-4 flex justify-between items-center lg:table-cell">
                                                        <div className='lg:hidden font-medium text-gray-900'>Subtotal:</div>
                                                        <div>${(cartItem.price * cartItem.quantity).toLocaleString('en-US', {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}</div>

                                                    </td>
                                                </tr>

                                            );
                                        })


                                    }
                                </tbody>
                            </table>

                            <div className='w-full h-[130px] sm:h-[70px] p-4 border-t flex flex-col sm:flex-row justify-between items-center '>
                                <div className='w-full sm:w-[60%] flex'>
                                    <input
                                        type="text"
                                        placeholder={couponError || `Coupon code`}
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className={`sm:w-[40%] border border-gray-300 rounded p-2 ${couponError && 'placeholder-red-500'}`}
                                    />
                                    <button
                                        className='flex-1 sm:w-auto sm:flex-none bg-lime-600 text-white font-medium py-3 px-7 rounded-full ml-3 hover:bg-lime-700 transition-all duration-500'
                                        onClick={(() => {
                                            applyCoupon(couponCode);
                                            setStripeCouponCode(couponCode);
                                            setCouponCode("");

                                        })}
                                    >
                                        Apply Coupon
                                    </button>
                                </div>
                                <button
                                    onClick={(() => updateCart(quantities))}
                                    className={`w-full sm:w-auto bg-lime-600 text-white font-medium py-3 px-7 rounded-full hover:bg-lime-700 transition-all duration-500 ${!quantitiesChange() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!quantitiesChange()}
                                >
                                    Update Cart
                                </button>
                            </div>
                        </div>

                        {loading ?
                            <div className='flex justify-center items-center col-span-2 lg:col-span-1 lg:col-start-2 border w-full h-[340px] p-7 text-gray-600'>
                                <LoaderCircle className="animate-spin text-green-500" size={40} />
                            </div>
                            :
                            <div className='col-span-2 lg:col-span-1 lg:col-start-2 border w-full h-[360px] p-7 text-gray-600'>
                                <h1 className='text-[42px] font-medium text-gray-700'>Cart totals</h1>
                                <hr className='-mx-7 my-4' />
                                <div className='flex flex-col gap-2'>
                                    <div className='w-full lg:w-[55%] flex justify-between items-center'>
                                        <div>Subtotal</div>
                                        <div>${subtotal.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}</div>
                                    </div>
                                    {discountPercentage !== 0
                                        &&
                                        <div className='w-full lg:w-[55%] flex justify-between items-center'>
                                            <div>Discount ({discountPercentage}%)</div>
                                            <div className='text-green-500'>-${(subtotal * (discountPercentage / 100)).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })
                                            }</div>
                                        </div>
                                    }
                                    <div className='w-full lg:w-[55%] flex justify-between items-center'>
                                        <div>HST (13%)</div>
                                        <div>${discountPercentage === 0 ?
                                            (subtotal * 0.13).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })
                                            :
                                            ((subtotal - (subtotal * (discountPercentage / 100))) * 0.13).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })
                                        }
                                        </div>
                                    </div>


                                    <hr className='-mx-3' />
                                    <div className='w-full lg:w-[55%] flex justify-between items-center'>
                                        <div>Total</div>
                                        <div>
                                            ${(
                                                (
                                                    subtotal - (discountPercentage === 0 ? 0 : (subtotal * (discountPercentage / 100)))
                                                ) + ((subtotal - (discountPercentage === 0 ? 0 : (subtotal * (discountPercentage / 100)))) * 0.13)
                                            ).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </div>

                                    </div>
                                    <hr className='-mx-3 mb-3' />
                                    <button
                                        onClick={handlePayment}
                                        className=' bg-lime-600 text-white font-medium py-5 rounded-full hover:bg-lime-700 transition-all duration-500 flex justify-center items-center'
                                    >
                                        {checkoutLoading ?
                                            <LoaderCircle className='animate-spin' />
                                            :
                                            "Proceed to checkout"
                                        }

                                    </button>
                                </div>
                            </div>}


                    </div>
                }
            </div>
        </section>
    )
}
