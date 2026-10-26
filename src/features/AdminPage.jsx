import { useState } from "react";
import { Plus, Settings2, Trash2, Users } from "lucide-react";
import { useAppData } from "../state/AppDataContext.jsx";
import { Button, Card, Field, Modal, Notice, PageHeading, SelectField } from "../components/ui.jsx";

const SECTIONS = ["Resource Master", "User Management", "Roles & Permissions", "Function Master", "Skills", "Experience", "Area of Interest", "Template Management", "FRD Templates", "Project Plan Templates", "Status Templates", "Governance Configuration", "Escalation Thresholds"];

export default function AdminPage({ notify }) {
  const { data, addResource, removeResource, setAdminSetting, restoreDemoData } = useAppData();
  const [section, setSection] = useState("Resource Master");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [fn, setFn] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState("");
  const canManage = data.role === "PMO";

  const add = event => {
    event.preventDefault();
    if (!name.trim() || !fn.trim()) {
      setError("Resource name and function are required.");
      return;
    }
    addResource({ name: name.trim(), fn: fn.trim(), skills: skills.trim(), experience: "Not set", interests: "Not set" });
    setName("");
    setFn("");
    setSkills("");
    setError("");
    setShowForm(false);
    notify("Resource added locally.");
  };

  return <div className="space-y-5">
    <PageHeading eyebrow="ADMIN & MASTERS" title="Administration" description="Manage resource and governance reference data for this local prototype." actions={<>
      {section === "Resource Master" && canManage && <Button variant="primary" onClick={() => setShowForm(true)}><Plus size={15}/> Add resource</Button>}
      <Button onClick={async () => {
        if (canManage && window.confirm("Restore all AXIOM demo data and discard local edits?")) {
          if (await restoreDemoData()) notify("Demo data restored. Local edits were cleared.");
        }
      }} disabled={!canManage}><Settings2 size={15}/> Restore demo data</Button>
    </>}/>
    {data.role !== "PMO" && <Notice type="info">The current {data.role} view is read-only for administration. Change the role selector to PMO to edit local masters.</Notice>}
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
      <Card title="Administration">
        <nav className="space-y-1" aria-label="Administration sections">{SECTIONS.map(item => <button key={item} onClick={() => setSection(item)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${section === item ? "bg-sky-50 font-bold text-sky-800" : "text-slate-600 hover:bg-slate-50"}`}>{item}</button>)}</nav>
      </Card>
      <Card title={section} action={<span className="text-xs text-slate-500">Changes saved in this browser</span>}>
        {section === "Resource Master" ? <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead><tr className="border-b border-slate-200 text-xs uppercase text-slate-500"><th className="py-3">Resource</th><th>Function</th><th>Skills</th><th>Experience</th><th>Projects</th>{canManage && <th/>}</tr></thead>
            <tbody className="divide-y divide-slate-100">{data.resources.map(resource => <tr key={resource.id}>
              <td className="py-3 font-semibold">{resource.name}</td><td>{resource.fn}</td><td>{resource.skills}</td><td>{resource.experience}</td><td>{resource.projects}</td>
              {canManage && <td><Button variant="ghost" className="min-h-8 px-2 text-red-700" onClick={() => { if (window.confirm(`Remove ${resource.name} from the resource master?`)) removeResource(resource.id); }} aria-label={`Remove ${resource.name}`}><Trash2 size={15}/></Button></td>}
            </tr>)}</tbody>
          </table>
          {data.resources.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No resource records yet.</p>}
        </div> : <SettingsSection section={section} canManage={canManage} value={data.adminSettings[section] || "Enabled"} onChange={value => { setAdminSetting(section, value); notify(`${section} updated locally.`); }}/>}
      </Card>
    </div>
    {showForm && <Modal title="Add resource" description="Add a resource to the local directory." onClose={() => { setShowForm(false); setError(""); }}>
      <form className="space-y-4" onSubmit={add}>
        <Field label="Name" value={name} onChange={setName} required/>
        <Field label="Function" value={fn} onChange={setFn} required/>
        <Field label="Skills" value={skills} onChange={setSkills} placeholder="e.g. CRM, Analytics"/>
        {error && <Notice type="error">{error}</Notice>}
        <div className="flex justify-end gap-2"><Button type="button" onClick={() => setShowForm(false)}>Cancel</Button><Button variant="primary" type="submit"><Plus size={15}/> Add resource</Button></div>
      </form>
    </Modal>}
  </div>;
}

function SettingsSection({ section, canManage, value, onChange }) {
  return <div className="max-w-xl space-y-4">
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"><Users className="mt-1 text-sky-700" size={19}/><div><strong>{section}</strong><p className="mt-1 text-sm text-slate-600">This setting is stored locally and is not enforced as a security boundary.</p></div></div>
    <SelectField label="Configuration" value={value} onChange={onChange} options={["Enabled", "Disabled", "Review required"]} disabled={!canManage}/>
    {!canManage && <p className="text-xs text-slate-500">Read-only for the selected prototype role.</p>}
    <Button variant="primary" disabled={!canManage} onClick={() => onChange(value)}><Settings2 size={15}/> Save configuration</Button>
  </div>;
}
