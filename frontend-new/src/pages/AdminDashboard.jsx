import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import api, { API_BASE } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LayoutDashboard, Users, GraduationCap, Calendar, ShieldCheck, DownloadCloud, CreditCard, Eye, Mail, Phone, MapPin, Clock, FileText } from "lucide-react";

const nav = [{ to: "/app/admin", label: "Overview", icon: LayoutDashboard, end: true }];

const roleColors = {
  admin: "bg-accent/20 border-accent/40",
  owner: "bg-primary/10 border-primary/40",
  tutor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  student: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30",
  parent: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // demo booking currently open
  const [statusBusy, setStatusBusy] = useState(false);

  const updateDemoStatus = async (newStatus) => {
    if (!selected) return;
    setStatusBusy(true);
    try {
      const { data } = await api.patch(`/admin/demos/${selected.id}`, { status: newStatus });
      setDemos((prev) => prev.map((d) => (d.id === data.id ? data : d)));
      setSelected(data);
      toast.success(`Status updated to "${newStatus}" — synced to Google Sheet.`);
    } catch (e) {
      toast.error(e.response?.data?.detail || "Could not update status");
    } finally {
      setStatusBusy(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [s, u, d] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users"),
          api.get("/admin/demos"),
        ]);
        setStats(s.data);
        setUsers(u.data);
        setDemos(d.data);
      } finally { setLoading(false); }
    })();
  }, []);

  const downloadCsv = () => {
    // Trigger download using cookie-auth session
    window.open(`${API_BASE}/admin/demos/export.csv`, "_blank");
  };

  const cards = stats ? [
    { label: "Total users", value: stats.users.total, icon: Users },
    { label: "Tutors", value: stats.users.tutors, icon: GraduationCap },
    { label: "Demo bookings", value: stats.demos.total, icon: Calendar },
    { label: "Paid orders", value: stats.payments.paid, icon: CreditCard },
  ] : [];

  return (
    <DashboardShell nav={nav} title="Admin overview">
      <div className="grid gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 lg:p-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/80">RynSpireEdu · SpireEdu Services</p>
            <h2 className="font-display text-2xl lg:text-3xl mt-2">Business overview</h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-lg">Demo bookings, users, and payments — at a glance.</p>
          </div>
          <ShieldCheck size={40} className="text-primary hidden sm:block" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((s) => (
            <div key={s.label} data-testid={`admin-stat-${s.label.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-2xl border border-border bg-card p-5 card-lift">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{s.label}</p>
                <s.icon size={16} className="text-accent" />
              </div>
              <p className="font-display text-3xl mt-3">{s.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="demos" className="w-full">
          <TabsList>
            <TabsTrigger value="demos" data-testid="tab-demos">Demo bookings</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="demos">
            <div className="rounded-2xl border border-border bg-card p-6 mt-4">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="font-display text-xl">Demo bookings</h3>
                  <p className="text-xs text-muted-foreground mt-1">Every free demo booked from the website.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-accent/40">{demos.length} total</Badge>
                  <Button onClick={downloadCsv} className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" data-testid="export-demos-csv">
                    <DownloadCloud size={14} className="mr-1.5" /> Export CSV
                  </Button>
                </div>
              </div>
              {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
              {!loading && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Class · Subject</TableHead>
                        <TableHead>When</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {demos.map((d) => (
                        <TableRow key={d.id} data-testid={`demo-row-${d.id}`}>
                          <TableCell className="font-medium">{d.name}</TableCell>
                          <TableCell className="text-xs">
                            <div>{d.email}</div>
                            <div className="text-muted-foreground">{d.phone}</div>
                          </TableCell>
                          <TableCell className="text-sm">{d.student_class} · {d.subject}</TableCell>
                          <TableCell className="text-sm font-mono">{d.demo_date} {d.demo_time}</TableCell>
                          <TableCell className="text-sm">{d.city}, {d.country}</TableCell>
                          <TableCell><Badge variant="outline" className="bg-accent/15 border-accent/40">{d.status}</Badge></TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" className="pill-btn h-8" onClick={() => setSelected(d)} data-testid={`view-demo-${d.id}`}>
                              <Eye size={12} className="mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {demos.length === 0 && (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">No demo bookings yet.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="rounded-2xl border border-border bg-card p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl">All users</h3>
                <Badge variant="outline" className="border-accent/40">{users.length} total</Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} data-testid={`user-row-${u.id}`}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                        <TableCell><Badge variant="outline" className={roleColors[u.role] || ""}>{u.role}</Badge></TableCell>
                        <TableCell className="text-sm">{u.country || "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Demo Details Modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg" data-testid="demo-details-dialog">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl flex items-center gap-2">
                  {selected.name}
                  <Badge variant="outline" className="bg-accent/15 border-accent/40 text-xs">{selected.status}</Badge>
                </DialogTitle>
                <DialogDescription className="text-xs font-mono">Booking ID · {selected.id}</DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-secondary/60 border border-border p-3 flex items-start gap-2">
                    <Mail size={14} className="text-primary mt-0.5" />
                    <div><div className="text-xs text-muted-foreground">Email</div><div className="break-all">{selected.email}</div></div>
                  </div>
                  <div className="rounded-xl bg-secondary/60 border border-border p-3 flex items-start gap-2">
                    <Phone size={14} className="text-primary mt-0.5" />
                    <div><div className="text-xs text-muted-foreground">Phone</div><div>{selected.phone}</div></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-secondary/60 border border-border p-3 flex items-start gap-2">
                    <MapPin size={14} className="text-primary mt-0.5" />
                    <div><div className="text-xs text-muted-foreground">Location</div><div>{selected.city}, {selected.country}</div></div>
                  </div>
                  <div className="rounded-xl bg-secondary/60 border border-border p-3 flex items-start gap-2">
                    <Clock size={14} className="text-primary mt-0.5" />
                    <div><div className="text-xs text-muted-foreground">Demo Slot</div><div className="font-mono">{selected.demo_date} · {selected.demo_time}</div><div className="text-xs text-muted-foreground">{selected.timezone}</div></div>
                  </div>
                </div>
                <div className="rounded-xl bg-accent/10 border border-accent/40 p-3">
                  <div className="text-xs uppercase tracking-[0.15em] text-primary/80">Requested demo</div>
                  <div className="font-display text-lg mt-1">{selected.subject} · {selected.student_class}</div>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1"><FileText size={12} /> Additional notes</div>
                  <p className="mt-1 text-sm leading-relaxed">{selected.additional_notes || <span className="text-muted-foreground italic">— none —</span>}</p>
                </div>
                <div className="text-xs text-muted-foreground">Booked {new Date(selected.created_at).toLocaleString()}</div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <Select value={selected.status} onValueChange={updateDemoStatus} disabled={statusBusy}>
                    <SelectTrigger className="w-36 rounded-xl h-9" data-testid="demo-status-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <Button asChild variant="outline" className="pill-btn" data-testid="demo-email-link"><a href={`mailto:${selected.email}`}><Mail size={12} className="mr-1" /> Email</a></Button>
                  <Button asChild className="pill-btn bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground" data-testid="demo-call-link"><a href={`tel:${selected.phone}`}><Phone size={12} className="mr-1" /> Call</a></Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
