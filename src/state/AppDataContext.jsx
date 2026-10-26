import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createInitialState } from "../data/seed.js";
import { clearAppState, loadAppState, saveAppState } from "../lib/persistence.js";
import { clearStoredFiles, removeFile, saveFile } from "../lib/files.js";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [bootstrap] = useState(loadAppState);
  const [data, setData] = useState(bootstrap.state);
  const [canPersist, setCanPersist] = useState(bootstrap.canPersist);
  const [storageWarning, setStorageWarning] = useState(bootstrap.warning);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    if (!canPersist) return;
    try {
      saveAppState(data);
      setStorageError("");
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "AXIOM could not save browser data.");
    }
  }, [canPersist, data]);

  const updateProject = (id, patch) => {
    setData(current => ({
      ...current,
      projects: current.projects.map(project =>
        project.id === id ? { ...project, ...patch, updatedAt: new Date().toISOString() } : project
      )
    }));
  };

  const createProject = values => {
    const highestId = data.projects.reduce((highest, project) => {
      const number = Number(project.id.replace("PRJ-", ""));
      return Number.isFinite(number) ? Math.max(highest, number) : highest;
    }, 1000);
    const project = {
      id: `PRJ-${highestId + 1}`,
      name: values.name.trim(),
      fn: values.fn?.trim() || "Enterprise Services",
      pm: values.pm?.trim() || "Unassigned",
      status: "Open",
      rag: "Grey",
      progress: 0,
      due: values.due || "",
      health: "New intake",
      businessProblem: values.businessProblem?.trim() || "",
      intake: values.intakeForm || {},
      notes: [],
      actions: [],
      attachments: values.attachmentIds || []
    };
    setData(current => ({
      ...current,
      projects: [project, ...current.projects],
      selectedProjectId: project.id
    }));
    return project;
  };

  const setRole = role => setData(current => ({ ...current, role }));
  const setSelectedProjectId = id => setData(current => ({ ...current, selectedProjectId: id }));
  const setUiPreference = (key, value) => setData(current => ({
    ...current,
    uiPreferences: { ...current.uiPreferences, [key]: value }
  }));

  const saveDraft = draft => {
    setData(current => ({
      ...current,
      drafts: [draft, ...current.drafts.filter(item => item.id !== draft.id)]
    }));
  };

  const deleteDraft = id => {
    setData(current => ({ ...current, drafts: current.drafts.filter(item => item.id !== id) }));
  };

  const addFile = async (ownerType, ownerId, file) => {
    const attachment = {
      id: crypto.randomUUID(),
      ownerType,
      ownerId,
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      createdAt: new Date().toISOString()
    };
    await saveFile(file, attachment);
    setData(current => ({ ...current, attachments: [...current.attachments, attachment] }));
    return attachment;
  };

  const deleteAttachment = async id => {
    await removeFile(id);
    setData(current => ({
      ...current,
      attachments: current.attachments.filter(attachment => attachment.id !== id),
      knowledge: current.knowledge.filter(item => item.attachmentId !== id),
      projects: current.projects.map(project => ({
        ...project,
        attachments: (project.attachments || []).filter(fileId => fileId !== id)
      }))
    }));
  };

  const addKnowledge = (entry, attachmentId = "") => {
    setData(current => ({
      ...current,
      knowledge: [{
        id: entry.id || crypto.randomUUID(),
        title: entry.title.trim(),
        category: entry.category,
        description: entry.description?.trim() || "",
        attachmentId,
        updatedAt: new Date().toISOString()
      }, ...current.knowledge]
    }));
  };

  const removeKnowledge = id => {
    setData(current => ({ ...current, knowledge: current.knowledge.filter(item => item.id !== id) }));
  };

  const addResource = resource => {
    setData(current => ({
      ...current,
      resources: [{
        ...resource,
        id: crypto.randomUUID(),
        projects: 0
      }, ...current.resources]
    }));
  };

  const removeResource = id => {
    setData(current => {
      const resource = current.resources.find(item => item.id === id);
      return {
        ...current,
        resources: current.resources.filter(item => item.id !== id),
        projects: resource
          ? current.projects.map(project => project.pm === resource.name ? { ...project, pm: "Unassigned" } : project)
          : current.projects
      };
    });
  };

  const setAdminSetting = (key, value) => {
    setData(current => ({
      ...current,
      adminSettings: { ...current.adminSettings, [key]: value }
    }));
  };

  const restoreDemoData = async () => {
    try {
      await clearStoredFiles();
      clearAppState();
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "AXIOM could not clear saved browser data.");
      return false;
    }
    const initial = createInitialState();
    setData(initial);
    setCanPersist(true);
    setStorageWarning("");
    setStorageError("");
    return true;
  };

  const value = useMemo(() => ({
    data,
    storageWarning,
    storageError,
    updateProject,
    createProject,
    setRole,
    setSelectedProjectId,
    setUiPreference,
    saveDraft,
    deleteDraft,
    addFile,
    deleteAttachment,
    addKnowledge,
    removeKnowledge,
    addResource,
    removeResource,
    setAdminSetting,
    restoreDemoData
  }), [data, storageWarning, storageError]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error("useAppData must be used inside AppDataProvider.");
  return context;
}
