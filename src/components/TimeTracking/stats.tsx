import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
	formatDuration,
	formatPLN,
	formatTrend,
	totalEarnings,
	totalMinutes,
	workDaysStreakFormat,
} from "@/lib/format-helpers";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Doc } from "../../../convex/_generated/dataModel";
import { Badge } from "../ui/badge";

type StatsProps = {
	rawSessions: Doc<"workSessions">[];
	companies: Doc<"company">[];
};

export default function Stats({ rawSessions, companies }: StatsProps) {
	const now = new Date();
	const lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() - 1);

	const getSessionsForMonth = (
		sessions: Doc<"workSessions">[],
		monthOffset: number = 0
	) => {
		const targetDate = new Date();
		targetDate.setMonth(targetDate.getMonth() + monthOffset);

		return sessions.filter((session) => {
			const start = new Date(session.startTime);
			return (
				start.getMonth() === targetDate.getMonth() &&
				start.getFullYear() === targetDate.getFullYear()
			);
		});
	};

	const monthSessions = getSessionsForMonth(rawSessions, 0);
	const lastMonthSessions = getSessionsForMonth(rawSessions, -1);
	const companiesWorkedThisMonthDisplay = () => {
		const companiesWorkedThisMonth = new Set(
			monthSessions.map((s) => s.companyId)
		).size;
		if (companiesWorkedThisMonth === 0) {
			return "0 companies";
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

	const hourTrend = totalMinutesThisMonth - totalMinutesLastMonth;
	const formattedHourTrend = formatTrend(hourTrend);

	const totalEarningsThisMonth = totalEarnings(monthSessions, companies);
	const totalEarningsLastMonth = totalEarnings(lastMonthSessions, companies);
	const salaryTrend = totalEarningsThisMonth - totalEarningsLastMonth;

	const getLongestDayInfo = (sessions: Doc<"workSessions">[]) => {
		const dailyTotals = new Map<string, number>();

		sessions.forEach((session) => {
			const date = new Date(session.startTime).toDateString();
			const minutes = totalMinutes([session]);
			dailyTotals.set(date, (dailyTotals.get(date) || 0) + minutes);
		});

		let longestDay = 0;
		let longestDayDate = "";

		for (const [date, minutes] of dailyTotals) {
			if (minutes > longestDay) {
				longestDay = minutes;
				longestDayDate = date;
			}
		}

		return { longestDay, longestDayDate };
	};

	const { longestDay, longestDayDate } = getLongestDayInfo(monthSessions);
	const { longestDay: longestDayLastMonth } =
		getLongestDayInfo(lastMonthSessions);

	const longestDayFormatted = formatDuration(longestDay);
	const longestDayDateFormatted = longestDayDate
		? new Date(longestDayDate).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
		  })
		: "";

	const longestDayTrend = longestDay - longestDayLastMonth;
	const longestDayTrendFormatted = formatTrend(longestDayTrend);

	const calculateWorkStreak = (sessions: Doc<"workSessions">[]) => {
		if (sessions.length === 0) return 0;

		const sortedSessions = sessions.sort(
			(a, b) =>
				new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
		);

		const workDays = Array.from(
			new Set(
				sortedSessions.map(
					(session) => new Date(session.startTime).toISOString().split("T")[0]
				)
			)
		)
			.sort()
			.reverse();

		if (workDays.length === 0) return 0;
		let streak = 0;
		const today = new Date();

		for (let i = 0; i < workDays.length; i++) {
			const workDay = new Date(workDays[i]);
			const expectedDay = new Date(today);
			expectedDay.setDate(today.getDate() - i);

			if (workDay.toDateString() === expectedDay.toDateString()) {
				streak++;
			} else {
				break;
			}
		}

		return streak;
	};

	const workStreak = calculateWorkStreak(monthSessions);
	const workStreakFormatted = workDaysStreakFormat(
		calculateWorkStreak(monthSessions)
	);
	const lastMonthWorkStreak = calculateWorkStreak(lastMonthSessions);

	const workStreakTrend = workStreak - lastMonthWorkStreak;
	console.log(workStreakTrend);
	return (
		<div className="grid grid-cols-4 gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Salary</CardTitle>
					<CardDescription>
						Across {companiesWorkedThisMonthDisplay()}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-between items-center">
					<p className="text-2xl font-bold">
						{formatPLN(totalEarningsThisMonth)}
					</p>
					<Badge variant={"outline"}>
						{salaryTrend > 0 ? (
							<div className="text-chart-2">
								+{formatPLN(salaryTrend)}{" "}
								<FontAwesomeIcon
									icon={faArrowUp}
									className="size-4 rotate-[45deg]"
								/>
							</div>
						) : salaryTrend < 0 ? (
							<div className="text-chart-5">
								{formatPLN(salaryTrend)}{" "}
								<FontAwesomeIcon
									icon={faArrowUp}
									className="size-4 rotate-[135deg]"
								/>
							</div>
						) : (
							<div className="text-chart-3">
								{formatPLN(salaryTrend)}{" "}
								<FontAwesomeIcon
									icon={faArrowUp}
									className="size-4 rotate-[90deg]"
								/>
							</div>
						)}
					</Badge>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Total hours</CardTitle>
					<CardDescription>
						{now.toLocaleString("en-GB", { month: "long", year: "numeric" })}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-between items-center">
					<p className="text-2xl font-bold">{totalTime}</p>
					<HoverCard>
						<HoverCardTrigger asChild>
							<Badge variant={"outline"}>
								{hourTrend > 0 ? (
									<div className="text-chart-2">
										{formattedHourTrend}{" "}
										<FontAwesomeIcon
											icon={faArrowUp}
											className="size-4 rotate-[45deg]"
										/>
									</div>
								) : hourTrend < 0 ? (
									<div className="text-chart-5">
										{formattedHourTrend}{" "}
										<FontAwesomeIcon
											icon={faArrowUp}
											className="size-4 rotate-[135deg]"
										/>
									</div>
								) : (
									<div className="text-chart-3">
										0h{" "}
										<FontAwesomeIcon
											icon={faArrowUp}
											className="size-4 rotate-[90deg]"
										/>
									</div>
								)}
							</Badge>
						</HoverCardTrigger>
						<HoverCardContent className="w-80">
							<div className="flex justify-between gap-4">
								<div className="space-y-1">
									<h4 className="text-sm font-semibold">@nextjs</h4>
									<p className="text-sm">
										The React Framework – created and maintained by @vercel.
									</p>
									<div className="text-muted-foreground text-xs">
										Joined December 2021
									</div>
								</div>
							</div>
						</HoverCardContent>
					</HoverCard>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Longest day</CardTitle>
					<CardDescription>
						Most hours worked on {longestDayDateFormatted}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-between items-center">
					<p className="text-2xl font-bold">{longestDayFormatted}</p>
					<Badge variant={"outline"}>
						{longestDayTrend > 0 ? (
							<div className="text-chart-2">
								{longestDayTrendFormatted}{" "}
								<FontAwesomeIcon
									icon={faArrowUp}
									className="size-4 rotate-[45deg]"
								/>
							</div>
						) : longestDayTrend < 0 ? (
							<div className="text-chart-5">
								{longestDayTrendFormatted}{" "}
								<FontAwesomeIcon
									icon={faArrowUp}
									className="size-4 rotate-[135deg]"
								/>
							</div>
						) : (
							<div className="text-chart-3">
								{longestDayTrendFormatted}{" "}
								<FontAwesomeIcon
									icon={faArrowUp}
									className="size-4 rotate-[90deg]"
								/>
							</div>
						)}
					</Badge>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Work streak</CardTitle>
					<CardDescription>Consecutive work days</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-2xl font-bold">{workStreakFormatted}</p>
				</CardContent>
			</Card>
		</div>
	);
}
