"use client";

import { useState } from "react";
import { BusLineCard } from "@/components/bus-line-card";
import { SundayNotice } from "@/components/sunday-notice";
import { DaySelector } from "@/components/day-selector";
import { AllTimesModal } from "@/components/all-times-modal";
import { getCurrentDay } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export default function Home() {
  const currentDay = getCurrentDay();
  const isSunday = currentDay === "Sunday";
  const [selectedDay, setSelectedDay] = useState<"weekday" | "Saturday">(
    currentDay === "Saturday" ? "Saturday" : "weekday"
  );
  const [isAllTimesModalOpen, setIsAllTimesModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-pink-950">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-center text-pink-500 md:text-4xl lg:text-5xl animate-fade-in">
          CU POP Bus Schedule
        </h1>

        <p className="mt-4 text-lg text-center text-gray-600 dark:text-gray-400 animate-fade-in-delay">
          Current day: <span className="font-semibold">{currentDay}</span>
        </p>

        {isSunday ? (
          <SundayNotice />
        ) : (
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
            {[1, 2, 3, 4].map((lineNumber) => (
              <BusLineCard
                key={lineNumber}
                lineNumber={lineNumber}
                dayType={selectedDay}
              />
            ))}
          </div>
        )}
        {
          <>
            {/* <DaySelector onDayChange={setSelectedDay} /> */}

            <div className="flex justify-center mt-4 mb-8 animate-fade-in-delay">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-950"
                onClick={() => setIsAllTimesModalOpen(true)}
              >
                <Clock className="w-4 h-4" />
                View All Timetables
              </Button>
            </div>
          </>
        }
      </div>

      <AllTimesModal
        isOpen={isAllTimesModalOpen}
        onClose={() => setIsAllTimesModalOpen(false)}
      />
    </main>
  );
}
