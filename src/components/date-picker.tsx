import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, type Dispatch } from "react";
import { formatTanggal } from "@/lib/utils";

type DatePickerProps = {
  value?: Date;
  onChange?: Dispatch<Date | undefined>;
  disabled?: boolean;
};

export function DatePicker({
  value,
  onChange,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {value ? formatTanggal(value.toISOString()) : "Pilih tanggal"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            disabled={disabled}
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
