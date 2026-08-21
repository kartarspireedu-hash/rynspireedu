import { useLocation } from "react-router-dom";

const WHATSAPP_NUMBER = "61480851790"; // +61 480 851 790 (Australia)
const WHATSAPP_MESSAGE = "Hi RynSpireEdu! I'd like to know more about your tutoring plans.";

export default function FloatingWhatsApp() {
  const location = useLocation();
  // Hide on focused flows (booking/payment/auth) to avoid distraction, same pattern as FloatingCTA.
  if (location.pathname.startsWith("/book-demo") || location.pathname === "/checkout" || location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      aria-label="Chat with us on WhatsApp"
      data-testid="floating-whatsapp"
      className="fixed left-4 bottom-24 sm:bottom-6 z-40 h-14 w-14 rounded-full bg-[#25D366] shadow-[0_10px_30px_rgba(37,211,102,0.45)] grid place-items-center hover:scale-105 active:scale-95 transition-transform"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="white" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.24.622 4.42 1.803 6.32L4 29l7.86-1.77A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7c-1.94 0-3.84-.52-5.5-1.5l-.395-.235-4.66 1.05 1.08-4.53-.257-.41A9.66 9.66 0 0 1 6.3 15c0-5.36 4.35-9.7 9.704-9.7 5.354 0 9.7 4.34 9.7 9.7 0 5.36-4.346 9.7-9.7 9.7Zm5.33-7.27c-.29-.145-1.72-.85-1.99-.945-.267-.097-.462-.145-.656.145-.194.29-.75.945-.92 1.14-.17.194-.34.218-.63.073-.29-.146-1.224-.451-2.332-1.44-.862-.769-1.444-1.719-1.613-2.01-.17-.29-.018-.447.127-.591.13-.13.29-.34.435-.51.146-.17.194-.29.29-.485.097-.194.049-.364-.024-.51-.073-.145-.656-1.58-.9-2.164-.237-.568-.478-.491-.656-.5l-.559-.01c-.194 0-.51.073-.777.364-.267.29-1.02.997-1.02 2.432s1.044 2.822 1.19 3.017c.146.194 2.055 3.14 4.98 4.404.696.3 1.238.48 1.662.615.698.222 1.334.19 1.836.115.56-.084 1.72-.703 1.963-1.382.243-.68.243-1.262.17-1.383-.073-.121-.267-.194-.558-.34Z" />
      </svg>
    </a>
  );
}
