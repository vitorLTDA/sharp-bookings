import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { WeeklyAvailability } from '@/lib/mockApi';

interface WeeklyCalendarProps {
  availability: WeeklyAvailability;
  onAvailabilityChange: (availability: WeeklyAvailability) => void;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 9 }, (_, i) => `${(9 + i).toString().padStart(2, '0')}:00`);

export function WeeklyCalendar({ availability, onAvailabilityChange }: WeeklyCalendarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<boolean>(false);

  const toggleSlot = (day: string, hour: string) => {
    const newAvailability = { ...availability };
    if (!newAvailability[day]) {
      newAvailability[day] = {};
    }
    newAvailability[day][hour] = !newAvailability[day]?.[hour];
    onAvailabilityChange(newAvailability);
  };

  const handleMouseDown = (day: string, hour: string) => {
    setIsDragging(true);
    const currentValue = availability[day]?.[hour] ?? false;
    setDragValue(!currentValue);
    toggleSlot(day, hour);
  };

  const handleMouseEnter = (day: string, hour: string) => {
    if (isDragging) {
      const newAvailability = { ...availability };
      if (!newAvailability[day]) {
        newAvailability[day] = {};
      }
      newAvailability[day][hour] = dragValue;
      onAvailabilityChange(newAvailability);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const setAllDay = (day: string, value: boolean) => {
    const newAvailability = { ...availability };
    newAvailability[day] = {};
    HOURS.forEach((hour) => {
      newAvailability[day][hour] = value;
    });
    onAvailabilityChange(newAvailability);
  };

  return (
    <div className="overflow-x-auto" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid grid-cols-8 gap-1 mb-2">
          <div className="p-2 text-sm font-medium text-muted-foreground">Time</div>
          {DAY_LABELS.map((day, i) => (
            <div key={day} className="p-2 text-center">
              <span className="text-sm font-medium">{day}</span>
              <div className="flex gap-1 mt-1 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1 text-xs"
                  onClick={() => setAllDay(DAYS[i], true)}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1 text-xs"
                  onClick={() => setAllDay(DAYS[i], false)}
                >
                  None
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Time slots grid */}
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 gap-1 mb-1">
            <div className="p-2 text-sm text-muted-foreground flex items-center">
              {hour}
            </div>
            {DAYS.map((day) => {
              const isAvailable = availability[day]?.[hour] ?? false;
              return (
                <button
                  key={`${day}-${hour}`}
                  className={cn(
                    'h-10 rounded-md border transition-colors cursor-pointer select-none',
                    isAvailable
                      ? 'bg-success/20 border-success/30 hover:bg-success/30'
                      : 'bg-muted/50 border-border hover:bg-muted'
                  )}
                  onMouseDown={() => handleMouseDown(day, hour)}
                  onMouseEnter={() => handleMouseEnter(day, hour)}
                />
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success/20 border border-success/30" />
            <span className="text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted/50 border border-border" />
            <span className="text-muted-foreground">Blocked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
