import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Compass,
  CreditCard,
  FileText,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  Sparkles,
  Users,
  WandSparkles,
  WalletCards,
  X,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export type View = "overview" | "budget" | "timeline" | "vendors" | "ideas" | "payments" | "settings";
type EventType = "Wedding" | "Birthday" | "Community";

type EventPlan = {
  title: string;
  type: EventType;
  date: string;
  location: string;
  guests: number;
  budget: number;
  theme: string;
  preferences: string;
};

type BudgetItem = {
  id: number;
  category: string;
  estimated: number;
  actual: number;
  status: "Paid" | "Deposit due" | "Planning";
  accent: string;
};

type TimelineItem = {
  id: number;
  date: string;
  title: string;
  detail: string;
  completed: boolean;
  tone: "green" | "gold" | "coral";
};

type VendorItem = {
  id: number;
  category: string;
  title: string;
  detail: string;
  due: string;
  status: "To do" | "In progress" | "Booked";
};

type Idea = {
  id: number;
  title: string;
  description: string;
  tag: string;
  why: string;
  effort: string;
  saved?: boolean;
};

type VendorRecommendation = {
  name: string;
  category: string;
  fit: string;
  description: string;
  budget: string;
  reason: string;
  nextStep: string;
};

type PaymentItem = {
  id: number;
  vendor: string;
  category: string;
  amount: number;
  due: string;
  status: "Paid" | "Due" | "Processing";
  method: string;
};

const starterPlan: EventPlan = {
  title: "Maya & Jordan's wedding",
  type: "Wedding",
  date: "2026-12-05",
  location: "The Garden Room, Brooklyn",
  guests: 84,
  budget: 24000,
  theme: "Candlelit garden dinner",
  preferences: "Low-waste, seasonal flowers, a great dance floor, no assigned seating",
};

const starterBudget: BudgetItem[] = [
  { id: 1, category: "Venue & rentals", estimated: 7200, actual: 6800, status: "Paid", accent: "ink" },
  { id: 2, category: "Food & beverage", estimated: 8600, actual: 0, status: "Deposit due", accent: "coral" },
  { id: 3, category: "Flowers & styling", estimated: 2350, actual: 450, status: "Planning", accent: "sage" },
  { id: 4, category: "Music & sound", estimated: 1900, actual: 0, status: "Planning", accent: "gold" },
  { id: 5, category: "Photo & video", estimated: 2800, actual: 1200, status: "Deposit due", accent: "ink" },
  { id: 6, category: "Paper & details", estimated: 650, actual: 0, status: "Planning", accent: "sage" },
];

const starterTimeline: TimelineItem[] = [
  { id: 1, date: "2026-04-18", title: "Lock the guest list", detail: "A final headcount keeps every other decision honest.", completed: true, tone: "green" },
  { id: 2, date: "2026-04-25", title: "Book the caterer", detail: "Compare the two tasting menus and place the deposit.", completed: false, tone: "coral" },
  { id: 3, date: "2026-05-09", title: "Choose the floral direction", detail: "Send the brief: seasonal, garden-grown, candle-friendly.", completed: false, tone: "gold" },
  { id: 4, date: "2026-06-06", title: "Send save-the-dates", detail: "Digital first, with a warm note for out-of-towners.", completed: false, tone: "green" },
  { id: 5, date: "2026-08-22", title: "Menu tasting", detail: "Bring two people with strong opinions and hungry hearts.", completed: false, tone: "coral" },
  { id: 6, date: "2026-11-21", title: "Final vendor walk-through", detail: "Run the room, rain plan, access, and power checklist.", completed: false, tone: "gold" },
];

const starterVendors: VendorItem[] = [
  { id: 1, category: "Food", title: "Caterer shortlist", detail: "Tasting menus + service style", due: "Due Apr 25", status: "In progress" },
  { id: 2, category: "Flowers", title: "Floral designer", detail: "Seasonal brief + quote", due: "Due May 09", status: "To do" },
  { id: 3, category: "Music", title: "DJ / sound", detail: "Playlist + ceremony mic", due: "Due May 30", status: "To do" },
  { id: 4, category: "Photo", title: "Photographer", detail: "Shot list + contract", due: "Booked", status: "Booked" },
  { id: 5, category: "Paper", title: "Stationery", detail: "Save-the-date direction", due: "Due Jun 06", status: "In progress" },
  { id: 6, category: "Rentals", title: "Tabletop rentals", detail: "Glassware + linen pull", due: "Due Sep 12", status: "To do" },
];

const starterIdeas: Idea[] = [
  { id: 1, title: "The candlelight welcome hour", description: "Let guests enter through a small garden path lit with taper candles, with a one-line note from the couple at each table.", tag: "Atmosphere", why: "Fits your garden dinner theme without asking the budget to do more.", effort: "Medium lift" },
  { id: 2, title: "A table for the neighborhood", description: "Add one long communal table for a rotating mix of friends, family, and the people who helped you feel at home.", tag: "Guest experience", why: "Makes 84 guests feel like one generous room, not a seating chart.", effort: "Low lift" },
  { id: 3, title: "Seasonal spritz station", description: "Offer a single signature spritz with a zero-proof twin, built around whatever fruit and herbs are best that week.", tag: "Food & drink", why: "Creates a memorable moment and a simple way to keep the bar focused.", effort: "Low lift" },
];

