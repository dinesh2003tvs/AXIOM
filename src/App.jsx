import { Component, useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ClipboardPlus,
  FolderKanban,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Upload,
  X
} from "lucide-react";
import { NAV_ITEMS, ROLES } from "./data/seed.js";
import { parseProjectPlanFile } from "./lib/parsePlan.js";
import { useAppData } from "./state/AppDataContext.jsx";
import { Button, Field, Modal, Notice } from "./components/ui.jsx";
import ExecutiveDashboard from "./features/ExecutiveDashboard.jsx";
import IntakePage from "./features/IntakePage.jsx";
import PortfolioPage from "./features/PortfolioPage.jsx";
import WorkspacePage from "./features/WorkspacePage.jsx";
import KnowledgePage from "./features/KnowledgePage.jsx";
import AdminPage from "./features/AdminPage.jsx";
import { SidebarMountainArt } from "./components/MountainGraphics.jsx";

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
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    setPage(data.uiPreferences?.page || "home");
    setCollapsed(Boolean(data.uiPreferences?.collapsed));
  }, [data.uiPreferences?.page, data.uiPreferences?.collapsed]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message) => setToast(message);

  const selectedProject = useMemo(
    () =>
      data.projects.find((project) => project.id === data.selectedProjectId) ||
      data.projects[0],
    [data.projects, data.selectedProjectId]
  );

  const results = search.trim()
    ? data.projects
        .filter((project) =>
          `${project.id} ${project.name} ${project.fn}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const navigate = (nextPage) => {
    setPage(nextPage);
    setUiPreference("page", nextPage);
    setMobileNav(false);
    setSearchOpen(false);
  };

  const openProject = (project) => {
    if (project?.id) {
      setSelectedProjectId(project.id);
      navigate("workspace");
    } else {
      notify("Opening project overview...");
    }
  };

  const createAndOpen = (values) => {
    const project = createProject(values);
    setCreateOpen(false);
    openProject(project);
    notify(`${project.id} created.`);
  };

  const renderPage = () => {
    if (page === "home") {
      return (
        <ExecutiveDashboard
          notify={notify}
          onSelectProject={(proj) => {
            const matched = data.projects.find(
              (p) => p.name.toLowerCase() === proj.name?.toLowerCase()
            );
            if (matched) {
              openProject(matched);
            } else {
              notify(`Viewing details for ${proj.name || "selected project"}`);
            }
          }}
        />
      );
    }
    if (page === "intake") {
      return <IntakePage onOpenProject={openProject} notify={notify} />;
    }
    if (page === "portfolio") {
      return (
        <PortfolioPage
          onOpenProject={openProject}
          onNewProject={() => setCreateOpen(true)}
          notify={notify}
        />
      );
    }
    if (page === "workspace" && selectedProject) {
      return (
        <WorkspacePage
          project={selectedProject}
          onBack={() => navigate("portfolio")}
          notify={notify}
        />
      );
    }
    if (page === "knowledge") {
      return <KnowledgePage notify={notify} />;
    }
    if (page === "admin") {
      return <AdminPage notify={notify} />;
    }
    return <ExecutiveDashboard notify={notify} onSelectProject={openProject} />;
  };

  if (isLoggedOut) {
    return (
      <div className="min-h-screen bg-[#070d1e] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800 bg-[#0b1329]/95 p-8 shadow-2xl text-center backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white font-black text-2xl shadow-lg shadow-sky-950/60 mb-5 border border-sky-400/30">
            A
          </div>
          <h1 className="text-2xl font-black tracking-wide text-white">AXIOM</h1>
          <p className="text-[10px] font-extrabold tracking-[0.24em] text-[#38bdf8] uppercase mt-1">
            AI ENABLED PMO
          </p>

          <div className="my-6 rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 flex items-center gap-3.5 text-left">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0369a1] text-white font-bold text-sm border border-sky-400/30">
              SS
            </div>
            <div className="min-w-0">
              <strong className="block text-sm font-bold text-white">Sharon Sonny</strong>
              <span className="text-xs text-slate-400">{data.role || "CXO / Leadership"} view</span>
            </div>
            <span className="ml-auto text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              Signed out
            </span>
          </div>

          <button
            onClick={() => {
              setIsLoggedOut(false);
              notify("Welcome back, Sharon Sonny!");
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-900/40 hover:from-sky-400 hover:to-blue-500 transition cursor-pointer"
          >
            <LogIn size={17} />
            Sign In as Sharon Sonny
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Mobile backdrop */}
      {mobileNav && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileNav(false)}
          aria-label="Close navigation"
        />
      )}

      {/* LEFT SIDEBAR - Matches Provided Menu Design */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#0b1329] text-slate-200 transition-all duration-300 ease-in-out overflow-x-hidden ${
          collapsed ? "w-[72px]" : "w-[245px]"
        } ${mobileNav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        {collapsed ? (
          <div className="flex h-[74px] items-center justify-center px-2 border-b border-slate-800/60">
            <button
              id="expand-sidebar-btn"
              onClick={() => {
                setCollapsed(false);
                setUiPreference("collapsed", false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer"
              title="Expand navigation"
              aria-label="Expand navigation"
            >
              <Menu size={20} />
            </button>
          </div>
        ) : (
          <div className="flex h-[74px] items-center justify-between px-4 pt-1 border-b border-slate-800/60">
            <button
              onClick={() => navigate("home")}
              className="flex flex-col justify-center text-left min-w-0 group cursor-pointer"
              title="AXIOM Home"
            >
              <span className="text-[22px] font-black tracking-wider text-white leading-none group-hover:text-sky-300 transition-colors">
                AXIOM
              </span>
              <span className="text-[9.5px] font-extrabold tracking-[0.24em] text-[#38bdf8] uppercase mt-1 truncate">
                AI ENABLED PMO
              </span>
            </button>
            <div className="flex items-center gap-1">
              <button
                id="collapse-sidebar-btn"
                onClick={() => {
                  setCollapsed(true);
                  setUiPreference("collapsed", true);
                }}
                className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer"
                title="Collapse navigation"
                aria-label="Collapse navigation"
              >
                <Menu size={20} />
              </button>
              <button
                onClick={() => setMobileNav(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden cursor-pointer"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Category header */}
        {!collapsed && (
          <p className="px-5 pb-1.5 pt-5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-slate-500">
            NAVIGATION
          </p>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto" aria-label="Main navigation">
          {NAV_ITEMS.map(([key, label]) => {
            const Icon = ICONS[key] || LayoutDashboard;
            const isActive = page === key;
            return (
              <button
                key={key}
                onClick={() => navigate(key)}
                title={collapsed ? label : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#0c2742] text-white border border-[#0284c7] shadow-sm"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                } ${collapsed ? "justify-center px-0" : ""}`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                />
                {!collapsed && <span className="truncate">{label}</span>}
                {key === "portfolio" && !collapsed && (
                  <span className="ml-auto grid h-5 min-w-[20px] px-1.5 place-items-center rounded-full bg-[#dbeafe] text-[11px] font-bold text-[#0369a1]">
                    {data.projects.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mountain Silhouette Art & Typography at Bottom */}
        <div className="relative mt-auto h-28 w-full overflow-hidden select-none border-t border-slate-800/40">
          <SidebarMountainArt className="absolute inset-0 w-full h-full opacity-85" />
          {!collapsed && (
            <div className="relative z-10 flex h-full items-end pb-3 pl-4">
              <div className="flex items-stretch gap-2">
                <div className="w-[2px] rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
                <div className="space-y-0.5 text-[9.5px] font-black uppercase tracking-[0.2em] text-slate-300/90 leading-tight">
                  <div>PEOPLE</div>
                  <div>PROJECTS</div>
                  <div>INSIGHTS</div>
                  <div>IMPACT</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout in Bottom Left Corner */}
        {collapsed ? (
          <div className="border-t border-slate-800/70 bg-[#080e1f] p-2 flex items-center justify-center">
            <button
              id="sidebar-logout-btn-collapsed"
              onClick={() => setLogoutModalOpen(true)}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="Sharon Sonny (CXO) — Click to log out"
              aria-label="Sharon Sonny (CXO) — Click to log out"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#0369a1] text-white font-bold text-xs border border-sky-400/30 group-hover:hidden">
                SS
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#080e1f]" />
              </div>
              <LogOut size={18} className="hidden group-hover:block text-rose-400" />
            </button>
          </div>
        ) : (
          <div className="border-t border-slate-800/70 bg-[#080e1f] px-3.5 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <button
                id="sidebar-profile-info-btn"
                onClick={() => setLogoutModalOpen(true)}
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left rounded-lg p-1 -ml-1 hover:bg-slate-800/60 transition group cursor-pointer"
                title="Click to log out"
              >
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0369a1] text-white font-bold text-xs shadow-inner border border-sky-400/30 group-hover:border-sky-400 transition">
                  SS
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#080e1f]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white group-hover:text-sky-300 transition truncate leading-tight">
                    Sharon Sonny
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 truncate leading-tight mt-0.5">
                    {data.role || "CXO / Leadership"} view
                  </span>
                </div>
              </button>

              <button
                id="sidebar-logout-btn"
                onClick={() => setLogoutModalOpen(true)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-500/15 hover:text-rose-400 transition-colors cursor-pointer"
                title="Log out"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:ml-[72px]" : "lg:ml-[245px]"
        }`}
      >
        {/* Sticky Top Header with Search, Role, Notifications */}
        <header className="sticky top-0 z-30 flex h-[64px] items-center gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
          >
            <Menu size={19} />
          </button>

          <strong className="text-sm font-bold text-slate-700">
            {page === "workspace"
              ? "Project Workspace"
              : NAV_ITEMS.find((item) => item[0] === page)?.[1] || "AXIOM"}
          </strong>

          {/* Search Bar */}
          <div className="relative ml-auto hidden w-full max-w-sm md:block">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white transition"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && results[0]) openProject(results[0]);
                if (event.key === "Escape") setSearchOpen(false);
              }}
              placeholder="Search projects and IDs"
            />
            {searchOpen && results.length > 0 && (
              <div className="absolute left-0 right-0 top-11 z-30 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
                {results.map((project) => (
                  <button
                    key={project.id}
                    className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                    onClick={() => {
                      setSearch(project.name);
                      openProject(project);
                    }}
                  >
                    <strong className="block text-xs font-bold text-slate-800">
                      {project.name}
                    </strong>
                    <small className="text-[11px] text-slate-500">
                      {project.id} · {project.fn}
                    </small>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action / Notification / Role */}
          <div className="flex items-center gap-2">
            <button
              className="relative grid h-9 w-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setNotificationOpen((value) => !value)}
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <label className="flex items-center gap-1.5 border-l border-slate-200 pl-2.5 text-sky-800 cursor-pointer">
              <ShieldCheck size={16} />
              <select
                className="max-w-[135px] bg-transparent text-xs font-bold outline-none cursor-pointer sm:max-w-none text-slate-700"
                value={data.role}
                onChange={(event) => setRole(event.target.value)}
                aria-label="Prototype role"
              >
                {ROLES.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
              <ChevronDown className="hidden sm:block text-slate-400" size={13} />
            </label>
          </div>

          {/* Notifications Dropdown */}
          {notificationOpen && (
            <div className="absolute right-4 top-14 z-40 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <strong className="text-sm font-bold text-slate-800">Notifications</strong>
                <button
                  onClick={() => setNotificationOpen(false)}
                  aria-label="Close notifications"
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed">
                You are using local prototype mode. All project changes and insights are processed locally.
              </p>
            </div>
          )}
        </header>

        {/* Content Container */}
        <main className="mx-auto max-w-[1700px] p-3.5 sm:p-5 xl:p-6">
          {storageWarning && (
            <Notice
              type="error"
              action={
                <Button
                  variant="danger"
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Restore demo data? Any unreadable local data will be removed."
                      )
                    ) {
                      if (await restoreDemoData()) notify("Demo data restored.");
                    }
                  }}
                >
                  Restore demo data
                </Button>
              }
            >
              {storageWarning}
            </Notice>
          )}

          {storageError && <Notice type="error">{storageError}</Notice>}

          <ErrorBoundary onReset={() => navigate("portfolio")}>{renderPage()}</ErrorBoundary>
        </main>
      </div>

      {/* CREATE PROJECT MODAL */}
      {createOpen && (
        <CreateProjectModal
          onClose={() => setCreateOpen(false)}
          onCreate={createAndOpen}
        />
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {logoutModalOpen && (
        <Modal
          title="Sign out of AXIOM?"
          description="Are you sure you want to end your current session?"
          onClose={() => setLogoutModalOpen(false)}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0369a1] text-white font-bold text-xs shadow-inner">
                SS
              </div>
              <div>
                <strong className="block text-xs font-bold text-slate-800">
                  Sharon Sonny
                </strong>
                <span className="text-[11px] text-slate-500">
                  {data.role || "CXO / Leadership"} view
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" onClick={() => setLogoutModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setLogoutModalOpen(false);
                  setIsLoggedOut(true);
                  notify("Logged out successfully.");
                }}
              >
                <LogOut size={14} /> Log out
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* TOAST ALERT */}
      {toast && (
        <div
          className="fixed bottom-5 right-5 z-[70] max-w-sm rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="status"
        >
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="surface p-6 rounded-2xl border border-red-200 bg-red-50/60 max-w-2xl mx-auto my-8">
          <h2 className="text-base font-bold text-red-900">Something went wrong</h2>
          <p className="mt-1 text-xs text-red-700">
            {this.state.error?.message || "An unexpected error occurred while loading this view."}
          </p>
          <div className="mt-4 flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (this.props.onReset) this.props.onReset();
              }}
            >
              Return to Project Workspace
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function CreateProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [fn, setFn] = useState("Enterprise Services");
  const [businessProblem, setBusinessProblem] = useState("");
  const [error, setError] = useState("");
  const [uploadedPlan, setUploadedPlan] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError("");
    try {
      const parsed = await parseProjectPlanFile(file);
      if (parsed.name) setName(parsed.name);
      if (parsed.fn) setFn(parsed.fn);
      if (parsed.businessProblem) setBusinessProblem(parsed.businessProblem);
      setUploadedPlan(parsed);
      const totalCount =
        parsed.projectPlan?.stats?.totalTasks || parsed.projectPlan?.items?.length || 0;
      setUploadSuccess(
        `Plan loaded from "${file.name}" (${totalCount} tasks & milestones populated).`
      );
    } catch (err) {
      console.error(err);
      setError("Failed to parse project plan spreadsheet. Please check the file format.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Project title is required.");
      return;
    }
    onCreate({
      name: name.trim(),
      fn: fn.trim(),
      businessProblem: businessProblem.trim(),
      pm: uploadedPlan?.pm || "Priya Shah",
      due: uploadedPlan?.due || "",
      projectPlan: uploadedPlan?.projectPlan || null
    });
  };

  return (
    <Modal
      title="New project"
      description="Create a local project record to continue in the workspace."
      onClose={onClose}
    >
      <form className="space-y-4" onSubmit={submit}>
        <Field
          label="Project title"
          value={name}
          onChange={setName}
          required
          placeholder="Enter project title"
        />
        <Field
          label="Department / function"
          value={fn}
          onChange={setFn}
          required
        />
        <Field
          label="Business problem"
          value={businessProblem}
          onChange={setBusinessProblem}
          rows={3}
          placeholder="Optional starting context"
        />
        {uploadSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}
        <Notice type="info">
          This creates a local record only. External AI discovery is not connected.
        </Notice>
        {error && <Notice type="error">{error}</Notice>}
        <div className="flex items-center justify-end gap-2 pt-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <Upload size={14} className={isUploading ? "animate-spin" : ""} />
            {isUploading ? "Loading plan..." : "Upload plan"}
          </Button>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            <Plus size={15} /> Create & open
          </Button>
        </div>
      </form>
    </Modal>
  );
}
