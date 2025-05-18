"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { getCurrentDay } from "@/lib/date-utils"

interface DaySelectorProps {
  onDayChange: (day: "weekday" | "Saturday") => void
}

export function DaySelector({ onDayChange }: DaySelectorProps) {
  const [selectedDay, setSelectedDay] = useState<"weekday" | "Saturday">(
    getCurrentDay() === "Saturday" ? "Saturday" : "weekday",
  )

  useEffect(() => {
    onDayChange(selectedDay)
  }, [selectedDay, onDayChange])

  return (
    <div className="flex items-center justify-center gap-2 p-2 mt-6 mb-4 bg-white rounded-lg shadow-sm dark:bg-gray-800 animate-fade-in-delay">
      <Calendar className="w-5 h-5 text-pink-500" />
      <Button
        variant={selectedDay === "weekday" ? "default" : "outline"}
        className={selectedDay === "weekday" ? "bg-pink-500 hover:bg-pink-600" : ""}
        onClick={() => setSelectedDay("weekday")}
      >
        Weekday
      </Button>
      <Button
        variant={selectedDay === "Saturday" ? "default" : "outline"}
        className={selectedDay === "Saturday" ? "bg-pink-500 hover:bg-pink-600" : ""}
        onClick={() => setSelectedDay("Saturday")}
      >
        Saturday
      </Button>
    </div>
  )
}
