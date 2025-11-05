'use client'; // This directive is necessary for using hooks like useState

import { useState } from 'react';
import Link from 'next/link'; // The Next.js component for navigation
import styles from './Header.module.css'; // Import our CSS Module
import CreateItemButton from './CreateItemButton';

export default function Header() {
  // State to manage if the dropdown is open or closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          MyApp
        </Link>

      <div className={styles.navActions}>
        {/* Here you use the imported component */}
        <CreateItemButton />
      </div>

        <div className={styles.dropdown}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className={styles.dropdownButton}
          >
            Navigate <span>&#9660;</span> {/* This is a small down-arrow icon */}
          </button>

          {/* This menu only shows if isDropdownOpen is true */}
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <Link href="/" onClick={() => setIsDropdownOpen(false)}>
                Items
              </Link>
              <Link href="/clients" onClick={() => setIsDropdownOpen(false)}>
                Clients
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}