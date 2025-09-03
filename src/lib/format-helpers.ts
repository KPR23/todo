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