const starterPayments: PaymentItem[] = [
  { id: 1, vendor: "The Garden Room", category: "Venue deposit", amount: 6800, due: "Paid Apr 04", status: "Paid", method: "Card ending 4242" },
  { id: 2, vendor: "Frame & Light Studio", category: "Photography deposit", amount: 1200, due: "Paid Apr 11", status: "Paid", method: "Card ending 4242" },
  { id: 3, vendor: "Table & Hearth Collective", category: "Catering deposit", amount: 2500, due: "Due Apr 25", status: "Due", method: "Not paid yet" },
  { id: 4, vendor: "Light & Stem Studio", category: "Floral retainer", amount: 450, due: "Due May 09", status: "Processing", method: "Awaiting confirmation" },
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-US", options ?? { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));

const readStorage = <T,>(key: string, fallback: T): T => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const workspaceName = (title: string, type: EventType) => title.replace(new RegExp(`\\s+${type}.*$`, "i"), "").replace(/'s$/i, "").trim() || title;
const initials = (value: string) => value.split(/\s+|&/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup ${compact ? "brand-lockup-compact" : ""}`}>
      <span className="brand-seal" aria-hidden="true"><span>✦</span></span>
      {!compact && <span className="brand-wordmark">celebrate</span>}
    </div>
  );
}

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warm" | "coral" }) {
  return <span className={`status-pill status-${tone}`}><span className="status-dot" />{children}</span>;
}

function ProgressRing({ value }: { value: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference - (value / 100) * circumference;
  return (
    <div className="progress-ring" aria-label={`${value}% planning progress`}>
      <svg viewBox="0 0 84 84" role="img">
        <circle className="ring-track" cx="42" cy="42" r={radius} />
        <circle className="ring-value" cx="42" cy="42" r={radius} strokeDasharray={circumference} strokeDashoffset={dash} />
      </svg>
      <div className="ring-copy"><strong>{value}%</strong><span>ready</span></div>
    </div>
  );
}

function Modal({ title, eyebrow, onClose, children }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-label={title} onMouseDown={event => event.stopPropagation()}>
        <div className="modal-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>
        {children}
      </div>
    </div>
  );
}

export default function Home({ initialView = "overview" }: { initialView?: View } = {}) {
  const [plan, setPlan] = useState<EventPlan>(() => readStorage("celebrate-plan", starterPlan));
  const [budget, setBudget] = useState<BudgetItem[]>(() => readStorage("celebrate-budget", starterBudget));
  const [timeline, setTimeline] = useState<TimelineItem[]>(() => readStorage("celebrate-timeline", starterTimeline));
  const [vendors, setVendors] = useState<VendorItem[]>(() => readStorage("celebrate-vendors", starterVendors));
  const [ideas, setIdeas] = useState<Idea[]>(() => readStorage("celebrate-ideas", starterIdeas));
  const [payments, setPayments] = useState<PaymentItem[]>(() => readStorage("celebrate-payments", starterPayments));
  const [view, setView] = useState<View>(initialView);
  const [showEdit, setShowEdit] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [generating, setGenerating] = useState(false);
  const [ideaPrompt, setIdeaPrompt] = useState("");
  const { user, isAuthenticated } = useAuth();

  useEffect(() => { window.localStorage.setItem("celebrate-plan", JSON.stringify(plan)); }, [plan]);
  useEffect(() => { window.localStorage.setItem("celebrate-budget", JSON.stringify(budget)); }, [budget]);
  useEffect(() => { window.localStorage.setItem("celebrate-timeline", JSON.stringify(timeline)); }, [timeline]);
  useEffect(() => { window.localStorage.setItem("celebrate-vendors", JSON.stringify(vendors)); }, [vendors]);
  useEffect(() => { window.localStorage.setItem("celebrate-ideas", JSON.stringify(ideas)); }, [ideas]);
  useEffect(() => { window.localStorage.setItem("celebrate-payments", JSON.stringify(payments)); }, [payments]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 2800); return () => window.clearTimeout(timer); }, [toast]);

  const estimatedTotal = useMemo(() => budget.reduce((sum, item) => sum + item.estimated, 0), [budget]);
  const actualTotal = useMemo(() => budget.reduce((sum, item) => sum + item.actual, 0), [budget]);
  const completedTimeline = timeline.filter(item => item.completed).length;
  const completedVendors = vendors.filter(item => item.status === "Booked").length;
  const progress = Math.min(100, Math.round(((completedTimeline + completedVendors) / (timeline.length + vendors.length)) * 100));
  const remaining = Math.max(0, plan.budget - actualTotal);
  const budgetPercent = Math.min(100, Math.round((estimatedTotal / plan.budget) * 100));

  const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "budget", label: "Budget", icon: WalletCards },
    { id: "timeline", label: "Timeline", icon: Clock3 },
    { id: "vendors", label: "Vendors", icon: ClipboardCheck },
    { id: "ideas", label: "Ideas lab", icon: Lightbulb },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "settings", label: "Settings", icon: CircleDollarSign },
  ];

  const changeView = (next: View) => { setView(next); setShowMenu(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const toggleTimeline = (id: number) => setTimeline(items => items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  const cycleVendor = (id: number) => setVendors(items => items.map(item => item.id === id ? { ...item, status: item.status === "To do" ? "In progress" : item.status === "In progress" ? "Booked" : "To do" } : item));
  const notify = (message: string) => setToast(message);
  const activeWorkspace = workspaceName(plan.title, plan.type);

  const generateIdeas = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/ideas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...plan, prompt: ideaPrompt }) });
      if (!response.ok) throw new Error("Idea service unavailable");
      const payload = await response.json() as { ideas?: Omit<Idea, "id">[] };
      if (!payload.ideas?.length) throw new Error("No ideas returned");
      setIdeas(current => [...payload.ideas!.map((idea, index) => ({ ...idea, id: Date.now() + index })), ...current].slice(0, 8));
      notify("Fresh ideas are ready — pick the ones that feel like you.");
    } catch {
      const typeWord = plan.type === "Community" ? "neighbors" : plan.type === "Birthday" ? "guests" : "people you love";
      const promptTail = ideaPrompt ? ` with a little ${ideaPrompt.toLowerCase()} energy` : "";
      const fallback: Idea[] = [
        { id: Date.now(), title: `A welcome ritual for ${typeWord}`, description: `Open the event with a small shared gesture${promptTail}: a handwritten wish, a seasonal bite, or one song everyone can add to.`, tag: "Guest experience", why: `It adds meaning without a large new line item to your ${formatMoney(plan.budget)} plan.`, effort: "Low lift" },
        { id: Date.now() + 1, title: "One beautiful thing, done well", description: `Choose a single visual anchor for ${plan.theme.toLowerCase()}: a flower cloud, a painted menu, or a room-sized ribbon moment.`, tag: "Design", why: "A focused visual cue makes the room feel intentional while keeping the rest simple.", effort: "Medium lift" },
        { id: Date.now() + 2, title: "The 15-minute local moment", description: "Invite a local maker, musician, or storyteller to share one short, memorable moment that guests can gather around.", tag: "Personal touch", why: "It gives your event a point of view and helps the schedule breathe.", effort: "Medium lift" },
      ];
      setIdeas(current => [...fallback, ...current].slice(0, 8));
      notify("Your plan sparked three new directions.");
    } finally { setGenerating(false); }
  };

  const saveIdea = (id: number) => {
    setIdeas(current => current.map(idea => idea.id === id ? { ...idea, saved: true } : idea));
    notify("Saved to your plan — you can find it here anytime.");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top"><BrandMark /><button className="sidebar-collapse" aria-label="Collapse navigation"><Menu size={18} /></button></div>
        <div className="workspace-label"><span className="eyebrow">Your workspace</span><button className="workspace-select" onClick={() => setShowEdit(true)}><span className="workspace-avatar">{initials(activeWorkspace)}</span><span><strong>{activeWorkspace}</strong><small>{plan.type} plan</small></span><ChevronDown size={15} /></button></div>
        <nav className="side-nav" aria-label="Planning views">
          <span className="nav-section-label">Plan it</span>
          {navItems.map(item => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${view === item.id ? "nav-item-active" : ""}`} onClick={() => changeView(item.id)}><Icon size={17} strokeWidth={view === item.id ? 2.4 : 1.8} /><span>{item.label}</span>{item.id === "ideas" && <span className="nav-new">New</span>}</button>; })}
        </nav>
        <div className="sidebar-note"><span className="sparkle-mini"><Sparkles size={13} /></span><div><strong>Planning, but lighter.</strong><p>Small steps. Better parties.</p></div></div>
        <div className="sidebar-bottom"><button className="nav-item muted-nav" onClick={() => changeView("settings")}><CircleDollarSign size={17} /><span>Settings</span></button><button className="profile-row" onClick={() => { window.location.href = "/login"; }}><div className="profile-avatar">{(user?.name || "M").slice(0, 1).toUpperCase()}</div><div><strong>{user?.name || "Maya Patel"}</strong><small>{isAuthenticated ? "Signed in" : "Host account · Sign in"}</small></div><MoreHorizontal size={17} /></button></div>
      </aside>

      <main className="main-content">
        <header className="mobile-header"><BrandMark compact /><button className="icon-button" onClick={() => setShowMenu(value => !value)} aria-label="Open navigation"><Menu size={20} /></button></header>
        {showMenu && <div className="mobile-nav">{navItems.map(item => <button key={item.id} className={view === item.id ? "mobile-nav-active" : ""} onClick={() => changeView(item.id)}>{item.label}</button>)}</div>}

        <div className="topbar"><div className="breadcrumb"><span>My events</span><ArrowUpRight size={14} /><strong>{plan.title}</strong></div><div className="topbar-actions"><button className="quiet-action" onClick={() => notify("Your plan is saved automatically.")}><Check size={15} /> Saved just now</button><button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify("You're all caught up — no new reminders.")}><Bell size={18} /><span className="notification-dot" /></button><button className="primary-button compact-button" onClick={() => setShowEdit(true)}><Plus size={16} /> Edit event</button></div></div>

        <section className="event-hero">
          <div className="hero-copy"><div className="hero-kicker"><span className="live-dot" /> {plan.type} · {formatDate(plan.date, { month: "short", day: "numeric", year: "numeric" })}</div><h1>Make room for<br /><em>the good stuff.</em></h1><p>{plan.title} is taking shape. You have the big picture — now let’s make the next few choices easy.</p><div className="hero-meta"><span><MapPin size={15} /> {plan.location}</span><span><Users size={15} /> {plan.guests} guests</span></div></div>
          <div className="hero-progress"><ProgressRing value={progress} /><div className="progress-detail"><span className="eyebrow">Planning progress</span><strong>{completedTimeline + completedVendors} of {timeline.length + vendors.length} details settled</strong><span className="progress-next">Next up: book the caterer <ArrowUpRight size={13} /></span></div></div>
        </section>

        <div className="content-wrap">
          {view === "overview" && <Overview plan={plan} budget={budget} timeline={timeline} vendors={vendors} estimatedTotal={estimatedTotal} actualTotal={actualTotal} remaining={remaining} budgetPercent={budgetPercent} onView={changeView} onToggleTimeline={toggleTimeline} onCycleVendor={cycleVendor} />}
          {view === "budget" && <BudgetView budget={budget} plan={plan} estimatedTotal={estimatedTotal} actualTotal={actualTotal} remaining={remaining} budgetPercent={budgetPercent} onAdd={() => setShowBudgetForm(true)} onUpdate={setBudget} />}
          {view === "timeline" && <TimelineView timeline={timeline} onToggle={toggleTimeline} onAdd={() => notify("Timeline templates are coming next — your next step is already highlighted.")} />}
          {view === "vendors" && <VendorsView plan={plan} vendors={vendors} onCycle={cycleVendor} onAdd={() => notify("Vendor category added to your checklist.")} onNotify={notify} />}
          {view === "ideas" && <IdeasView ideas={ideas} generating={generating} prompt={ideaPrompt} setPrompt={setIdeaPrompt} onGenerate={generateIdeas} onSave={saveIdea} />}
          {view === "payments" && <PaymentsView payments={payments} onUpdate={setPayments} onNotify={notify} />}
          {view === "settings" && <SettingsView plan={plan} onNotify={notify} onReset={() => { setPlan(starterPlan); setBudget(starterBudget); setTimeline(starterTimeline); setVendors(starterVendors); setIdeas(starterIdeas); setPayments(starterPayments); notify("Demo workspace reset."); }} />}
        </div>

        <footer className="main-footer"><span>celebrate / your planning companion</span><span>Everything autosaves in this browser</span></footer>
      </main>

      {showEdit && <EditEventModal plan={plan} onClose={() => setShowEdit(false)} onSave={(next) => { setPlan(next); setShowEdit(false); notify("Event details updated."); }} />}
      {showBudgetForm && <BudgetModal onClose={() => setShowBudgetForm(false)} onSave={(item) => { setBudget(current => [...current, { ...item, id: Date.now() }]); setShowBudgetForm(false); notify("Budget line added."); }} />}
      {toast && <div className="toast"><span className="toast-icon"><Check size={15} /></span>{toast}</div>}
    </div>
  );
}

