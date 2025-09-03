import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatDuration, formatPLN, totalMinutes } from "@/lib/format-helpers";
import { faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Doc } from "../../../convex/_generated/dataModel";

type StatsProps = {
	rawSessions: Doc<"workSessions">[];
	companies: Doc<"company">[];
};

export default function Stats({ rawSessions, companies }: StatsProps) {
	const now = new Date();
	const currentMonth = now.getMonth();
	const currentYear = now.getFullYear();

	const monthSessions = rawSessions.filter((session) => {
		const start = new Date(session.startTime);
		return (
			start.getMonth() === currentMonth && start.getFullYear() === currentYear
		);
	});

	const lastMonthSessions = rawSessions.filter((session) => {
		const start = new Date(session.startTime);
		return (
			start.getMonth() === currentMonth - 1 &&
			start.getFullYear() === currentYear
		);
	});

	const companiesWorkedThisMonthDisplay = () => {
		const companiesWorkedThisMonth = new Set(
			monthSessions.map((s) => s.companyId)
		).size;
		if (companiesWorkedThisMonth === 0) {
			return "No companies worked with this month";
		}
		if (companiesWorkedThisMonth === 1) {
			return "1 company";
		}
		return `${companiesWorkedThisMonth} companies`;
	};

	const totalMinutesThisMonth = totalMinutes(monthSessions);
	const totalTime = formatDuration(totalMinutesThisMonth);

	const totalMinutesLastMonth = totalMinutes(lastMonthSessions);
	const totalTimeLastMonth = formatDuration(totalMinutesLastMonth);
	console.log(totalTimeLastMonth);

	const hourTrend = totalMinutesThisMonth - totalMinutesLastMonth;
	console.log("hour" + hourTrend);

	const totalEarnings = monthSessions.reduce((sum, session) => {
		const start = new Date(session.startTime);
		const end = new Date(session.endTime);
		const durationMs = end.getTime() - start.getTime();
		const hours = durationMs / 1000 / 60 / 60;
		const hourlyRate =
			companies.find((c) => c._id === session.companyId)?.rate || 0;
		return sum + hours * hourlyRate;
	}, 0);

	return (
		<div className="grid grid-cols-4 gap-4">
			{/* Total hours this month */}
			<Card>
				<CardHeader>
					<CardTitle>Total hours this month</CardTitle>
					<CardDescription>
						{now.toLocaleString("en-GB", { month: "long", year: "numeric" })}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-between items-center">
					<p className="text-2xl font-bold">{totalTime}</p>
					<FontAwesomeIcon icon={faArrowTrendDown} className="size-4" />
				</CardContent>
			</Card>
			{/* Total earnings this month */}
			<Card>
				<CardHeader>
					<CardTitle>Total earnings this month</CardTitle>
					<CardDescription>
						Across {companiesWorkedThisMonthDisplay()}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">{formatPLN(totalEarnings)}</p>
				</CardContent>
			</Card>
		</div>
	);
}
