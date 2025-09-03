import express from "express";
import axios from "axios";
import qs from "qs";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
}));


let lastAuthConfig = {}

// ---------------- AUTH + BATCH TEMPLATE ----------------
app.post("/auth/token", async (req, res) => {
    const { url, port, username, password, apiKey, batchPayload } = req.body;

    if (!url || !port || !username || !password || !apiKey) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const data = qs.stringify({
        grant_type: "password",
        username,
        password,
        scope: `apiKey=${apiKey}`,
    });

    try {
        // STEP 1: Get Token
        const tokenResponse = await axios.post(
            `http://${url}:${port}/token`,
            data,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const token = tokenResponse.data;
        const cookies = tokenResponse.headers;

        lastAuthConfig = { url, port,cookies };
        // STEP 2: Get Batch Template
        const batchResponse = await axios.get(
            `http://${url}:${port}/api/apibase/ULBATCH/UnitLineBatchTemplateDetails`,
            {
                headers: {
                    Cookie: cookies["set-cookie"],
                },
                withCredentials: true,
            }
        );

        res.json({
            token,
            batchResult: batchResponse.data,
            cookies: cookies["set-cookie"], // send cookies back for reuse
        });

        console.log("batch response",batchResponse.data);

    } catch (err) {
        console.error("❌ Error:", err.response?.data || err.message);
        res.status(500).json({ error: err.response?.data || err.message });
    }
});

// ---------------- NEW ROUTE: PUSH FRONTEND PAYLOAD ----------------
app.post("/sage/push", async (req, res) => {
    const payload = req.body;

    console.log('url',lastAuthConfig.url);
    console.log('url',lastAuthConfig.port);
    console.log('url',lastAuthConfig.cookies);
    // console.log('pushed to api',payload);

    try {
        const pushResponse = await axios.post(
            `http://${lastAuthConfig.url}:${lastAuthConfig.port}/api/apibase/ULBATCH/create`,
            payload,
            {
                headers: {
                    Cookie: lastAuthConfig.cookies["set-cookie"]
                },
                withCredentials: true,
            }
        );

        // console.log("✅ Sage Push Response:", pushResponse.data);

        res.json({ result: pushResponse.data });

    } catch (err) {
        console.error("❌ Push Error:", err.response?.data || err.message);
        res.status(500).json({ error: err.response?.data || err.message });
    }
});



const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
