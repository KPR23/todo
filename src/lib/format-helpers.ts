import { Doc } from "../../convex/_generated/dataModel";

export function formatDuration(totalMinutes: number) {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = Math.round(totalMinutes % 60);
	if (hours > 0 && minutes > 0) {
		return `${hours}h ${minutes}min`;
	} else if (hours > 0) {
		return `${hours}h`;
	} else {
		return `${minutes}min`;
	}
}

export function formatTrend(totalMinutes: number) {
	const isPositive = totalMinutes >= 0;
	const absoluteMinutes = Math.abs(totalMinutes);
	const hours = Math.floor(absoluteMinutes / 60);
	const minutes = Math.round(absoluteMinutes % 60);

	const sign = isPositive ? "+" : "-";

	if (hours > 0) {
		return `${sign}${hours}h`;
	} else if (hours > 0) {
		return `${sign}${hours}h`;
	} else if (minutes > 0) {
		return `${sign}${minutes}min`;
	} else {
		return "0min";
	}
}

export function formatPLN(amount: number) {
	if (amount % 1 === 0) {
		return `${amount} zł`;
	} else {
		return `${amount.toFixed(2).replace(".", ",")} zł`;
	}
}

export function totalMinutes(monthSessions: Doc<"workSessions">[]) {
	return monthSessions.reduce((sum, session) => {
		const start = new Date(session.startTime);
		const end = new Date(session.endTime);
		const durationMs = end.getTime() - start.getTime();
		const minutes = durationMs / 1000 / 60;
		return sum + minutes;
	}, 0);
}

export function totalEarnings(
	monthSessions: Doc<"workSessions">[],
	companies: Doc<"company">[]
) {
	return monthSessions.reduce((sum, session) => {
		const start = new Date(session.startTime);
		const end = new Date(session.endTime);
		const durationMs = end.getTime() - start.getTime();
		const hours = durationMs / 1000 / 60 / 60;
		const hourlyRate =
			companies.find((c) => c._id === session.companyId)?.rate || 0;
		return sum + hours * hourlyRate;
	}, 0);
}

export function workDaysStreakFormat(days: number) {
	if (days === 1) {
		return "1 day";
	}
	return `${days} days`;
}
