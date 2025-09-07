"use client";

import {
	endOfMonth,
	endOfYear,
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
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog";

export default function DateRangePicker({
	value,
	onChange,
}: {
	value: DateRange | undefined;
	onChange: (range: DateRange) => void;
}) {
	const today = new Date();
	const yesterday = {
		from: subDays(today, 1),
		to: subDays(today, 1),
	};
	const last7Days = {
		from: subDays(today, 6),
		to: today,
	};
	const last30Days = {
		from: subDays(today, 29),
		to: today,
	};
	const monthToDate = {
		from: startOfMonth(today),
		to: today,
	};
	const lastMonth = {
		from: startOfMonth(subMonths(today, 1)),
		to: endOfMonth(subMonths(today, 1)),
	};
	const yearToDate = {
		from: startOfYear(today),
		to: today,
	};
	const lastYear = {
		from: startOfYear(subYears(today, 1)),
		to: endOfYear(subYears(today, 1)),
	};

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
				<Button variant="outline">
					{value?.from && value?.to
						? `${value.from.toLocaleDateString()} - ${value.to.toLocaleDateString()}`
						: "Select Date Range"}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Select Date Range</DialogTitle>
				<div className="rounded-md border">
					<div className="flex max-sm:flex-col">
						<div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
							<div className="h-full sm:border-e">
								<div className="flex flex-col px-2">
									<Button
										variant="ghost"
										size="sm"
										className="w-full justify-start"
										onClick={() => {
											const todayRange = { from: today, to: today };
											handleDateChange(todayRange);
											setMonth(today);
										}}
									>
										Today
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="w-full justify-start"
										onClick={() => {
											handleDateChange(yesterday);
											setMonth(yesterday.to);
										}}
									>
										Yesterday
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="w-full justify-start"
										onClick={() => {
											handleDateChange(last7Days);
											setMonth(last7Days.to);
										}}
									>
										Last 7 days
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="w-full justify-start"
										onClick={() => {
											handleDateChange(last30Days);
											setMonth(last30Days.to);
										}}
									>
										Last 30 days
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="w-full justify-start"
										onClick={() => {
											handleDateChange(monthToDate);
											setMonth(monthToDate.to);
										}}
									>
										Month to date
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="w-full justify-start"
										onClick={() => {
											handleDateChange(lastMonth);
											setMonth(lastMonth.to);
										}}
									>
										Last month
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="w-full justify-start"
										onClick={() => {
											handleDateChange(yearToDate);
											setMonth(yearToDate.to);
										}}
									>
										Year to date
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="w-full justify-start"
										onClick={() => {
											handleDateChange(lastYear);
											setMonth(lastYear.to);
										}}
									>
										Last year
									</Button>
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
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
