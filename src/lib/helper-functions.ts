import { endOfDay, startOfDay } from "date-fns";
import { Doc } from "../../convex/_generated/dataModel";

export function totalMinutes(monthSessions: Doc<"workSessions">[]) {
	return monthSessions.reduce((sum, session) => {
		const start = new Date(session.startTime);
		if (!session.startTime || !Number.isFinite(start.getTime())) {
			return sum;
		}

		const end = new Date(session.endTime);
		if (!session.endTime || !Number.isFinite(end.getTime())) {
			return sum;
		}

		const durationMs = end.getTime() - start.getTime();
		if (durationMs <= 0) {
			return sum;
		}

		const minutes = durationMs / 1000 / 60;
		if (!Number.isFinite(minutes) || minutes < 0) {
			return sum;
		}

		return sum + minutes;
	}, 0);
}

export function totalEarnings(
	monthSessions: Doc<"workSessions">[],
	companies: Doc<"company">[]
) {
	return monthSessions.reduce((sum, session) => {
		const start = new Date(session.startTime);
		if (!session.startTime || !Number.isFinite(start.getTime())) {
			return sum;
		}

		const end = new Date(session.endTime);
		if (!session.endTime || !Number.isFinite(end.getTime())) {
			return sum;
		}

		const durationMs = end.getTime() - start.getTime();
		if (durationMs <= 0) {
			return sum;
		}

		const hours = durationMs / 1000 / 60 / 60;
		if (!Number.isFinite(hours) || hours < 0) {
			return sum;
		}

		const company = companies.find((c) => c._id === session.companyId);
		const hourlyRate = company?.rate;

		if (hourlyRate === undefined || !Number.isFinite(hourlyRate)) {
			return sum;
		}

		return sum + hours * hourlyRate;
	}, 0);
}

export function getLongestDayInfo(sessions: Doc<"workSessions">[]) {
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
}

export function calculateWorkStreak(sessions: Doc<"workSessions">[]) {
	if (sessions.length === 0) return 0;

	const sortedSessions = sessions.sort(
		(a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
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
}

export function workDaysStreakFormat(days: number) {
	if (days === 1) {
		return "1 day";
	}
	return `${days} days`;
}

export function getSessionsForDateRange(
	sessions: Doc<"workSessions">[],
	startDate: Date,
	endDate: Date
) {
	const start = startOfDay(startDate);
	const end = endOfDay(endDate);

	return sessions.filter((session) => {
		const sessionDate = new Date(session.startTime);
		return sessionDate >= start && sessionDate <= end;
	});
}

export function longestStreak(sessions: Doc<"workSessions">[]) {
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
}

export function percentageChange(current: number, previous: number) {
	if (previous === 0) {
		return current > 0 ? 100 : 0;
	}
	return ((current - previous) / previous) * 100;
}

export function getPercentageColor(percent: number) {
	if (percent > 0) return "text-chart-2";
	if (percent < 0) return "text-chart-5";
	return "text-chart-3";
}

export function getArrowRotation(percent: number) {
	if (percent > 0) return "rotate-[45deg]";
	if (percent < 0) return "rotate-[135deg]";
	return "rotate-[90deg]";
}
