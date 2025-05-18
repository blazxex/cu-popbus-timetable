"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeBlock } from "@/components/time-block"
import { getCurrentDay, formatTime } from "@/lib/date-utils"
import { Skeleton } from "@/components/ui/skeleton"

interface TimeData {
  [hour: string]: string[]
}

interface TimetableData {
  weekday: {
    [line: string]: TimeData
  }
  Saturday: {
    [line: string]: TimeData
  }
}

export default function LinePage() {
  const params = useParams()
  const router = useRouter()
  const lineId = params.id as string
  const lineName = `Line ${lineId}`

  const [timetable, setTimetable] = useState<TimetableData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState(getCurrentDay() === "Saturday" ? "Saturday" : "weekday")

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await fetch("/timetable.json")
        const data = await response.json()
        setTimetable(data)
      } catch (error) {
        console.error("Failed to fetch timetable:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTimetable()
  }, [])

  if (!timetable && loading) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-40 mb-8" />
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!timetable || !timetable[currentTab as keyof TimetableData][lineName]) {
    return (
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-pink-500">Invalid Line</h1>
        </div>
        <p>This bus line does not exist. Please return to the homepage.</p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Go Back
        </Button>
      </div>
    )
  }

  const lineData = timetable[currentTab as keyof TimetableData][lineName]
  const currentTime = new Date()
  const currentHour = currentTime.getHours().toString()
  const currentMinute = currentTime.getMinutes()

  // Filter to only show upcoming times
  const upcomingTimes: { [hour: string]: string[] } = {}

  Object.keys(lineData).forEach((hour) => {
    if (Number.parseInt(hour) > Number.parseInt(currentHour)) {
      // All times in future hours
      upcomingTimes[hour] = lineData[hour]
    } else if (hour === currentHour) {
      // Only times in current hour that are in the future
      const futureMinutes = lineData[hour].filter((minute) => {
        // Handle the space in some minute values like "00 "
        const cleanMinute = minute.trim()
        return Number.parseInt(cleanMinute) > currentMinute
      })

      if (futureMinutes.length > 0) {
        upcomingTimes[hour] = futureMinutes
      }
    }
  })

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl animate-fade-in">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-pink-500 md:text-3xl">{lineName} Timetable</h1>
      </div>

      <Tabs defaultValue={currentTab} className="mb-8" onValueChange={setCurrentTab}>
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="weekday">Weekday</TabsTrigger>
          <TabsTrigger value="Saturday">Saturday</TabsTrigger>
        </TabsList>

        <TabsContent value="weekday" className="mt-6 animate-fade-in">
          <div className="flex items-center mb-4 text-gray-600 dark:text-gray-400">
            <Clock className="w-5 h-5 mr-2" />
            <span>Current time: {formatTime(currentTime)}</span>
          </div>
          {renderTimetable(upcomingTimes)}
        </TabsContent>

        <TabsContent value="Saturday" className="mt-6 animate-fade-in">
          <div className="flex items-center mb-4 text-gray-600 dark:text-gray-400">
            <Clock className="w-5 h-5 mr-2" />
            <span>Current time: {formatTime(currentTime)}</span>
          </div>
          {renderTimetable(upcomingTimes)}
        </TabsContent>
      </Tabs>
    </div>
  )

  function renderTimetable(times: { [hour: string]: string[] }) {
    if (Object.keys(times).length === 0) {
      return (
        <div className="p-6 mt-4 text-center border rounded-lg bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-900">
          <p className="text-lg font-medium text-pink-700 dark:text-pink-300">No more buses today</p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The service has ended for today.</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {Object.keys(times)
          .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
          .map((hour) => (
            <div key={hour} className="animate-fade-in-up">
              <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                {Number.parseInt(hour) > 12 ? Number.parseInt(hour) - 12 : hour}:00{" "}
                {Number.parseInt(hour) >= 12 ? "PM" : "AM"}
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {times[hour].map((minute, index) => (
                  <TimeBlock
                    key={`${hour}-${minute}-${index}`}
                    hour={Number.parseInt(hour)}
                    minute={Number.parseInt(minute.trim())}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    )
  }
}
