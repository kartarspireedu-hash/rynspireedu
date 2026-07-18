import { Link } from "react-router-dom";
import BrandMark from "@/components/BrandMark";

const AU_CITIES = [
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra",
  "Gold Coast", "Newcastle", "Wollongong", "Hobart", "Darwin", "Geelong",
  "Sunshine Coast", "Townsville", "Cairns", "Toowoomba", "Ballarat", "Bendigo",
  "Launceston", "Mackay", "Rockhampton", "Bunbury", "Bundaberg", "Hervey Bay",
  "Wagga Wagga", "Coffs Harbour", "Gladstone", "Mildura", "Shepparton",
  "Port Macquarie", "Tamworth", "Orange", "Dubbo", "Geraldton", "Kalgoorlie",
  "Albany", "Nowra", "Warrnambool", "Alice Springs", "Broken Hill",
];

const NZ_CITIES = [
  "Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga",
  "Napier", "Hastings", "Dunedin", "Palmerston North", "Nelson",
  "Rotorua", "New Plymouth", "Whangarei", "Invercargill", "Whanganui",
  "Gisborne", "Timaru", "Blenheim", "Ashburton", "Levin",
  "Cambridge", "Queenstown", "Taupo", "Masterton", "Pukekohe",
  "Feilding", "Oamaru", "Havelock North", "Rangiora", "Warkworth",
];

function CityList({ cities }) {
  return (
    <p className="text-xs text-muted-foreground leading-6">
      {cities.map((c, i) => (
        <span key={c}>
          <Link to="/book-demo" className="hover:text-primary transition-colors">
            Tutor in {c}
          </Link>
          {i < cities.length - 1 && <span className="mx-1.5 text-border">—</span>}
        </span>
      ))}
    </p>
  );
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-border mt-16 pb-24 lg:pb-0" data-testid="site-footer">
      <div className="container-x py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <BrandMark size="md" />
          <p className="text-sm text-muted-foreground mt-4 max-w-sm leading-relaxed">
            Premium 1-to-1 online tutoring for Kindergarten to Year 12. A SpireEdu Services brand — trusted across Australia, New Zealand and worldwide.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">SpireEdu Services · RynSpireEdu</p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/pricing" className="hover:text-primary">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/book-demo" className="hover:text-primary">Book Free Demo</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:care@rynspireedu.com" className="hover:text-primary">care@rynspireedu.com</a></li>
            <li>Sydney · Auckland · London</li>
            <li><Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Payment Terms &amp; Conditions</Link></li>
            <li>© {new Date().getFullYear()} SpireEdu Services</li>
          </ul>
        </div>
      </div>

      {/* Local reach — SEO */}
      <div className="border-t border-border">
        <div className="container-x py-10 space-y-8">
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-3">Online Tutoring across Australia</h4>
            <CityList cities={AU_CITIES} />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-3">Online Tutoring across New Zealand</h4>
            <CityList cities={NZ_CITIES} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground pt-4 border-t border-border">
            RynSpireEdu — a brand of SpireEdu Services · Online lessons delivered anywhere. Local coordinator support for AU & NZ families.
          </p>
        </div>
      </div>
    </footer>
  );
}