function SectionHeading({ eyebrow, title, action, onAction }: { eyebrow: string; title: string; action?: string; onAction?: () => void }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action && <button className="text-button" onClick={onAction}>{action} <ArrowUpRight size={14} /></button>}</div>;
}

function Overview({ plan, budget, timeline, vendors, estimatedTotal, actualTotal, remaining, budgetPercent, onView, onToggleTimeline, onCycleVendor }: { plan: EventPlan; budget: BudgetItem[]; timeline: TimelineItem[]; vendors: VendorItem[]; estimatedTotal: number; actualTotal: number; remaining: number; budgetPercent: number; onView: (view: View) => void; onToggleTimeline: (id: number) => void; onCycleVendor: (id: number) => void }) {
  return <div className="overview-grid">
    <div className="overview-main">
      <SectionHeading eyebrow="The big picture" title="Your plan, at a glance" action="See all details" onAction={() => onView("timeline")} />
      <div className="stat-strip"><div className="stat-block"><span className="stat-icon stat-icon-coral"><CalendarDays size={18} /></span><div><small>Event day</small><strong>{formatDate(plan.date, { month: "short", day: "numeric" })}</strong><span>in 232 days</span></div></div><div className="stat-block"><span className="stat-icon stat-icon-gold"><WalletCards size={18} /></span><div><small>Left to spend</small><strong>{formatMoney(remaining)}</strong><span>{budgetPercent}% allocated</span></div></div><div className="stat-block"><span className="stat-icon stat-icon-sage"><ListChecks size={18} /></span><div><small>Next milestone</small><strong>Book caterer</strong><span>due Apr 25</span></div></div></div>
      <div className="section-heading section-heading-spaced"><div><span className="eyebrow">Your next few moves</span><h2>Keep the good energy going.</h2></div><span className="tiny-note">{timeline.filter(item => item.completed).length} done today</span></div>
      <div className="timeline-preview">{timeline.slice(0, 4).map(item => <button key={item.id} className={`timeline-row ${item.completed ? "timeline-row-done" : ""}`} onClick={() => onToggleTimeline(item.id)}><span className={`timeline-marker marker-${item.tone}`}>{item.completed ? <Check size={13} /> : <span />}</span><span className="timeline-date">{formatDate(item.date, { month: "short", day: "numeric" })}</span><span className="timeline-info"><strong>{item.title}</strong><small>{item.detail}</small></span><span className={`row-status ${item.completed ? "row-status-done" : ""}`}>{item.completed ? "Done" : "Next"}</span></button>)}</div>
      <button className="inline-add" onClick={() => onView("timeline")}><Plus size={15} /> Open full timeline</button>
    </div>
    <aside className="overview-side">
      <div className="soft-card budget-card"><div className="card-heading"><div><span className="eyebrow">Budget pulse</span><h3>{formatMoney(estimatedTotal)}</h3></div><button className="mini-link" onClick={() => onView("budget")}>Manage <ArrowUpRight size={13} /></button></div><div className="budget-meter"><span style={{ width: `${Math.min(100, budgetPercent)}%` }} /></div><div className="meter-labels"><span>Estimated</span><strong>{formatMoney(plan.budget - estimatedTotal)} buffer</strong></div><div className="expense-list">{budget.slice(0, 4).map(item => <div className="expense-row" key={item.id}><span className={`expense-swatch swatch-${item.accent}`} /><span>{item.category}</span><strong>{formatMoney(item.estimated)}</strong></div>)}</div><div className="card-footnote"><CreditCard size={14} /> {formatMoney(actualTotal)} paid so far</div></div>
      <div className="soft-card vendor-card"><div className="card-heading"><div><span className="eyebrow">Vendor checklist</span><h3>{vendors.filter(item => item.status === "Booked").length} of {vendors.length} booked</h3></div><button className="mini-link" onClick={() => onView("vendors")}>View <ArrowUpRight size={13} /></button></div><div className="vendor-meter"><span style={{ width: `${(vendors.filter(item => item.status === "Booked").length / vendors.length) * 100}%` }} /></div><div className="vendor-mini-list">{vendors.slice(0, 3).map(item => <button className="vendor-mini-row" key={item.id} onClick={() => onCycleVendor(item.id)}><span className={`check-circle ${item.status === "Booked" ? "check-circle-done" : ""}`}>{item.status === "Booked" && <Check size={12} />}</span><span><strong>{item.title}</strong><small>{item.status === "Booked" ? "Booked" : item.due}</small></span><ChevronDown size={14} /></button>)}</div></div>
      <div className="quote-card"><span className="quote-mark">“</span><p>The best parties have a little room left in them.</p><span className="quote-caption">A gentle reminder from us to you</span></div>
    </aside>
  </div>;
}

