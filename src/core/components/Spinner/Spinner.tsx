import styles from './Spinner.module.css';

export const Spinner = () => (
  <div className={styles.overlay}>
    <div className={styles.loader}>
      <div className={styles.box} />
      <div className={styles.box} />
      <div className={styles.box} />
      <div className={styles.box} />
      <div className={styles.box} />
      <div className={styles.logo}>
        <span className={styles.logoText}>Pradma</span>
      </div>
    </div>
  </div>
);
