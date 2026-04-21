// supabase/functions/server/pesapal_logic.tsx

const IS_LIVE = false; // Set to true when you go live
const PESAPAL_BASE_URL = IS_LIVE 
  ? "https://pay.pesapal.com/v3/api" 
  : "https://cybil.pesapal.com/api";

const CONSUMER_KEY = "YOUR_PESAPAL_KEY";
const CONSUMER_SECRET = "YOUR_PESAPAL_SECRET";

// 1. Get Access Token
export async function getPesapalToken() {
  const res = await fetch(`${PESAPAL_BASE_URL}/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
    }),
  });
  const data = await res.json();
  return data.token;
}

// 2. Register IPN (You only need to do this once to get an IPN_ID)
// This tells Pesapal where to send "Success" signals
export async function registerIPN(token: string, siteUrl: string) {
  const res = await fetch(`${PESAPAL_BASE_URL}/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      url: `${siteUrl}/functions/v1/make-server-98d801c7/payments/pesapal-ipn`,
      ipn_notification_type: "GET"
    })
  });
  const data = await res.json();
  return data.ipn_id; // Save this value!
}

// 3. Create Payment Session
export async function createPesapalOrder(token: string, ipnId: string, orderData: any) {
  const payload = {
    id: orderData.orderId,
    currency: "UGX",
    amount: orderData.total,
    description: "Digital Products - DJ Enoch Pro",
    callback_url: orderData.redirectUrl, // Where user returns after paying
    notification_id: ipnId,
    billing_address: {
      email_address: orderData.email,
      phone_number: orderData.phone || "0747816444",
      first_name: orderData.name,
    }
  };

  const res = await fetch(`${PESAPAL_BASE_URL}/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  return await res.json();
}