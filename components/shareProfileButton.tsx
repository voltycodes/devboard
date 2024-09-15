"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function ShareProfileButton({ghID, lcID}: {ghID: string | null, lcID: string | null}) {
  const [host, setHost] = useState(process.env.VERCEL_URL || process.env.PUBLIC_URL || '');

  useEffect(() => {
    if (window) {
      setHost(window.location.host);
    }
  }, [])

  const copyProfileLink = () => {
    const url = `${host}/stats?${ghID ? `github=${ghID}` : ''}${lcID ? `${ghID ? '&' : ''}leetcode=${lcID}` : ''}`
    navigator.clipboard.writeText(url);
    toast.success("Copied Your Profile Link To Clipboard!")
  }

  return (
    <Button className="mt-6 font-semibold flex gap-2" onClick={copyProfileLink}>
      <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1={12} x2={12} y1={2} y2={15} /></svg>
      Share Your Stats
    </Button>
  )
}