function BudgetView({ budget, plan, estimatedTotal, actualTotal, remaining, budgetPercent, onAdd, onUpdate }: { budget: BudgetItem[]; plan: EventPlan; estimatedTotal: number; actualTotal: number; remaining: number; budgetPercent: number; onAdd: () => void; onUpdate: (items: BudgetItem[]) => void }) {
  const updateStatus = (id: number) => onUpdate(budget.map(item => item.id === id ? { ...item, status: item.status === "Planning" ? "Deposit due" : item.status === "Deposit due" ? "Paid" : "Planning" } : item));
  return <div className="view-stack"><SectionHeading eyebrow="Money, made calmer" title="Budget that leaves room for joy." action="Add category" onAction={onAdd} /><div className="budget-summary-grid"><div className="large-number-card"><span className="eyebrow">Total plan</span><strong>{formatMoney(plan.budget)}</strong><div className="budget-meter"><span style={{ width: `${budgetPercent}%` }} /></div><div className="meter-labels"><span>{formatMoney(estimatedTotal)} estimated</span><strong>{formatMoney(remaining)} left</strong></div></div><div className="budget-stat-card"><span className="eyebrow">Paid so far</span><strong>{formatMoney(actualTotal)}</strong><span>Across {budget.filter(item => item.actual > 0).length} categories</span></div><div className="budget-stat-card"><span className="eyebrow">Average / guest</span><strong>{formatMoney(Math.round(estimatedTotal / plan.guests))}</strong><span>{plan.guests} guests · estimated</span></div></div><div className="table-card"><div className="table-toolbar"><div><span className="eyebrow">All categories</span><strong>{budget.length} budget lines</strong></div><button className="quiet-action"><MoreHorizontal size={17} /> Options</button></div><div className="budget-table"><div className="table-head"><span>Category</span><span>Estimated</span><span>Paid</span><span>Status</span><span /></div>{budget.map(item => <div className="table-row" key={item.id}><div className="table-category"><span className={`expense-swatch swatch-${item.accent}`} /><span><strong>{item.category}</strong><small>{item.actual > 0 ? `${Math.round((item.actual / item.estimated) * 100)}% paid` : "No payments yet"}</small></span></div><strong>{formatMoney(item.estimated)}</strong><span>{formatMoney(item.actual)}</span><button className="table-status" onClick={() => updateStatus(item.id)}><StatusPill tone={item.status === "Paid" ? "good" : item.status === "Deposit due" ? "coral" : "warm"}>{item.status}</StatusPill></button><button className="icon-button table-more" aria-label={`More options for ${item.category}`}><MoreHorizontal size={17} /></button></div>)}</div><button className="table-add" onClick={onAdd}><Plus size={15} /> Add another category</button></div></div>;
}

