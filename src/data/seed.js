export const ROLES = ["CXO / Leadership", "PMO", "PM"];

export const NAV_ITEMS = [
  ["home", "Home"],
  ["intake", "Project Intake"],
  ["portfolio", "Project Workspace"],
  ["knowledge", "Knowledge Repository"],
  ["admin", "Admin & Masters"]
];

export const LIFECYCLE = ["Open", "Ready for review", "In Progress", "Closed"];
export const RAGS = ["Green", "Amber", "Red", "Grey"];

export const createInitialState = () => ({
  version: 1,
  role: "PMO",
  projects: [
    { id: "PRJ-1048", name: "Customer Onboarding Automation", fn: "Enterprise Services", pm: "Aarav Menon", status: "In Progress", rag: "Amber", progress: 68, due: "2026-09-30", health: "2 dependencies", notes: [], actions: [] },
    { id: "PRJ-1051", name: "Technology Readiness", fn: "Global Technology", pm: "Meera Nair", status: "In Progress", rag: "Green", progress: 81, due: "2026-09-30", health: "On track", notes: [], actions: [] },
    { id: "PRJ-1037", name: "MDM Global Customer Registry", fn: "Global Technology", pm: "Aarav Menon", status: "Ready for review", rag: "Amber", progress: 52, due: "2026-10-18", health: "Decision pending", notes: [], actions: [] },
    { id: "PRJ-1029", name: "TIA Analytics Dashboard", fn: "Marketing", pm: "Priya Shah", status: "In Progress", rag: "Green", progress: 91, due: "2026-10-07", health: "UAT active", notes: [], actions: [] },
    { id: "PRJ-1062", name: "Salesforce Opportunity Standardization", fn: "Enterprise Services", pm: "Unassigned", status: "Open", rag: "Grey", progress: 12, due: "2026-11-04", health: "Needs PM", notes: [], actions: [] },
    { id: "PRJ-1019", name: "Warehouse Automation Enhancement", fn: "Operations", pm: "Rohan Iyer", status: "Closed", rag: "Green", progress: 100, due: "2026-08-12", health: "Closed", notes: [], actions: [] }
  ],
  drafts: [],
  knowledge: [
    { id: "KN-1", title: "Enterprise MDM Registry — Architecture", category: "Architecture", updatedAt: "2026-09-12" },
    { id: "KN-2", title: "Customer Onboarding — FRD v3", category: "FRD", updatedAt: "2026-09-10" },
    { id: "KN-3", title: "IT Transition Checklist", category: "Project Case Study", updatedAt: "2026-09-08" },
    { id: "KN-4", title: "Governance Thresholds & Escalation Matrix", category: "Governance", updatedAt: "2026-09-02" },
    { id: "KN-5", title: "UAT Test Scenario Template", category: "Template", updatedAt: "2026-08-28" },
    { id: "KN-6", title: "AI Project Intake — Discovery Question Bank", category: "Knowledge", updatedAt: "2026-08-21" }
  ],
  resources: [
    { id: "USR-1", name: "Aarav Menon", fn: "Enterprise Services", skills: "Salesforce · Integration · AI", experience: "8 yrs", interests: "Automation · CRM", projects: 3 },
    { id: "USR-2", name: "Meera Nair", fn: "Global Technology", skills: "Migration · ERP · PM", experience: "10 yrs", interests: "Transformation · ERP", projects: 2 },
    { id: "USR-3", name: "Priya Shah", fn: "Marketing", skills: "Analytics · CRM · UX", experience: "6 yrs", interests: "Digital · Analytics", projects: 2 },
    { id: "USR-4", name: "Rohan Iyer", fn: "Global Technology", skills: "ServiceNow · ITSM", experience: "7 yrs", interests: "Platform · Automation", projects: 1 }
  ],
  attachments: [],
  adminSettings: {},
  selectedProjectId: "PRJ-1048",
  uiPreferences: { collapsed: false, page: "home" }
});
