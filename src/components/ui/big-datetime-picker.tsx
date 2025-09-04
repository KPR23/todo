"use client";

import { ClockIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BigDateTimePickerProps {
	value?: Date;
	onChange?: (date: Date) => void;
}

export default function BigDateTimePicker({
	value,
	onChange,
}: BigDateTimePickerProps) {
	const id = useId();
	const [date, setDate] = useState<Date | undefined>(value || new Date());
	const [time, setTime] = useState<string>(() => {
		if (value) {
			const hours = value.getHours().toString().padStart(2, "0");
			const minutes = value.getMinutes().toString().padStart(2, "0");
			return `${hours}:${minutes}`;
		}
		return "12:00";
	});

	// Sync with external value changes
	useEffect(() => {
		if (value) {
			setDate(value);
			const hours = value.getHours().toString().padStart(2, "0");
			const minutes = value.getMinutes().toString().padStart(2, "0");
			setTime(`${hours}:${minutes}`);
		}
	}, [value]);

	const handleDateChange = (newDate: Date | undefined) => {
		if (!newDate) return;

		setDate(newDate);

		// Combine date with current time
		const [hours, minutes] = time.split(":").map(Number);
		const combinedDateTime = new Date(newDate);
		combinedDateTime.setHours(hours || 0, minutes || 0, 0, 0);

		onChange?.(combinedDateTime);
	};

	const handleTimeChange = (newTime: string) => {
		setTime(newTime);

		if (!date) return;

		// Combine current date with new time
		const [hours, minutes] = newTime.split(":").map(Number);
		const combinedDateTime = new Date(date);
		combinedDateTime.setHours(hours || 0, minutes || 0, 0, 0);

		onChange?.(combinedDateTime);
	};

	return (
		<div className="w-fit">
			<div className="rounded-md border">
				<Calendar
					mode="single"
					className="p-2"
					selected={date}
					onSelect={handleDateChange}
				/>
				<div className="border-t p-3">
					<div className="flex items-center gap-3">
						<Label htmlFor={id} className="text-xs">
							Enter time
						</Label>
						<div className="relative grow">
							<Input
								id={id}
								type="time"
								step="60"
								value={time}
								onChange={(e) => handleTimeChange(e.target.value)}
								className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
							/>
							<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
								<ClockIcon size={16} aria-hidden="true" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
