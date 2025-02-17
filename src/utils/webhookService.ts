
const WEBHOOK_URL = "https://n8n.servenorobot.com/webhook/canva-webhook";

export const triggerWebhook = async (event: string, data: any) => {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

    if (!response.ok) {
      console.error("Webhook trigger failed:", await response.text());
      throw new Error(`Webhook failed with status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error triggering webhook:", error);
    throw error; // Re-throw to handle in components
  }
};
