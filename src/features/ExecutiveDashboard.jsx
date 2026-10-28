import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Calendar,
  ChevronDown,
  Database,
  ExternalLink,
  Info,
  Layers,
  Leaf,
  Lightbulb,
  Plus,
  Settings,
  Target,
  TrendingUp,
  Users,
  X
} from "lucide-react";
import {
  AI_INSIGHTS_RECOMMENDATIONS,
  BURNDOWN_DATA,
  BUSINESS_VALUE_DATA,
  CONFIDENCE_METRICS,
  EXECUTIVE_DECISIONS,
  KEY_MILESTONES,
  KEY_RISKS,
  KPI_SUMMARY,
  STRATEGIC_OBJECTIVES,
  TOP_PROJECTS
} from "../data/executiveData.js";
import {
  BurndownLineChart,
  BusinessValueBarChart,
  DeliveryConfidenceGauge,
  DonutChart
} from "../components/ExecutiveCharts.jsx";
import { HeaderMountainWatermark } from "../components/MountainGraphics.jsx";

export default function ExecutiveDashboard({ notify, onSelectProject }) {
  // Filters state
  const [businessUnit, setBusinessUnit] = useState("All Business Units");
  const [fiscalYear, setFiscalYear] = useState("FY 2024 - 2025");
  const [burndownProject, setBurndownProject] = useState("All Strategic Projects");
  const [valueMetric, setValueMetric] = useState("Cumulative");

  // Modals state
  const [activeDecision, setActiveDecision] = useState(null);
  const [activeRisk, setActiveRisk] = useState(null);
  const [activeInsight, setActiveInsight] = useState(null);
  const [activeViewAll, setActiveViewAll] = useState(null);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);

  const handleDecisionAction = (decision, action) => {
    setActiveDecision(null);
    notify(`Decision recorded: ${action} for "${decision.title}"`);
  };

  return (
    <div className="relative min-h-screen space-y-3.5 pb-10">
      {/* Mountain Watermark in Top Right */}
      <HeaderMountainWatermark className="absolute -top-5 -right-5 w-[560px] h-[195px] opacity-80 z-0 pointer-events-none" />

      {/* TOP HEADER SECTION */}
      <div className="relative z-10 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-0.5">
        <div>
          <h1 className="text-[25px] sm:text-[27px] font-extrabold tracking-tight text-slate-900 leading-tight">
            Executive Dashboard
          </h1>
          <p className="text-xs sm:text-[13px] font-normal text-slate-500 mt-0.5">
            Strategic delivery, business impact and key decisions
          </p>
        </div>

        {/* Header Right Controls - Single neat line */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3">
          {/* Business Unit Selector */}
          <div className="relative">
            <select
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs py-1.5 pl-3 pr-7 rounded-lg shadow-2xs hover:border-slate-300 focus:outline-none cursor-pointer"
            >
              <option>All Business Units</option>
              <option>Digital Core Platform</option>
              <option>Enterprise Services</option>
              <option>Operations & Supply Chain</option>
              <option>Global Technology</option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* FY Selector */}
          <div className="relative">
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs py-1.5 pl-3 pr-7 rounded-lg shadow-2xs hover:border-slate-300 focus:outline-none cursor-pointer"
            >
              <option>FY 2024 - 2025</option>
              <option>FY 2023 - 2024</option>
              <option>FY 2025 - 2026</option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Last Updated Badge */}
          <div className="flex items-center gap-2 border-l border-slate-200/80 pl-3">
            <Calendar size={15} className="text-sky-600 shrink-0" />
            <div className="text-left leading-none">
              <span className="block text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                Last Updated
              </span>
              <span className="text-[11px] font-bold text-slate-700 mt-0.5 block whitespace-nowrap">
                20 Oct 2025 10:30 AM
              </span>
            </div>
          </div>

          {/* Profile / Role Badge */}
          <div className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-2.5 py-1 shadow-2xs">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-600 text-[11px] font-black text-white shrink-0">
              CL
            </span>
            <span className="text-xs font-bold text-slate-800 whitespace-nowrap">CXO & Leadership</span>
            <ChevronDown size={13} className="text-slate-400" />
          </div>
        </div>
      </div>

      {/* ROW 1: 6 KPI CARDS */}
      <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {/* KPI 1: Strategic Projects */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#1e70eb] text-white shadow-2xs">
              <Layers size={20} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold text-slate-500 leading-tight">
                Strategic Projects
              </span>
              <strong className="block text-[25px] xl:text-[27px] font-black leading-none text-slate-900 mt-0.5">
                {KPI_SUMMARY.strategicProjects.value}
              </strong>
              <div className="mt-1 text-[11px] font-bold text-emerald-600 leading-tight">
                {KPI_SUMMARY.strategicProjects.change}
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: On Track */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#10b981] text-white shadow-2xs">
              <Target size={20} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold text-slate-500 leading-tight">
                On Track
              </span>
              <strong className="block text-[25px] xl:text-[27px] font-black leading-none text-slate-900 mt-0.5">
                {KPI_SUMMARY.onTrack.percentage}
              </strong>
              <span className="mt-1 block text-[11px] font-bold text-emerald-600 leading-tight">
                {KPI_SUMMARY.onTrack.count}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: At Risk */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#f59e0b] text-white shadow-2xs">
              <AlertTriangle size={20} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold text-slate-500 leading-tight">
                At Risk
              </span>
              <strong className="block text-[25px] xl:text-[27px] font-black leading-none text-slate-900 mt-0.5">
                {KPI_SUMMARY.atRisk.percentage}
              </strong>
              <span className="mt-1 block text-[11px] font-semibold text-slate-500 leading-tight">
                {KPI_SUMMARY.atRisk.count}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Delayed */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#ef4444] text-white shadow-2xs">
              <AlertCircle size={20} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold text-slate-500 leading-tight">
                Delayed
              </span>
              <strong className="block text-[25px] xl:text-[27px] font-black leading-none text-slate-900 mt-0.5">
                {KPI_SUMMARY.delayed.percentage}
              </strong>
              <span className="mt-1 block text-[11px] font-semibold text-slate-500 leading-tight">
                {KPI_SUMMARY.delayed.count}
              </span>
            </div>
          </div>
        </div>

        {/* KPI 5: Total Investment */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#6366f1] text-white shadow-2xs">
              <Database size={20} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold text-slate-500 leading-tight">
                Total Investment
              </span>
              <strong className="block text-[23px] xl:text-[25px] font-black leading-none text-slate-900 mt-0.5 whitespace-nowrap">
                {KPI_SUMMARY.totalInvestment.value}
              </strong>
              <div className="mt-1 text-[11px] font-bold text-emerald-600 leading-tight">
                {KPI_SUMMARY.totalInvestment.change}
              </div>
            </div>
          </div>
        </div>

        {/* KPI 6: Expected Business Value */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-2xs hover:shadow-sm transition-all">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#059669] text-white shadow-2xs">
              <TrendingUp size={20} />
            </div>
            <div className="min-w-0">
              <span className="block text-[11px] font-semibold text-slate-500 leading-tight">
                Expected Business Value
              </span>
              <strong className="block text-[23px] xl:text-[25px] font-black leading-none text-slate-900 mt-0.5 whitespace-nowrap">
                {KPI_SUMMARY.expectedBusinessValue.value}
              </strong>
              <span className="mt-1 block text-[11px] font-bold text-emerald-600 leading-tight">
                {KPI_SUMMARY.expectedBusinessValue.roi}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: 3 EQUAL COLUMNS (Portfolio Status, Strategic Objectives Progress, Key Risks & Escalations) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Card 1: Portfolio Status */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Portfolio Status</h2>
          </div>
          <div className="my-auto py-1">
            <DonutChart
              onTrack={18}
              atRisk={7}
              delayed={3}
              total={28}
            />
          </div>
        </div>

        {/* Card 2: Strategic Objectives Progress */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Strategic Objectives Progress
            </h2>
            <button
              onClick={() => setActiveViewAll("objectives")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              View All <ArrowRight size={13} />
            </button>
          </div>

          <div className="mt-2 divide-y divide-slate-100/70">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1.1fr_45px_65px] items-center text-[10.5px] font-semibold text-slate-400 pb-2 px-1">
              <span>Objective</span>
              <span>Progress</span>
              <span className="text-center">Projects</span>
              <span className="text-right">Target</span>
            </div>

            {/* Rows */}
            {STRATEGIC_OBJECTIVES.map((obj) => {
              const IconComponent =
                obj.icon === "bar-chart-2"
                  ? BarChart2
                  : obj.icon === "settings"
                  ? Settings
                  : obj.icon === "users"
                  ? Users
                  : Leaf;

              const iconTone =
                obj.icon === "bar-chart-2"
                  ? "text-blue-600 bg-blue-50"
                  : obj.icon === "settings"
                  ? "text-blue-600 bg-blue-50"
                  : obj.icon === "users"
                  ? "text-rose-500 bg-rose-50"
                  : "text-emerald-600 bg-emerald-50";

              return (
                <div
                  key={obj.id}
                  className="grid grid-cols-[1.5fr_1.1fr_45px_65px] items-center py-2 text-xs hover:bg-slate-50/70 rounded px-1 transition-colors"
                >
                  {/* Objective Title */}
                  <div className="flex items-center gap-2 min-w-0 pr-1.5">
                    <span className={`grid h-6 w-6 shrink-0 place-items-center rounded ${iconTone}`}>
                      <IconComponent size={13} />
                    </span>
                    <span className="truncate font-semibold text-slate-800 text-[11.5px]" title={obj.name}>
                      {obj.name}
                    </span>
                  </div>

                  {/* Progress Bar + Value */}
                  <div className="flex items-center gap-2 pr-1.5">
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${obj.barColor}`}
                        style={{ width: `${obj.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 shrink-0">
                      {obj.progress}%
                    </span>
                  </div>

                  {/* Projects Count */}
                  <div className="text-center text-slate-700 font-bold text-[11.5px]">
                    {obj.projects}
                  </div>

                  {/* Target Date */}
                  <div className="text-right text-slate-500 font-medium text-[11px]">
                    {obj.target}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Key Risks & Escalations */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Key Risks & Escalations
            </h2>
            <button
              onClick={() => setActiveViewAll("risks")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              View All <ArrowRight size={13} />
            </button>
          </div>

          <div className="mt-1.5 divide-y divide-slate-100/70">
            {/* Table Header */}
            <div className="grid grid-cols-[16px_1fr_54px_58px] items-center text-[10.5px] font-semibold text-slate-400 pb-2 px-1">
              <span className="text-center">#</span>
              <span className="pl-1">Risk / Issue</span>
              <span className="text-center">Impact</span>
              <span className="text-right">Action</span>
            </div>

            {/* Rows */}
            {KEY_RISKS.map((risk) => (
              <div
                key={risk.id}
                className="grid grid-cols-[16px_1fr_54px_58px] items-center py-1.5 text-xs hover:bg-slate-50/70 rounded px-1 transition-colors"
              >
                <span className="text-center text-slate-400 font-semibold text-[11px]">
                  {risk.id}
                </span>

                <span className="truncate font-medium text-slate-800 text-[11.5px] pl-1 pr-1" title={risk.issue}>
                  {risk.issue}
                </span>

                <div className="text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      risk.impactColor === "red"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : risk.impactColor === "amber"
                        ? "bg-amber-50 text-amber-600 border border-amber-100"
                        : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    }`}
                  >
                    {risk.impact}
                  </span>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => setActiveRisk(risk)}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-semibold transition ${
                      risk.action === "Review"
                        ? "text-blue-600 hover:bg-blue-50 border border-blue-200"
                        : "text-slate-600 hover:bg-slate-50 border border-slate-200"
                    }`}
                  >
                    {risk.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: 3 EQUAL COLUMNS (Burndown, Expected vs Realized, Delivery Confidence) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Card 1: Portfolio Delivery (Burndown) */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Portfolio Delivery (Burndown)
              </h2>
              <div className="relative">
                <select
                  value={burndownProject}
                  onChange={(e) => setBurndownProject(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px] py-1 pl-2.5 pr-6 rounded-md hover:border-slate-300 focus:outline-none cursor-pointer"
                >
                  <option>All Strategic Projects</option>
                  <option>Digital Core Platform</option>
                  <option>ERP Modernization</option>
                  <option>Customer Portal</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-2 text-[10.5px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                <span className="text-slate-600 font-medium">Planned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                <span className="text-slate-600 font-medium">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                <span className="text-slate-600 font-medium">Forecast</span>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <BurndownLineChart data={BURNDOWN_DATA} />
          </div>
        </div>

        {/* Card 2: Expected vs Realized Business Value */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Expected vs Realized Business Value
              </h2>
              <div className="relative">
                <select
                  value={valueMetric}
                  onChange={(e) => setValueMetric(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px] py-1 pl-2.5 pr-6 rounded-md hover:border-slate-300 focus:outline-none cursor-pointer"
                >
                  <option>Cumulative</option>
                  <option>Per Quarter</option>
                </select>
                <ChevronDown
                  size={12}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-2 text-[10.5px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                <span className="text-slate-600 font-medium">Expected Value</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                <span className="text-slate-600 font-medium">Realized Value</span>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <BusinessValueBarChart data={BUSINESS_VALUE_DATA} />
          </div>
        </div>

        {/* Card 3: Delivery Confidence */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between min-w-0">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Delivery Confidence
            </h2>
          </div>

          <div className="my-auto py-1 min-w-0">
            <DeliveryConfidenceGauge
              percentage={72}
              changeText="↑ 6% vs. last quarter"
              metrics={CONFIDENCE_METRICS}
            />
          </div>
        </div>
      </div>

      {/* ROW 4: 3 EQUAL COLUMNS (Top Strategic Projects, Key Milestones, Executive Decisions Required) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Card 1: Top Strategic Projects */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Top Strategic Projects
            </h2>
            <button
              onClick={() => setActiveViewAll("projects")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              View All <ArrowRight size={13} />
            </button>
          </div>

          <div className="mt-1.5 divide-y divide-slate-100/70 overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-[14px_1.1fr_1fr_68px_48px_65px_48px] items-center text-[10px] font-semibold text-slate-400 pb-2 px-1 min-w-[390px]">
              <span className="text-center">#</span>
              <span>Project Name</span>
              <span>Business Objective</span>
              <span className="text-center">Health</span>
              <span className="text-center">Progress</span>
              <span className="text-center">Target Date</span>
              <span className="text-right">Business Value</span>
            </div>

            {/* Rows */}
            {TOP_PROJECTS.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  setSelectedProjectDetail(project);
                  if (onSelectProject) onSelectProject(project);
                }}
                className="grid grid-cols-[14px_1.1fr_1fr_68px_48px_65px_48px] items-center py-2 text-xs hover:bg-slate-50/80 rounded px-1 transition-colors cursor-pointer min-w-[390px]"
              >
                <span className="text-center text-slate-400 font-semibold text-[10.5px]">
                  {project.id}
                </span>

                <span className="font-semibold text-slate-800 text-[11px] truncate pr-1" title={project.name}>
                  {project.name}
                </span>

                <span className="text-slate-600 font-medium text-[10.5px] truncate pr-1" title={project.objective}>
                  {project.objective}
                </span>

                <div className="text-center">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold whitespace-nowrap">
                    <span
                      className={`h-2 w-2 rounded-full shrink-0 ${
                        project.healthTone === "green"
                          ? "bg-emerald-500"
                          : project.healthTone === "amber"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span
                      className={
                        project.healthTone === "green"
                          ? "text-emerald-700"
                          : project.healthTone === "amber"
                          ? "text-amber-700"
                          : "text-red-700"
                      }
                    >
                      {project.health}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <div className="h-1.5 w-10 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${project.progressColor}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-500 font-medium whitespace-nowrap">
                  {project.targetDate}
                </div>

                <div className="text-right text-[11px] font-bold text-slate-900 whitespace-nowrap">
                  {project.businessValue}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Key Milestones (Next 90 Days) */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              Key Milestones <span className="text-slate-500 font-normal">(Next 90 Days)</span>
            </h2>
            <button
              onClick={() => setActiveViewAll("milestones")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              View All <ArrowRight size={13} />
            </button>
          </div>

          <div className="mt-1.5 divide-y divide-slate-100/70">
            {/* Table Header */}
            <div className="grid grid-cols-[70px_1.1fr_1fr_20px] items-center text-[10.5px] font-semibold text-slate-400 pb-2 px-1">
              <span>Date</span>
              <span>Milestone</span>
              <span>Project</span>
              <span className="text-right">Status</span>
            </div>

            {/* Rows */}
            {KEY_MILESTONES.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-[70px_1.1fr_1fr_20px] items-center py-2 text-xs hover:bg-slate-50/70 rounded px-1 transition-colors"
              >
                <span className="font-semibold text-slate-700 text-[10.5px] whitespace-nowrap">
                  {m.date}
                </span>

                <span className="font-medium text-slate-800 text-[11px] truncate pr-1" title={m.milestone}>
                  {m.milestone}
                </span>

                <span className="text-slate-500 font-medium text-[10.5px] truncate pr-1" title={m.project}>
                  {m.project}
                </span>

                <div className="text-right flex justify-end">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      m.statusTone === "green"
                        ? "bg-emerald-500"
                        : m.statusTone === "amber"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: AI Insights & Recommendations */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                AI Insights & Recommendations
              </h2>
              <button
                onClick={() => setActiveViewAll("insights")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                View All <ArrowRight size={13} />
              </button>
            </div>

            {/* Insight Items */}
            <div className="mt-2 space-y-2">
              {AI_INSIGHTS_RECOMMENDATIONS.map((item) => {
                const IconComponent =
                  item.icon === "TrendingUp"
                    ? TrendingUp
                    : item.icon === "AlertTriangle"
                    ? AlertTriangle
                    : item.icon === "Settings"
                    ? Settings
                    : Lightbulb;

                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveInsight(item)}
                    className="flex items-start gap-3 rounded-lg p-1.5 transition-colors hover:bg-slate-50/80 cursor-pointer"
                  >
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full mt-0.5 ${item.bgColor} ${item.iconColor}`}
                    >
                      <IconComponent size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-[11.5px] font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[10.5px] text-slate-500 font-normal leading-tight mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DECISION ACTION MODAL */}
      {activeDecision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full ${
                    activeDecision.tone === "red"
                      ? "bg-red-500 text-white"
                      : activeDecision.tone === "amber"
                      ? "bg-amber-400 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  <AlertCircle size={18} />
                </span>
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                    Decision Item #{activeDecision.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeDecision.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveDecision(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Context & Impact
                </span>
                <p className="leading-relaxed">{activeDecision.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    Impact Level
                  </span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                    {activeDecision.impact}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    Budget Impact
                  </span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                    {activeDecision.requestedAmount}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => handleDecisionAction(activeDecision, "Rejected / Deferred")}
                className="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Reject / Defer
              </button>
              <button
                onClick={() => handleDecisionAction(activeDecision, "Additional Info Requested")}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
              >
                Request Info
              </button>
              <button
                onClick={() => handleDecisionAction(activeDecision, "Approved")}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
              >
                Approve Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RISK DETAIL MODAL */}
      {activeRisk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                  Risk Review #{activeRisk.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {activeRisk.issue}
                </h3>
              </div>
              <button
                onClick={() => setActiveRisk(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Severity / Impact
                  </span>
                  <span
                    className={`font-bold mt-0.5 block ${
                      activeRisk.impactColor === "red"
                        ? "text-red-600"
                        : activeRisk.impactColor === "amber"
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {activeRisk.impact}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Assigned Owner
                  </span>
                  <span className="font-bold text-slate-800 mt-0.5 block truncate">
                    {activeRisk.owner}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Active Mitigation Plan
                </span>
                <p className="leading-relaxed">{activeRisk.mitigation}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setActiveRisk(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  notify(`Risk #${activeRisk.id} updated with executive endorsement.`);
                  setActiveRisk(null);
                }}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                Endorse Mitigation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT QUICK DETAIL MODAL */}
      {selectedProjectDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600">
                  {selectedProjectDetail.objective}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedProjectDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProjectDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Health
                </span>
                <span
                  className={`font-bold mt-1 block ${
                    selectedProjectDetail.healthTone === "green"
                      ? "text-emerald-600"
                      : selectedProjectDetail.healthTone === "amber"
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedProjectDetail.health}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Progress
                </span>
                <span className="font-bold text-slate-900 mt-1 block">
                  {selectedProjectDetail.progress}% Complete
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Business Value
                </span>
                <span className="font-bold text-slate-900 mt-1 block">
                  {selectedProjectDetail.businessValue}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-sky-50/60 border border-sky-100 p-3.5 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-bold text-sky-800">
                <Target size={15} /> Target Completion: {selectedProjectDetail.targetDate}
              </div>
              <p className="mt-1 text-slate-600 leading-relaxed">
                Key workstreams are scheduled in cadence with strategic quarterly delivery gates.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setSelectedProjectDetail(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedProjectDetail(null);
                  notify(`Opened workspace for ${selectedProjectDetail.name}`);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 inline-flex items-center gap-1.5"
              >
                Open Project Workspace <ExternalLink size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI INSIGHT DETAIL MODAL */}
      {activeInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full ${activeInsight.bgColor} ${activeInsight.iconColor}`}
                >
                  {activeInsight.icon === "TrendingUp" ? (
                    <TrendingUp size={18} />
                  ) : activeInsight.icon === "AlertTriangle" ? (
                    <AlertTriangle size={18} />
                  ) : activeInsight.icon === "Settings" ? (
                    <Settings size={18} />
                  ) : (
                    <Lightbulb size={18} />
                  )}
                </span>
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600">
                    AI Insight · {activeInsight.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeInsight.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveInsight(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-100">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  AI Recommendation Detail
                </span>
                <p className="leading-relaxed text-slate-700">{activeInsight.detail}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-sky-50/70 p-2.5 border border-sky-100">
                  <span className="block text-[10px] font-bold text-sky-700 uppercase">
                    Projected Impact
                  </span>
                  <span className="font-bold text-sky-900 text-xs mt-0.5 block">
                    {activeInsight.impact}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">
                    Suggested Action
                  </span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                    {activeInsight.subtitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setActiveInsight(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  notify(`AI Recommendation "${activeInsight.title}" added to action items.`);
                  setActiveInsight(null);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
              >
                Apply Recommendation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ALL MODAL */}
      {activeViewAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 capitalize">
                All {activeViewAll === "insights" ? "AI Insights & Recommendations" : activeViewAll}
              </h3>
              <button
                onClick={() => setActiveViewAll(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 max-h-96 overflow-y-auto text-xs text-slate-600 space-y-2.5">
              {activeViewAll === "insights" ? (
                AI_INSIGHTS_RECOMMENDATIONS.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveViewAll(null);
                      setActiveInsight(item);
                    }}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full mt-0.5 ${item.bgColor} ${item.iconColor}`}
                    >
                      {item.icon === "TrendingUp" ? (
                        <TrendingUp size={16} />
                      ) : item.icon === "AlertTriangle" ? (
                        <AlertTriangle size={16} />
                      ) : item.icon === "Settings" ? (
                        <Settings size={16} />
                      ) : (
                        <Lightbulb size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <strong className="text-slate-900 text-xs">{item.title}</strong>
                        <span className="rounded bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5">
                          {item.impact}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.subtitle}</p>
                      <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p className="text-slate-500">
                    Showing complete record for {activeViewAll}. Full drill-down filtering is synced across business units.
                  </p>
                  <div className="rounded-lg bg-slate-50 p-3 text-slate-700">
                    Total active items tracked: {activeViewAll === "projects" ? TOP_PROJECTS.length : activeViewAll === "risks" ? KEY_RISKS.length : activeViewAll === "milestones" ? KEY_MILESTONES.length : EXECUTIVE_DECISIONS.length} items.
                  </div>
                </>
              )}
            </div>
            <div className="mt-5 flex justify-end border-t border-slate-100 pt-3">
              <button
                onClick={() => setActiveViewAll(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
