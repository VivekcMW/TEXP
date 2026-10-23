import styles from "./scene.module.css";

export default function OfficeArrival({ ready, playing }: { ready: boolean; playing: boolean }) {
  return <div className={styles.arrival} data-ready={ready} aria-hidden={ready}
    style={{ animationPlayState: playing ? "running" : "paused" }}>
    <div className={styles.arrivalOrbit} aria-hidden><span /><span /><span /><b>n.</b></div>
    <p className={styles.arrivalEyebrow}>WELCOME TO YOUR NEXT CHAPTER</p>
    <p className={styles.arrivalTitle}>Great work starts here.</p>
    <p className={styles.arrivalStatus} role="status">Opening your AI office<span aria-hidden>...</span></p>
    <span className={styles.arrivalLine} aria-hidden />
  </div>;
}
