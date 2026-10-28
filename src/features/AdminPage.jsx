import { useState } from "react";
import { ChevronDown, Plus, Settings2, Trash2, Users } from "lucide-react";
import { useAppData } from "../state/AppDataContext.jsx";
import { Button, Card, Field, Modal, Notice, PageHeading, SelectField } from "../components/ui.jsx";

const MAIN_SECTIONS = [
  "PM Master",
  "User Management",
  "Roles & Permissions",
  "Function Master",
  "Templates Management",
  "Governance Configuration"
];

const TEMPLATE_SUBSECTIONS = [
  "FRD Templates",
  "Project Plan Templates",
  "Report Templates"
];

export default function AdminPage({ notify }) {
  const { data, addResource, removeResource, setAdminSetting, restoreDemoData } = useAppData();
  const [section, setSection] = useState("PM Master");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [fn, setFn] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState("");
  const canManage = data.role === "PMO";

  const isTemplatesExpanded = templatesOpen || TEMPLATE_SUBSECTIONS.includes(section);

  const handleTemplateMenuClick = () => {
    if (section === "Templates Management") {
      setTemplatesOpen(prev => !prev);
    } else {
      setSection("Templates Management");
      setTemplatesOpen(true);
    }
  };

  const add = event => {
    event.preventDefault();
    if (!name.trim() || !fn.trim()) {
      setError("PM name and function are required.");
      return;
    }
    addResource({ name: name.trim(), fn: fn.trim(), skills: skills.trim(), experience: "Not set", interests: "Not set" });
    setName("");
    setFn("");
    setSkills("");
    setError("");
    setShowForm(false);
    notify("PM added locally.");
  };

  return <div className="space-y-5">
    <PageHeading eyebrow="ADMIN & MASTERS" title="Administration" description="Manage resource and governance reference data for this local prototype." actions={<>
      {section === "PM Master" && canManage && <Button variant="primary" onClick={() => setShowForm(true)}><Plus size={15}/> Add PM</Button>}
      <Button onClick={async () => {
        if (canManage && window.confirm("Restore all AXIOM demo data and discard local edits?")) {
          if (await restoreDemoData()) notify("Demo data restored. Local edits were cleared.");
        }
      }} disabled={!canManage}><Settings2 size={15}/> Restore demo data</Button>
    </>}/>
    {data.role !== "PMO" && <Notice type="info">The current {data.role} view is read-only for administration. Change the role selector to PMO to edit local masters.</Notice>}
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
      <Card title="Administration">
        <nav className="space-y-1" aria-label="Administration sections">
          {MAIN_SECTIONS.map(item => {
            if (item === "Templates Management") {
              const isTemplateActive = section === "Templates Management" || TEMPLATE_SUBSECTIONS.includes(section);
              return (
                <div key={item} className="space-y-1">
                  <button
                    type="button"
                    onClick={handleTemplateMenuClick}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isTemplateActive ? "bg-sky-50 font-bold text-sky-800" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>Templates Management</span>
                    <ChevronDown
                      size={15}
                      className={`text-slate-400 transition-transform duration-200 ${
                        isTemplatesExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isTemplatesExpanded && (
                    <div className="ml-2 space-y-0.5 border-l-2 border-sky-200/80 pl-2">
                      {TEMPLATE_SUBSECTIONS.map(subItem => (
                        <button
                          key={subItem}
                          type="button"
                          onClick={() => setSection(subItem)}
                          className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                            section === subItem
                              ? "bg-sky-100 font-bold text-sky-900"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          {subItem}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <button
                key={item}
                type="button"
                onClick={() => setSection(item)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  section === item ? "bg-sky-50 font-bold text-sky-800" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            );
          })}
        </nav>
      </Card>
      <Card title={section} action={<span className="text-xs text-slate-500">Changes saved in this browser</span>}>
        {section === "PM Master" ? <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead><tr className="border-b border-slate-200 text-xs uppercase text-slate-500"><th className="py-3">PM</th><th>Function</th><th>Skills</th><th>Experience</th><th>Projects</th>{canManage && <th/>}</tr></thead>
            <tbody className="divide-y divide-slate-100">{data.resources.map(resource => <tr key={resource.id}>
              <td className="py-3 font-semibold">{resource.name}</td><td>{resource.fn}</td><td>{resource.skills || "—"}</td><td>{resource.experience}</td><td>{resource.projects}</td>
              {canManage && <td><Button variant="ghost" className="min-h-8 px-2 text-red-700" onClick={() => { if (window.confirm(`Remove ${resource.name} from the PM master?`)) removeResource(resource.id); }} aria-label={`Remove ${resource.name}`}><Trash2 size={15}/></Button></td>}
            </tr>)}</tbody>
          </table>
          {data.resources.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No PM records yet.</p>}
        </div> : section === "Templates Management" ? (
          <div>
            <div className="mb-6 rounded-xl border border-sky-100 bg-sky-50/60 p-4">
              <h3 className="text-sm font-bold text-sky-900">Template Directory</h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Select a template category below or from the sidebar menu to view and configure its specifications, sections, and requirements.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Managed Template Subsections</h4>
              <div className="grid gap-3.5 sm:grid-cols-3">
                {TEMPLATE_SUBSECTIONS.map(subItem => (
                  <button
                    key={subItem}
                    type="button"
                    onClick={() => {
                      setSection(subItem);
                      setTemplatesOpen(true);
                    }}
                    className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-left shadow-2xs hover:border-sky-300 hover:bg-sky-50/50 transition-all group cursor-pointer"
                  >
                    <strong className="block text-sm font-bold text-slate-800 group-hover:text-sky-800 transition">
                      {subItem}
                    </strong>
                    <span className="mt-1.5 text-xs text-slate-500 block leading-normal">
                      Manage {subItem.toLowerCase()} configuration and requirements.
                    </span>
                    <span className="mt-3 text-xs font-semibold text-sky-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Configure →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <SettingsSection section={section} canManage={canManage} value={data.adminSettings[section] || "Enabled"} onChange={value => { setAdminSetting(section, value); notify(`${section} updated locally.`); }}/>
        )}
      </Card>
    </div>
    {showForm && <Modal title="Add PM" description="Add a PM to the local directory." onClose={() => { setShowForm(false); setError(""); }}>
      <form className="space-y-4" onSubmit={add}>
        <Field label="Name" value={name} onChange={setName} required/>
        <Field label="Function" value={fn} onChange={setFn} required/>
        <Field label="Skills" value={skills} onChange={setSkills} placeholder="e.g. CRM, Analytics"/>
        {error && <Notice type="error">{error}</Notice>}
        <div className="flex justify-end gap-2"><Button type="button" onClick={() => setShowForm(false)}>Cancel</Button><Button variant="primary" type="submit"><Plus size={15}/> Add PM</Button></div>
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
