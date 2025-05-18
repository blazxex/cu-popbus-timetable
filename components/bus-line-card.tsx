"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Bus, Clock } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatTime, getMinutesDifference } from "@/lib/date-utils"
import { busRoutes } from "@/lib/bus-routes"
import { RouteModal } from "@/components/route-modal"

interface BusLineCardProps {
  lineNumber: number
  dayType: "weekday" | "Saturday"
}

export function BusLineCard({ lineNumber, dayType }: BusLineCardProps) {
  const [loading, setLoading] = useState(true)
  const [nextBusTime, setNextBusTime] = useState<Date | null>(null)
  const [minutesUntil, setMinutesUntil] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const lineName = `Line ${lineNumber}`
  const routeInfo = busRoutes[lineName as keyof typeof busRoutes]

  useEffect(() => {
    const fetchNextBusTime = async () => {
      try {
        const response = await fetch("/timetable.json")
        const data = await response.json()

        const lineData = data[dayType][lineName]
        if (!lineData) {
          setLoading(false)
          return
        }

        const now = new Date()
        const currentHour = now.getHours().toString()
        const currentMinute = now.getMinutes()

        let foundNextBus = false
        let nextBus: Date | null = null

        // Check current hour first
        if (lineData[currentHour]) {
          for (const minute of lineData[currentHour]) {
            const minuteValue = Number.parseInt(minute.trim())
            if (minuteValue > currentMinute) {
              nextBus = new Date(now)
              nextBus.setHours(Number.parseInt(currentHour))
              nextBus.setMinutes(minuteValue)
              nextBus.setSeconds(0)
              foundNextBus = true
              break
            }
          }
        }

        // If not found in current hour, check future hours
        if (!foundNextBus) {
          const hours = Object.keys(lineData)
            .map((h) => Number.parseInt(h))
            .filter((h) => h > Number.parseInt(currentHour))
            .sort((a, b) => a - b)

          for (const hour of hours) {
            if (lineData[hour.toString()] && lineData[hour.toString()].length > 0) {
              const firstMinute = Number.parseInt(lineData[hour.toString()][0].trim())
              nextBus = new Date(now)
              nextBus.setHours(hour)
              nextBus.setMinutes(firstMinute)
              nextBus.setSeconds(0)
              foundNextBus = true
              break
            }
          }
        }

        setNextBusTime(nextBus)
        if (nextBus) {
          setMinutesUntil(getMinutesDifference(now, nextBus))
        }
      } catch (error) {
        console.error("Failed to fetch next bus time:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNextBusTime()

    // Refresh every minute
    const intervalId = setInterval(() => {
      setRefreshKey((prev) => prev + 1)
    }, 60000)

    return () => clearInterval(intervalId)
  }, [lineName, dayType, refreshKey])

  if (loading) {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-2">
          <Skeleton className="h-7 w-24" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    )
  }

  return (
    <>
      <Card
        className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <CardHeader className="pb-2 text-white" style={{ backgroundColor: routeInfo.color }}>
          <CardTitle className="flex items-center">
            <Bus className="w-5 h-5 mr-2" />
            {lineName}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2 pt-4">
          {nextBusTime ? (
            <>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                <span>Next Bus: {formatTime(nextBusTime)}</span>
              </div>
              <div className="mt-2 text-lg font-semibold" style={{ color: routeInfo.color }}>
                Departs in {minutesUntil} min
              </div>
            </>
          ) : (
            <div className="py-2 text-gray-600 dark:text-gray-400">No more buses today</div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full transition-colors"
            style={
              {
                backgroundColor: routeInfo.color,
                "--hover-color": `${routeInfo.color}dd`,
              } as React.CSSProperties
            }
            onClick={(e) => {
              e.stopPropagation()
              setIsModalOpen(true)
            }}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>

      <RouteModal
        lineNumber={lineNumber}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayType={dayType}
      />
    </>
  )
}
