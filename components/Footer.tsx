import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>
        &copy; {currentYear} CRUD Items. All rights reserved.
      </p>
    </footer>
  );
}