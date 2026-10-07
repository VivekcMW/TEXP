export const SCENE_IDS = ["agentic-field", "rag-pipeline", "automation-loop", "enterprise-stack"] as const;
export type SceneId = (typeof SCENE_IDS)[number];
export type SceneProps = { onReady?: () => void; onLost?: () => void };
export const sceneMeta: Record<SceneId, { alt: string }> = {
  "agentic-field": { alt: "Abstract network of agents, tools and data exchanging signals" },
  "rag-pipeline": { alt: "Documents fragmenting into chunks that settle into an embedding lattice and are retrieved by a query" },
  "automation-loop": { alt: "A ring of stages, plan, act, observe, correct, with an item moving through them" },
  "enterprise-stack": { alt: "Layered planes for data, models, orchestration and applications with connectors between them" },
};
