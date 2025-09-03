"use client";

import Stats from "@/components/TimeTracking/stats";
import TimeTrackingTable from "@/components/TimeTracking/time-tracking-table";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { FilterIcon, PlusIcon } from "lucide-react";
import { api } from "../../../../convex/_generated/api";

export default function TimeTrackingPage() {
	const rawSessions = useQuery(api.workSessions.getSessions) || [];
	const companies = useQuery(api.company.getCompany) || [];

	return (
		<main className="flex flex-col p-6 grow">
			<div className="flex flex-col gap-4 mx-auto w-full max-w-6xl">
				<div className="flex justify-between items-center">
					<h1 className="text-lg md:text-2xl font-semibold">Time Tracking</h1>
					<div className="flex gap-2">
						<Button>
							<PlusIcon className="w-4 h-4" />
							Add Task
						</Button>
						<Button variant="outline">
							<FilterIcon className="w-4 h-4" />
							Filters
						</Button>
					</div>
				</div>
				<hr className="my-2 w-full border-t border-zinc-950/10 dark:border-white/10" />
				<div className="flex flex-col gap-6">
					<Stats rawSessions={rawSessions} companies={companies} />
					<TimeTrackingTable rawSessions={rawSessions} companies={companies} />
				</div>
			</div>
		</main>
	);
}
