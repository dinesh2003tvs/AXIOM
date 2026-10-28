import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileText, X } from "lucide-react";
import { getFile } from "../lib/files.js";
import { useAppData } from "../state/AppDataContext.jsx";

export function Button({ children, variant = "secondary", className = "", ...props }) {
  const styles = {
    primary: "border-brand bg-brand text-white hover:bg-sky-800",
    secondary: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    danger: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    ghost: "border-transparent bg-transparent text-slate-600 hover:bg-slate-100"
  };
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${styles[variant]} ${className}`} {...props}>{children}</button>;
}

export function PageHeading({ eyebrow, title, description, actions }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700">{eyebrow}</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-3xl text-sm text-muted">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>;
}

export function Card({ title, action, children, className = "" }) {
  return <section className={`surface p-4 sm:p-5 ${className}`}>
    {(title || action) && <div className="mb-4 flex items-center justify-between gap-3">
      {title && <h2 className="text-base font-bold text-ink">{title}</h2>}
      {action}
    </div>}
    {children}
  </section>;
}

export function Field({ label, value, onChange, type = "text", placeholder, required = false, min, max, rows }) {
  const control = rows
    ? <textarea className="field-control resize-y" rows={rows} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} required={required}/>
    : <input className="field-control" type={type} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} required={required} min={min} max={max}/>;
  return <label className="block text-sm font-semibold text-slate-700">
    {label}{required && <span className="ml-1 text-red-600" aria-hidden="true">*</span>}
    {control}
  </label>;
}

export function SelectField({ label, value, onChange, options, disabled = false }) {
  return <label className="block text-sm font-semibold text-slate-700">
    {label}
    <select className="field-control" value={value} onChange={event => onChange(event.target.value)} disabled={disabled}>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>;
}

export function Badge({ children, tone = "slate" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    grey: "bg-slate-100 text-slate-600 ring-slate-200",
    blue: "bg-sky-50 text-sky-700 ring-sky-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200"
  };
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${tones[tone]}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${tone === "green" ? "bg-emerald-500" : tone === "amber" ? "bg-amber-500" : tone === "red" ? "bg-red-500" : tone === "blue" ? "bg-sky-500" : "bg-slate-400"}`}/>
    {children}
  </span>;
}

export function Modal({ title, description, onClose, children, wide = false }) {
  return <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-slate-950/60 backdrop-blur-xs p-4" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className={`my-auto w-full ${wide ? "max-w-2xl" : "max-w-lg"} rounded-2xl bg-white p-5 shadow-2xl sm:p-6`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><h2 className="text-xl font-bold">{title}</h2>{description && <p className="mt-1 text-sm text-muted">{description}</p>}</div>
        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close"><X size={18}/></button>
      </div>
      {children}
    </section>
  </div>;
}

export function Notice({ type = "info", children, action }) {
  const style = type === "error"
    ? "border-red-200 bg-red-50 text-red-800"
    : type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-sky-200 bg-sky-50 text-sky-800";
  const Icon = type === "error" ? AlertTriangle : type === "success" ? CheckCircle2 : AlertTriangle;
  return <div className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${style}`} role={type === "error" ? "alert" : "status"}>
    <Icon className="mt-0.5 shrink-0" size={17}/><div className="flex-1">{children}</div>{action}
  </div>;
}

export function FilePicker({ ownerType, ownerId, attachments, onUploaded, onRemoved, onError, multiple = true, readOnly = false }) {
  const { addFile, deleteAttachment } = useAppData();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const upload = async event => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selected.length) return;
    setBusy(true);
    try {
      const added = [];
      for (const file of selected) added.push(await addFile(ownerType, ownerId, file));
      onUploaded?.(added);
    } catch (error) {
      onError(error instanceof Error ? error.message : "The file could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const download = async attachment => {
    try {
      const stored = await getFile(attachment.id);
      if (!stored) throw new Error("The file record exists, but its contents are missing.");
      const url = URL.createObjectURL(stored.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = attachment.name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      onError(error instanceof Error ? error.message : "The stored file could not be opened.");
    }
  };

  const remove = async attachment => {
    try {
      await deleteAttachment(attachment.id);
      onRemoved?.(attachment);
    } catch (error) {
      onError(error instanceof Error ? error.message : "The stored file could not be removed.");
    }
  };

  return <div>
    <input className="hidden" type="file" multiple={multiple} ref={inputRef} onChange={upload}/>
    {!readOnly && <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} disabled={busy}>
      <FileText size={16}/>{busy ? "Saving..." : "Choose files"}
    </Button>}
    {attachments?.length > 0 && <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200">
      {attachments.map(attachment => <li key={attachment.id} className="flex items-center gap-2 px-3 py-2 text-sm">
        <FileText size={15} className="shrink-0 text-sky-700"/>
        <span className="min-w-0 flex-1 truncate">{attachment.name} <span className="text-xs text-slate-400">({formatBytes(attachment.size)})</span></span>
        <button className="rounded p-1 text-slate-500 hover:bg-slate-100" onClick={() => download(attachment)} aria-label={`Download ${attachment.name}`}><Download size={15}/></button>
        {!readOnly && <button className="rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-700" onClick={() => remove(attachment)} aria-label={`Remove ${attachment.name}`}><X size={15}/></button>}
      </li>)}
    </ul>}
  </div>;
}

function formatBytes(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
