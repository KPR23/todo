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
	const rounded = Math.round(absoluteMinutes);
	const hours = Math.floor(rounded / 60);
	const minutes = rounded % 60;

	const sign = isPositive ? "+" : "-";

	if (hours > 0 && minutes > 0) return `${sign}${hours}h ${minutes}min`;
	if (hours > 0) return `${sign}${hours}h`;
	if (minutes > 0) return `${sign}${minutes}min`;
	return "0min";
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

export function workDaysStreakFormat(days: number) {
	if (days === 1) {
		return "1 day";
	}
	return `${days} days`;
}
