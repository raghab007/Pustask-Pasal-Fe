import axios from "axios";

export const addToCart = async (bookId, quantity = 1, getAuthHeader) => {
    try {
        await axios.post(
            "http://localhost:5001/api/Cart/add",
            { bookId, quantity },
            {
                headers: getAuthHeader(),
            }
        );
        return { success: true };
    } catch (error) {
        console.error("Error adding to cart:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to add item to cart",
        };
    }
};

export const getCart = async (getAuthHeader) => {
    try {
        const response = await axios.get("http://localhost:5001/api/Cart", {
            headers: getAuthHeader(),
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching cart:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to fetch cart",
        };
    }
};

export const updateCartItem = async (itemId, quantity, getAuthHeader) => {
    try {
        await axios.put(
            `http://localhost:5001/api/Cart/update/${itemId}`,
            { quantity },
            {
                headers: getAuthHeader(),
            }
        );
        return { success: true };
    } catch (error) {
        console.error("Error updating cart item:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to update cart item",
        };
    }
};

export const removeCartItem = async (itemId, getAuthHeader) => {
    try {
        await axios.delete(`http://localhost:5001/api/Cart/remove/${itemId}`, {
            headers: getAuthHeader(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error removing cart item:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to remove cart item",
        };
    }
};

export const clearCart = async (getAuthHeader) => {
    try {
        await axios.delete("http://localhost:5001/api/Cart/clear", {
            headers: getAuthHeader(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error clearing cart:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to clear cart",
        };
    }
}; 