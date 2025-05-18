"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatTime } from "@/lib/date-utils"

export function SundayNotice() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-12 animate-fade-in-up">
      <Alert
        variant="destructive"
        className="border-pink-500 bg-pink-50 dark:bg-pink-950 text-pink-800 dark:text-pink-200"
      >
        <AlertCircle className="w-5 h-5" />
        <AlertTitle className="text-xl">No Service on Sundays</AlertTitle>
        <AlertDescription className="mt-2">
          <p>There is no bus service available today. Service will resume tomorrow.</p>
          <p className="mt-2">Current time: {formatTime(currentTime)} (Bangkok time)</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