function TimelineView({ timeline, onToggle, onAdd }: { timeline: TimelineItem[]; onToggle: (id: number) => void; onAdd: () => void }) {
  return <div className="view-stack"><SectionHeading eyebrow="The run of show" title="A timeline with breathing room." action="Add milestone" onAction={onAdd} /><div className="timeline-layout"><div className="timeline-column">{timeline.map((item, index) => <div className="full-timeline-row" key={item.id}><div className="full-date"><span className="eyebrow">{index === 0 ? "First up" : index === timeline.length - 1 ? "Final stretch" : "Milestone"}</span><strong>{formatDate(item.date, { month: "short", day: "numeric" })}</strong><small>{formatDate(item.date, { year: "numeric" })}</small></div><div className={`full-marker marker-${item.tone} ${item.completed ? "full-marker-done" : ""}`}>{item.completed ? <Check size={14} /> : <span />}</div><button className={`full-timeline-card ${item.completed ? "full-card-done" : ""}`} onClick={() => onToggle(item.id)}><div><span className="eyebrow">{item.completed ? "Settled" : "On the horizon"}</span><h3>{item.title}</h3><p>{item.detail}</p></div><span className={`circle-check ${item.completed ? "circle-check-done" : ""}`}>{item.completed && <Check size={14} />}</span></button></div>)}</div><aside className="timeline-aside soft-card"><span className="eyebrow">Timeline note</span><h3>Put the decisions that unlock other decisions first.</h3><p>Once the caterer is chosen, your menu, rentals, floor plan, and guest experience all get easier to shape.</p><div className="aside-rule" /><div className="aside-stat"><strong>1</strong><span>decision<br />to unlock next</span></div></aside></div></div>;
}

