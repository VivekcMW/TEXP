import type { DiagramId } from "@/content/schemas";
import { RagPipelineDiagram } from "./RagPipelineDiagram";
import { AgentLoopDiagram } from "./AgentLoopDiagram";
import { AutomationFlowDiagram } from "./AutomationFlowDiagram";
import { EnterpriseStackDiagram } from "./EnterpriseStackDiagram";
import { EngagementModelDiagram } from "./EngagementModelDiagram";
import { BeforeAfterDiagram } from "./BeforeAfterDiagram";

export const diagrams: Record<DiagramId, { Component: React.ComponentType }> = {
  "rag-pipeline": { Component: RagPipelineDiagram },
  "agent-loop": { Component: AgentLoopDiagram },
  "automation-flow": { Component: AutomationFlowDiagram },
  "enterprise-stack": { Component: EnterpriseStackDiagram },
  "engagement-model": { Component: EngagementModelDiagram },
  "before-after": { Component: BeforeAfterDiagram },
};

export function DiagramById({ id }: { id: DiagramId }) {
  const { Component } = diagrams[id];
  return <Component />;
}
