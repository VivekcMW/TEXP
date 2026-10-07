import { Diagram, Box, Arrow } from "./Diagram";
import { Reveal } from "./Reveal";
const stages = ["Ingest", "Chunk", "Embed", "Store", "Retrieve", "Generate"];
const subs = ["PDF, email, tickets", "Semantic sections", "Vector per chunk", "Vector index", "Top-k by query", "Grounded answer"];
export function RagPipelineDiagram() {
  return (
    <Diagram title="Retrieval-augmented generation pipeline" description="Six stages left to right: documents are ingested, split into chunks, embedded into vectors, stored in an index, retrieved by a query, and used to generate a grounded answer with citations." caption="How a RAG system turns your documents into answers with citations." viewBox="0 0 860 140">
      {stages.map((s, i) => (
        <Reveal key={s} delay={i * 0.08}>
          <Box x={10 + i * 142} y={40} label={s} sub={subs[i]} accent={i === 5} />
          {i < stages.length - 1 && <Arrow x1={130 + i * 142} y1={64} x2={152 + i * 142} y2={64} />}
        </Reveal>
      ))}
      <Reveal delay={0.6}>
        <Box x={10 + 4 * 142} y={104} w={120} h={28} label="Query" />
        <Arrow x1={70 + 4 * 142} y1={104} x2={70 + 4 * 142} y2={92} />
      </Reveal>
    </Diagram>
  );
}
