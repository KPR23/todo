"use client";

import Stats from "@/app/(protected)/time-tracking/_components/stats";
import TimeTrackingTable from "@/app/(protected)/time-tracking/_components/time-tracking-table";
import DateRangePicker from "@/components/ui/date-range-picker";
import { getSessionsForDateRange } from "@/lib/helper-functions";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { api } from "../../../../convex/_generated/api";

export default function TimeTrackingPage() {
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: undefined,
		to: undefined,
	});

	const rawSessions = useQuery(api.workSessions.getSessions);
	const companies = useQuery(api.company.getCompanies) || [];

	const filteredSessions = useMemo(() => {
		if (!rawSessions) return [];

		if (!dateRange?.from || !dateRange?.to) {
			return rawSessions;
		}

		return getSessionsForDateRange(rawSessions, dateRange.from, dateRange.to);
	}, [rawSessions, dateRange]);

	return (
		<main className="flex flex-col p-6 grow">
			<div className="flex flex-col gap-4 mx-auto w-full max-w-6xl">
				<div className="flex justify-between items-center">
					<h1 className="text-lg md:text-2xl font-semibold">Time Tracking</h1>
					<div className="flex gap-2">
						<DateRangePicker value={dateRange} onChange={setDateRange} />
					</div>
				</div>
				<hr className="my-2 w-full border-t border-zinc-950/10 dark:border-white/10" />
				<div className="flex flex-col gap-6">
					<Stats
						rawSessions={rawSessions || []}
						companies={companies}
						dateRange={dateRange}
					/>
					<TimeTrackingTable
						rawSessions={filteredSessions}
						companies={companies}
					/>
				</div>
			</div>
		</main>
	);
}
