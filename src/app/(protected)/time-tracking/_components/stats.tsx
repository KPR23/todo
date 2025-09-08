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
	formatPercentage,
	formatPLN,
	formatTrend,
} from "@/lib/format-helper";
import {
	getArrowRotation,
	getLongestDayInfo,
	getPercentageColor,
	getSessionsForDateRange,
	longestStreak,
	percentageChange,
	totalEarnings,
	totalMinutes,
	workDaysStreakFormat,
} from "@/lib/helper-functions";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRange } from "react-day-picker";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Badge } from "../../../../components/ui/badge";

type StatsProps = {
	rawSessions: Doc<"workSessions">[];
	companies: Doc<"company">[];
	dateRange?: DateRange;
};

export default function Stats({
	rawSessions,
	companies,
	dateRange,
}: StatsProps) {
	const getComparisonPeriod = (dateRange?: DateRange) => {
		if (!dateRange?.from || !dateRange?.to) {
			const now = new Date();
			const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
			const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
			const currentMonthEnd = new Date(
				now.getFullYear(),
				now.getMonth() + 1,
				0
			);

			return {
				type: "month",
				label: "vs last month",
				currentPeriod: getSessionsForDateRange(
					rawSessions,
					currentMonthStart,
					currentMonthEnd
				),
				previousPeriod: getSessionsForDateRange(
					rawSessions,
					lastMonthStart,
					lastMonthEnd
				),
			};
		}

		const from = dateRange.from;
		const to = dateRange.to;
		const daysDiff =
			Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

		if (daysDiff === 1) {
			const prevDay = new Date(from);
			prevDay.setDate(prevDay.getDate() - 1);

			const currentPeriod = getSessionsForDateRange(rawSessions, from, from);
			const previousPeriod = getSessionsForDateRange(
				rawSessions,
				prevDay,
				prevDay
			);

			console.log("Current day:", from.toDateString());
			console.log("Previous day:", prevDay.toDateString());
			console.log("Current period sessions:", currentPeriod);
			console.log("Previous period sessions:", previousPeriod);

			return {
				type: "day",
				label: "vs previous day",
				currentPeriod: currentPeriod,
				previousPeriod: previousPeriod,
			};
		} else if (daysDiff <= 7) {
			const periodLength = daysDiff;
			const prevStart = new Date(from);
			prevStart.setDate(prevStart.getDate() - periodLength);
			const prevEnd = new Date(to);
			prevEnd.setDate(prevEnd.getDate() - periodLength);

			return {
				type: "period",
				label: `vs previous ${daysDiff} days`,
				currentPeriod: getSessionsForDateRange(rawSessions, from, to),
				previousPeriod: getSessionsForDateRange(
					rawSessions,
					prevStart,
					prevEnd
				),
			};
		} else {
			const prevStart = new Date(from);
			const prevEnd = new Date(to);

			if (daysDiff <= 31) {
				prevStart.setMonth(prevStart.getMonth() - 1);
				prevEnd.setMonth(prevEnd.getMonth() - 1);

				return {
					type: "month",
					label: "vs same period last month",
					currentPeriod: getSessionsForDateRange(rawSessions, from, to),
					previousPeriod: getSessionsForDateRange(
						rawSessions,
						prevStart,
						prevEnd
					),
				};
			} else {
				prevStart.setFullYear(prevStart.getFullYear() - 1);
				prevEnd.setFullYear(prevEnd.getFullYear() - 1);

				return {
					type: "year",
					label: "vs same period last year",
					currentPeriod: getSessionsForDateRange(rawSessions, from, to),
					previousPeriod: getSessionsForDateRange(
						rawSessions,
						prevStart,
						prevEnd
					),
				};
			}
		}
	};

	const comparison = getComparisonPeriod(dateRange);

	const currentSessions = comparison.currentPeriod;
	const previousSessions = comparison.previousPeriod;

	// Hours
	const totalMinutesCurrent = totalMinutes(currentSessions);
	const totalMinutesPrevious = totalMinutes(previousSessions);

	const totalMinutesDifference = totalMinutesCurrent - totalMinutesPrevious;

	const hoursPercentChange = percentageChange(
		totalMinutesCurrent,
		totalMinutesPrevious
	);

	// Salary
	const companiesWorkedThisMonthDisplay = () => {
		const companiesWorkedThisMonth = new Set(
			currentSessions.map((s) => s.companyId)
		).size;
		if (companiesWorkedThisMonth === 0) {
			return "0 companies";
		}
		if (companiesWorkedThisMonth === 1) {
			return "1 company";
		}
		return `${companiesWorkedThisMonth} companies`;
	};

	const totalSalaryCurrent = totalEarnings(currentSessions, companies);
	const totalSalaryPrevious = totalEarnings(previousSessions, companies);

	const totalSalaryDifference = totalSalaryCurrent - totalSalaryPrevious;

	const salaryPercentChange = percentageChange(
		totalSalaryCurrent,
		totalSalaryPrevious
	);

	//Longest Day
	const { longestDay, longestDayDate } = getLongestDayInfo(currentSessions);
	const { longestDay: longestDayLastMonth } =
		getLongestDayInfo(previousSessions);

	const longestDayDateFormatted = longestDayDate
		? new Date(longestDayDate).toLocaleDateString("en-GB", {
				day: "numeric",
				month: "short",
		  })
		: "";

	const longestDayTrend = longestDay - longestDayLastMonth;

	const longestDayPercentChange = percentageChange(
		longestDay,
		longestDayLastMonth
	);

	// Work streak
	const currentWorkStreak = longestStreak(currentSessions);
	const previousWorkStreak = longestStreak(previousSessions);

	const workStreakTrend = currentWorkStreak - previousWorkStreak;

	const workStreakPercentChange = percentageChange(
		currentWorkStreak,
		previousWorkStreak
	);

	const getCardDescription = () => {
		if (!dateRange?.from || !dateRange?.to) {
			return new Date().toLocaleString("en-GB", {
				month: "long",
				year: "numeric",
			});
		}

		const from = dateRange.from.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
		});
		const to = dateRange.to.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
		});

		return from === to ? from : `${from} - ${to}`;
	};

	return (
		<div className="grid grid-cols-4 gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Total hours</CardTitle>
					<CardDescription>{getCardDescription()}</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-between items-center">
					<p className="text-2xl font-bold">
						{formatDuration(totalMinutesCurrent)}
					</p>
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
							<div className="space-y-4 p-2">
								<h4 className="text-md font-bold text-foreground">
									Hours Comparison
								</h4>
								<div className="space-y-2">
									<div className="flex justify-between items-center text-sm">
										<span className="text-muted-foreground">
											Selected period:
										</span>
										<span className="font-semibold text-foreground">
											{formatDuration(totalMinutesCurrent)}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-muted-foreground">
											Comparison period:
										</span>
										<span className="font-semibold text-foreground">
											{formatDuration(totalMinutesPrevious)}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm pt-2 border-t">
										<span className="text-muted-foreground">Difference:</span>
										<span
											className={`font-bold ${getPercentageColor(
												totalMinutesDifference
											)}`}
										>
											{formatTrend(totalMinutesDifference)}
										</span>
									</div>
								</div>
								<p className="text-xs text-muted-foreground">
									{comparison.label}
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
					<p className="text-2xl font-bold">{formatPLN(totalSalaryCurrent)}</p>
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
							<div className="space-y-4 p-2">
								<h4 className="text-md font-bold text-foreground">
									Salary Comparison
								</h4>
								<div className="space-y-2">
									<div className="flex justify-between items-center text-sm">
										<span className="text-muted-foreground">
											Selected period:
										</span>
										<span className="font-semibold text-foreground">
											{formatPLN(totalSalaryCurrent)}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-muted-foreground">
											Comparison period:
										</span>
										<span className="font-semibold text-foreground">
											{formatPLN(totalSalaryPrevious)}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm pt-2 border-t">
										<span className="text-muted-foreground">Difference:</span>
										<span
											className={`font-bold ${getPercentageColor(
												totalSalaryDifference
											)}`}
										>
											{formatPLN(totalSalaryDifference)}
										</span>
									</div>
								</div>
								<p className="text-xs text-muted-foreground">
									{comparison.label}
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
					<p className="text-2xl font-bold">{formatDuration(longestDay)}</p>
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
							<div className="space-y-4 p-2">
								<h4 className="text-md font-bold text-foreground">
									Longest Day Comparison
								</h4>
								<div className="space-y-2">
									<div className="flex justify-between items-center text-sm">
										<span className="text-muted-foreground">
											Selected period:
										</span>
										<span className="font-semibold text-foreground">
											{formatDuration(longestDay)}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-muted-foreground">
											Comparison period:
										</span>
										<span className="font-semibold text-foreground">
											{formatDuration(longestDayLastMonth)}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm pt-2 border-t">
										<span className="text-muted-foreground">Difference:</span>
										<span
											className={`font-bold ${getPercentageColor(
												longestDayTrend
											)}`}
										>
											{formatTrend(longestDayTrend)}
										</span>
									</div>
								</div>
								<p className="text-xs text-muted-foreground">
									{comparison.label}
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
					<p className="text-2xl font-bold">
						{workDaysStreakFormat(currentWorkStreak)}
					</p>
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
							<div className="space-y-4 p-2">
								<h4 className="text-md font-bold text-foreground">
									Work Streak Comparison
								</h4>
								<div className="space-y-2">
									<div className="flex justify-between items-center text-sm">
										<span className="text-muted-foreground">
											Selected period:
										</span>
										<span className="font-semibold text-foreground">
											{workDaysStreakFormat(currentWorkStreak)}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-muted-foreground">
											Comparison period:
										</span>
										<span className="font-semibold text-foreground">
											{workDaysStreakFormat(previousWorkStreak)}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm pt-2 border-t">
										<span className="text-muted-foreground">Difference:</span>
										<span
											className={`font-bold ${getPercentageColor(
												workStreakTrend
											)}`}
										>
											{workStreakTrend > 0 ? "+" : ""}
											{workStreakTrend} days
										</span>
									</div>
								</div>
								<p className="text-xs text-muted-foreground">
									{comparison.label}
								</p>
							</div>
						</HoverCardContent>
					</HoverCard>
				</CardContent>
			</Card>
		</div>
	);
}
