import { stations, type StationId } from "./workflows";
import styles from "./scene.module.css";

const details: Record<StationId, { role: string; reads: string; does: string; gate: string }> = {
  intake: { role: "The first reader", reads: "Messages and attachments.", does: "Creates a structured, traceable task.", gate: "Flags missing details; never invents them." },
  research: { role: "The context finder", reads: "Your connected records.", does: "Gathers evidence and its sources.", gate: "Only accesses records you have permitted." },
  policy: { role: "The rule checker", reads: "Policies and evidence.", does: "Checks eligibility and recommends a next step.", gate: "Sensitive decisions go to a person." },
  review: { role: "You, in control", reads: "Recommendations and exceptions.", does: "An authorised person approves or asks for evidence.", gate: "Required approval cannot be skipped." },
  execution: { role: "The task closer", reads: "Approved instructions.", does: "Updates records, replies and logs each action.", gate: "Stays within your permissions." },
};

export default function RoleDetails({ id, onClose }: { id: StationId; onClose: () => void }) {
  const info = details[id];
  const name = stations.find((station) => station.id === id)!.name;
  return <div className={styles.roleDetails} role="region" aria-label={`${name} agent details`}>
    <div className={styles.roleHeading}><strong>{name}: {info.role}</strong><button type="button" onClick={onClose} aria-label="Close role details">&times;</button></div>
    <dl>
      <div><dt>Reads</dt><dd>{info.reads}</dd></div>
      <div><dt>Does</dt><dd>{info.does}</dd></div>
      <div><dt>Your control</dt><dd>{info.gate}</dd></div>
    </dl>
  </div>;
}
