'use client';

import SignIn from "./sign-in";
import Link from "next/link";

import styles from "./navbar.module.css";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { User } from "firebase/auth";
import { BsYoutube } from "react-icons/bs";
import Upload from "./upload";


function NavBar() {
  // Initialize user state
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [] /* No dependencies, never rerun */);


  return (
    <nav className="sticky top-0 dark:bg-slate-800 px-6 py-8 ring-1 ring-slate-900/5 shadow-xl flex items-center justify-between flex-wrap-6">
      
      <Link href="/">
        <span className={styles.logoContainer}>
        <h1 className="fixed">VicTube</h1>
        <BsYoutube size={40}/>
        </span>
      </Link>
      {
        user && <Upload/>
      }
      <SignIn user={user} />
    </nav>
  );
}

export default NavBar;
