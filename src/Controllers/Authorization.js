import axios from "axios";
import qs from "qs";
export async function getToken() {
    const savedConfig = localStorage.getItem("apiConfig");
    if (!savedConfig) {
        throw new Error("API config not found in localStorage");
    }

    const credentials = JSON.parse(savedConfig);

    try {
        const response = await axios.post("http://localhost:4000/auth/token", credentials, {
            withCredentials: true,
        });

        console.log("✅ Token from backend:", response.data);
        return response.data; // contains token + headers
    } catch (err) {
        console.error("❌ Failed to fetch token from backend:", err.message);
        throw err;
    }
}
