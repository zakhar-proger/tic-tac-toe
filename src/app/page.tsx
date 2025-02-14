import styles from "@/app/ui/page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span style={{ display: "block" }}>Hello Player</span>
      </main>
    </div>
  );
}
