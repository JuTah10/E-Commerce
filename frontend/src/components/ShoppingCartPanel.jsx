import React from 'react';
import { Trash2, X, LoaderCircle } from 'lucide-react'; // or any cart/close icons
import { Link } from 'react-router-dom';

import { useCartStore } from '../store/useCartStore';

function ShoppingCartPanel({ cartItem, isOpen, setIsOpen }) {
    const { loading, deleteFromCart } = useCartStore();
    const [deleteingItemId, setDeletingItemId] = React.useState(null);


    return (
        <div>
            {/* Overlay background, click outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Cart Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[40%] bg-white z-50 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-black">Shopping Cart</h2>
                    <button onClick={() => setIsOpen(false)}>
                        <X color='black' />
                    </button>
                </div>

                {/* Empty Cart Message */}

                {(cartItem?.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-[70%] text-gray-500">
                        <p >No products in the cart.</p>
                    </div>
                ) :

                    <div className='flex flex-col p-[20px]'>
                        {cartItem.map((item, index) => (
                            (loading && deleteingItemId === item.id)
                                ?
                                <LoaderCircle size={24} className="w-full flex justify-center items-center animate-spin text-gray-400" />
                                :
                                <div
                                    key={item.id}
                                    className='w-full'
                                >
                                    <div

                                        className='flex items-center gap-2 text-gray-500 py-[19.2px] w-full'
                                    >
                                        <img src={item.image} className="w-20 h-20" />
                                        <div className='flex-1'>
                                            <div className='flex flex-1 justify-between items-center mb-1'>
                                                <div>{item.name}</div>
                                                <Trash2
                                                    size={20}
                                                    className='cursor-pointer hover:text-emerald-500'
                                                    onClick={async () => {
                                                        setDeletingItemId(item.id);
                                                        await deleteFromCart(item.id);
                                                        setDeletingItemId(null);
                                                    }}

                                                />

                                            </div>

                                            <div className='flex flex-1 justify-between items-center'>
                                                <div className='flex gap-1 items-center'>{item.quantity} <span className='text-sm'>x</span> ${item.price}</div>
                                                <div>${(item.quantity * item.price).toFixed(2)}</div>
                                            </div>

                                        </div>

                                    </div>
                                    {index < cartItem.length - 1 && (
                                        <hr className="border-t border-gray-200 my-2" />
                                    )}
                                </div>

                        ))}
                    </div>
                }



                {/* Continue Button */}
                <div className="absolute bottom-4 w-full px-6">
                    <button onClick={() => setIsOpen(false)} className="w-full bg-lime-600 text-white font-medium py-3 rounded-full">
                        <Link to="/shop">Continue Shopping</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ShoppingCartPanel;
