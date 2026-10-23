import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import { agentPresentations, type AgentPresentation, type WorkbenchKind } from "../src/components/agents/showcase";

const desk = readFileSync("public/posters/agent-workbench.svg", "utf8");

function Parcel({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M0 20 40 0 80 20 80 64 40 84 0 64Z" fill="#c6a579" />
    <path d="M0 20 40 0 80 20 40 40Z" fill="#e0c69b" />
    <path d="m26 7 40 20 12-6-40-20Z" fill="#f3dfb9" />
    <path d="m8 31 24 12v18L8 49Z" fill="#fff9e9" />
  </g>;
}

function Workspace({ kind, color }: { kind: WorkbenchKind; color: string }) {
  switch (kind) {
    case "claims":
      return <g>
        <path d="m132 319 109-51 98 42-108 54Z" fill="#b9cbb9" />
        <Parcel x={151} y={253} /><Parcel x={214} y={226} />
        <path d="M149 292V201l123-54v91" stroke={color} strokeWidth="12" strokeLinejoin="round" />
        <path d="m150 232 122-55v23l-122 55Z" fill={color} opacity=".25" />
        <circle cx="217" cy="173" r="9" fill="#dcefd2" />
      </g>;
    case "returns":
      return <g>
        <path d="m112 314 123-57 104 47-124 61Z" fill={color} stroke="#526e5c" strokeWidth="6" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`m${126 + i * 23} ${310 - i * 10} 84 38`} stroke="#cad6bd" strokeWidth="8" />)}
        <path d="m130 323 1 37m178-44v36" stroke="#8aa18c" strokeWidth="8" />
        <Parcel x={162} y={239} />
        <path d="m253 224 50-23 37 16v40l-50 23-37-16Z" fill={color} />
        <path d="m272 231 45-20v50l-45 20Z" fill="#fff9e9" />
        <path d="m280 242 27-13m-27 24 27-13" stroke={color} strokeWidth="4" />
      </g>;
    case "billing":
      return <g>
        <path d="m148 311 115-52 64 29-115 54Z" fill="#b7cbd0" />
        <path d="M153 203 275 148v139l-122 57Z" fill={color} stroke={color} strokeWidth="12" strokeLinejoin="round" />
        <path d="m162 211 104-47v112l-104 48Z" fill="#f6f6e8" />
        <path d="m177 273 0-25m29 12v-52m29 39v-38" stroke={color} strokeWidth="15" />
        <path d="m175 296 75-34m-75 45 46-21" stroke="#acbec4" strokeWidth="4" />
        <path d="m261 311 31-14 35 15-31 15Z" fill="#e5c982" />
        <path d="m261 302 31-14 35 15-31 15Z" fill="#f1dca6" />
      </g>;
    case "healthcare":
      return <g>
        <path d="m148 310 114-52 72 33-114 53Z" fill="#c6d5df" />
        <path d="m151 203 104-47v158l-104 48Z" fill={color} stroke={color} strokeWidth="8" strokeLinejoin="round" />
        <path d="m161 211 84-38v131l-84 39Z" fill="#f8f8ec" />
        <path d="m186 185 40-18v17l-40 18Z" fill="#afbfcd" />
        <path d="m203 215 0 43m-19-12 38-17" stroke={color} strokeWidth="12" />
        <path d="m176 291 52-24m-52 38 39-18" stroke="#a9bdc6" strokeWidth="4" />
        <path d="m265 268 39-18v65l-39 18Z" fill="#e6ebde" stroke={color} strokeWidth="5" />
        <path d="m274 292 6 4 15-24m-21 36 21-10" stroke={color} strokeWidth="4" />
      </g>;
    case "maintenance":
      return <g>
        <path d="m139 312 120-54 80 35-121 57Z" fill="#98a89b" />
        <path d="m151 318 0 28m158-44v30" stroke="#718677" strokeWidth="9" />
        <g transform="translate(220 247) skewY(-24)">
          {Array.from({ length: 8 }, (_, i) => <rect key={i} x="-10" y="-65" width="20" height="32" rx="3" fill={color} transform={`rotate(${i * 45})`} />)}
          <circle r="44" fill={color} /><circle r="23" fill="#e4e5d8" />
          <circle r="12" fill="#80978b" />
        </g>
        <path d="m275 282 33-58m-39 14 4-19 18-4" stroke="#d9bf83" strokeWidth="10" strokeLinecap="round" />
      </g>;
    case "outage":
      return <g>
        <path d="m123 306 118-54 105 47-120 57Z" fill={color} />
        <path d="m158 301 41-18 45 21 38-18m-38 18-18 29" stroke="#e6f1d6" strokeWidth="4" />
        {[[158, 301], [199, 283], [244, 304], [282, 286], [226, 333]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill="#ebcf87" />)}
        <path d="M168 291V180m-28 18 56-25m67 99V156m-29 22 57-26" stroke="#647e73" strokeWidth="8" />
        <path d="M142 196q58 41 93-19m-43-1q57 31 96-25" stroke={color} strokeWidth="3" />
        <circle cx="264" cy="153" r="10" fill="#ecd18b" />
      </g>;
    case "permits":
      return <g>
        <path d="m128 307 123-56 104 47-125 59Z" fill="#c7dcd7" />
        <path d="m146 307 105-48m-78 62 105-48m-71 63 102-48" stroke="#7e9f9b" strokeWidth="2" />
        <path d="m159 225 46-21 45 20v76l-46 22-45-21Z" fill="#d6c6a7" />
        <path d="m159 225 46-21 45 20-46 22Z" fill="#ede1c5" />
        <path d="m224 246 41-19 39 18v61l-41 19-39-18Z" fill={color} />
        <path d="m170 241 17 8v20l-17-8m17 20-17-8v20l17 8" fill="#f9f6e7" />
        <path d="m285 318 29-14 25 11-29 14Z" fill="#526f60" />
        <path d="m310 314 0-29" stroke={color} strokeWidth="13" strokeLinecap="round" />
      </g>;
  }
}

function WorkbenchPreview({ presentation }: { presentation: AgentPresentation }) {
  return <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label={presentation.artwork}
    width="800" height="480" viewBox="0 0 800 480" fill="none">
    <g dangerouslySetInnerHTML={{ __html: desk }} />
    <Workspace kind={presentation.kind} color={presentation.color} />
  </svg>;
}

for (const presentation of agentPresentations) {
  const svg = renderToStaticMarkup(React.createElement(WorkbenchPreview, { presentation }));
  writeFileSync(`public/posters/agent-${presentation.kind}.svg`, svg + "\n");
}
