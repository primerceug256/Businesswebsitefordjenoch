// supabase/functions/server/pesapal_logic.tsx

const IS_LIVE = true; // SET TO TRUE WHEN YOU GO LIVE
const BASE_URL = IS_LIVE ? "https://pay.pesapal.com/v3/api" : "https://cybil.pesapal.com/api";

const CONSUMER_KEY = "YOUR_PESAPAL_CONSUMER_KEY"; 
const CONSUMER_SECRET = "YOUR_PESAPAL_CONSUMER_SECRET";

export async function getPesapalToken() {
  const res = await fetch(`${BASE_URL}/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ consumer_key: CONSUMER_KEY, consumer_secret: CONSUMER_SECRET }),
  });
  const data = await res.json();
  return data.token;
}

export async function registerIPN(token: string) {
  const res = await fetch(`${BASE_URL}/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({
      url: `https://nlhpnvzpbceolsbozrjw.supabase.co/functions/v1/make-server-98d801c7/payments/pesapal-ipn`,
      ipn_notification_type: "GET"
    })
  });
  const data = await res.json();
  return data.ipn_id; 
}

export async function createPesapalOrder(token: string, ipnId: string, orderData: any) {
  const payload = {
    id: orderData.orderId,
    currency: "UGX",
    amount: orderData.total,
    description: "Digital Products - DJ Enoch Pro",
    callback_url: "https://your-website.com/my-library", 
    notification_id: ipnId,
    billing_address: {
      email_address: orderData.email,
      phone_number: "0747816444",
      first_name: orderData.name,
    }
  };

  const res = await fetch(`${BASE_URL}/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  return await res.json();
}