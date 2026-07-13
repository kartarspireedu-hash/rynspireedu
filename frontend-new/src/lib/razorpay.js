/**
 * Razorpay Standard Checkout helper.
 * Loads checkout.js dynamically if needed and opens the modal.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function openRazorpayCheckout({ keyId, order, customer, planKey, onSuccess, onDismiss, onError }) {
  const ok = await loadRazorpayScript();
  if (!ok) {
    onError && onError(new Error("Failed to load Razorpay"));
    return;
  }
  const options = {
    key: keyId,
    order_id: order.order_id,
    amount: order.amount,
    currency: order.currency,
    name: "RynSpireEdu",
    description: `${planKey || "Plan"} · Premium 1-to-1 Online Tutoring`,
    prefill: {
      name: customer?.name || "",
      email: customer?.email || "",
      contact: customer?.phone || "",
    },
    theme: { color: "#6b21a8" },
    handler: (response) => onSuccess && onSuccess(response),
    modal: { ondismiss: () => onDismiss && onDismiss() },
  };
  const rp = new window.Razorpay(options);
  rp.on("payment.failed", (resp) => onError && onError(resp.error));
  rp.open();
}
