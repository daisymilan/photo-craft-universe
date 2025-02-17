
const WEBHOOK_URL = "https://n8n.servenorobot.com/webhook/canva-webhook";

export const triggerWebhook = async (event: string, data: any) => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors", // Add this to handle CORS
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data,
        metadata: {
          userId: "anonymous", // We can update this when we add authentication
          platform: "web"
        }
      }),
    });

    // Since we're using no-cors mode, we won't get a JSON response
    // Instead, we'll return a success status
    return { success: true };
  } catch (error) {
    console.error("Error triggering webhook:", error);
    throw error; // Re-throw to handle in components
  }
};
