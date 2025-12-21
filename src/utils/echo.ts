import AsyncStorage from "@react-native-async-storage/async-storage";
import Echo from "laravel-echo";
import PusherNative from "pusher-js/react-native";

let echoInstance: Echo | null = null;

/**
 * Get the user token from AsyncStorage
 */
const getToken = async (): Promise<string | null> => {
    try {
        const userData = await AsyncStorage.getItem("loginUser");
        if (userData) {
            const parsed = JSON.parse(userData);
            const token = parsed?.token || null;
            return token;
        }
        return null;
    } catch (error) {
        return null;
    }
};

/**
 * Initialize Echo instance
 */
export const initEcho = async (): Promise<Echo> => {
    if (echoInstance) return echoInstance;

    const echo = new Echo({
        broadcaster: "reverb",
        key: "9zorypzleaccvncniixu",
        wsHost: "uat.nextmove.estate",
        wsPort: 443,
        wssPort: 443,
        forceTLS: true,
        enabledTransports: ["ws", "wss"],
        wsPath: "backend/socket", // remove leading slash
        encrypted: true,
        disableStats: true,
        authorizer: (channel) => ({
            authorize: async (socketId, callback) => {
                const token = await getToken(); // always get latest token
                try {
                    const res = await fetch(
                        "https://uat.nextmove.estate/backend/broadcasting/auth",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                                Authorization: token ? `Bearer ${token}` : "",
                            },
                            body: JSON.stringify({
                                socket_id: socketId,
                                channel_name: channel.name,
                            }),
                        }
                    );
                    const data = await res.json();
                    if (res.ok) callback(null, data);
                    else callback(new Error(data.message || "Auth failed"), { auth: "" });
                } catch (err) {
                    callback(err as Error, { auth: "" });
                }
            },
        }),
        client: new PusherNative("9zorypzleaccvncniixu", {
            wsHost: "uat.nextmove.estate",
            wsPort: 443,
            wssPort: 443,
            forceTLS: true,
            enabledTransports: ["ws", "wss"],
            disableStats: true,
            cluster: "",
        }),
    });

    const pusher = (echo.connector as any).pusher;
    pusher.logToConsole = true;
    pusher.connection.bind("connected", () => console.log("✅ WebSocket connected"));
    pusher.connection.bind("error", (err: any) => console.error("🔴 WS Error:", err));

    echoInstance = echo;
    return echo;
};

/**
 * Get Echo instance
 */
export const getEcho = async (): Promise<Echo> => {
    return await initEcho();
};

/**
 * Disconnect Echo
 */
export const disconnectEcho = () => {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
        console.log("🛑 Echo disconnected");
    } else {
        console.log("⚠️ No Echo instance to disconnect");
    }
};
