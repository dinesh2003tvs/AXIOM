import { useEffect, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, Bot, CalendarDays, CheckCircle2, FileText, GitBranch, Plus, Save, Sparkles, Target, Users } from "lucide-react";
import { LIFECYCLE, RAGS } from "../data/seed.js";
import { useAppData } from "../state/AppDataContext.jsx";
import { Badge, Button, Card, Field, FilePicker, Notice, PageHeading, SelectField } from "../components/ui.jsx";

const TABS = ["Overview", "Artifacts", "Project plan", "Related & knowledge", "Test cases", "Analytics", "Escalations"];

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
  const files = data.attachments.filter(file => project.attachments?.includes(file.id));
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
    if (tab === "Project plan") return <ProjectPlan project={project} canEdit={canEdit} onSave={values => { updateProject(project.id, values); notify("Project plan saved locally."); }}/>;
    if (tab === "Related & knowledge") return <RelatedKnowledge data={data}/>;
    if (tab === "Test cases") return <SimulatedFeature icon={CheckCircle2} title="Test case management" text="Test planning is represented as a local prototype surface. Add a project action to track a test activity." notify={notify}/>;
    if (tab === "Analytics") return <Analytics project={project}/>;
    return <Escalations project={project} updateProject={updateProject} notify={notify}/>;
  };

  return <div className="space-y-5">
    <PageHeading eyebrow="PROJECT WORKSPACE" title={project.name} description={<><strong>{project.id}</strong> · {project.fn} · Workspace data is saved locally.</>} actions={<Button onClick={onBack}><ArrowRight className="rotate-180" size={15}/> Back</Button>}/>
    {error && <Notice type="error">{error}</Notice>}
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <div className="surface p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Lifecycle</p><div className="mt-2">{canEdit ? <select className="field-control mt-0" value={project.status} onChange={event => updateProject(project.id, { status: event.target.value })}>{LIFECYCLE.map(status => <option key={status}>{status}</option>)}</select> : <p className="mt-2 font-semibold">{project.status}</p>}</div></div>
      <div className="surface p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">RAG health</p><div className="mt-2">{canEdit ? <select className="field-control mt-0" value={project.rag} onChange={event => updateProject(project.id, { rag: event.target.value })}>{RAGS.map(value => <option key={value}>{value}</option>)}</select> : <Badge tone={project.rag.toLowerCase()}>{project.rag}</Badge>}</div></div>
      <div className="surface p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Progress</p><p className="mt-2 text-xl font-bold">{project.progress}%</p></div>
      <div className="surface p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Project manager</p><p className="mt-2 font-semibold">{project.pm}</p></div>
      <div className="surface p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Target end</p><p className="mt-2 font-semibold">{project.due || "Not set"}</p></div>
    </div>
    <div className="surface overflow-x-auto p-2">
      <div className="flex min-w-max gap-1" role="tablist" aria-label="Project workspace sections">
        {TABS.map(item => <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`rounded-lg px-4 py-2.5 text-sm font-semibold ${tab === item ? "bg-sky-50 text-sky-800" : "text-slate-500 hover:bg-slate-50"}`}>{item}</button>)}
      </div>
    </div>
    {viewTab()}
    {tab === "Overview" && <Card title="Project details">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Project title" value={name} onChange={setName}/>
        <SelectField label="Project manager" value={pm} onChange={setPm} options={["Unassigned", ...new Set([...data.resources.map(resource => resource.name), project.pm].filter(Boolean))]}/>
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
        <div className="mt-4 flex flex-wrap gap-2"><Badge tone="blue">{project.fn}</Badge><Badge>{project.status}</Badge><Badge tone={project.rag.toLowerCase()}>{project.rag}</Badge></div>
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

function ProjectPlan({ project, canEdit, onSave }) {
  const [progress, setProgress] = useState(project.progress);
  const [due, setDue] = useState(project.due || "");
  const [pm, setPm] = useState(project.pm);
  return <Card title="Project plan">
    <p className="mb-4 text-sm text-slate-500">Track delivery ownership, target date, and progress in local project data.</p>
    <div className="grid gap-4 md:grid-cols-3">
      <Field label="Project manager" value={pm} onChange={setPm}/>
      <Field label="Target end date" type="date" value={due} onChange={setDue}/>
      <Field label="Progress (%)" type="number" min="0" max="100" value={progress} onChange={value => setProgress(Math.min(100, Math.max(0, Number(value))))}/>
    </div>
    {canEdit && <Button variant="primary" className="mt-4" onClick={() => onSave({ pm, due, progress: Number(progress) })}><Save size={15}/> Save plan</Button>}
  </Card>;
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

function SimulatedFeature({ icon: Icon, title, text, notify }) {
  return <Card title={title}><div className="flex items-start gap-3"><span className="rounded-xl bg-sky-50 p-3 text-sky-700"><Icon size={20}/></span><div><p className="text-sm text-slate-600">{text}</p><Button className="mt-4" onClick={() => notify(`${title} is represented as a local prototype; no external service is connected.`)}>Open simulation <ArrowRight size={15}/></Button></div></div></Card>;
}
