import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ClipboardPlus, Save, Send, Sparkles } from "lucide-react";
import { useAppData } from "../state/AppDataContext.jsx";
import { Badge, Button, Card, Field, FilePicker, Notice, PageHeading, SelectField } from "../components/ui.jsx";

const STEPS = ["Request information", "Business justification", "Project characteristics", "Technology & timeline", "Review & submit"];
const blankForm = () => ({
  name: "",
  requestor: "Sharon Sonny",
  fn: "Enterprise Services",
  coFunction: "",
  owner: "",
  sponsor: "",
  category: "Internal facing",
  requestedDate: "",
  businessProblem: "",
  desiredOutcome: "",
  costType: "One Time",
  projectType: "Implementation",
  recordType: "Project",
  vendorInvolved: "No",
  multipleFunctions: "No",
  expectedUsers: "",
  effort: "",
  systems: "",
  integrationRequired: "No",
  dataMigration: "No",
  infosecReview: "No",
  startDate: "",
  due: ""
});

export default function IntakePage({ onOpenProject, notify }) {
  const { data, saveDraft, deleteDraft, createProject } = useAppData();
  const [step, setStep] = useState(0);
  const [draftId, setDraftId] = useState(() => data.drafts[0]?.id || crypto.randomUUID());
  const [form, setForm] = useState(() => ({ ...blankForm(), ...(data.drafts[0]?.form || {}) }));
  const [error, setError] = useState("");
  const attachments = data.attachments.filter(file => file.ownerType === "draft" && file.ownerId === draftId);
  const edit = (key, value) => setForm(current => ({ ...current, [key]: value }));

  const requiredMessage = useMemo(() => {
    if (step === 0 && !form.name.trim()) return "Enter a project title before continuing.";
    if (step === 1 && !form.businessProblem.trim()) return "Describe the business problem before continuing.";
    return "";
  }, [form.businessProblem, form.name, step]);

  if (data.role === "CXO / Leadership") {
    const requests = data.projects.filter(project => ["Open", "Ready for review"].includes(project.status));
    return <div className="space-y-5">
      <PageHeading eyebrow="PROJECT INTAKE" title="Project intake visibility" description="Leadership view of requests awaiting intake completion or governance review."/>
      <Notice type="info">This stakeholder view is read-only. Switch to PMO or PM to create or edit an intake.</Notice>
      <Card title="Open requests">
        {requests.length === 0 ? <p className="py-6 text-sm text-slate-500">There are no open requests.</p> : <div className="divide-y divide-slate-100">
          {requests.map(project => <button key={project.id} onClick={() => onOpenProject(project)} className="flex w-full items-center justify-between gap-3 py-3 text-left hover:bg-slate-50">
            <span><strong className="block text-sm">{project.name}</strong><small className="text-xs text-slate-500">{project.id} · {project.fn}</small></span>
            <span className="text-xs font-semibold text-sky-800">{project.status} →</span>
          </button>)}
        </div>}
      </Card>
    </div>;
  }

  const persistDraft = () => {
    const draft = { id: draftId, form, updatedAt: new Date().toISOString() };
    saveDraft(draft);
    notify("Intake draft saved in this browser.");
  };

  const submit = event => {
    event.preventDefault();
    if (!form.name.trim() || !form.businessProblem.trim()) {
      setError("A project title and business problem are required.");
      setStep(!form.name.trim() ? 0 : 1);
      return;
    }
    const project = createProject({
      name: form.name,
      fn: form.fn,
      due: form.due,
      businessProblem: form.businessProblem,
      intakeForm: form,
      attachmentIds: attachments.map(file => file.id)
    });
    deleteDraft(draftId);
    notify(`${project.id} created and submitted for PMO review.`);
    onOpenProject(project);
  };

  return <div className="space-y-5">
    <PageHeading eyebrow="PROJECT INTAKE" title="Start a project" description="Capture the business need and supporting context. AI guidance below is simulated locally." actions={<Button onClick={persistDraft}><Save size={16}/> Save draft</Button>}/>
    {error && <Notice type="error">{error}</Notice>}
    <div className="surface overflow-x-auto p-2">
      <ol className="flex min-w-max gap-1">
        {STEPS.map((name, index) => <li key={name}>
          <button onClick={() => { setStep(index); setError(""); }} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${step === index ? "bg-sky-50 text-sky-800" : index < step ? "text-emerald-700" : "text-slate-500"}`}>
            <span className={`grid h-6 w-6 place-items-center rounded-full border text-xs ${step === index ? "border-sky-600 bg-sky-600 text-white" : index < step ? "border-emerald-500 bg-emerald-50" : "border-slate-300"}`}>{index < step ? <Check size={13}/> : index + 1}</span>{name}
          </button>
        </li>)}
      </ol>
    </div>
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
      <form className="surface p-5 sm:p-7" onSubmit={submit}>
        <div className="mb-5"><span className="text-xs font-bold uppercase tracking-widest text-sky-700">Step {step + 1} of {STEPS.length}</span><h2 className="mt-1 text-xl font-bold">{STEPS[step]}</h2></div>
        {step === 0 && <div className="grid gap-4 md:grid-cols-2">
          <Field label="Project title" value={form.name} onChange={value => edit("name", value)} required placeholder="e.g. Customer Onboarding Automation"/>
          <Field label="Requestor" value={form.requestor} onChange={value => edit("requestor", value)}/>
          <Field label="Department / function" value={form.fn} onChange={value => edit("fn", value)} required/>
          <Field label="Co-function" value={form.coFunction} onChange={value => edit("coFunction", value)}/>
          <Field label="Business owner" value={form.owner} onChange={value => edit("owner", value)} placeholder="Name"/>
          <Field label="Sponsor" value={form.sponsor} onChange={value => edit("sponsor", value)} placeholder="Name"/>
          <SelectField label="Category" value={form.category} onChange={value => edit("category", value)} options={["Internal facing", "Customer facing", "Regulatory", "Technology"]}/>
          <Field label="Requested date" type="date" value={form.requestedDate} onChange={value => edit("requestedDate", value)}/>
        </div>}
        {step === 1 && <div className="space-y-4">
          <Field label="Business problem" value={form.businessProblem} onChange={value => edit("businessProblem", value)} rows={4} required placeholder="What problem or opportunity should this project address?"/>
          <Field label="Desired outcome" value={form.desiredOutcome} onChange={value => edit("desiredOutcome", value)} rows={4} placeholder="Describe the measurable outcome."/>
          <SelectField label="Cost type" value={form.costType} onChange={value => edit("costType", value)} options={["One Time", "Recurring", "Capital", "Operational"]}/>
        </div>}
        {step === 2 && <div className="grid gap-4 md:grid-cols-2">
          <SelectField label="Project type" value={form.projectType} onChange={value => edit("projectType", value)} options={["Implementation", "Enhancement", "Migration", "Research"]}/>
          <SelectField label="Record type" value={form.recordType} onChange={value => edit("recordType", value)} options={["Project", "Program", "Initiative"]}/>
          <SelectField label="Vendor involved?" value={form.vendorInvolved} onChange={value => edit("vendorInvolved", value)} options={["No", "Yes"]}/>
          <SelectField label="Multiple functions?" value={form.multipleFunctions} onChange={value => edit("multipleFunctions", value)} options={["No", "Yes"]}/>
          <Field label="Expected users" type="number" min="0" value={form.expectedUsers} onChange={value => edit("expectedUsers", value)}/>
          <Field label="Estimated effort" value={form.effort} onChange={value => edit("effort", value)} placeholder="e.g. 80–200 hours"/>
        </div>}
        {step === 3 && <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Systems involved" value={form.systems} onChange={value => edit("systems", value)} placeholder="Comma-separated systems"/>
            <SelectField label="Integration required?" value={form.integrationRequired} onChange={value => edit("integrationRequired", value)} options={["No", "Yes"]}/>
            <SelectField label="Data migration required?" value={form.dataMigration} onChange={value => edit("dataMigration", value)} options={["No", "Yes"]}/>
            <SelectField label="Infosec review required?" value={form.infosecReview} onChange={value => edit("infosecReview", value)} options={["No", "Yes"]}/>
            <Field label="Preferred start date" type="date" value={form.startDate} onChange={value => edit("startDate", value)}/>
            <Field label="Target end date" type="date" value={form.due} onChange={value => edit("due", value)}/>
          </div>
          <div><h3 className="mb-2 text-sm font-bold">Supporting documents</h3><FilePicker ownerType="draft" ownerId={draftId} attachments={attachments} onError={setError}/></div>
        </div>}
        {step === 4 && <div className="space-y-4">
          <Notice type="info"><strong>Local simulation:</strong> AXIOM would assess priority, complexity, scale, and governance requirements here. No AI service is connected.</Notice>
          <Card title="Request summary">
            <dl className="grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
              <Summary label="Project title" value={form.name}/>
              <Summary label="Department" value={form.fn}/>
              <Summary label="Requestor" value={form.requestor}/>
              <Summary label="Business owner" value={form.owner || "Not provided"}/>
              <Summary label="Business problem" value={form.businessProblem}/>
              <Summary label="Desired outcome" value={form.desiredOutcome || "Not provided"}/>
              <Summary label="Target end" value={form.due || "Not provided"}/>
              <Summary label="Supporting files" value={`${attachments.length} file(s) uploaded`}/>
            </dl>
          </Card>
          <div className="flex flex-wrap gap-2"><Badge tone="amber">Priority: assess in PMO review</Badge><Badge tone="blue">Complexity: unassessed</Badge><Badge tone="slate">Governance: pending</Badge></div>
          <p className="text-sm text-slate-500">Submitting creates a local project record with status Open. No server request will be made.</p>
        </div>}
        {requiredMessage && <p className="mt-4 text-sm font-semibold text-amber-700">{requiredMessage}</p>}
        <div className="mt-7 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4">
          <Button type="button" onClick={() => { setStep(value => Math.max(0, value - 1)); setError(""); }} disabled={step === 0}><ArrowLeft size={15}/> Back</Button>
          {step < STEPS.length - 1
            ? <Button type="button" variant="primary" onClick={() => requiredMessage ? setError(requiredMessage) : (setError(""), setStep(value => value + 1))}>Continue <ArrowRight size={15}/></Button>
            : <Button type="submit" variant="primary"><Send size={15}/> Submit to PMO</Button>}
        </div>
      </form>
      <aside className="space-y-4">
        <Card title={<span className="flex items-center gap-2"><Sparkles size={17} className="text-sky-700"/> Intake assistant</span>}>
          <p className="text-sm text-slate-600">This is a prototype assistant panel. It does not analyze or transmit your form data.</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600"><li>✓ Dynamic discovery layout</li><li>✓ Required-field checks</li><li>✓ Draft persistence in this browser</li><li>✓ File contents stored in IndexedDB</li></ul>
        </Card>
        <Card title="Saved drafts">
          {data.drafts.length === 0 ? <p className="text-sm text-slate-500">No saved intake drafts.</p> : <div className="space-y-2">
            {data.drafts.map(draft => <button key={draft.id} onClick={() => { setDraftId(draft.id); setForm({ ...blankForm(), ...draft.form }); setStep(0); }} className="w-full rounded-lg bg-slate-50 p-3 text-left hover:bg-slate-100">
              <strong className="block truncate text-sm">{draft.form.name || "Untitled draft"}</strong><small className="text-xs text-slate-500">Updated {new Date(draft.updatedAt).toLocaleDateString()}</small>
            </button>)}
          </div>}
        </Card>
      </aside>
    </div>
  </div>;
}

function Summary({ label, value }) {
  return <div className="min-w-0"><dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-slate-800">{value || "Not provided"}</dd></div>;
}
