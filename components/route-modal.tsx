"use client";

import { useState, useEffect } from "react";
import { Bus, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { busRoutes } from "@/lib/bus-routes";
import { formatTime, getMinutesDifference } from "@/lib/date-utils";
import Link from "next/link";

interface RouteModalProps {
  lineNumber: number;
  isOpen: boolean;
  onClose: () => void;
  dayType: "weekday" | "Saturday";
}

interface NextBusTime {
  time: Date;
  minutesUntil: number;
}

export function RouteModal({
  lineNumber,
  isOpen,
  onClose,
  dayType,
}: RouteModalProps) {
  const [nextBusTimes, setNextBusTimes] = useState<NextBusTime[]>([]);
  const [loading, setLoading] = useState(true);

  const lineName = `Line ${lineNumber}`;
  const routeInfo = busRoutes[lineName as keyof typeof busRoutes];

  useEffect(() => {
    const fetchNextBusTimes = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        const response = await fetch("/timetable.json");
        const data = await response.json();

        const lineData = data[dayType][lineName];
        if (!lineData) {
          setLoading(false);
          return;
        }

        const now = new Date();
        const currentHour = now.getHours().toString();
        const currentMinute = now.getMinutes();

        const times: NextBusTime[] = [];

        // Helper function to add a bus time
        const addBusTime = (hour: number, minute: number) => {
          const busTime = new Date(now);
          busTime.setHours(hour);
          busTime.setMinutes(minute);
          busTime.setSeconds(0);

          // Only add if it's in the future
          if (busTime > now) {
            times.push({
              time: busTime,
              minutesUntil: getMinutesDifference(now, busTime),
            });
          }
        };

        // Check current hour
        if (lineData[currentHour]) {
          for (const minute of lineData[currentHour]) {
            const minuteValue = Number.parseInt(minute.trim());
            if (minuteValue > currentMinute) {
              addBusTime(Number.parseInt(currentHour), minuteValue);
            }
          }
        }

        // Check future hours
        const hours = Object.keys(lineData)
          .map((h) => Number.parseInt(h))
          .filter((h) => h > Number.parseInt(currentHour))
          .sort((a, b) => a - b);

        for (const hour of hours) {
          for (const minute of lineData[hour.toString()]) {
            addBusTime(hour, Number.parseInt(minute.trim()));
            if (times.length >= 3) break;
          }
          if (times.length >= 3) break;
        }

        setNextBusTimes(times.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch next bus times:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextBusTimes();
  }, [isOpen, lineName, dayType]);

  if (!routeInfo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <div
              className="flex items-center justify-center w-8 h-8 mr-2 text-white rounded-full"
              style={{ backgroundColor: routeInfo.color }}
            >
              <Bus className="w-5 h-5" />
            </div>
            {lineName} Information
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">ROUTE DESCRIPTION</h3>
          <p className="text-gray-700 dark:text-gray-300">{routeInfo.description}</p> */}

          {/* <h3 className="mt-4 mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            STOPS
          </h3>
          <div className="space-y-2">
            {routeInfo.stops.map((stop, index) => (
              <div key={stop.id} className="flex items-start">
                <MapPin className="w-4 h-4 mt-0.5 mr-2 text-pink-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {stop.name} {index < routeInfo.stops.length - 1 && "→"}
                </span>
              </div>
            ))}
          </div> */}

          <Separator className="my-4" />

          <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            NEXT DEPARTURES
          </h3>
          {loading ? (
            <div className="text-center py-2">Loading...</div>
          ) : nextBusTimes.length > 0 ? (
            <div className="space-y-2">
              {nextBusTimes.map((busTime, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                >
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-pink-500" />
                    <span>{formatTime(busTime.time)}</span>
                  </div>
                  <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                    in {busTime.minutesUntil} min
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2 text-center bg-gray-50 dark:bg-gray-800 rounded-md">
              No more buses today
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-1/2">
            Close
          </Button>
          <Link href={`/line/${lineNumber}`} className="sm:w-1/2 w-full">
            <Button className="w-full bg-pink-500 hover:bg-pink-600">
              View Full Schedule
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