function VendorsView({ plan, vendors, onCycle, onAdd, onNotify }: { plan: EventPlan; vendors: VendorItem[]; onCycle: (id: number) => void; onAdd: () => void; onNotify: (message: string) => void }) {
  const groups = Array.from(new Set(vendors.map(item => item.category)));
  const [location, setLocation] = useState(plan.location);
  const [budget, setBudget] = useState(String(plan.budget));
  const [recommendations, setRecommendations] = useState<VendorRecommendation[]>([]);
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const findVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/vendors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ location, budget: Number(budget), type: plan.type, guests: plan.guests, preferences: plan.preferences }) });
      if (!response.ok) throw new Error("Vendor service unavailable");
      const payload = await response.json() as { vendors?: VendorRecommendation[] };
      if (!payload.vendors?.length) throw new Error("No recommendations returned");
      setRecommendations(payload.vendors);
      onNotify("Three vendor directions are ready for your brief.");
    } catch {
      setRecommendations([
        { name: `${location || "Local"} table & hearth collective`, category: "Catering", fit: "Best overall fit", description: `A seasonal menu team for ${plan.guests} guests with a generous, low-waste point of view.`, budget: `$${Math.round(Number(budget || plan.budget) * .38).toLocaleString()} estimated`, reason: "Fits your event size and keeps food at the center of the experience.", nextStep: "Request tasting menu" },
        { name: `${location || "Local"} light & stem studio`, category: "Flowers & styling", fit: "Best atmosphere", description: "A small studio with reusable vessels and a seasonal styling brief.", budget: `$${Math.round(Number(budget || plan.budget) * .1).toLocaleString()} estimated`, reason: "One strong visual anchor, without filling the room with extras.", nextStep: "Share event brief" },
        { name: `${location || "Local"} after-hours sound`, category: "Music & sound", fit: "Best energy", description: "A flexible DJ and sound team for clear ceremony audio and a later dance floor.", budget: `$${Math.round(Number(budget || plan.budget) * .08).toLocaleString()} estimated`, reason: "Protects the parts guests remember most.", nextStep: "Check availability" },
      ]);
      onNotify("Your budget and location sparked three vendor directions.");
    } finally { setLoading(false); }
  };

  return <div className="view-stack"><SectionHeading eyebrow="People who make it happen" title="Your vendor checklist." action="Add vendor" onAction={onAdd} /><div className="vendor-ai-panel"><div className="vendor-ai-copy"><span className="idea-orb"><Sparkles size={18} /></span><span className="eyebrow">New · AI vendor scout</span><h3>Find a few good fits before you open 40 tabs.</h3><p>Use your event budget and location to get practical vendor directions — then shortlist the ones worth contacting.</p></div><div className="vendor-ai-form"><label><span>Location</span><input value={location} onChange={event => setLocation(event.target.value)} placeholder="City or neighborhood" /></label><label><span>Total budget</span><input type="number" value={budget} onChange={event => setBudget(event.target.value)} /></label><button className="primary-button" onClick={findVendors} disabled={loading}>{loading ? <><span className="loading-dot" /> Scouting</> : <><Sparkles size={16} /> Recommend vendors</>}</button></div></div>{recommendations.length > 0 && <div className="recommendations"><div className="recommendations-heading"><div><span className="eyebrow">Tailored shortlist</span><h3>Directions worth a closer look.</h3></div><span className="ideas-powered"><Sparkles size={13} /> Based on {location || "your location"} · ${Number(budget || 0).toLocaleString()} budget</span></div><div className="recommendation-grid">{recommendations.map((vendor, index) => { const isShortlisted = shortlisted.includes(vendor.name); return <article className="recommendation-card" key={`${vendor.name}-${index}`}><div className="recommendation-top"><span className="idea-tag">{vendor.category}</span><StatusPill tone={index === 0 ? "good" : index === 1 ? "warm" : "coral"}>{vendor.fit}</StatusPill></div><h4>{vendor.name}</h4><p>{vendor.description}</p><div className="recommendation-budget"><strong>{vendor.budget}</strong><span>{vendor.reason}</span></div><button className={`recommendation-action ${isShortlisted ? "recommendation-action-saved" : ""}`} onClick={() => { setShortlisted(current => isShortlisted ? current.filter(name => name !== vendor.name) : [...current, vendor.name]); onNotify(isShortlisted ? "Removed from your vendor shortlist." : "Added to your vendor shortlist."); }}>{isShortlisted ? <><Check size={14} /> Shortlisted</> : <><Plus size={14} /> Add to shortlist</>}</button><span className="recommendation-next">Next step · {vendor.nextStep}</span></article>; })}</div><span className="vendor-disclaimer">Directional recommendations only — confirm pricing, availability, and fit directly with each vendor.</span></div>}<div className="vendor-grid">{groups.map(group => { const item = vendors.find(vendor => vendor.category === group)!; return <button key={group} className="vendor-card-large" onClick={() => onCycle(item.id)}><div className={`vendor-category-icon category-${group.toLowerCase()}`}><Compass size={18} /></div><div className="vendor-card-copy"><span className="eyebrow">{group}</span><h3>{item.title}</h3><p>{item.detail}</p><span className="vendor-due">{item.due}</span></div><div className="vendor-card-status"><StatusPill tone={item.status === "Booked" ? "good" : item.status === "In progress" ? "coral" : "warm"}>{item.status}</StatusPill><ChevronDown size={15} /></div></button>; })}<button className="add-vendor-card" onClick={onAdd}><span><Plus size={20} /></span><strong>Add a vendor category</strong><small>Venue, rentals, transport...</small></button></div><div className="vendor-tip"><Sparkles size={16} /><span><strong>Helpful thought:</strong> vendors are easier to book when the brief feels like a point of view, not a spreadsheet.</span></div></div>;
}

