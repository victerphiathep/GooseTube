'use client';
import { getVideos } from "../firebase/functions";
import { useSearchParams } from 'next/navigation'

export default function Watch() {
  const videoPrefix = 'https://storage.googleapis.com/victube-processed-videos/';
  const videoSrc = useSearchParams().get('v');
  const videos = getVideos();

  return (
    <div className="h-screen bg-white dark:bg-slate-800 rounded-lg px-6 py-8 ring-1 ring-slate-900/5 shadow-xl">
  <div>
    <span className="inline-flex items-center justify-center p-2 bg-indigo-500 rounded-md shadow-lg">
      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"></svg>
    </span>
  </div>
  <h3 className="text-slate-900 dark:text-white mt-5 text-base font-medium tracking-tight">Writes Upside-Down</h3>
  <div>
      <h1>Video Title</h1>
      { <video controls src={videoPrefix + videoSrc}/> }
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex obcaecati natus eligendi delectus, cum deleniti sunt in labore nihil quod quibusdam expedita nemo.
    </p>
    </div>

  
</div>
  );
}
