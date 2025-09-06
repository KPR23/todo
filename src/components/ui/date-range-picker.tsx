"use client";

import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import RangeCalendar from "./calendar-rac";

export default function DateRangePicker() {
	const [range, setRange] = useState<DateRange | undefined>(undefined);

	return (
		<div className="w-full max-w-xs space-y-2 items-end flex">
			<Label htmlFor="dates" className="px-1">
				Range date picker
			</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						id="dates"
						className="max-w-fit justify-between font-normal"
					>
						{range?.from && range?.to
							? `${range.from.toLocaleDateString(
									"en-GB"
							  )} - ${range.to.toLocaleDateString("en-GB")}`
							: "Pick a date"}
						<ChevronDownIcon />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto overflow-hidden p-0 pr-4" align="end">
					<RangeCalendar />
				</PopoverContent>
			</Popover>
		</div>
	);
}
