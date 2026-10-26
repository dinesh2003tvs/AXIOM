import { useEffect, useMemo, useState } from "react";
import { Activity, Bell, BookOpen, BriefcaseBusiness, ChevronDown, ClipboardPlus, FolderKanban, LayoutDashboard, Menu, Plus, Search, Settings2, ShieldCheck, Sparkles, X } from "lucide-react";
import { NAV_ITEMS, ROLES } from "./data/seed.js";
import { useAppData } from "./state/AppDataContext.jsx";
import { Button, Field, Modal, Notice } from "./components/ui.jsx";
import HomePage from "./features/HomePage.jsx";
import IntakePage from "./features/IntakePage.jsx";
import PortfolioPage from "./features/PortfolioPage.jsx";
import WorkspacePage from "./features/WorkspacePage.jsx";
import KnowledgePage from "./features/KnowledgePage.jsx";
import AdminPage from "./features/AdminPage.jsx";

const ICONS = {
  home: LayoutDashboard,
  intake: ClipboardPlus,
  portfolio: BriefcaseBusiness,
  workspace: FolderKanban,
  knowledge: BookOpen,
  admin: Settings2
};

export default function App() {
  const {
    data,
    storageWarning,
    storageError,
    setRole,
    setSelectedProjectId,
    setUiPreference,
    createProject,
    restoreDemoData
  } = useAppData();
  const [page, setPage] = useState(data.uiPreferences?.page || "home");
  const [collapsed, setCollapsed] = useState(Boolean(data.uiPreferences?.collapsed));
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    setPage(data.uiPreferences?.page || "home");
    setCollapsed(Boolean(data.uiPreferences?.collapsed));
  }, [data.uiPreferences?.page, data.uiPreferences?.collapsed]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = message => setToast(message);
  const selectedProject = useMemo(() =>
    data.projects.find(project => project.id === data.selectedProjectId) || data.projects[0],
  [data.projects, data.selectedProjectId]);
  const results = search.trim()
    ? data.projects.filter(project => `${project.id} ${project.name} ${project.fn}`.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  const navigate = nextPage => {
    setPage(nextPage);
    setUiPreference("page", nextPage);
    setMobileNav(false);
    setSearchOpen(false);
  };

  const openProject = project => {
    setSelectedProjectId(project.id);
    navigate("workspace");
  };

  const createAndOpen = values => {
    const project = createProject(values);
    setCreateOpen(false);
    openProject(project);
    notify(`${project.id} created.`);
  };

  const renderPage = () => {
    if (page === "home") return <HomePage onOpenProject={openProject} onNewProject={() => setCreateOpen(true)} notify={notify}/>;
    if (page === "intake") return <IntakePage onOpenProject={openProject} notify={notify}/>;
    if (page === "portfolio") return <PortfolioPage onOpenProject={openProject} onNewProject={() => setCreateOpen(true)} notify={notify}/>;
    if (page === "workspace" && selectedProject) return <WorkspacePage project={selectedProject} onBack={() => navigate("portfolio")} notify={notify}/>;
    if (page === "knowledge") return <KnowledgePage notify={notify}/>;
    if (page === "admin") return <AdminPage notify={notify}/>;
    return <HomePage onOpenProject={openProject} onNewProject={() => setCreateOpen(true)} notify={notify}/>;
  };

  return <div className="min-h-screen bg-canvas text-ink">
    {mobileNav && <button className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}
    <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#0d1722] text-slate-200 transition-all ${collapsed ? "w-[76px]" : "w-64"} ${mobileNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} lg:translate-x-0`}>
      <div className="flex h-[74px] items-center gap-3 border-b border-slate-700/60 px-5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-800"><Sparkles size={18}/></span>
        {!collapsed && <span><strong className="block tracking-wide">AXIOM</strong><small className="text-[10px] text-slate-400">Governance & automation</small></span>}
        <button onClick={() => setMobileNav(false)} className="ml-auto rounded p-1 text-slate-400 lg:hidden" aria-label="Close navigation"><X size={18}/></button>
      </div>
      {!collapsed && <p className="px-5 pb-2 pt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p>}
      <nav className="space-y-1 px-3" aria-label="Main navigation">
        {NAV_ITEMS.map(([key, label]) => {
          const Icon = ICONS[key];
          return <button key={key} onClick={() => navigate(key)} title={collapsed ? label : undefined} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${page === key ? "bg-sky-950 text-white ring-1 ring-inset ring-sky-900" : "text-slate-300 hover:bg-slate-800"}`}>
            <Icon size={18}/>{!collapsed && <span>{label}</span>}{key === "portfolio" && !collapsed && <span className="ml-auto rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">{data.projects.length}</span>}
          </button>;
        })}
      </nav>
      <div className="mt-auto p-3">
        {!collapsed && <div className="mb-3 rounded-xl border border-slate-700 bg-slate-800/70 p-3">
          <div className="flex items-center gap-2 text-sky-300"><Sparkles size={16}/><strong className="text-xs">AXIOM Copilot</strong></div>
          <p className="mt-2 text-[11px] leading-5 text-slate-400">Local prototype mode · no external actions</p>
        </div>}
        <div className="flex items-center gap-2 border-t border-slate-700 px-2 pt-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-900 text-xs font-bold">SS</span>
          {!collapsed && <span className="min-w-0"><strong className="block truncate text-xs">Sharon Sonny</strong><small className="text-[10px] text-slate-400">{data.role} view</small></span>}
          {!collapsed && <button className="ml-auto text-slate-400" onClick={() => setNotificationOpen(value => !value)} aria-label="Notifications"><Bell size={16}/></button>}
        </div>
      </div>
    </aside>

    <div className={`min-h-screen transition-[margin] ${collapsed ? "lg:ml-[76px]" : "lg:ml-64"}`}>
      <header className="sticky top-0 z-20 flex h-[68px] items-center gap-3 border-b border-slate-200 bg-white/95 px-3 backdrop-blur sm:px-6">
        <button className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={19}/></button>
        <button className="hidden h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:grid" onClick={() => {
          const value = !collapsed;
          setCollapsed(value);
          setUiPreference("collapsed", value);
        }} aria-label="Collapse navigation"><Menu size={19}/></button>
        <strong className="hidden text-sm text-slate-600 sm:block">{NAV_ITEMS.find(item => item[0] === page)?.[1] || "AXIOM"}</strong>
        <div className="relative ml-auto hidden w-full max-w-sm md:block">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
          <input className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-sky-500" value={search} onChange={event => { setSearch(event.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} onKeyDown={event => {
            if (event.key === "Enter" && results[0]) openProject(results[0]);
            if (event.key === "Escape") setSearchOpen(false);
          }} placeholder="Search projects and IDs"/>
          {searchOpen && results.length > 0 && <div className="absolute left-0 right-0 top-11 z-30 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
            {results.map(project => <button key={project.id} className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50" onClick={() => { setSearch(project.name); openProject(project); }}><strong className="block text-sm">{project.name}</strong><small className="text-xs text-slate-500">{project.id} · {project.fn}</small></button>)}
          </div>}
        </div>
        <div className="flex items-center gap-2">
          <button className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => setNotificationOpen(value => !value)} aria-label="Notifications"><Bell size={17}/><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"/></button>
          <label className="flex items-center gap-1.5 border-l border-slate-200 pl-2 text-sky-800"><ShieldCheck size={15}/><select className="max-w-[135px] bg-transparent text-xs font-bold outline-none sm:max-w-none" value={data.role} onChange={event => setRole(event.target.value)} aria-label="Prototype role">{ROLES.map(role => <option key={role}>{role}</option>)}</select><ChevronDown className="hidden sm:block" size={13}/></label>
        </div>
        {notificationOpen && <div className="absolute right-4 top-14 z-30 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between"><strong className="text-sm">Notifications</strong><button onClick={() => setNotificationOpen(false)} aria-label="Close notifications"><X size={16}/></button></div>
          <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">You are using local prototype mode. No live notifications are connected.</p>
        </div>}
      </header>

      <main className="mx-auto max-w-[1600px] space-y-4 p-4 sm:p-6 xl:p-8">
        {storageWarning && <Notice type="error" action={<Button variant="danger" onClick={async () => {
          if (window.confirm("Restore demo data? Any unreadable local data will be removed.")) {
            if (await restoreDemoData()) notify("Demo data restored.");
          }
        }}>Restore demo data</Button>}>{storageWarning}</Notice>}
        {storageError && <Notice type="error">{storageError}</Notice>}
        {renderPage()}
      </main>
    </div>
    {createOpen && <CreateProjectModal onClose={() => setCreateOpen(false)} onCreate={createAndOpen}/>}
    {toast && <div className="fixed bottom-5 right-5 z-[70] max-w-sm rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl" role="status">{toast}</div>}
  </div>;
}

function CreateProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [fn, setFn] = useState("Enterprise Services");
  const [businessProblem, setBusinessProblem] = useState("");
  const [error, setError] = useState("");

  const submit = event => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Project title is required.");
      return;
    }
    onCreate({ name, fn, businessProblem });
  };

  return <Modal title="New project" description="Create a local project record to continue in the workspace." onClose={onClose}>
    <form className="space-y-4" onSubmit={submit}>
      <Field label="Project title" value={name} onChange={setName} required placeholder="Enter project title"/>
      <Field label="Department / function" value={fn} onChange={setFn} required/>
      <Field label="Business problem" value={businessProblem} onChange={setBusinessProblem} rows={3} placeholder="Optional starting context"/>
      <Notice type="info">This creates a local record only. External AI discovery is not connected.</Notice>
      {error && <Notice type="error">{error}</Notice>}
      <div className="flex justify-end gap-2"><Button type="button" onClick={onClose}>Cancel</Button><Button variant="primary" type="submit"><Plus size={15}/> Create & open</Button></div>
    </form>
  </Modal>;
}
