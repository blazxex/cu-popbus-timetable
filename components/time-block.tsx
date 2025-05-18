import { formatAMPM } from "@/lib/date-utils"

interface TimeBlockProps {
  hour: number
  minute: number
}

export function TimeBlock({ hour, minute }: TimeBlockProps) {
  const timeString = formatAMPM(hour, minute)

  return (
    <div className="flex items-center justify-center p-3 transition-all duration-300 bg-white border rounded-lg shadow-sm dark:bg-gray-800 border-pink-100 dark:border-pink-900 hover:border-pink-300 dark:hover:border-pink-700 hover:shadow-md animate-fade-in">
      <span className="text-lg font-medium text-pink-600 dark:text-pink-400">{timeString}</span>
    </div>
  )
}
