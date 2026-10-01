import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CustomQuotesPanel from "@/components/CustomQuotesPanel";

// Deliberately not linked anywhere in the site nav — reachable only at
// this exact URL, and still requires admin/owner login (ProtectedRoute
// in App.jsx). The same panel is also embedded directly in the Admin
// Dashboard's "Payment links" tab for everyday use.
export default function AdminCustomQuotes() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="container-x pt-10 pb-20 max-w-2xl mx-auto">
        <h1 className="font-display text-2xl">Custom payment links</h1>
        <div className="mt-1">
          <CustomQuotesPanel />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
