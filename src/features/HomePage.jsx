import { Activity, AlertTriangle, ArrowRight, BriefcaseBusiness, CheckCircle2, FolderKanban, Plus, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useAppData } from "../state/AppDataContext.jsx";
import { Badge, Button, Card, PageHeading } from "../components/ui.jsx";

const roleCopy = {
  "CXO / Leadership": ["Executive portfolio view", "Enterprise project health, delivery signals, and decisions requiring leadership attention."],
  PMO: ["PMO control center", "Portfolio governance, resource allocation, exceptions, and AI recommendations."],
  PM: ["My delivery workspace", "Project delivery progress, upcoming milestones, and AI-supported actions."]
};

export default function HomePage({ onOpenProject, onNewProject, notify }) {
  const { data } = useAppData();
  const projects = data.role === "PM"
    ? data.projects.filter(project => project.pm !== "Unassigned" && project.status !== "Closed").slice(0, 4)
    : data.projects.slice(0, 5);
  const [title, description] = roleCopy[data.role];
  const active = data.projects.filter(project => project.status === "In Progress").length;
  const atRisk = data.projects.filter(project => project.rag === "Amber" || project.rag === "Red").length;
  const unassigned = data.projects.filter(project => project.pm === "Unassigned").length;
  const stats = [
    { label: "Total projects", value: data.projects.length, icon: FolderKanban },
    { label: "In progress", value: active, icon: Activity },
    { label: "At risk", value: atRisk, icon: AlertTriangle },
    { label: "Unassigned", value: unassigned, icon: Users }
  ];
  const statuses = ["Open", "Ready for review", "In Progress", "Closed"];

  return <div className="space-y-5">
    <PageHeading eyebrow="HOME" title={title} description={description} actions={data.role !== "CXO / Leadership" && <Button variant="primary" onClick={onNewProject}><Plus size={16}/> New project</Button>}/>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => <Card key={label} className="flex items-center gap-3 p-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-700"><Icon size={20}/></span>
        <span><strong className="block text-2xl">{value}</strong><span className="text-sm text-slate-600">{label}</span></span>
      </Card>)}
    </div>
    <Card className="border-sky-100 bg-sky-50/60">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-white p-2 text-sky-700"><Sparkles size={20}/></span>
        <div className="flex-1">
          <h2 className="font-bold">AXIOM insight <span className="ml-2 rounded-full bg-white px-2 py-1 text-[10px] uppercase tracking-wide text-sky-700">Local simulation</span></h2>
          <p className="mt-1 text-sm text-slate-600">There are {atRisk} projects with amber or red health, {unassigned} unassigned, and {active} currently in progress. This insight is calculated from the projects stored in this browser.</p>
        </div>
        <Button variant="ghost" onClick={() => notify("This insight is a local demonstration; no AI service is connected.")}>About <ArrowRight size={15}/></Button>
      </div>
    </Card>
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <Card title="Projects" action={<Button variant="ghost" onClick={() => notify("Choose Project Workspace from the navigation to browse all projects.")}>Portfolio <ArrowRight size={15}/></Button>}>
        <div className="divide-y divide-slate-100">
          {projects.length === 0 && <p className="py-8 text-center text-sm text-muted">No projects match this role view yet.</p>}
          {projects.map(project => <button key={project.id} onClick={() => onOpenProject(project)} className="flex w-full items-center gap-3 py-3 text-left hover:bg-slate-50">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-700"><BriefcaseBusiness size={17}/></span>
            <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{project.name}</strong><small className="text-xs text-slate-500">{project.id} · {project.fn}</small></span>
            <span className="hidden w-20 sm:block"><span className="block h-1.5 rounded-full bg-slate-100"><span className="block h-full rounded-full bg-sky-600" style={{ width: `${project.progress}%` }}/></span><small className="mt-1 block text-right text-xs text-slate-500">{project.progress}%</small></span>
            <Badge tone={project.rag.toLowerCase()}>{project.rag}</Badge>
          </button>)}
        </div>
      </Card>
      <div className="space-y-4">
        <Card title="Lifecycle overview">
          <div className="space-y-3">
            {statuses.map(status => {
              const count = data.projects.filter(project => project.status === status).length;
              const percentage = data.projects.length ? count / data.projects.length * 100 : 0;
              return <div key={status}>
                <div className="mb-1 flex justify-between text-sm"><span>{status}</span><strong>{count}</strong></div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-600" style={{ width: `${percentage}%` }}/></div>
              </div>;
            })}
          </div>
        </Card>
        <Card title="Governance signals">
          <div className="space-y-3 text-sm">
            <Signal icon={AlertTriangle} text={`${atRisk} projects need health review`} tone="amber"/>
            <Signal icon={Users} text={`${unassigned} projects need a PM`} tone="blue"/>
            <Signal icon={ShieldCheck} text={`${data.drafts.length} intake drafts saved locally`} tone="green"/>
          </div>
        </Card>
      </div>
    </div>
    <Card title="Recent project activity">
      <div className="grid gap-3 text-sm md:grid-cols-3">
        <ActivityEntry title="Portfolio state" text={`${data.projects.length} projects are available in this browser.`}/>
        <ActivityEntry title="Latest update" text={data.projects[0] ? `${data.projects[0].name} · ${data.projects[0].status}` : "No project updates yet."}/>
        <ActivityEntry title="Local data" text="Changes stay on this device; nothing is sent to a server."/>
      </div>
    </Card>
  </div>;
}

function Signal({ icon: Icon, text, tone }) {
  const colors = { amber: "text-amber-600 bg-amber-50", blue: "text-sky-700 bg-sky-50", green: "text-emerald-700 bg-emerald-50" };
  return <div className="flex items-center gap-2"><span className={`rounded-lg p-2 ${colors[tone]}`}><Icon size={16}/></span>{text}</div>;
}

function ActivityEntry({ title, text }) {
  return <div className="rounded-lg bg-slate-50 p-3"><strong className="block text-xs uppercase tracking-wide text-slate-500">{title}</strong><p className="mt-1 text-slate-700">{text}</p><span className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 size={13}/> Saved in this browser</span></div>;
}
