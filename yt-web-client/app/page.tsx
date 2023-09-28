import Image from "next/image";
import { getVideos } from "./firebase/functions";
import Link from "next/link";
import { MantineProvider } from '@mantine/core';

import styles from "./page.module.css"

export default async function Home() {
  const videos = await getVideos();

  return (
    <main className="bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl flex min-h-screen flex-col items-center justify-between p-24">
      {videos.map((video) => (
        // eslint-disable-next-line react/jsx-key
        <Link href={`/watch?v=${video.filename}`}>
          <Image src={"/thumbnail.png"} alt="video" width={120} height={80} 
          className={styles.thumbnail}/>
        </Link>
      ))
      }
    </main>
  )
}
