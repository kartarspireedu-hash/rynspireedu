/**
 * Razorpay Standard Checkout helper.
 * Loads checkout.js dynamically if needed and opens the modal.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    // Reuse an in-flight tag (preload) instead of adding a second script.
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
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
    // Phone/tablet friendliness: keep the sheet open when the user switches
    // to a UPI app and back, confirm before closing, and let the sheet
    // handle retries after a failed attempt.
    retry: { enabled: true },
    modal: {
      ondismiss: () => onDismiss && onDismiss(),
      confirm_close: true,
      escape: false,
      backdropclose: false,
    },
  };
  const rp = new window.Razorpay(options);
  rp.on("payment.failed", (resp) => onError && onError(resp.error));
  rp.open();
}
