import axios from "axios";

const API_URL = "http://localhost:5001/api";

export const getBooks = async (page, pageSize, searchQuery, genre, sortBy) => {
    try {
        let url = `${API_URL}/Books`;
        const params = new URLSearchParams({
            page: page,
            count: pageSize
        });

        if (searchQuery) {
            url = `${API_URL}/Books/search`;
            params.append('title', searchQuery);
        } else if (genre && genre !== "ALL") {
            url = `${API_URL}/Books/by-genre-type`;
            params.append('genreType', genre);
        }

        if (sortBy) {
            params.append('sortBy', sortBy);
        }

        console.log('Fetching books with URL:', `${url}?${params.toString()}`);

        const response = await axios.get(`${url}?${params.toString()}`);
        console.log('Response:', response.data);

        return {
            success: true,
            data: {
                books: response.data.books || response.data.Books,
                totalCount: response.data.totalCount
            }
        };
    } catch (error) {
        console.error("Error fetching books:", error);
        return {
            success: false,
            error: error.response?.data || "Failed to fetch books"
        };
    }
}; 