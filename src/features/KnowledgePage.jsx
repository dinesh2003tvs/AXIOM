import { useMemo, useState } from "react";
import { BookOpen, Plus, Search, ShieldCheck, Sparkles, Trash2, Upload } from "lucide-react";
import { useAppData } from "../state/AppDataContext.jsx";
import { Button, Card, Field, FilePicker, Modal, Notice, PageHeading, SelectField } from "../components/ui.jsx";

const CATEGORIES = ["All Knowledge", "Historical Projects", "Project Case Studies", "Lessons Learned", "Project Decisions", "Project Outcomes", "Risks & Issues History", "Templates", "Governance", "Architecture", "FRD", "Knowledge"];

export default function KnowledgePage({ notify }) {
  const { data, addKnowledge, removeKnowledge, deleteAttachment } = useAppData();
  const canManage = data.role === "PMO";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Knowledge");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("Knowledge");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const matches = useMemo(() => data.knowledge.filter(item => {
    const matchesCategory = category === "All Knowledge" || item.category === category;
    const matchesSearch = `${item.title} ${item.category} ${item.description || ""}`.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [data.knowledge, category, query]);

  const create = event => {
    event.preventDefault();
    if (!title.trim()) {
      setError("Enter a title for the knowledge record.");
      return;
    }
    addKnowledge({ title, category: kind, description });
    setTitle("");
    setDescription("");
    setKind("Knowledge");
    setShowForm(false);
    setError("");
    notify("Knowledge record added to this browser.");
  };

  return <div className="space-y-5">
    <PageHeading eyebrow="KNOWLEDGE REPOSITORY" title="Enterprise knowledge" description="Search and maintain templates, lessons, decisions, and project references stored locally." actions={<>
      <Button onClick={() => notify("Validation is a prototype-only workflow; no external service is connected.")}><ShieldCheck size={15}/> Validate</Button>
      {canManage && <Button variant="primary" onClick={() => setShowForm(true)}><Plus size={15}/> Add knowledge</Button>}
    </>}/>
    <Card className="bg-sky-50/60">
      <div className="flex flex-wrap items-center gap-3">
        <Sparkles className="text-sky-700" size={20}/>
        <label className="relative min-w-[240px] flex-1"><Search className="absolute left-3 top-3 text-slate-400" size={16}/><input className="field-control mt-0 bg-white pl-9" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search titles, categories, and descriptions"/></label>
        <span className="rounded-full bg-white px-3 py-2 text-xs font-bold text-sky-800">Local search · {matches.length} results</span>
      </div>
    </Card>
    <div className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)]">
      <Card title="Browse">
        <div className="space-y-1">{CATEGORIES.map((item, index) => {
          const count = item === "All Knowledge" ? data.knowledge.length : data.knowledge.filter(entry => entry.category === item).length;
          if (index > 7 && count === 0) return null;
          return <button key={item} onClick={() => setCategory(item)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${category === item ? "bg-sky-50 font-bold text-sky-800" : "text-slate-600 hover:bg-slate-50"}`}><span>{item}</span><span className="text-xs text-slate-400">{count}</span></button>;
        })}</div>
      </Card>
      <div className="space-y-3">
        {matches.map(item => <KnowledgeItem key={item.id} item={item} notify={notify} canManage={canManage} onDelete={async () => {
          const files = data.attachments.filter(file => file.ownerType === "knowledge" && file.ownerId === item.id);
          if (files.length && !window.confirm("Delete this record and its attached file contents?")) return;
          try {
            for (const file of files) await deleteAttachment(file.id);
            removeKnowledge(item.id);
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "The knowledge record could not be deleted.");
          }
        }}/>)}
        {matches.length === 0 && <Card><div className="py-10 text-center"><BookOpen className="mx-auto text-slate-300" size={28}/><p className="mt-3 text-sm text-slate-500">No knowledge entries match your search.</p></div></Card>}
      </div>
    </div>
    {error && <Notice type="error">{error}</Notice>}
    {showForm && <Modal title="Add knowledge" description="Create a searchable local reference record." onClose={() => { setShowForm(false); setError(""); }}>
      <form className="space-y-4" onSubmit={create}>
        <Field label="Title" value={title} onChange={setTitle} required placeholder="Knowledge record title"/>
        <SelectField label="Category" value={kind} onChange={setKind} options={CATEGORIES.filter(item => !["All Knowledge", "Historical Projects", "Project Outcomes", "Risks & Issues History"].includes(item))}/>
        <Field label="Description" value={description} onChange={setDescription} rows={3} placeholder="Optional summary"/>
        {error && <Notice type="error">{error}</Notice>}
        <div className="flex justify-end gap-2"><Button type="button" onClick={() => setShowForm(false)}>Cancel</Button><Button type="submit" variant="primary"><Plus size={15}/> Add record</Button></div>
      </form>
    </Modal>}
  </div>;
}

function KnowledgeItem({ item, notify, canManage, onDelete }) {
  const { data } = useAppData();
  const files = data.attachments.filter(file => file.ownerType === "knowledge" && file.ownerId === item.id);
  const [error, setError] = useState("");
  return <Card className="flex flex-col gap-3 sm:flex-row sm:items-start">
    <span className="rounded-xl bg-sky-50 p-3 text-sky-700"><BookOpen size={19}/></span>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{item.title}</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{item.category}</span></div>
      <p className="mt-1 text-sm text-slate-500">{item.description || "Local knowledge repository item"} · Updated {new Date(item.updatedAt).toLocaleDateString()}</p>
      <div className="mt-3">
        <FilePicker ownerType="knowledge" ownerId={item.id} attachments={files} onError={setError} readOnly={!canManage}/>
        {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      </div>
    </div>
    {canManage && <div className="flex gap-1">
      <Button variant="ghost" className="min-h-9 px-2" onClick={() => notify(`${item.title} is available in this browser.`)} aria-label={`View ${item.title}`}><Upload size={15}/></Button>
      <Button variant="ghost" className="min-h-9 px-2 text-red-700" onClick={onDelete} aria-label={`Delete ${item.title}`}><Trash2 size={15}/></Button>
    </div>}
  </Card>;
}
