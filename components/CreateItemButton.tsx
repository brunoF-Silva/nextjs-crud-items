// app/components/CreateItemButton.tsx

'use client'; // This must be a client component to use hooks

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './CreateItemButton.module.css'; // We will create this CSS file next

export default function CreateItemButton() {
  const pathname = usePathname();

  // This check is the "state".
  // We only want to show the button on the main /items list page,
  // not on /items/new or /items/[id].
  const isItemsList = pathname === '/';

  // If we are not on the /items page, render nothing.
  if (!isItemsList) {
    return null;
  }

  // If we ARE on the /items page, render the button.
  return (
    <Link href="/items/new" className={styles.createButton}>
      <span>+</span> New Item
    </Link>
  );
}