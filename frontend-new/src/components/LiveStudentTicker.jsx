import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, User } from "lucide-react";

// Arrays specifically curated for Australia & New Zealand
const FIRST_NAMES = [
  "Oliver", "Charlotte", "Noah", "Amelia", "William", "Isla", "Jack", "Mia",
  "Leo", "Ava", "Lucas", "Grace", "Henry", "Zoe", "Ethan", "Ruby",
  "Liam", "Sophie", "Xavier", "Chloe", "Hunter", "Ella", "Cooper", "Willow",
  "Aarav", "Anaya", "Vihaan", "Diya", "Kabir", "Aanya", "Arjun", "Ishika",
  "Manaia", "Aroha", "Kauri", "Anahera", "Tane", "Waimarie", "Nikau", "Hinewai",
  "Wei", "Mei", "Jayden", "Priya", "Rohan", "Emma", "Harper", "Levi",
  "Thomas", "Olivia", "James", "Harriet", "Archie", "Matilda", "George", "Frankie",
  "Riley", "Indie", "Beau", "Sienna"
];

const LAST_NAMES = [
  "Smith", "Jones", "Wilson", "Brown", "Taylor", "Anderson", "Nguyen", "Singh",
  "Patel", "Ngata", "Thompson", "White", "Martin", "Williams", "Lee", "Kaur",
  "Walker", "Harris", "Clark", "Kelly", "Robinson", "Chen", "Ali", "Campbell"
];

const YEARS = ["Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11"];

const SUBJECTS = [
  "Mathematics", "English", "Physics", "Chemistry", "Biology",
  "Economics", "Computer Science", "IELTS", "PTE", "Coding",
];

const TUTORS = [
  "Dr. Priya Sharma", "James O'Connor", "Aditi Verma", "Ryan Chen",
  "Sarah Williams", "Manpreet Singh", "Emily Thompson", "Aroha Ngata",
  "David Wilson", "Neha Kapoor", "Liam Anderson", "Fiona Campbell",
];

const CITIES = [
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Canberra",
  "Gold Coast", "Auckland", "Wellington", "Christchurch", "Hamilton", "Dunedin",
];

// Deterministic index into total 8,640 (60 * 24 * 6) student combos
const TOTAL = FIRST_NAMES.length * LAST_NAMES.length * YEARS.length; // 8640

function studentAt(idx) {
  const i = ((idx % TOTAL) + TOTAL) % TOTAL;
  const yearIdx = i % YEARS.length;
  const q1 = Math.floor(i / YEARS.length);
  const lastIdx = q1 % LAST_NAMES.length;
  const firstIdx = Math.floor(q1 / LAST_NAMES.length) % FIRST_NAMES.length;
  return {
    name: `${FIRST_NAMES[firstIdx]} ${LAST_NAMES[lastIdx]}`,
    year: YEARS[yearIdx],
    subject: SUBJECTS[(i * 7) % SUBJECTS.length],
    tutor: TUTORS[(i * 11) % TUTORS.length],
    city: CITIES[(i * 13) % CITIES.length],
  };
}

export default function LiveStudentTicker() {
  const start = useMemo(() => Math.floor(Math.random() * TOTAL), []);
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => n + 1), 10000);
    return () => clearInterval(id);
  }, []);

  const s = studentAt(start + i);

  return (
    <div className="mx-auto max-w-3xl rounded-3xl sm:rounded-full border border-border bg-card/70 backdrop-blur-md px-4 sm:px-5 py-3 sm:py-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1.5 shadow-[0_8px_32px_rgba(10,25,47,0.06)]" data-testid="live-student-ticker">
      <span className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-accent shrink-0">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        Live
      </span>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -6, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="flex-1 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm min-w-0"
        >
          <span className="flex items-center gap-1.5"><User size={14} className="text-accent shrink-0" /><span className="font-medium">{s.name}</span></span>
          <span className="text-muted-foreground text-xs">{s.year}</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><BookOpen size={12} /> {s.subject}</span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><GraduationCap size={12} /> {s.tutor}</span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground sm:ml-auto">{s.city}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
