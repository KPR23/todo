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
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Badge } from "../../../../components/ui/badge";

type StatsProps = {
	rawSessions: Doc<"workSessions">[];
	companies: Doc<"company">[];
};

export default function Stats({ rawSessions, companies }: StatsProps) {
	const now = new Date();
	// const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

	const getSessionsForMonth = (
		sessions: Doc<"workSessions">[],
		monthOffset: number = 0
	) => {
		const targetDate = new Date(
			now.getFullYear(),
			now.getMonth() + monthOffset,
			1
		);

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

	const calculateLongestStreakInMonth = (sessions: Doc<"workSessions">[]) => {
		if (sessions.length === 0) return 0;

		const workDays = Array.from(
			new Set(
				sessions.map(
					(session) => new Date(session.startTime).toISOString().split("T")[0]
				)
			)
		).sort();

		if (workDays.length === 0) return 0;

		let maxStreak = 1;
		let currentStreak = 1;

		for (let i = 1; i < workDays.length; i++) {
			const currentDay = new Date(workDays[i]);
			const previousDay = new Date(workDays[i - 1]);

			const dayDifference = Math.floor(
				(currentDay.getTime() - previousDay.getTime()) / (1000 * 60 * 60 * 24)
			);

			if (dayDifference === 1) {
				currentStreak++;
				maxStreak = Math.max(maxStreak, currentStreak);
			} else {
				currentStreak = 1;
			}
		}

		return maxStreak;
	};

	const workStreak = calculateWorkStreak(monthSessions);
	const workStreakFormatted = workDaysStreakFormat(workStreak);
	const lastMonthLongestStreak =
		calculateLongestStreakInMonth(lastMonthSessions);

	const salaryPercentChange =
		totalEarningsLastMonth === 0
			? totalEarningsThisMonth > 0
				? 100
				: 0
			: ((totalEarningsThisMonth - totalEarningsLastMonth) /
					totalEarningsLastMonth) *
			  100;

	const hoursPercentChange =
		totalMinutesLastMonth === 0
			? totalMinutesThisMonth > 0
				? 100
				: 0
			: ((totalMinutesThisMonth - totalMinutesLastMonth) /
					totalMinutesLastMonth) *
			  100;

	const longestDayPercentChange =
		longestDayLastMonth === 0
			? longestDay > 0
				? 100
				: 0
			: ((longestDay - longestDayLastMonth) / longestDayLastMonth) * 100;

	const workStreakPercentChange =
		lastMonthLongestStreak === 0
			? workStreak > 0
				? 100
				: 0
			: ((workStreak - lastMonthLongestStreak) / lastMonthLongestStreak) * 100;

	const formatPercentage = (percent: number) => {
		if (percent === 0) return "0%";
		const sign = percent > 0 ? "+" : "";
		const formatted =
			percent % 1 === 0 ? percent.toString() : percent.toFixed(1);
		return `${sign}${formatted}%`;
	};

	const getPercentageColor = (percent: number) => {
		if (percent > 0) return "text-chart-2";
		if (percent < 0) return "text-chart-5";
		return "text-chart-3";
	};

	const getArrowRotation = (percent: number) => {
		if (percent > 0) return "rotate-[45deg]";
		if (percent < 0) return "rotate-[135deg]";
		return "rotate-[90deg]";
	};

	return (
		<div className="grid grid-cols-4 gap-4">
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
								<div className={getPercentageColor(hoursPercentChange)}>
									{formatPercentage(hoursPercentChange)}{" "}
									<FontAwesomeIcon
										icon={faArrowUp}
										className={`size-4 ${getArrowRotation(hoursPercentChange)}`}
									/>
								</div>
							</Badge>
						</HoverCardTrigger>
						<HoverCardContent className="w-80">
							<div className="space-y-2">
								<h4 className="text-sm font-semibold">Hours Comparison</h4>
								<div className="space-y-1 text-sm">
									<p>This month: {totalTime}</p>
									<p>Last month: {totalTimeLastMonth}</p>
									<p>Difference: {formattedHourTrend}</p>
								</div>
								<p className="text-xs text-muted-foreground">
									Percentage change in total working hours compared to previous
									month
								</p>
							</div>
						</HoverCardContent>
					</HoverCard>
				</CardContent>
			</Card>
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
					<HoverCard>
						<HoverCardTrigger asChild>
							<Badge variant={"outline"}>
								<div className={getPercentageColor(salaryPercentChange)}>
									{formatPercentage(salaryPercentChange)}{" "}
									<FontAwesomeIcon
										icon={faArrowUp}
										className={`size-4 ${getArrowRotation(
											salaryPercentChange
										)}`}
									/>
								</div>
							</Badge>
						</HoverCardTrigger>
						<HoverCardContent className="w-80">
							<div className="space-y-2">
								<h4 className="text-sm font-semibold">Salary Comparison</h4>
								<div className="space-y-1 text-sm">
									<p>This month: {formatPLN(totalEarningsThisMonth)}</p>
									<p>Last month: {formatPLN(totalEarningsLastMonth)}</p>
									<p>
										Difference: {salaryTrend > 0 ? "+" : ""}
										{formatPLN(salaryTrend)}
									</p>
								</div>
								<p className="text-xs text-muted-foreground">
									Percentage change compared to previous month
								</p>
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
					<HoverCard>
						<HoverCardTrigger asChild>
							<Badge variant={"outline"}>
								<div className={getPercentageColor(longestDayPercentChange)}>
									{formatPercentage(longestDayPercentChange)}{" "}
									<FontAwesomeIcon
										icon={faArrowUp}
										className={`size-4 ${getArrowRotation(
											longestDayPercentChange
										)}`}
									/>
								</div>
							</Badge>
						</HoverCardTrigger>
						<HoverCardContent className="w-80">
							<div className="space-y-2">
								<h4 className="text-sm font-semibold">
									Longest Day Comparison
								</h4>
								<div className="space-y-1 text-sm">
									<p>This month: {longestDayFormatted}</p>
									<p>Last month: {formatDuration(longestDayLastMonth)}</p>
									<p>Difference: {longestDayTrendFormatted}</p>
								</div>
								<p className="text-xs text-muted-foreground">
									Percentage change in longest working day compared to previous
									month
								</p>
							</div>
						</HoverCardContent>
					</HoverCard>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Work streak</CardTitle>
					<CardDescription>Consecutive work days</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-between items-center">
					<p className="text-2xl font-bold">{workStreakFormatted}</p>
					<HoverCard>
						<HoverCardTrigger asChild>
							<Badge variant={"outline"}>
								<div className={getPercentageColor(workStreakPercentChange)}>
									{formatPercentage(workStreakPercentChange)}{" "}
									<FontAwesomeIcon
										icon={faArrowUp}
										className={`size-4 ${getArrowRotation(
											workStreakPercentChange
										)}`}
									/>
								</div>
							</Badge>
						</HoverCardTrigger>
						<HoverCardContent className="w-80">
							<div className="space-y-2">
								<h4 className="text-sm font-semibold">
									Work Streak Comparison
								</h4>
								<div className="space-y-1 text-sm">
									<p>Current streak: {workStreakFormatted}</p>
									<p>
										{"Last month's longest: "}
										{workDaysStreakFormat(lastMonthLongestStreak)}
									</p>
									<p>
										Difference:{" "}
										{workStreak - lastMonthLongestStreak > 0 ? "+" : ""}
										{workStreak - lastMonthLongestStreak} days
									</p>
								</div>
								<p className="text-xs text-muted-foreground">
									Current streak vs longest streak from previous month
								</p>
							</div>
						</HoverCardContent>
					</HoverCard>
				</CardContent>
			</Card>
		</div>
	);
}
