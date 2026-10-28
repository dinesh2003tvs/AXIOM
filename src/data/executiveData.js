export const KPI_SUMMARY = {
  strategicProjects: {
    value: 28,
    change: "↑ 12% vs. last quarter",
    changeType: "positive"
  },
  onTrack: {
    percentage: "64%",
    count: "18 projects"
  },
  atRisk: {
    percentage: "25%",
    count: "7 projects"
  },
  delayed: {
    percentage: "11%",
    count: "3 projects"
  },
  totalInvestment: {
    value: "$ 12.5M",
    change: "↑ 8% vs. last quarter",
    changeType: "positive"
  },
  expectedBusinessValue: {
    value: "$ 18.2M",
    roi: "146% ROI (projected)"
  }
};

export const STRATEGIC_OBJECTIVES = [
  {
    id: 1,
    name: "Digital Transformation",
    icon: "bar-chart-2",
    progress: 80,
    barColor: "bg-blue-600",
    projects: 8,
    target: "Dec 2025"
  },
  {
    id: 2,
    name: "Operational Efficiency",
    icon: "settings",
    progress: 65,
    barColor: "bg-blue-600",
    projects: 6,
    target: "Mar 2026"
  },
  {
    id: 3,
    name: "Customer Experience",
    icon: "users",
    progress: 50,
    barColor: "bg-sky-500",
    projects: 5,
    target: "Jun 2026"
  },
  {
    id: 4,
    name: "Sustainability",
    icon: "leaf",
    progress: 40,
    barColor: "bg-blue-800",
    projects: 4,
    target: "Dec 2026"
  }
];

export const KEY_RISKS = [
  {
    id: 1,
    issue: "Integration delay with core system",
    impact: "High",
    impactColor: "red",
    action: "Review",
    actionType: "review",
    owner: "Core Architecture Team",
    mitigation: "Deploying parallel API proxy bridge to decouple release timeline."
  },
  {
    id: 2,
    issue: "Resource attrition in key project",
    impact: "High",
    impactColor: "red",
    action: "Review",
    actionType: "review",
    owner: "Engineering Lead",
    mitigation: "Fast-tracking contract backfills with partner staff augmentation."
  },
  {
    id: 3,
    issue: "Regulatory compliance change",
    impact: "Medium",
    impactColor: "amber",
    action: "Review",
    actionType: "review",
    owner: "Legal & Governance",
    mitigation: "Scope re-baselined with compliance audit lead."
  },
  {
    id: 4,
    issue: "Budget overrun - Phase 2",
    impact: "Medium",
    impactColor: "amber",
    action: "Review",
    actionType: "review",
    owner: "PMO Financials",
    mitigation: "Reallocating contingency reserves from completed Q1 tranches."
  },
  {
    id: 5,
    issue: "Vendor dependency risk",
    impact: "Low",
    impactColor: "green",
    action: "Monitor",
    actionType: "monitor",
    owner: "Vendor Operations",
    mitigation: "Bi-weekly SLA tracking and escalation gate established."
  }
];

export const BURNDOWN_DATA = [
  { month: "Jan", planned: 12, actual: 8, forecast: null },
  { month: "Feb", planned: 18, actual: 14, forecast: null },
  { month: "Mar", planned: 28, actual: 22, forecast: null },
  { month: "Apr", planned: 38, actual: 30, forecast: null },
  { month: "May", planned: 48, actual: 38, forecast: null },
  { month: "Jun", planned: 58, actual: 46, forecast: null },
  { month: "Jul", planned: 68, actual: 54, forecast: null },
  { month: "Aug", planned: 78, actual: 68, forecast: 68 },
  { month: "Sep", planned: 88, actual: null, forecast: 74 },
  { month: "Oct", planned: 95, actual: null, forecast: 78 },
  { month: "Nov", planned: 98, actual: null, forecast: 82 },
  { month: "Dec", planned: 100, actual: null, forecast: 85 }
];

export const BUSINESS_VALUE_DATA = [
  { period: "Q1", expected: 1.2, realized: 0.8 },
  { period: "Q2", expected: 3.5, realized: 2.6 },
  { period: "Q3", expected: 6.8, realized: 5.0 },
  { period: "Q4", expected: 9.1, realized: 6.9 },
  { period: "FY25 Q1", expected: 12.0, realized: 9.4 },
  { period: "Q2", expected: 15.2, realized: 11.8 },
  { period: "Q3", expected: 18.2, realized: 12.4 }
];

export const CONFIDENCE_METRICS = [
  { label: "Scope Stability", value: "80%", dotColor: "bg-emerald-500" },
  { label: "Schedule Predictability", value: "70%", dotColor: "bg-amber-500" },
  { label: "Cost Predictability", value: "65%", dotColor: "bg-amber-400" },
  { label: "Resource Availability", value: "78%", dotColor: "bg-sky-500" },
  { label: "Overall Health", value: "72%", dotColor: "bg-indigo-400" }
];

