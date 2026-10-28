import { useState } from "react";

export function DonutChart({
  onTrack = 18,
  atRisk = 7,
  delayed = 3,
  total = 28
}) {
  const [hovered, setHovered] = useState(null);

  const r = 48;
  const c = 2 * Math.PI * r; // ~301.59

  const onTrackPct = onTrack / total; // ~0.643
  const atRiskPct = atRisk / total;   // ~0.250
  const delayedPct = delayed / total; // ~0.107

  const onTrackLen = onTrackPct * c;
  const atRiskLen = atRiskPct * c;
  const delayedLen = delayedPct * c;

  // Green starts at ~12 o'clock / -90 deg
  const onTrackOffset = 0;
  const atRiskOffset = -onTrackLen;
  const delayedOffset = -(onTrackLen + atRiskLen);

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      {/* SVG Donut */}
      <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 130 130" className="w-full h-full -rotate-90 transform">
          <circle
            cx="65"
            cy="65"
            r={r}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="18"
          />

          {/* On Track Segment (Emerald Green) */}
          <circle
            cx="65"
            cy="65"
            r={r}
            fill="none"
            stroke="#22c55e"
            strokeWidth="18"
            strokeDasharray={`${onTrackLen - 2} ${c - onTrackLen + 2}`}
            strokeDashoffset={onTrackOffset}
            className="transition-all duration-300 hover:opacity-85 cursor-pointer"
            onMouseEnter={() => setHovered("onTrack")}
            onMouseLeave={() => setHovered(null)}
          />

          {/* At Risk Segment (Amber) */}
          <circle
            cx="65"
            cy="65"
            r={r}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="18"
            strokeDasharray={`${atRiskLen - 2} ${c - atRiskLen + 2}`}
            strokeDashoffset={atRiskOffset}
            className="transition-all duration-300 hover:opacity-85 cursor-pointer"
            onMouseEnter={() => setHovered("atRisk")}
            onMouseLeave={() => setHovered(null)}
          />

          {/* Delayed Segment (Coral Red) */}
          <circle
            cx="65"
            cy="65"
            r={r}
            fill="none"
            stroke="#ef4444"
            strokeWidth="18"
            strokeDasharray={`${delayedLen - 2} ${c - delayedLen + 2}`}
            strokeDashoffset={delayedOffset}
            className="transition-all duration-300 hover:opacity-85 cursor-pointer"
            onMouseEnter={() => setHovered("delayed")}
            onMouseLeave={() => setHovered(null)}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[25px] font-extrabold leading-none text-slate-900">
            {total}
          </span>
          <span className="text-[10.5px] font-semibold text-slate-500 mt-1">
            Projects
          </span>
        </div>
      </div>

      {/* Legend on right */}
      <div className="flex-1 space-y-2.5 pl-2">
        <div
          className={`flex items-center justify-between text-xs transition-opacity ${
            hovered && hovered !== "onTrack" ? "opacity-35" : "opacity-100"
          }`}
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shrink-0" />
            <span className="text-slate-600 font-semibold text-[11.5px] whitespace-nowrap">On Track</span>
          </div>
          <span className="font-extrabold text-slate-800 text-xs whitespace-nowrap pl-2">
            {onTrack} <span className="font-normal text-slate-500">({Math.round(onTrackPct * 100)}%)</span>
          </span>
        </div>

        <div
          className={`flex items-center justify-between text-xs transition-opacity ${
            hovered && hovered !== "atRisk" ? "opacity-35" : "opacity-100"
          }`}
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0" />
            <span className="text-slate-600 font-semibold text-[11.5px] whitespace-nowrap">At Risk</span>
          </div>
          <span className="font-extrabold text-slate-800 text-xs whitespace-nowrap pl-2">
            {atRisk} <span className="font-normal text-slate-500">({Math.round(atRiskPct * 100)}%)</span>
          </span>
        </div>

        <div
          className={`flex items-center justify-between text-xs transition-opacity ${
            hovered && hovered !== "delayed" ? "opacity-35" : "opacity-100"
          }`}
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0" />
            <span className="text-slate-600 font-semibold text-[11.5px] whitespace-nowrap">Delayed</span>
          </div>
          <span className="font-extrabold text-slate-800 text-xs whitespace-nowrap pl-2">
            {delayed} <span className="font-normal text-slate-500">({Math.round(delayedPct * 100)}%)</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export function DeliveryConfidenceGauge({
  percentage = 72,
  changeText = "↑ 6% vs. last quarter",
  metrics = []
}) {
  const radius = 46;
  const strokeWidth = 10;
  const angle = 220;
  const arcLength = (angle / 360) * (2 * Math.PI * radius);
  const fillLength = (percentage / 100) * arcLength;

  return (
    <div className="flex items-center gap-2 py-1 min-w-0">
      {/* Gauge Visual */}
      <div className="flex flex-col items-center justify-center shrink-0 w-[94px]">
        <div className="relative w-[90px] h-[72px] flex items-center justify-center">
          <svg viewBox="0 0 120 95" className="w-full h-full overflow-visible">
            <path
              d="M 22 78 A 46 46 0 1 1 98 78"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <path
              d="M 22 78 A 46 46 0 1 1 98 78"
              fill="none"
              stroke="#0284c7"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${arcLength}`}
              strokeDashoffset={`${arcLength - fillLength}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 top-1 flex flex-col items-center justify-center text-center">
            <span className="text-[20px] font-black text-slate-900 leading-none">
              {percentage}%
            </span>
            <span className="text-[9px] font-bold text-slate-500 mt-0.5">
              Confidence
            </span>
          </div>
        </div>
        <div className="text-[9.5px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5 whitespace-nowrap">
          {changeText}
        </div>
      </div>

      {/* Metrics List */}
      <div className="flex-1 min-w-0 space-y-1.5 border-l border-slate-100 pl-2">
        {metrics.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className={`w-1.5 h-1.5 rounded-full ${item.dotColor} shrink-0`} />
              <span className="text-slate-600 font-semibold text-[10.5px] truncate" title={item.label}>
                {item.label}
              </span>
            </div>
            <span className="font-extrabold text-slate-900 text-[11px] shrink-0 tabular-nums">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BurndownLineChart({ data = [] }) {
  const [activePoint, setActivePoint] = useState(null);

  const width = 450;
  const height = 180;
  const padding = { top: 25, right: 30, bottom: 25, left: 32 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const yTicks = [0, 20, 40, 60, 80, 100];

  const getX = (index) => padding.left + (index / (data.length - 1)) * graphWidth;
  const getY = (val) => padding.top + graphHeight - (val / 100) * graphHeight;

  const plannedPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.planned), val: d.planned, month: d.month }));
  const plannedPath = plannedPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`, "");

  const actualData = data.filter((d) => d.actual !== null);
  const actualPoints = actualData.map((d) => {
    const origIdx = data.findIndex((item) => item.month === d.month);
    return { x: getX(origIdx), y: getY(d.actual), val: d.actual, month: d.month };
  });
  const actualPath = actualPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`, "");

  const forecastData = data.filter((d) => d.forecast !== null);
  const forecastPoints = forecastData.map((d) => {
    const origIdx = data.findIndex((item) => item.month === d.month);
    return { x: getX(origIdx), y: getY(d.forecast), val: d.forecast, month: d.month };
  });
  const forecastPath = forecastPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`, "");

  const octPt = plannedPoints[9] || plannedPoints[plannedPoints.length - 1];
  const augActualPt = actualPoints[actualPoints.length - 1];
  const decForecastPt = forecastPoints[forecastPoints.length - 1];

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        <defs>
          <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Y Axis text label */}
        <text
          x={-height / 2}
          y={10}
          transform="rotate(-90)"
          textAnchor="middle"
          className="text-[8.5px] fill-slate-400 font-semibold"
        >
          Cumulative Work (%)
        </text>

        {/* Horizontal grid lines */}
        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="2,3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 6}
                y={y + 3}
                textAnchor="end"
                className="text-[8.5px] fill-slate-400 font-semibold"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* X Axis month labels */}
        {data.map((d, i) => {
          const x = getX(i);
          return (
            <text
              key={d.month}
              x={x}
              y={height - 6}
              textAnchor="middle"
              className="text-[9px] fill-slate-500 font-semibold"
            >
              {d.month}
            </text>
          );
        })}

        {/* Forecast Dashed Line (Coral Red) */}
        {forecastPath && (
          <path
            d={forecastPath}
            fill="none"
            stroke="#f87171"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
        )}

        {/* Planned Line (Sky Blue) */}
        <path
          d={plannedPath}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          className="transition-all"
        />

        {/* Actual Line (Emerald Green) */}
        {actualPath && (
          <path
            d={actualPath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            className="transition-all"
          />
        )}

        {/* Nodes for Planned Line */}
        {plannedPoints.map((pt, i) => (
          <circle
            key={`pl-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="2.5"
            fill="#0284c7"
            className="hover:r-3.5 transition-all cursor-pointer"
            onMouseEnter={() => setActivePoint({ type: "Planned", ...pt })}
            onMouseLeave={() => setActivePoint(null)}
          />
        ))}

        {/* Nodes for Actual Line */}
        {actualPoints.map((pt, i) => (
          <circle
            key={`act-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="3"
            fill="#16a34a"
            className="hover:r-4 transition-all cursor-pointer"
            onMouseEnter={() => setActivePoint({ type: "Actual", ...pt })}
            onMouseLeave={() => setActivePoint(null)}
          />
        ))}

        {/* Nodes for Forecast Line */}
        {forecastPoints.map((pt, i) => (
          <circle
            key={`fc-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="2.5"
            fill="#ef4444"
            className="hover:r-3.5 transition-all cursor-pointer"
            onMouseEnter={() => setActivePoint({ type: "Forecast", ...pt })}
            onMouseLeave={() => setActivePoint(null)}
          />
        ))}

        {/* 1. Planned 100% Callout */}
        {octPt && (
          <g transform={`translate(${octPt.x - 28}, ${octPt.y - 23})`} filter="url(#badgeShadow)">
            <rect width="56" height="17" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="0.75" />
            <text x="28" y="11.5" textAnchor="middle" className="text-[8px] fill-sky-800 font-extrabold">
              Planned 100%
            </text>
          </g>
        )}

        {/* 2. Actual 68% Callout */}
        {augActualPt && (
          <g transform={`translate(${augActualPt.x - 20}, ${augActualPt.y + 8})`} filter="url(#badgeShadow)">
            <rect width="40" height="20" rx="3" fill="#dcfce7" stroke="#22c55e" strokeWidth="0.75" />
            <text x="20" y="8" textAnchor="middle" className="text-[7.5px] fill-emerald-800 font-bold">
              Actual
            </text>
            <text x="20" y="16.5" textAnchor="middle" className="text-[8px] fill-emerald-800 font-black">
              68%
            </text>
          </g>
        )}

        {/* 3. Forecast 85% Callout */}
        {decForecastPt && (
          <g transform={`translate(${decForecastPt.x - 22}, ${decForecastPt.y - 23})`} filter="url(#badgeShadow)">
            <rect width="44" height="20" rx="3" fill="#fee2e2" stroke="#f87171" strokeWidth="0.75" />
            <text x="22" y="8" textAnchor="middle" className="text-[7.5px] fill-rose-800 font-bold">
              Forecast
            </text>
            <text x="22" y="16.5" textAnchor="middle" className="text-[8px] fill-rose-800 font-black">
              85%
            </text>
          </g>
        )}
      </svg>

      {/* Floating tooltip */}
      {activePoint && (
        <div
          className="absolute z-10 pointer-events-none rounded bg-slate-900 px-2 py-1 text-[9.5px] text-white shadow-lg font-medium"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${(activePoint.y / height) * 100}%`,
            transform: "translate(-50%, -130%)"
          }}
        >
          {activePoint.type}: {activePoint.val}% ({activePoint.month})
        </div>
      )}
    </div>
  );
}

export function BusinessValueBarChart({ data = [] }) {
  const [hoveredBar, setHoveredBar] = useState(null);

  const width = 450;
  const height = 180;
  const padding = { top: 25, right: 20, bottom: 25, left: 30 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const yTicks = [0, 5, 10, 15, 20];
  const maxVal = 20;

  const getY = (val) => padding.top + graphHeight - (val / maxVal) * graphHeight;
  const groupWidth = graphWidth / data.length;
  const barWidth = 10;
  const gap = 2.5;

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
      >
        <text
          x={-height / 2}
          y={10}
          transform="rotate(-90)"
          textAnchor="middle"
          className="text-[8.5px] fill-slate-400 font-semibold"
        >
          Volume
        </text>

        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="2,3"
                strokeWidth="1"
              />
              <text
                x={padding.left - 6}
                y={y + 3}
                textAnchor="end"
                className="text-[8.5px] fill-slate-400 font-semibold"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {data.map((item, i) => {
          const groupCenterX = padding.left + i * groupWidth + groupWidth / 2;
          const expX = groupCenterX - barWidth - gap / 2;
          const realX = groupCenterX + gap / 2;

          const expY = getY(item.expected);
          const expH = padding.top + graphHeight - expY;

          const realY = getY(item.realized);
          const realH = padding.top + graphHeight - realY;

          return (
            <g key={item.period}>
              {/* Expected Bar (Sky Blue) */}
              <rect
                x={expX}
                y={expY}
                width={barWidth}
                height={Math.max(2, expH)}
                rx="1.5"
                fill="#38bdf8"
                className="hover:opacity-80 cursor-pointer transition-all"
                onMouseEnter={() =>
                  setHoveredBar({
                    period: item.period,
                    type: "Approved Project",
                    val: item.expected
                  })
                }
                onMouseLeave={() => setHoveredBar(null)}
              />
              <text
                x={expX + barWidth / 2}
                y={expY - 3}
                textAnchor="middle"
                className="text-[7.5px] fill-sky-800 font-black"
              >
                {item.expected}
              </text>

              {/* Realized Bar (Emerald Green) */}
              <rect
                x={realX}
                y={realY}
                width={barWidth}
                height={Math.max(2, realH)}
                rx="1.5"
                fill="#22c55e"
                className="hover:opacity-80 cursor-pointer transition-all"
                onMouseEnter={() =>
                  setHoveredBar({
                    period: item.period,
                    type: "Project Intake",
                    val: item.realized
                  })
                }
                onMouseLeave={() => setHoveredBar(null)}
              />
              <text
                x={realX + barWidth / 2}
                y={realY - 3}
                textAnchor="middle"
                className="text-[7.5px] fill-emerald-800 font-black"
              >
                {item.realized}
              </text>

              {/* Period label */}
              <text
                x={groupCenterX}
                y={height - 6}
                textAnchor="middle"
                className="text-[9px] fill-slate-500 font-semibold"
              >
                {item.period}
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredBar && (
        <div className="absolute top-2 right-4 rounded bg-slate-900 px-2 py-1 text-[9.5px] text-white shadow-lg pointer-events-none font-medium">
          {hoveredBar.period} · {hoveredBar.type}: {hoveredBar.val}
        </div>
      )}
    </div>
  );
}
