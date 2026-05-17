export async function sendOrderConfirmationEmail(to: string, orderId: string, amount: number) {
  // In a real app, integrate Resend, Sendgrid, etc.
  console.log(`[EMAIL MOCK] Sending order confirmation to ${to} for order ${orderId} (₹${amount})`);
  return true;
}
