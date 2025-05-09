import { createContext, useContext, useState, useCallback } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../utils/cartUtils';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async (getAuthHeader) => {
        setLoading(true);
        setError(null);
        try {
            const result = await getCart(getAuthHeader);
            if (result.success) {
                setCart(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Failed to fetch cart");
        } finally {
            setLoading(false);
        }
    }, []);

    const addItemToCart = useCallback(async (bookId, quantity, getAuthHeader) => {
        setLoading(true);
        setError(null);
        try {
            const result = await addToCart(bookId, quantity, getAuthHeader);
            if (result.success) {
                await fetchCart(getAuthHeader);
            } else {
                setError(result.error);
            }
            return result;
        } catch (err) {
            setError("Failed to add item to cart");
            return { success: false, error: "Failed to add item to cart" };
        } finally {
            setLoading(false);
        }
    }, [fetchCart]);

    const updateItemQuantity = useCallback(async (bookId, quantity, getAuthHeader) => {
        setLoading(true);
        setError(null);
        try {
            const result = await updateCartItem(bookId, quantity, getAuthHeader);
            if (result.success) {
                await fetchCart(getAuthHeader);
            } else {
                setError(result.error);
            }
            return result;
        } catch (err) {
            setError("Failed to update cart item");
            return { success: false, error: "Failed to update cart item" };
        } finally {
            setLoading(false);
        }
    }, [fetchCart]);

    const removeItem = useCallback(async (bookId, getAuthHeader) => {
        setLoading(true);
        setError(null);
        try {
            const result = await removeCartItem(bookId, getAuthHeader);
            if (result.success) {
                await fetchCart(getAuthHeader);
            } else {
                setError(result.error);
            }
            return result;
        } catch (err) {
            setError("Failed to remove item");
            return { success: false, error: "Failed to remove item" };
        } finally {
            setLoading(false);
        }
    }, [fetchCart]);

    const clearCartItems = useCallback(async (getAuthHeader) => {
        setLoading(true);
        setError(null);
        try {
            const result = await clearCart(getAuthHeader);
            if (result.success) {
                setCart(null);
            } else {
                setError(result.error);
            }
            return result;
        } catch (err) {
            setError("Failed to clear cart");
            return { success: false, error: "Failed to clear cart" };
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        cart,
        loading,
        error,
        fetchCart,
        addItemToCart,
        updateItemQuantity,
        removeItem,
        clearCartItems
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 