import axios from "axios";
import { API_URL } from "../config";

export const placeOrder = async (getAuthHeader) => {
    try {
        const response = await axios.post(
            `${API_URL}/Orders`,
            {},
            {
                headers: getAuthHeader(),
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error placing order:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to place order",
        };
    }
};

export const getOrders = async (getAuthHeader) => {
    try {
        const response = await axios.get(`${API_URL}/Orders`, {
            headers: getAuthHeader(),
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to fetch orders",
        };
    }
};

export const getOrderDetails = async (orderId, getAuthHeader) => {
    try {
        const response = await axios.get(`${API_URL}/Orders/${orderId}`, {
            headers: getAuthHeader(),
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching order details:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to fetch order details",
        };
    }
};

export const cancelOrder = async (orderId, getAuthHeader) => {
    try {
        const response = await axios.post(
            `${API_URL}/Orders/${orderId}/cancel`,
            {},
            {
                headers: getAuthHeader(),
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error cancelling order:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to cancel order",
        };
    }
};

export const getOrderByClaimCode = async (claimCode) => {
    try {
        const response = await axios.get(`${API_URL}/Orders/claim/${claimCode}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching order by claim code:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to fetch order details",
        };
    }
};

export const updateOrderStatus = async (orderId, status, authHeader) => {
    try {
        let endpoint;
        if (status === "Processing") {
            endpoint = `${API_URL}/Orders/${orderId}/process`;
        } else if (status === "Delivered") {
            endpoint = `${API_URL}/Orders/${orderId}/deliver`;
        } else {
            throw new Error("Invalid status");
        }

        const response = await axios.post(
            endpoint,
            {},
            { headers: authHeader }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating order status:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to update order status",
        };
    }
};

export const getAllOrders = async (getAuthHeader) => {
    try {
        const response = await axios.get(`${API_URL}/Orders/all`, {
            headers: getAuthHeader(),
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to fetch all orders",
        };
    }
};

export const getPurchasedBooks = async (getAuthHeader) => {
    try {
        const response = await axios.get(`${API_URL}/Orders/purchased-books`, {
            headers: getAuthHeader(),
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching purchased books:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to fetch purchased books",
        };
    }
}; 