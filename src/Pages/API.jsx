import { useState, useEffect } from "react";
import { getToken } from "../Controllers/Authorization.js";
import { getBatchTemplateDetails } from "../Controllers/BatchTemplate.js";

function TestAPI() {
    const [tokenResponse, setTokenResponse] = useState(null);
    const [batchDetails, setBatchDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                console.log("🔄 Fetching token...");
                const tokenResponse = await getToken();

                if (!tokenResponse?.access_token) {
                    setError("Token fetch failed or missing access_token");
                    return;
                }

                setTokenResponse(tokenResponse);

                console.log("🔄 Fetching batch template details...");
                const details = await getBatchTemplateDetails(tokenResponse.access_token);

                if (!details) {
                    setError("Batch details fetch returned empty");
                    return;
                }

                setBatchDetails(details);

            } catch (err) {
                console.error("❌ API error:", err);
                setError("Failed to fetch data");
            }
        })();
    }, []);

    return (
        <div>
            {error ? (
                <div style={{ color: "red" }}>{error}</div>
            ) : !tokenResponse ? (
                "Loading token..."
            ) : !batchDetails ? (
                "Loading batch template details..."
            ) : (
                <>
                    <h3>Token Response:</h3>
                    <pre>{JSON.stringify(tokenResponse, null, 2)}</pre>

                    <h3>Batch Template Details:</h3>
                    <pre>{JSON.stringify(batchDetails, null, 2)}</pre>
                </>
            )}
        </div>
    );
}

export default TestAPI;
