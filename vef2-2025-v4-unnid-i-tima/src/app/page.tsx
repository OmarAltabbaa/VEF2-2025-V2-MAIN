import styles from "./page.module.css";
import Navigation from "./components/Navigation/Navigation";

export default function Home() {
  return (
    <div className={styles.page}>
      <Navigation />
      <h1>Verkefni 4 </h1>
      <h2></h2>
    </div>
  );
}