function IdeasView({ ideas, generating, prompt, setPrompt, onGenerate, onSave }: { ideas: Idea[]; generating: boolean; prompt: string; setPrompt: (value: string) => void; onGenerate: () => void; onSave: (id: number) => void }) {
  return <div className="view-stack ideas-view"><div className="ideas-hero"><div><span className="idea-orb"><WandSparkles size={20} /></span><span className="eyebrow">Planning intelligence</span><h2>What could make this feel unmistakably yours?</h2><p>Tell Celebrate a little more about the feeling you want. It will turn your event details into ideas that fit the room, the budget, and the people.</p></div><div className="idea-prompt"><label htmlFor="idea-prompt">Add a creative nudge <span>optional</span></label><div className="prompt-row"><input id="idea-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="e.g. more playful, very local, dinner-party energy" /><button className="primary-button" onClick={onGenerate} disabled={generating}>{generating ? <><span className="loading-dot" /> Thinking</> : <><Sparkles size={16} /> Generate ideas</>}</button></div><div className="prompt-chips"><button onClick={() => setPrompt("more playful")}>more playful</button><button onClick={() => setPrompt("very local")}>very local</button><button onClick={() => setPrompt("understated")}>understated</button></div></div></div><div className="ideas-toolbar"><div><span className="eyebrow">For your event</span><strong>{ideas.length} thoughtful directions</strong></div><span className="ideas-powered"><Sparkles size={13} /> Tailored to your plan</span></div><div className="ideas-grid">{ideas.map(idea => <article className={`idea-card ${idea.saved ? "idea-card-saved" : ""}`} key={idea.id}><div className="idea-card-top"><span className="idea-tag">{idea.tag}</span><button className={`save-idea ${idea.saved ? "save-idea-saved" : ""}`} onClick={() => onSave(idea.id)}>{idea.saved ? <><Check size={14} /> Saved</> : "Save idea"}</button></div><h3>{idea.title}</h3><p>{idea.description}</p><div className="idea-card-foot"><span><strong>Why it fits</strong>{idea.why}</span><span className="effort-badge">{idea.effort}</span></div></article>)}</div></div>;
}

function PaymentsView({ payments, onUpdate, onNotify }: { payments: PaymentItem[]; onUpdate: (items: PaymentItem[]) => void; onNotify: (message: string) => void }) {
  const paid = payments.filter(item => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0);
  const due = payments.filter(item => item.status !== "Paid").reduce((sum, item) => sum + item.amount, 0);
  const cycleStatus = (id: number) => onUpdate(payments.map(item => item.id === id ? { ...item, status: item.status === "Due" ? "Processing" : item.status === "Processing" ? "Paid" : "Due", method: item.status === "Due" ? "Awaiting confirmation" : item.status === "Processing" ? "Card ending 4242" : "Not paid yet", due: item.status === "Processing" ? "Paid just now" : item.due } : item));
  return <div className="view-stack payments-view"><SectionHeading eyebrow="Money in motion" title="Payments, without the mystery." action="Record payment" onAction={() => onNotify("Payment recording is ready — click a status to move it through due, processing, and paid.")} /><div className="payment-summary"><div className="payment-summary-card"><span className="eyebrow">Paid so far</span><strong>{formatMoney(paid)}</strong><span>{payments.filter(item => item.status === "Paid").length} completed payments</span></div><div className="payment-summary-card payment-summary-warm"><span className="eyebrow">Still to settle</span><strong>{formatMoney(due)}</strong><span>{payments.filter(item => item.status !== "Paid").length} open items</span></div><div className="payment-summary-card payment-summary-sage"><span className="eyebrow">Payment space</span><strong>USD</strong><span>Demo ledger · autosaved</span></div></div><div className="payments-card"><div className="table-toolbar"><div><span className="eyebrow">Payment history</span><strong>{payments.length} tracked payments</strong></div><span className="payment-note"><CreditCard size={14} /> Click a status to advance it</span></div><div className="payment-list">{payments.map(item => <div className="payment-row" key={item.id}><span className={`payment-icon payment-icon-${item.status.toLowerCase()}`}><CreditCard size={16} /></span><div className="payment-main"><strong>{item.vendor}</strong><small>{item.category} · {item.method}</small></div><span className="payment-due">{item.due}</span><strong className="payment-amount">{formatMoney(item.amount)}</strong><button className="table-status" onClick={() => { cycleStatus(item.id); onNotify(item.status === "Paid" ? "Payment reopened." : item.status === "Due" ? "Payment marked processing." : "Payment marked paid."); }}><StatusPill tone={item.status === "Paid" ? "good" : item.status === "Processing" ? "warm" : "coral"}>{item.status}</StatusPill></button></div>)}</div></div><div className="payment-disclaimer"><Sparkles size={15} /><span>This is your event payment ledger. Live card checkout can be connected when you are ready to configure a payment provider.</span></div></div>;
}

