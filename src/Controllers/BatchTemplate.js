import axios from "axios";

export async function getBatchTemplateDetails(token) {
    try {
        const response = await axios.post("http://localhost:4000/proxy/batch-template", { token });
        return response.data;
    } catch (error) {
        console.error("❌ Batch template fetch failed:", error.message);
        throw error;
    }
}
