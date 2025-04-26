
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DayPickerSingleProps, DayPickerRangeProps, DayPickerMultipleProps } from "react-day-picker"

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | { from: Date, to?: Date }
  className?: string
  placeholder?: string
  id?: string
  required?: boolean
  defaultMonth?: Date
}

export function DatePicker({
  date,
  onSelect,
  mode = "single",
  selected,
  className,
  placeholder = "Select date",
  id,
  required,
  defaultMonth
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {mode === "single" && (
          <Calendar
            mode="single"
            selected={selected as Date}
            onSelect={onSelect as DayPickerSingleProps['onSelect']}
            initialFocus
            defaultMonth={defaultMonth}
            className="p-3 pointer-events-auto"
          />
        )}
        {mode === "range" && (
          <Calendar
            mode="range"
            selected={selected as { from: Date, to?: Date }}
            onSelect={(range) => {
              // Type-safe handling for range mode
              if (onSelect && range?.from) {
                onSelect(range.from);
              }
            }}
            initialFocus
            defaultMonth={defaultMonth}
            className="p-3 pointer-events-auto"
          />
        )}
        {mode === "multiple" && (
          <Calendar
            mode="multiple"
            selected={selected as Date[]}
            onSelect={(days) => {
              // Type-safe handling for multiple mode
              if (onSelect && days && days.length > 0) {
                onSelect(days[days.length - 1]);
              }
            }}
            initialFocus
            defaultMonth={defaultMonth}
            className="p-3 pointer-events-auto"
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
