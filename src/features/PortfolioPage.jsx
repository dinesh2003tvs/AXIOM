import { useMemo, useState } from "react";
import { ArrowUpRight, Filter, Search, ShieldCheck, Sparkles, UserRoundPlus, Users } from "lucide-react";
import { LIFECYCLE, RAGS } from "../data/seed.js";
import { useAppData } from "../state/AppDataContext.jsx";
import { Badge, Button, Card, Field, PageHeading, SelectField } from "../components/ui.jsx";

export default function PortfolioPage({ onOpenProject, onNewProject, notify }) {
  const { data, updateProject } = useAppData();
  const [rag, setRag] = useState("All");
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const projects = useMemo(() => data.projects.filter(project => {
    const matchesRag = rag === "All" || project.rag === rag;
    const matchesStatus = status === "All" || project.status === status;
    const matchesQuery = `${project.id} ${project.name} ${project.fn} ${project.pm}`.toLowerCase().includes(query.toLowerCase());
    return matchesRag && matchesStatus && matchesQuery;
  }), [data.projects, rag, status, query]);
  const risks = data.projects.filter(project => ["Amber", "Red"].includes(project.rag)).length;
  const unassigned = data.projects.filter(project => project.pm === "Unassigned").length;
  const manage = data.role === "PMO";

  return <div className="space-y-5">
    <PageHeading eyebrow="PROJECT WORKSPACE" title="Project workspace overview" description="Review lifecycle, project health, assignments, and delivery progress stored in this browser." actions={<>
      <Button onClick={() => setRag(rag === "All" ? "Amber" : "All")}><Filter size={15}/> {rag === "All" ? "Show at risk" : "Clear risk filter"}</Button>
      {manage && <Button variant="primary" onClick={onNewProject}><UserRoundPlus size={15}/> New project</Button>}
    </>}/>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric title="Projects" value={data.projects.length} icon={ShieldCheck}/>
      <Metric title="At risk" value={risks} icon={Sparkles}/>
      <Metric title="Unassigned" value={unassigned} icon={Users}/>
      <Metric title="Saved locally" value="Yes" icon={ShieldCheck}/>
    </div>
    <Card title="Portfolio" action={<span className="text-xs text-slate-500">{projects.length} of {data.projects.length} projects</span>}>
      <div className="mb-4 grid gap-3 md:grid-cols-[minmax(180px,1fr)_200px_200px]">
        <label className="relative block"><Search className="absolute left-3 top-3 text-slate-400" size={16}/><input className="field-control mt-0 pl-9" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search project, ID, function, PM"/></label>
        <SelectField label="RAG" value={rag} onChange={setRag} options={["All", ...RAGS]}/>
        <SelectField label="Lifecycle" value={status} onChange={setStatus} options={["All", ...LIFECYCLE]}/>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left text-sm">
          <thead><tr className="border-y border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            {["Project", "Function", "PM", "Lifecycle", "RAG", "Progress", "Target end", ""].map(heading => <th key={heading} className="px-3 py-3 font-bold">{heading}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map(project => <tr key={project.id} className="hover:bg-slate-50">
              <td className="px-3 py-3"><button className="text-left" onClick={() => onOpenProject(project)}><strong className="block text-sky-800 hover:underline">{project.name}</strong><small className="text-slate-500">{project.id}</small></button></td>
              <td className="px-3 py-3">{project.fn}</td>
              <td className="px-3 py-3">{manage
                ? <select className="max-w-40 rounded-md border border-slate-200 px-2 py-1" value={project.pm} onChange={event => updateProject(project.id, { pm: event.target.value })}><option>Unassigned</option>{data.resources.map(resource => <option key={resource.id}>{resource.name}</option>)}</select>
                : project.pm}</td>
              <td className="px-3 py-3">{manage
                ? <select className="rounded-md border border-slate-200 px-2 py-1" value={project.status} onChange={event => updateProject(project.id, { status: event.target.value })}>{LIFECYCLE.map(value => <option key={value}>{value}</option>)}</select>
                : project.status}</td>
              <td className="px-3 py-3">{manage
                ? <select aria-label={`RAG for ${project.name}`} className="rounded-md border border-slate-200 px-2 py-1" value={project.rag} onChange={event => updateProject(project.id, { rag: event.target.value })}>{RAGS.map(value => <option key={value}>{value}</option>)}</select>
                : <Badge tone={project.rag.toLowerCase()}>{project.rag}</Badge>}</td>
              <td className="px-3 py-3"><div className="flex items-center gap-2"><input aria-label={`Progress for ${project.name}`} disabled={!manage} className="w-20 accent-sky-700" type="range" min="0" max="100" value={project.progress} onChange={event => updateProject(project.id, { progress: Number(event.target.value) })}/><span>{project.progress}%</span></div></td>
              <td className="px-3 py-3">{project.due ? new Date(`${project.due}T00:00:00`).toLocaleDateString() : "—"}</td>
              <td className="px-3 py-3"><Button variant="ghost" className="min-h-8 px-2" onClick={() => onOpenProject(project)} aria-label={`Open ${project.name}`}><ArrowUpRight size={16}/></Button></td>
            </tr>)}
          </tbody>
        </table>
        {projects.length === 0 && <div className="py-10 text-center text-sm text-slate-500">No projects match these filters.</div>}
      </div>
    </Card>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Governance signals">
        <ul className="space-y-3 text-sm">
          <li className="flex justify-between border-b border-slate-100 pb-3"><span>Projects with Amber / Red health</span><strong>{risks}</strong></li>
          <li className="flex justify-between border-b border-slate-100 pb-3"><span>Projects awaiting PM assignment</span><strong>{unassigned}</strong></li>
          <li className="flex justify-between"><span>Ready for PMO review</span><strong>{data.projects.filter(project => project.status === "Ready for review").length}</strong></li>
        </ul>
      </Card>
      <Card title="AI portfolio signals">
        <p className="mb-3 text-sm text-slate-600">Prototype-only insights based on current browser data. No AI service is contacted.</p>
        <div className="space-y-2">{unassigned > 0 && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{unassigned} project(s) have no assigned PM.</p>}{risks > 0 && <p className="rounded-lg bg-orange-50 p-3 text-sm text-orange-900">{risks} project(s) have Amber or Red RAG.</p>}{unassigned === 0 && risks === 0 && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">No current health or allocation signals.</p>}</div>
      </Card>
    </div>
  </div>;
}

function Metric({ title, value, icon: Icon }) {
  return <Card className="flex items-center gap-3 p-4"><span className="rounded-lg bg-sky-50 p-2 text-sky-700"><Icon size={18}/></span><span><span className="block text-xs text-slate-500">{title}</span><strong className="text-xl">{value}</strong></span></Card>;
}
