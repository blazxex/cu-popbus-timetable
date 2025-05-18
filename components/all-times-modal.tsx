"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatAMPM } from "@/lib/date-utils"

interface AllTimesModalProps {
  isOpen: boolean
  onClose: () => void
}

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

export function AllTimesModal({ isOpen, onClose }: AllTimesModalProps) {
  const [timetable, setTimetable] = useState<TimetableData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLine, setSelectedLine] = useState("Line 1")
  const [selectedDay, setSelectedDay] = useState<"weekday" | "Saturday">("weekday")

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!isOpen) return

      try {
        setLoading(true)
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
  }, [isOpen])

  if (!timetable) return null

  const lineData = timetable[selectedDay][selectedLine]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Complete Timetable</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Tabs defaultValue={selectedLine} onValueChange={setSelectedLine} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="Line 1">Line 1</TabsTrigger>
                <TabsTrigger value="Line 2">Line 2</TabsTrigger>
                <TabsTrigger value="Line 3">Line 3</TabsTrigger>
                <TabsTrigger value="Line 4">Line 4</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs
              defaultValue={selectedDay}
              onValueChange={(value) => setSelectedDay(value as "weekday" | "Saturday")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekday">Weekday</TabsTrigger>
                <TabsTrigger value="Saturday">Saturday</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {Object.keys(lineData)
                .sort()
                .map((hour) => (
                  <div key={hour} className="animate-fade-in">
                    <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">
                      {Number.parseInt(hour) > 12 ? Number.parseInt(hour) - 12 : hour}:00{" "}
                      {Number.parseInt(hour) >= 12 ? "PM" : "AM"}
                    </h3>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                      {lineData[hour].map((minute, index) => (
                        <div
                          key={`${hour}-${minute}-${index}`}
                          className="flex items-center justify-center p-2 transition-all duration-300 bg-white border rounded-md shadow-sm dark:bg-gray-800 border-pink-100 dark:border-pink-900 hover:border-pink-300 dark:hover:border-pink-700"
                        >
                          <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                            {formatAMPM(Number.parseInt(hour), Number.parseInt(minute.trim()))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-pink-500 hover:bg-pink-600">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
