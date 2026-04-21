// supabase/functions/server/pesapal.tsx

const PESAPAL_URL = "https://cybil.pesapal.com/api"; // Use https://pay.pesapal.com/v3/api for live

export async function getPesapalAuth() {
  const response = await fetch(`${PESAPAL_URL}/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      consumer_key: "YOUR_CONSUMER_KEY",
      consumer_secret: "YOUR_CONSUMER_SECRET",
    }),
  });
  const data = await response.json();
  return data.token;
}

export async function initiatePesapalPayment(orderData: any) {
  const token = await getPesapalAuth();
  
  const payload = {
    id: orderData.id,
    currency: "UGX",
    amount: orderData.total,
    description: `Payment for ${orderData.itemName}`,
    callback_url: "https://your-website.com/my-library",
    notification_id: "YOUR_REGISTERED_IPN_ID",
    billing_address: {
      email_address: orderData.email,
      phone_number: orderData.phone,
      first_name: orderData.name,
    }
  };

  const response = await fetch(`${PESAPAL_URL}/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  return await response.json(); // This returns the redirect_url
}