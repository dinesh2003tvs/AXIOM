import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  Banknote,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Coins,
  Edit2,
  FileText,
  Filter,
  GitBranch,
  Layers,
  MoreVertical,
  Plus,
  Save,
  Search,
  Sparkles,
  Target,
  Trash2,
  Upload,
  Users
} from "lucide-react";
import { LIFECYCLE, RAGS } from "../data/seed.js";
import { parseProjectPlanFile, getDefaultItems } from "../lib/parsePlan.js";
import { useAppData } from "../state/AppDataContext.jsx";
import { Badge, Button, Card, Field, FilePicker, Notice, PageHeading, SelectField } from "../components/ui.jsx";

const TABS = [
  "Overview",
  "Artifacts",
  "Project plan",
  "Related & knowledge",
  "Test cases",
  "Analytics",
  "Escalations",
  "Project Budget",
  "Project Team & Key Stakeholders"
];

export default function WorkspacePage({ project, onBack, notify }) {
  const { data, updateProject } = useAppData();
  const [tab, setTab] = useState("Overview");
  const [name, setName] = useState(project.name);
  const [pm, setPm] = useState(project.pm);
  const [due, setDue] = useState(project.due || "");
  const [progress, setProgress] = useState(project.progress);
  const [noteText, setNoteText] = useState("");
  const [actionText, setActionText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(project.name);
    setPm(project.pm);
    setDue(project.due || "");
    setProgress(project.progress);
    setTab("Overview");
  }, [project.id, project.name, project.pm, project.due, project.progress]);

  const canEdit = data.role !== "CXO / Leadership";
  const files = (data.attachments || []).filter(file => (project.attachments || []).includes(file.id));
  const saveSummary = () => {
    updateProject(project.id, { name: name.trim(), pm, due, progress: Number(progress) });
    notify("Project details saved locally.");
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    updateProject(project.id, { notes: [...(project.notes || []), { id: crypto.randomUUID(), text: noteText.trim(), createdAt: new Date().toISOString() }] });
    setNoteText("");
    notify("Project note added.");
  };

  const addAction = () => {
    if (!actionText.trim()) return;
    updateProject(project.id, { actions: [...(project.actions || []), { id: crypto.randomUUID(), text: actionText.trim(), done: false }] });
    setActionText("");
    notify("Project action added.");
  };

  const toggleAction = id => updateProject(project.id, {
    actions: project.actions.map(action => action.id === id ? { ...action, done: !action.done } : action)
  });

  const viewTab = () => {
    if (tab === "Overview") return <Overview project={project} onNote={addNote} noteText={noteText} setNoteText={setNoteText} onAction={addAction} actionText={actionText} setActionText={setActionText} onToggleAction={toggleAction}/>;
    if (tab === "Artifacts") return <Card title="Project artifacts">
      <p className="mb-4 text-sm text-slate-500">Files are saved in this browser’s IndexedDB and linked to this project.</p>
      <FilePicker ownerType="project" ownerId={project.id} attachments={files} onUploaded={added => updateProject(project.id, { attachments: [...new Set([...(project.attachments || []), ...added.map(file => file.id)])] })} onError={setError}/>
    </Card>;
    if (tab === "Project plan") return <ProjectPlan project={project} canEdit={canEdit} updateProject={updateProject} notify={notify} onSave={values => { updateProject(project.id, values); notify("Project plan saved locally."); }}/>;
    if (tab === "Related & knowledge") return <RelatedKnowledge data={data}/>;
    if (tab === "Test cases") return <SimulatedFeature icon={CheckCircle2} title="Test case management" text="Test planning is represented as a local prototype surface. Add a project action to track a test activity." notify={notify}/>;
    if (tab === "Analytics") return <Analytics project={project}/>;
    if (tab === "Escalations") return <Escalations project={project} updateProject={updateProject} notify={notify}/>;
    if (tab === "Project Budget") return <ProjectBudget project={project} updateProject={updateProject} canEdit={canEdit} notify={notify}/>;
    if (tab === "Project Team & Key Stakeholders") return <ProjectTeamStakeholders project={project} updateProject={updateProject} canEdit={canEdit} notify={notify} resources={data.resources}/>;
    return <Overview project={project} onNote={addNote} noteText={noteText} setNoteText={setNoteText} onAction={addAction} actionText={actionText} setActionText={setActionText} onToggleAction={toggleAction}/>;
  };

  return <div className="space-y-5">
    <PageHeading eyebrow="PROJECT WORKSPACE" title={project.name} description={<><strong>{project.id}</strong> · {project.fn} · Workspace data is saved locally.</>} actions={<Button onClick={onBack}><ArrowRight className="rotate-180" size={15}/> Back</Button>}/>
    {error && <Notice type="error">{error}</Notice>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <div className="surface p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Lifecycle</p><div className="mt-2">{canEdit ? <select className="field-control mt-0" value={project.status} onChange={event => updateProject(project.id, { status: event.target.value })}>{LIFECYCLE.map(status => <option key={status}>{status}</option>)}</select> : <p className="mt-2 font-semibold">{project.status}</p>}</div></div>
      <div className="surface p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">RAG health</p><div className="mt-2">{canEdit ? <select className="field-control mt-0" value={project.rag} onChange={event => updateProject(project.id, { rag: event.target.value })}>{RAGS.map(value => <option key={value}>{value}</option>)}</select> : <Badge tone={(project.rag || "Grey").toLowerCase()}>{project.rag || "Grey"}</Badge>}</div></div>
      <div className="surface p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Progress</p><p className="mt-2 text-xl font-bold">{project.progress}%</p></div>
      <div className="surface p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Project manager</p><p className="mt-2 font-semibold">{project.pm}</p></div>
      <div className="surface p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Target end</p><p className="mt-2 font-semibold">{project.due || "Not set"}</p></div>
    </div>
    <div className="surface overflow-x-auto p-2">
      <div className="flex min-w-max gap-1" role="tablist" aria-label="Project workspace sections">
        {TABS.map(item => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${tab === item ? "bg-sky-50 text-sky-800" : "text-slate-500 hover:bg-slate-50"}`}>{item}</button>)}
      </div>
    </div>
    {viewTab()}
    {tab === "Overview" && <Card title="Project details">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Project title" value={name} onChange={setName}/>
        <SelectField label="Project manager" value={pm} onChange={setPm} options={["Unassigned", ...new Set([...(data.resources || []).map(resource => resource.name), project.pm].filter(Boolean))]}/>
        <Field label="Target end date" type="date" value={due} onChange={setDue}/>
        <label className="block text-sm font-semibold text-slate-700">Progress · {progress}%<input className="mt-3 block w-full accent-sky-700" type="range" min="0" max="100" value={progress} onChange={event => setProgress(event.target.value)} disabled={!canEdit}/></label>
      </div>
      {canEdit && <Button variant="primary" className="mt-4" onClick={saveSummary}><Save size={15}/> Save details</Button>}
    </Card>}
  </div>;
}

function Overview({ project, onNote, noteText, setNoteText, onAction, actionText, setActionText, onToggleAction }) {
  return <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
    <div className="space-y-4">
      <Card title="Project summary">
        <p className="text-sm leading-6 text-slate-600">{project.businessProblem || "The workspace centralizes project requirements, artifacts, planning, and health information."}</p>
        <div className="mt-4 flex flex-wrap gap-2"><Badge tone="blue">{project.fn}</Badge><Badge>{project.status}</Badge><Badge tone={(project.rag || "Grey").toLowerCase()}>{project.rag || "Grey"}</Badge></div>
      </Card>
      {project.intake && Object.values(project.intake).some(Boolean) && <Card title="Intake details">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {Object.entries(project.intake).filter(([, value]) => value).map(([key, value]) => <div key={key} className="min-w-0"><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{key.replace(/[A-Z]/g, letter => ` ${letter}`).replace(/^./, letter => letter.toUpperCase())}</dt><dd className="mt-1 break-words text-slate-700">{value}</dd></div>)}
        </dl>
      </Card>}
      <Card title="Project timeline">
        <div className="grid gap-3 sm:grid-cols-2">
          {["Discovery & intake", "Requirements", "Build & UAT", "Production release"].map((stage, index) => <div key={stage} className="rounded-lg border border-slate-200 p-3"><div className="flex items-center gap-2"><span className={`grid h-7 w-7 place-items-center rounded-full ${index < 2 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{index < 2 ? <CheckCircle2 size={15}/> : index + 1}</span><strong className="text-sm">{stage}</strong></div><p className="mt-2 text-xs text-slate-500">{index < 2 ? "Completed" : index === 2 ? `${project.progress}% complete` : `Target ${project.due || "not set"}`}</p></div>)}
        </div>
      </Card>
      <Card title="Project notes">
        <div className="flex gap-2"><input className="field-control mt-0" value={noteText} onChange={event => setNoteText(event.target.value)} placeholder="Add a project note"/><Button variant="primary" onClick={onNote}><Plus size={15}/> Add</Button></div>
        <div className="mt-3 space-y-2">{(project.notes || []).length === 0 ? <p className="text-sm text-slate-500">No notes yet.</p> : [...project.notes].reverse().map(note => <p className="rounded-lg bg-slate-50 p-3 text-sm" key={note.id}>{note.text}<small className="mt-1 block text-xs text-slate-400">{new Date(note.createdAt).toLocaleString()}</small></p>)}</div>
      </Card>
    </div>
    <div className="space-y-4">
      <Card title="Project actions">
        <div className="flex gap-2"><input className="field-control mt-0" value={actionText} onChange={event => setActionText(event.target.value)} placeholder="Add a follow-up action"/><Button variant="primary" onClick={onAction}><Plus size={15}/></Button></div>
        <div className="mt-3 space-y-2">{(project.actions || []).length === 0 ? <p className="text-sm text-slate-500">No actions tracked.</p> : project.actions.map(action => <label key={action.id} className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm"><input type="checkbox" checked={action.done} onChange={() => onToggleAction(action.id)} className="accent-sky-700"/><span className={action.done ? "text-slate-400 line-through" : ""}>{action.text}</span></label>)}</div>
      </Card>
      <Card title="AI project health">
        <Notice type="info"><Sparkles size={13} className="mr-1 inline"/>Simulation only · No AI service is connected.</Notice>
        <div className="mt-4 space-y-3 text-sm text-slate-600"><p className="flex gap-2"><AlertTriangle className="text-amber-600" size={16}/>{project.health}</p><p className="flex gap-2"><CalendarDays className="text-sky-700" size={16}/>Target date: {project.due || "Not set"}</p><p className="flex gap-2"><Activity className="text-emerald-700" size={16}/>{project.progress}% progress recorded</p></div>
      </Card>
      <Card title="Quick actions">
        <div className="grid gap-2"><Button onClick={() => alert("Meeting scheduling is a local prototype interaction.")}><CalendarDays size={15}/> Schedule a meeting</Button><Button onClick={() => alert("Virtual PM is a local prototype simulation; no autonomous action is taken.")}><Bot size={15}/> Virtual PM options</Button></div>
      </Card>
    </div>
  </div>;
}

function ProjectPlan({ project, canEdit, updateProject, notify, onSave }) {
  const initialPlan = project.projectPlan || {
    stats: { totalTasks: 24, completed: 8, inProgress: 10, overdue: 2, milestones: 4 },
    items: getDefaultItems(),
    fileName: "AXIOM_Project_Plan_Wireframe.xlsx"
  };

  const [plan, setPlan] = useState(initialPlan);
  const [viewMode, setViewMode] = useState("list"); // "list" | "timeline"
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (project.projectPlan) {
      setPlan(project.projectPlan);
    }
  }, [project.projectPlan]);

  const items = plan.items || [];

  const totalTasksCount = items.filter(i => !i.isMilestone && !i.isGroup).length || plan.stats?.totalTasks || 24;
  const completedCount = items.filter(i => i.status === "Completed").length || plan.stats?.completed || 8;
  const inProgressCount = items.filter(i => i.status === "In Progress").length || plan.stats?.inProgress || 10;
  const overdueCount = plan.stats?.overdue ?? 2;
  const milestonesCount = items.filter(i => i.isMilestone).length || plan.stats?.milestones || 4;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const parsed = await parseProjectPlanFile(file);
      setPlan(parsed.projectPlan);
      if (updateProject) {
        updateProject(project.id, {
          projectPlan: parsed.projectPlan,
          due: parsed.due || project.due,
          pm: parsed.pm || project.pm
        });
      }
      if (notify) notify(`Project plan uploaded from "${file.name}".`);
    } catch (err) {
      console.error(err);
      if (notify) notify("Failed to parse project plan file.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const toggleGroup = (groupName) => {
    setCollapsedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const saveItem = (saved) => {
    let newItems;
    if (editingItem) {
      newItems = items.map(item => item.id === saved.id ? { ...item, ...saved } : item);
    } else {
      newItems = [...items, { ...saved, id: `T-${Date.now()}` }];
    }
    const updatedPlan = {
      ...plan,
      items: newItems,
      stats: {
        totalTasks: newItems.filter(i => !i.isMilestone && !i.isGroup).length,
        completed: newItems.filter(i => i.status === "Completed").length,
        inProgress: newItems.filter(i => i.status === "In Progress").length,
        overdue: overdueCount,
        milestones: newItems.filter(i => i.isMilestone).length
      }
    };
    setPlan(updatedPlan);
    if (updateProject) updateProject(project.id, { projectPlan: updatedPlan });
    setEditingItem(null);
    setIsTaskModalOpen(false);
    setIsMilestoneModalOpen(false);
    if (notify) notify(editingItem ? "Item updated." : "Item added.");
  };

  const deleteItem = (id) => {
    const newItems = items.filter(item => item.id !== id);
    const updatedPlan = {
      ...plan,
      items: newItems,
      stats: {
        totalTasks: newItems.filter(i => !i.isMilestone && !i.isGroup).length,
        completed: newItems.filter(i => i.status === "Completed").length,
        inProgress: newItems.filter(i => i.status === "In Progress").length,
        overdue: overdueCount,
        milestones: newItems.filter(i => i.isMilestone).length
      }
    };
    setPlan(updatedPlan);
    if (updateProject) updateProject(project.id, { projectPlan: updatedPlan });
    if (notify) notify("Item removed from plan.");
  };

  const filteredItems = items.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = item.name.toLowerCase().includes(q) ||
        (item.owner && item.owner.toLowerCase().includes(q)) ||
        (item.status && item.status.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (statusFilter === "milestones") return item.isMilestone;
    if (statusFilter !== "all") {
      return item.status?.toLowerCase() === statusFilter.toLowerCase();
    }
    return true;
  });

  const getStatusBadgeClass = (status, isMilestone) => {
    if (isMilestone) return "bg-purple-50 text-purple-700 border-purple-200";
    const s = (status || "").toLowerCase();
    if (s === "completed") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "in progress") return "bg-sky-50 text-sky-700 border-sky-200";
    if (s === "blocked") return "bg-rose-50 text-rose-700 border-rose-200";
    if (s === "pending verification") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  // Timeline weeks matching Wireframe Sheet 4
  const TIMELINE_WEEKS = [
    { label: "26 Oct", date: "2026-10-26" },
    { label: "02 Nov", date: "2026-11-02" },
    { label: "09 Nov", date: "2026-11-09" },
    { label: "16 Nov", date: "2026-11-16" },
    { label: "23 Nov", date: "2026-11-23" },
    { label: "30 Nov", date: "2026-11-30" },
    { label: "07 Dec", date: "2026-12-07" },
    { label: "14 Dec", date: "2026-12-14" },
    { label: "21 Dec", date: "2026-12-21" },
    { label: "28 Dec", date: "2026-12-28" },
    { label: "04 Jan", date: "2027-01-04" },
    { label: "11 Jan", date: "2027-01-11" }
  ];

  return (
    <div className="space-y-4">
      {/* Header and Action Links */}
      <div className="surface p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Project Plan</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Plan and track tasks, milestones, ownership and delivery timelines.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 shadow-xs hover:bg-sky-50 transition cursor-pointer"
            >
              <Upload size={13} className={isUploading ? "animate-spin" : ""} />
              {isUploading ? "Uploading..." : "Upload project plan"}
            </button>
            <button
              onClick={() => alert("Generate project plan requires connected FRD/BRD context.")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-xs hover:bg-slate-50 transition cursor-pointer"
            >
              <Sparkles size={13} className="text-amber-500" />
              Generate project plan (FRD/BRD)
            </button>
          </div>
        </div>

        {/* 5 KPI Cards (Matching Wireframe Row 4) */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-xs">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
              TOTAL TASKS
            </p>
            <p className="mt-1 text-2xl font-black text-slate-800">{totalTasksCount}</p>
          </div>
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3.5 shadow-xs">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-700">
              COMPLETED
            </p>
            <p className="mt-1 text-2xl font-black text-emerald-700">{completedCount}</p>
          </div>
          <div className="rounded-xl border border-sky-200/80 bg-sky-50/40 p-3.5 shadow-xs">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-sky-700">
              IN PROGRESS
            </p>
            <p className="mt-1 text-2xl font-black text-sky-700">{inProgressCount}</p>
          </div>
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-3.5 shadow-xs">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-amber-700">
              OVERDUE
            </p>
            <p className="mt-1 text-2xl font-black text-amber-700">{overdueCount}</p>
          </div>
          <div className="rounded-xl border border-purple-200/80 bg-purple-50/40 p-3.5 shadow-xs col-span-2 sm:col-span-1">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-purple-700">
              MILESTONES
            </p>
            <p className="mt-1 text-2xl font-black text-purple-700">{milestonesCount}</p>
          </div>
        </div>
      </div>

      {/* Toolbar & Filter Bar (Matching Wireframe Row 6) */}
      <div className="surface p-3.5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-md px-3 py-1.5 transition ${
                viewMode === "list"
                  ? "bg-white text-sky-800 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              LIST VIEW
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`rounded-md px-3 py-1.5 transition ${
                viewMode === "timeline"
                  ? "bg-white text-sky-800 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              TIMELINE VIEW
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full max-w-xs sm:w-64">
            <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search tasks and milestones…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter size={13} />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="h-8.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="all">Filters ▾ (All items)</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
              <option value="Not Started">Not Started</option>
              <option value="milestones">Milestones only</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        {canEdit && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingItem(null);
                setIsTaskModalOpen(true);
              }}
              className="text-xs"
            >
              <Plus size={13} /> Add task
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingItem(null);
                setIsMilestoneModalOpen(true);
              }}
              className="text-xs"
            >
              <Plus size={13} /> Milestone
            </Button>
          </div>
        )}
      </div>

      {/* Main Content: LIST VIEW */}
      {viewMode === "list" && (
        <div className="surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase tracking-wider text-slate-600 text-[10.5px]">
                  <th className="px-4 py-3">TASK / MILESTONE</th>
                  <th className="px-3 py-3">OWNER</th>
                  <th className="px-3 py-3">START DATE</th>
                  <th className="px-3 py-3">END / TARGET</th>
                  <th className="px-3 py-3">DURATION</th>
                  <th className="px-3 py-3">STATUS</th>
                  <th className="px-3 py-3">PROGRESS</th>
                  <th className="px-3 py-3">RELATED MILESTONES</th>
                  <th className="px-3 py-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredItems.map(item => {
                  const isHidden = item.parentGroup && collapsedGroups[item.parentGroup];
                  if (isHidden) return null;

                  if (item.isGroup) {
                    const isCollapsed = collapsedGroups[item.name];
                    return (
                      <tr
                        key={item.id}
                        className="bg-slate-50/70 font-semibold hover:bg-slate-100/70 transition"
                      >
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleGroup(item.name)}
                            className="flex items-center gap-2 text-left font-bold text-slate-800 hover:text-sky-700 cursor-pointer"
                          >
                            <span className="text-slate-400">
                              {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                            </span>
                            <span>{item.name}</span>
                          </button>
                        </td>
                        <td className="px-3 py-3 text-slate-600">{item.owner}</td>
                        <td className="px-3 py-3 text-slate-500">{item.startDate || "—"}</td>
                        <td className="px-3 py-3 text-slate-500">{item.endDate || "—"}</td>
                        <td className="px-3 py-3 text-slate-600">{item.duration}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getStatusBadgeClass(
                              item.status,
                              false
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-slate-200 overflow-hidden">
                              <div
                                className="h-full bg-sky-600 rounded-full"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700">
                              {item.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-500 text-[11px]">
                          {item.relatedMilestones || "—"}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canEdit && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingItem(item);
                                    setIsTaskModalOpen(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-sky-600"
                                  title="Edit"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => deleteItem(item.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  if (item.isMilestone) {
                    return (
                      <tr
                        key={item.id}
                        className="bg-purple-50/30 hover:bg-purple-50/60 font-medium transition"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 pl-3">
                            <span className="text-purple-600 font-black text-sm">◆</span>
                            <strong className="text-purple-950 font-bold">{item.name}</strong>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-600">{item.owner}</td>
                        <td className="px-3 py-3 text-slate-500">{item.startDate || "—"}</td>
                        <td className="px-3 py-3 text-slate-500 font-semibold">{item.endDate || "—"}</td>
                        <td className="px-3 py-3">
                          <span className="inline-block rounded-md border border-purple-200 bg-purple-100/60 px-2 py-0.5 text-[10.5px] font-bold text-purple-800">
                            Milestone
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getStatusBadgeClass(
                              item.status,
                              true
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-400 text-[11px] italic">
                          (Linked tasks calc)
                        </td>
                        <td className="px-3 py-3 text-purple-700 font-semibold text-[11px]">
                          {item.relatedMilestones || "Linked milestone"}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canEdit && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingItem(item);
                                    setIsMilestoneModalOpen(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-purple-600"
                                  title="Edit milestone"
                                >
                                  <Edit2 size={13} />
                                </button>
                                <button
                                  onClick={() => deleteItem(item.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600"
                                  title="Delete"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  // Standard subtask
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 pl-7 text-slate-800">
                          <span className="text-slate-300 font-mono text-xs">├</span>
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-600">{item.owner}</td>
                      <td className="px-3 py-3 text-slate-500">{item.startDate || "—"}</td>
                      <td className="px-3 py-3 text-slate-500">{item.endDate || "—"}</td>
                      <td className="px-3 py-3 text-slate-600">{item.duration}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getStatusBadgeClass(
                            item.status,
                            false
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.progress === 100
                                  ? "bg-emerald-500"
                                  : item.progress > 0
                                  ? "bg-sky-600"
                                  : "bg-slate-300"
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-600">
                            {item.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-500 text-[11px]">
                        {item.relatedMilestones || "—"}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {canEdit && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setIsTaskModalOpen(true);
                                }}
                                className="p-1 text-slate-400 hover:text-sky-600"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Content: TIMELINE VIEW (Gantt-Style Wireframe Sheet 4) */}
      {viewMode === "timeline" && (
        <div className="surface overflow-hidden">
          <div className="overflow-x-auto p-4">
            <div className="min-w-[1000px]">
              {/* Header with week columns */}
              <div className="grid grid-cols-[280px_repeat(12,1fr)] border-b border-slate-200 pb-2.5 text-xs font-bold text-slate-600">
                <div className="px-2">TASK / MILESTONE</div>
                {TIMELINE_WEEKS.map(w => (
                  <div key={w.label} className="text-center font-bold text-slate-700">
                    {w.label}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100 pt-2">
                {filteredItems.map((item, idx) => {
                  if (item.parentGroup && collapsedGroups[item.parentGroup]) return null;

                  // Compute active weeks based on item start/end or wireframe position
                  const weekIndex =
                    idx < 5
                      ? 0
                      : idx < 9
                      ? 1
                      : idx < 12
                      ? 3
                      : 4;
                  const spanWeeks = item.isMilestone ? 1 : item.isGroup ? 3 : 2;

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[280px_repeat(12,1fr)] items-center py-2.5 text-xs hover:bg-slate-50/60"
                    >
                      <div className="flex items-center gap-2 truncate pr-3">
                        {item.isMilestone ? (
                          <span className="text-purple-600 font-bold">◆</span>
                        ) : item.isGroup ? (
                          <span className="text-slate-400 font-bold">▾</span>
                        ) : (
                          <span className="text-slate-300 font-mono pl-3">├</span>
                        )}
                        <span
                          className={`truncate ${
                            item.isMilestone
                              ? "font-bold text-purple-900"
                              : item.isGroup
                              ? "font-bold text-slate-800"
                              : "text-slate-700"
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">· {item.owner}</span>
                      </div>

                      {/* 12 Timeline Column Slots */}
                      <div className="col-span-12 grid grid-cols-12 gap-1 items-center h-7">
                        {Array.from({ length: 12 }).map((_, colIdx) => {
                          const isStart = colIdx === weekIndex;
                          const inRange = colIdx >= weekIndex && colIdx < weekIndex + spanWeeks;

                          if (item.isMilestone && isStart) {
                            return (
                              <div
                                key={colIdx}
                                className="flex items-center justify-center col-span-1"
                              >
                                <div
                                  className="h-5 w-5 rotate-45 rounded bg-purple-600 shadow-xs flex items-center justify-center text-white text-[10px] cursor-pointer"
                                  title={`${item.name} (Target: ${item.endDate || "Oct 30"})`}
                                >
                                  <span className="-rotate-45 font-bold">◆</span>
                                </div>
                              </div>
                            );
                          }

                          if (!item.isMilestone && inRange) {
                            return (
                              <div
                                key={colIdx}
                                className={`h-5 flex items-center px-1.5 ${
                                  item.isGroup
                                    ? "bg-slate-300 rounded-sm"
                                    : item.status === "Completed"
                                    ? "bg-emerald-500 rounded-md text-white font-semibold text-[10px]"
                                    : "bg-sky-500 rounded-md text-white font-semibold text-[10px]"
                                }`}
                              >
                                {isStart && (
                                  <span className="truncate text-[10px]">
                                    {item.duration || "Duration"}
                                  </span>
                                )}
                              </div>
                            );
                          }

                          return <div key={colIdx} className="h-5 border-r border-slate-100/60" />;
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal (Sheet 2 Task Editor) */}
      {isTaskModalOpen && (
        <TaskEditorModal
          item={editingItem}
          groups={items.filter(i => i.isGroup).map(i => i.name)}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingItem(null);
          }}
          onSave={saveItem}
        />
      )}

      {/* Milestone Modal (Sheet 3 Milestone Editor) */}
      {isMilestoneModalOpen && (
        <MilestoneEditorModal
          item={editingItem}
          onClose={() => {
            setIsMilestoneModalOpen(false);
            setEditingItem(null);
          }}
          onSave={saveItem}
        />
      )}
    </div>
  );
}

function TaskEditorModal({ item, groups, onClose, onSave }) {
  const [name, setName] = useState(item?.name || "");
  const [description, setDescription] = useState(item?.description || "");
  const [owner, setOwner] = useState(item?.owner || "Priya Shah");
  const [parentGroup, setParentGroup] = useState(item?.parentGroup || groups[0] || "");
  const [startDate, setStartDate] = useState(item?.startDate || "2026-10-27");
  const [endDate, setEndDate] = useState(item?.endDate || "2026-10-30");
  const [duration, setDuration] = useState(item?.duration || "4 days");
  const [status, setStatus] = useState(item?.status || "In Progress");
  const [priority, setPriority] = useState(item?.priority || "High");
  const [progress, setProgress] = useState(item?.progress ?? 50);
  const [relatedMilestones, setRelatedMilestones] = useState(item?.relatedMilestones || "");
  const [notes, setNotes] = useState(item?.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      ...(item || {}),
      name: name.trim(),
      description,
      owner,
      parentGroup: parentGroup || null,
      startDate,
      endDate,
      duration,
      status,
      priority,
      progress: Number(progress),
      relatedMilestones,
      notes,
      isMilestone: false,
      isGroup: !parentGroup,
      isSubtask: Boolean(parentGroup)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {item ? "Edit Task" : "Task Details Panel"}
            </h3>
            <p className="text-xs text-slate-500">Configure task details, dates, and ownership.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <Field label="Task Name *" value={name} onChange={setName} required />
          <Field label="Description" value={description} onChange={setDescription} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Parent Task Group</label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none"
                value={parentGroup}
                onChange={e => setParentGroup(e.target.value)}
              >
                <option value="">None (Top-level group)</option>
                {groups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <Field label="Assigned To" value={owner} onChange={setOwner} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Start Date *" type="date" value={startDate} onChange={setStartDate} required />
            <Field label="End Date *" type="date" value={endDate} onChange={setEndDate} required />
            <Field label="Duration" value={duration} onChange={setDuration} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Progress ({progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={e => setProgress(Number(e.target.value))}
                className="mt-2 w-full accent-sky-600"
              />
            </div>
          </div>

          <Field
            label="Related Milestones"
            value={relatedMilestones}
            onChange={setRelatedMilestones}
            placeholder="e.g. Requirements Sign-off"
          />
          <Field label="Notes" value={notes} onChange={setNotes} placeholder="Additional notes…" />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MilestoneEditorModal({ item, onClose, onSave }) {
  const [name, setName] = useState(item?.name || "");
  const [targetDate, setTargetDate] = useState(item?.endDate || item?.startDate || "2026-10-30");
  const [owner, setOwner] = useState(item?.owner || "Priya Shah");
  const [status, setStatus] = useState(item?.status || "In Progress");
  const [description, setDescription] = useState(
    item?.description || "Formal confirmation that milestone objectives are approved."
  );
  const [relatedMilestones, setRelatedMilestones] = useState(item?.relatedMilestones || "3 linked tasks");
  const [criteria, setCriteria] = useState(item?.criteria || "Business owner approval received");
  const [notes, setNotes] = useState(item?.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      ...(item || {}),
      name: name.trim(),
      owner,
      startDate: targetDate,
      endDate: targetDate,
      duration: "Milestone",
      status,
      description,
      relatedMilestones,
      criteria,
      notes,
      progress: status === "Achieved" || status === "Completed" ? 100 : 50,
      isMilestone: true,
      isGroup: false,
      isSubtask: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {item ? "Edit Milestone" : "Milestone Details Panel"}
            </h3>
            <p className="text-xs text-slate-500">
              Milestones are checkpoint records indicating key deliverables.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <Field label="Milestone Name *" value={name} onChange={setName} required />
          <Field label="Description" value={description} onChange={setDescription} />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Target Date *" type="date" value={targetDate} onChange={setTargetDate} required />
            <Field label="Owner" value={owner} onChange={setOwner} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status</label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs outline-none"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Achieved">Achieved</option>
              </select>
            </div>
            <Field
              label="Linked Tasks / Criteria"
              value={relatedMilestones}
              onChange={setRelatedMilestones}
              placeholder="e.g. 3 linked tasks"
            />
          </div>

          <Field
            label="Achievement Criteria"
            value={criteria}
            onChange={setCriteria}
            placeholder="Criteria needed for sign-off…"
          />
          <Field label="Notes" value={notes} onChange={setNotes} placeholder="Approval evidence / notes…" />

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Milestone
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RelatedKnowledge({ data }) {
  return <Card title="Related knowledge">
    <div className="grid gap-3 md:grid-cols-2">{data.knowledge.map(item => <div key={item.id} className="rounded-lg border border-slate-200 p-4"><div className="flex items-center gap-2 text-sky-700"><GitBranch size={16}/><Badge tone="blue">{item.category}</Badge></div><strong className="mt-2 block">{item.title}</strong><small className="mt-1 block text-slate-500">Repository record · {new Date(item.updatedAt).toLocaleDateString()}</small></div>)}</div>
    {data.knowledge.length === 0 && <p className="text-sm text-slate-500">No knowledge records available.</p>}
  </Card>;
}

function Analytics({ project }) {
  return <div className="grid gap-4 md:grid-cols-3">
    <Card title="Delivery progress"><div className="text-4xl font-bold text-sky-800">{project.progress}%</div><div className="mt-4 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-sky-600" style={{ width: `${project.progress}%` }}/></div><p className="mt-2 text-sm text-slate-500">Current project progress</p></Card>
    <Card title="Lifecycle"><strong className="text-lg">{project.status}</strong><p className="mt-2 text-sm text-slate-500">Lifecycle remains separate from RAG health.</p></Card>
    <Card title="RAG health"><Badge tone={project.rag.toLowerCase()}>{project.rag}</Badge><p className="mt-3 text-sm text-slate-500">Health summary: {project.health}</p></Card>
  </div>;
}

function Escalations({ project, updateProject, notify }) {
  const [text, setText] = useState("");
  const escalations = project.escalations || [];
  return <Card title="Escalation log">
    <div className="mb-4 flex gap-2"><input className="field-control mt-0" value={text} onChange={event => setText(event.target.value)} placeholder="Describe an issue or decision needed"/><Button variant="primary" onClick={() => {
      if (!text.trim()) return;
      updateProject(project.id, { escalations: [...escalations, { id: crypto.randomUUID(), text: text.trim(), createdAt: new Date().toISOString() }] });
      setText("");
      notify("Escalation logged locally.");
    }}><Plus size={15}/> Log</Button></div>
    {escalations.length === 0 ? <p className="text-sm text-slate-500">No escalations have been logged.</p> : <div className="space-y-2">{[...escalations].reverse().map(item => <div key={item.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3"><strong className="text-sm">{item.text}</strong><small className="mt-1 block text-amber-800">{new Date(item.createdAt).toLocaleString()}</small></div>)}</div>}
  </Card>;
}

function ProjectBudget({ project, updateProject, canEdit, notify }) {
  const defaultBudget = {
    allocated: 125000,
    actualSpent: 78500,
    forecast: 118000,
    categories: [
      { name: "Development & Engineering", allocated: 65000, spent: 44000 },
      { name: "Software Licenses & Cloud Infra", allocated: 25000, spent: 18500 },
      { name: "QA & Integration Testing", allocated: 18000, spent: 9200 },
      { name: "PMO, Security & Contingency", allocated: 17000, spent: 6800 }
    ]
  };

  const budget = { ...defaultBudget, ...(project.budget || {}) };
  const [allocated, setAllocated] = useState(budget.allocated);
  const [actualSpent, setActualSpent] = useState(budget.actualSpent);
  const [forecast, setForecast] = useState(budget.forecast);

  const remaining = Math.max(0, Number(allocated) - Number(actualSpent));
  const burnPercent = Number(allocated) > 0 ? Math.min(100, Math.round((Number(actualSpent) / Number(allocated)) * 100)) : 0;
  const isOverBudget = Number(actualSpent) > Number(allocated);

  const saveBudget = () => {
    updateProject(project.id, {
      budget: {
        ...budget,
        allocated: Number(allocated),
        actualSpent: Number(actualSpent),
        forecast: Number(forecast)
      }
    });
    notify("Project budget saved locally.");
  };

  return (
    <div className="space-y-5">
      {/* KPI Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-sky-50 p-2.5 text-sky-700">
              <Banknote size={20} />
            </span>
            <div>
              <span className="block text-xs font-semibold text-slate-500">Budget Allocated</span>
              <strong className="text-xl font-bold text-slate-900">${Number(allocated).toLocaleString()}</strong>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
              <Coins size={20} />
            </span>
            <div>
              <span className="block text-xs font-semibold text-slate-500">Actual Spent</span>
              <strong className="text-xl font-bold text-slate-900">${Number(actualSpent).toLocaleString()}</strong>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className={`rounded-xl p-2.5 ${isOverBudget ? "bg-rose-50 text-rose-700" : "bg-indigo-50 text-indigo-700"}`}>
              <BadgeDollarSign size={20} />
            </span>
            <div>
              <span className="block text-xs font-semibold text-slate-500">Remaining Budget</span>
              <strong className={`text-xl font-bold ${isOverBudget ? "text-rose-600" : "text-slate-900"}`}>
                ${remaining.toLocaleString()}
              </strong>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
              <Target size={20} />
            </span>
            <div>
              <span className="block text-xs font-semibold text-slate-500">Forecasted Final Cost</span>
              <strong className="text-xl font-bold text-slate-900">${Number(forecast).toLocaleString()}</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* Burn Rate / Budget Consumption Progress */}
      <Card title="Budget Consumption & Health">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">
              Budget Utilization: <strong className="text-sky-800">{burnPercent}%</strong>
            </span>
            <span className="text-xs font-medium text-slate-500">
              ${Number(actualSpent).toLocaleString()} spent of ${Number(allocated).toLocaleString()}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget ? "bg-rose-500" : burnPercent > 80 ? "bg-amber-500" : "bg-sky-600"
              }`}
              style={{ width: `${burnPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            {isOverBudget
              ? "Warning: Actual expenses exceed the allocated baseline budget."
              : burnPercent > 80
              ? "Caution: Budget spend is approaching allocated limits."
              : "Healthy: Spending rate is well aligned with current milestone progress."}
          </p>
        </div>
      </Card>

      {/* Budget Breakdown by Category */}
      <Card title="Cost Category Breakdown">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[550px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2.5 font-bold">Category</th>
                <th className="font-bold">Allocated</th>
                <th className="font-bold">Actual Spent</th>
                <th className="font-bold">Remaining</th>
                <th className="font-bold">Burn Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {budget.categories.map(cat => {
                const catRemaining = Math.max(0, cat.allocated - cat.spent);
                const catBurn = cat.allocated > 0 ? Math.round((cat.spent / cat.allocated) * 100) : 0;
                return (
                  <tr key={cat.name} className="hover:bg-slate-50">
                    <td className="py-3 font-semibold text-slate-800">{cat.name}</td>
                    <td className="text-slate-600">${cat.allocated.toLocaleString()}</td>
                    <td className="font-medium text-slate-900">${cat.spent.toLocaleString()}</td>
                    <td className="text-slate-600">${catRemaining.toLocaleString()}</td>
                    <td>
                      <span className="inline-flex items-center gap-2">
                        <span className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden inline-block">
                          <span
                            className={`block h-full ${catBurn > 90 ? "bg-rose-500" : catBurn > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                            style={{ width: `${Math.min(100, catBurn)}%` }}
                          />
                        </span>
                        <span className="text-xs text-slate-600">{catBurn}%</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Editable Budget Settings */}
      {canEdit && (
        <Card title="Update Budget Baseline">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Budget Allocated ($)"
              type="number"
              value={allocated}
              onChange={setAllocated}
              min="0"
            />
            <Field
              label="Actual Spent ($)"
              type="number"
              value={actualSpent}
              onChange={setActualSpent}
              min="0"
            />
            <Field
              label="Forecasted Final Cost ($)"
              type="number"
              value={forecast}
              onChange={setForecast}
              min="0"
            />
          </div>
          <Button variant="primary" className="mt-4" onClick={saveBudget}>
            <Save size={15} /> Save Budget
          </Button>
        </Card>
      )}
    </div>
  );
}

function ProjectTeamStakeholders({ project, updateProject, canEdit, notify, resources = [] }) {
  const defaultTeam = {
    businessOwner: project.intake?.owner || "Vikram Malhotra",
    sponsor: project.intake?.sponsor || "Sharon Sonny",
    pm: project.pm || "Aarav Menon",
    deliveryOwner: "Meera Nair",
    technicalLead: "Rohan Iyer",
    developer: "Priya Shah"
  };

  const team = { ...defaultTeam, ...(project.team || {}) };
  const [businessOwner, setBusinessOwner] = useState(team.businessOwner);
  const [sponsor, setSponsor] = useState(team.sponsor);
  const [pm, setPm] = useState(team.pm);
  const [deliveryOwner, setDeliveryOwner] = useState(team.deliveryOwner);
  const [technicalLead, setTechnicalLead] = useState(team.technicalLead);
  const [developer, setDeveloper] = useState(team.developer);

  const rolesConfig = [
    {
      role: "Business Owner",
      person: businessOwner,
      desc: "Defines strategic outcomes, business acceptance, and priority.",
      raci: "Accountable"
    },
    {
      role: "Sponsor",
      person: sponsor,
      desc: "Executive backing, financial sponsorship, and escalation governance.",
      raci: "Accountable"
    },
    {
      role: "PM (Project Manager)",
      person: pm,
      desc: "Day-to-day project execution, milestone scheduling, and team coordination.",
      raci: "Responsible"
    },
    {
      role: "Delivery Owner",
      person: deliveryOwner,
      desc: "Oversees overall solution delivery, release cadence, and cross-functional teams.",
      raci: "Responsible"
    },
    {
      role: "Technical Lead",
      person: technicalLead,
      desc: "Architectural alignment, technical design review, and code quality governance.",
      raci: "Responsible"
    },
    {
      role: "Developer",
      person: developer,
      desc: "Implementation, component development, unit testing, and defect resolution.",
      raci: "Responsible"
    }
  ];

  const saveTeam = () => {
    updateProject(project.id, {
      pm,
      team: {
        businessOwner: businessOwner.trim(),
        sponsor: sponsor.trim(),
        pm: pm.trim(),
        deliveryOwner: deliveryOwner.trim(),
        technicalLead: technicalLead.trim(),
        developer: developer.trim()
      }
    });
    notify("Project team & key stakeholders saved.");
  };

  return (
    <div className="space-y-5">
      {/* Stakeholders Cards Grid */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {rolesConfig.map(item => (
          <Card key={item.role} className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                  {item.role}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  {item.raci}
                </span>
              </div>
              <strong className="mt-2 block text-base font-bold text-slate-900">
                {item.person || "Unassigned"}
              </strong>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Stakeholder Directory & RACI Table */}
      <Card title="Team Directory & Responsibility Matrix">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="py-2.5 font-bold">Role</th>
                <th className="font-bold">Stakeholder Name</th>
                <th className="font-bold">Governance RACI</th>
                <th className="font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rolesConfig.map(item => (
                <tr key={item.role} className="hover:bg-slate-50">
                  <td className="py-3 font-semibold text-slate-800">{item.role}</td>
                  <td className="font-medium text-sky-900">{item.person || "Unassigned"}</td>
                  <td>
                    <Badge tone={item.raci === "Accountable" ? "blue" : "emerald"}>
                      {item.raci}
                    </Badge>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Editable Assignment Form */}
      {canEdit && (
        <Card title="Assign Team Members & Stakeholders">
          <form
            onSubmit={e => {
              e.preventDefault();
              saveTeam();
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Business Owner"
                value={businessOwner}
                onChange={setBusinessOwner}
                placeholder="Enter business owner name"
              />
              <Field
                label="Sponsor"
                value={sponsor}
                onChange={setSponsor}
                placeholder="Enter sponsor name"
              />
              <Field
                label="PM (Project Manager)"
                value={pm}
                onChange={setPm}
                placeholder="Enter PM name"
              />
              <Field
                label="Delivery Owner"
                value={deliveryOwner}
                onChange={setDeliveryOwner}
                placeholder="Enter delivery owner name"
              />
              <Field
                label="Technical Lead"
                value={technicalLead}
                onChange={setTechnicalLead}
                placeholder="Enter tech lead name"
              />
              <Field
                label="Developer"
                value={developer}
                onChange={setDeveloper}
                placeholder="Enter developer / lead engineer"
              />
            </div>
            <Button variant="primary" type="submit" className="mt-2">
              <Save size={15} /> Save Team & Stakeholders
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}

function SimulatedFeature({ icon: Icon, title, text, notify }) {
  return <Card title={title}><div className="flex items-start gap-3"><span className="rounded-xl bg-sky-50 p-3 text-sky-700"><Icon size={20}/></span><div><p className="text-sm text-slate-600">{text}</p><Button className="mt-4" onClick={() => notify(`${title} is represented as a local prototype; no external service is connected.`)}>Open simulation <ArrowRight size={15}/></Button></div></div></Card>;
}