export const TOP_PROJECTS = [
  {
    id: 1,
    name: "Digital Core Platform",
    objective: "Digital Transformation",
    health: "On Track",
    healthTone: "green",
    progress: 80,
    progressColor: "bg-blue-600",
    targetDate: "15 Jul 2025",
    businessValue: "$ 5.2M"
  },
  {
    id: 2,
    name: "Customer Portal Revamp",
    objective: "Customer Experience",
    health: "At Risk",
    healthTone: "amber",
    progress: 60,
    progressColor: "bg-blue-600",
    targetDate: "30 Aug 2025",
    businessValue: "$ 3.8M"
  },
  {
    id: 3,
    name: "ERP Modernization",
    objective: "Operational Efficiency",
    health: "Delayed",
    healthTone: "red",
    progress: 45,
    progressColor: "bg-blue-600",
    targetDate: "10 Aug 2025",
    businessValue: "$ 2.1M"
  },
  {
    id: 4,
    name: "Data Analytics Platform",
    objective: "Data Driven Decision",
    health: "On Track",
    healthTone: "green",
    progress: 70,
    progressColor: "bg-blue-600",
    targetDate: "20 Sep 2025",
    businessValue: "$ 4.5M"
  },
  {
    id: 5,
    name: "Sustainability Initiative",
    objective: "Sustainability",
    health: "At Risk",
    healthTone: "amber",
    progress: 50,
    progressColor: "bg-amber-500",
    targetDate: "05 Sep 2025",
    businessValue: "$ 2.6M"
  }
];

export const KEY_MILESTONES = [
  {
    id: 1,
    date: "15 Jul 2025",
    milestone: "UAT Completion",
    project: "Digital Core Platform",
    statusTone: "green"
  },
  {
    id: 2,
    date: "30 Aug 2025",
    milestone: "Go Live",
    project: "Customer Portal",
    statusTone: "amber"
  },
  {
    id: 3,
    date: "10 Aug 2025",
    milestone: "Phase 1 Deployment",
    project: "ERP Modernization",
    statusTone: "red"
  },
  {
    id: 4,
    date: "20 Sep 2025",
    milestone: "Model Sign-off",
    project: "Data Analytics",
    statusTone: "green"
  },
  {
    id: 5,
    date: "05 Sep 2025",
    milestone: "Vendor Selection",
    project: "Sustainability",
    statusTone: "amber"
  }
];

export const EXECUTIVE_DECISIONS = [
  {
    id: "DEC-1",
    title: "Approve additional budget for ERP Phase 2",
    subtitle: "Impact: 3 months delay if not approved",
    tone: "red",
    impact: "High (Critical Path)",
    requestedAmount: "$420,000",
    details: "Additional funds required for legacy ERP dual-cloud verification and data mapping integrity checks.",
    status: "Pending"
  },
  {
    id: "DEC-2",
    title: "Approve vendor change for Data Analytics",
    subtitle: "Current vendor not meeting SLA",
    tone: "amber",
    impact: "Medium (SLA Non-compliance)",
    requestedAmount: "Cost Neutral",
    details: "Replace existing offshore pipeline vendor with vetted preferred partner under enterprise umbrella agreement.",
    status: "Pending"
  },
  {
    id: "DEC-3",
    title: "Confirm scope for Sustainability Phase 2",
    subtitle: "Pending business confirmation",
    tone: "blue",
    impact: "Low / Scope alignment",
    requestedAmount: "$150,000",
    details: "Finalize Scope 3 carbon telemetry metrics across European supply chain hubs.",
    status: "Pending"
  }
];

export const AI_INSIGHTS_RECOMMENDATIONS = [
  {
    id: "INS-1",
    icon: "TrendingUp",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    title: "2 projects likely to complete early",
    subtitle: "Opportunity to accelerate business value",
    detail: "Digital Core Platform and Data Analytics Platform are pacing ahead of schedule by 12 days. Early completion unlocks $1.4M in Q3 business value ahead of forecast.",
    category: "Acceleration",
    impact: "+$1.4M Value"
  },
  {
    id: "INS-2",
    icon: "AlertTriangle",
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    title: "3 projects at high risk due to dependency delays",
    subtitle: "Recommend leadership intervention",
    detail: "Cross-functional API dependencies between ERP Modernization and legacy warehouse systems show critical-path blockage. Escalation to vendor steering committee recommended.",
    category: "Risk Alert",
    impact: "High Critical Path"
  },
  {
    id: "INS-3",
    icon: "Settings",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    title: "Potential 8% cost savings through resource optimization",
    subtitle: "Review resource allocation in Q3",
    detail: "Re-balancing engineering contractors with dedicated internal staff on Customer Portal Revamp can trim $380,000 from current run rate.",
    category: "Cost Optimization",
    impact: "8% ($380K) Savings"
  },
  {
    id: "INS-4",
    icon: "Lightbulb",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    title: "Customer portal revamp can drive ~15% increase",
    subtitle: "in customer engagement (projected)",
    detail: "Simulated analytics based on Q1-Q2 beta cohort show self-service onboarding conversion rising by 14.8%, boosting customer retention and NPS score.",
    category: "Growth Projection",
    impact: "~15% Engagement"
  }
];
