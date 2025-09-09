"use client";

import {
	endOfMonth,
	endOfYear,
	format,
	isSameDay,
	isSameMonth,
	isSameYear,
	isToday,
	isYesterday,
	startOfMonth,
	startOfYear,
	subDays,
	subMonths,
	subYears,
} from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "./dialog";

type PresetRange = {
	from: Date;
	to: Date;
	label: string;
};

function dateRangeEquals(a: DateRange | undefined, b: DateRange): boolean {
	return !!a && isSameDay(a.from!, b.from!) && isSameDay(a.to!, b.to!);
}

function getPresetRanges(today: Date): PresetRange[] {
	return [
		{ from: today, to: today, label: "Today" },
		{ from: subDays(today, 1), to: subDays(today, 1), label: "Yesterday" },
		{ from: subDays(today, 6), to: today, label: "Last 7 days" },
		{ from: subDays(today, 29), to: today, label: "Last 30 days" },
		{ from: startOfMonth(today), to: today, label: "Month to date" },
		{
			from: startOfMonth(subMonths(today, 1)),
			to: endOfMonth(subMonths(today, 1)),
			label: "Last month",
		},
		{ from: startOfYear(today), to: today, label: "Year to date" },
		{
			from: startOfYear(subYears(today, 1)),
			to: endOfYear(subYears(today, 1)),
			label: "Last year",
		},
	];
}

function formatDate(date: Date) {
	return format(date, "d MMM yyyy");
}

function getDateLabel(range: DateRange | undefined, today: Date): string {
	if (!range?.from || !range?.to) return "Select date range";

	const matched = getPresetRanges(today).find((preset) =>
		dateRangeEquals(range, preset)
	);
	if (matched) return matched.label;

	if (isSameDay(range.from, range.to)) return formatDate(range.from);

	if (isSameMonth(range.from, range.to) && isSameYear(range.from, range.to)) {
		return `${format(range.from, "d")} – ${formatDate(range.to)}`;
	}

	return `${formatDate(range.from)} – ${formatDate(range.to)}`;
}

export default function DateRangePicker({
	value,
	onChange,
}: {
	value: DateRange | undefined;
	onChange: (range: DateRange) => void;
}) {
	const today = new Date();
	const presetRanges = getPresetRanges(today);

	const [month, setMonth] = useState(today);
	const [localDate, setLocalDate] = useState<DateRange | undefined>(value);

	useEffect(() => {
		setLocalDate(value);
	}, [value]);

	const handleDateChange = (newDate: DateRange) => {
		setLocalDate(newDate);
		onChange(newDate);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					aria-label={getDateLabel(value, today)}
					className="min-w-[180px] text-left"
				>
					{getDateLabel(value, today)}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Select Date Range</DialogTitle>
				<DialogDescription>
					Choose a date range for your selection.
				</DialogDescription>
				<div className="rounded-md border">
					<div className="flex max-sm:flex-col">
						<div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-40">
							<div className="h-full sm:border-e">
								<div className="flex flex-col px-2 gap-1">
									{presetRanges.map((preset) => (
										<Button
											key={preset.label}
											variant="ghost"
											size="sm"
											className={`w-full justify-start ${
												dateRangeEquals(localDate, preset) &&
												"bg-muted cursor-default"
											}`}
											onClick={() => {
												handleDateChange({
													from: preset.from,
													to: preset.to,
												});
												setMonth(preset.to);
											}}
											disabled={dateRangeEquals(localDate, preset)}
										>
											{preset.label}
										</Button>
									))}
								</div>
							</div>
						</div>
						<Calendar
							mode="range"
							selected={localDate}
							onSelect={(newDate) => {
								if (newDate) {
									handleDateChange(newDate);
								}
							}}
							month={month}
							onMonthChange={setMonth}
							className="p-2"
							disabled={[{ after: today }]}
							numberOfMonths={1}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