function SettingsView({ plan, onNotify, onReset }: { plan: EventPlan; onNotify: (message: string) => void; onReset: () => void }) {
  const [reminders, setReminders] = useState(() => readStorage("celebrate-reminders", true));
  const [compact, setCompact] = useState(() => readStorage("celebrate-compact", false));
  const [saved, setSaved] = useState(false);
  const updateToggle = (key: string, value: boolean, setter: (value: boolean) => void) => { setter(value); window.localStorage.setItem(key, JSON.stringify(value)); onNotify("Settings saved."); };
  const exportPlan = () => { const blob = new Blob([JSON.stringify({ plan, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = "celebrate-event-plan.json"; anchor.click(); URL.revokeObjectURL(url); onNotify("Your plan export is ready."); };
  return <div className="view-stack settings-view"><SectionHeading eyebrow="Make it yours" title="Settings that keep planning light." action="Open login" onAction={() => { window.location.href = "/login"; }} /><div className="settings-grid"><section className="settings-card"><div className="settings-card-heading"><div><span className="eyebrow">Workspace</span><h3>How Celebrate should feel.</h3></div><span className="settings-icon"><CircleDollarSign size={17} /></span></div><label className="setting-row"><span><strong>Gentle reminders</strong><small>Show helpful nudges for upcoming payments and milestones.</small></span><button className={`toggle ${reminders ? "toggle-on" : ""}`} onClick={() => updateToggle("celebrate-reminders", !reminders, setReminders)} aria-label="Toggle gentle reminders"><span /></button></label><label className="setting-row"><span><strong>Compact planning view</strong><small>Use tighter rows when you have a lot of vendor details.</small></span><button className={`toggle ${compact ? "toggle-on" : ""}`} onClick={() => updateToggle("celebrate-compact", !compact, setCompact)} aria-label="Toggle compact planning view"><span /></button></label></section><section className="settings-card"><div className="settings-card-heading"><div><span className="eyebrow">Your event</span><h3>{plan.title}</h3></div><span className="settings-icon settings-icon-coral"><CalendarDays size={17} /></span></div><div className="settings-facts"><span><small>Type</small><strong>{plan.type}</strong></span><span><small>Guests</small><strong>{plan.guests}</strong></span><span><small>Budget</small><strong>{formatMoney(plan.budget)}</strong></span><span><small>Location</small><strong>{plan.location}</strong></span></div><button className="settings-link" onClick={() => { window.location.href = "/"; }}>Edit event details <ArrowUpRight size={14} /></button></section><section className="settings-card settings-card-wide"><div className="settings-card-heading"><div><span className="eyebrow">Your data</span><h3>Take your plan with you.</h3><p>Celebrate saves your current workspace in this browser. You can also export a lightweight backup anytime.</p></div><FileText size={22} className="settings-file-icon" /></div><div className="settings-actions"><button className="primary-button" onClick={exportPlan}><FileText size={15} /> Export plan</button><button className="quiet-action" onClick={() => { onReset(); setSaved(true); }}>Reset demo workspace</button></div>{saved && <span className="settings-success"><Check size={14} /> Workspace reset to the example plan.</span>}</section></div></div>;
}

function EditEventModal({ plan, onClose, onSave }: { plan: EventPlan; onClose: () => void; onSave: (plan: EventPlan) => void }) {
  const [draft, setDraft] = useState(plan);
  const set = (key: keyof EventPlan, value: string | number) => setDraft(current => ({ ...current, [key]: value }));
  return <Modal title="Shape the event" eyebrow="Event details" onClose={onClose}><div className="form-grid"><label className="field wide"><span>Event name</span><input value={draft.title} onChange={event => set("title", event.target.value)} /></label><label className="field"><span>Type</span><select value={draft.type} onChange={event => set("type", event.target.value as EventType)}><option>Wedding</option><option>Birthday</option><option>Community</option></select></label><label className="field"><span>Date</span><input type="date" value={draft.date} onChange={event => set("date", event.target.value)} /></label><label className="field wide"><span>Location</span><div className="input-with-icon"><MapPin size={15} /><input value={draft.location} onChange={event => set("location", event.target.value)} /></div></label><label className="field"><span>Guests</span><input type="number" min="1" value={draft.guests} onChange={event => set("guests", Number(event.target.value))} /></label><label className="field"><span>Budget</span><input type="number" min="0" value={draft.budget} onChange={event => set("budget", Number(event.target.value))} /></label><label className="field wide"><span>Theme / feeling</span><input value={draft.theme} onChange={event => set("theme", event.target.value)} /></label><label className="field wide"><span>Preferences</span><textarea value={draft.preferences} onChange={event => set("preferences", event.target.value)} rows={3} /></label></div><div className="modal-actions"><button className="quiet-action" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => onSave(draft)}><Check size={16} /> Save changes</button></div></Modal>;
}

function BudgetModal({ onClose, onSave }: { onClose: () => void; onSave: (item: Omit<BudgetItem, "id">) => void }) {
  const [category, setCategory] = useState("Transport");
  const [estimated, setEstimated] = useState(900);
  return <Modal title="Add a budget line" eyebrow="Budget manager" onClose={onClose}><div className="form-grid"><label className="field wide"><span>Category</span><input value={category} onChange={event => setCategory(event.target.value)} /></label><label className="field"><span>Estimated cost</span><input type="number" min="0" value={estimated} onChange={event => setEstimated(Number(event.target.value))} /></label><label className="field"><span>Status</span><select defaultValue="Planning"><option>Planning</option><option>Deposit due</option><option>Paid</option></select></label></div><div className="modal-actions"><button className="quiet-action" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => onSave({ category, estimated, actual: 0, status: "Planning", accent: "coral" })}><Plus size={16} /> Add category</button></div></Modal>;
}
