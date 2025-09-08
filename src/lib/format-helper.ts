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
	const isPositive = totalMinutes > 0;
	const absoluteMinutes = Math.abs(totalMinutes);
	const rounded = Math.round(absoluteMinutes);
	const hours = Math.floor(rounded / 60);
	const minutes = rounded % 60;

	if (totalMinutes === 0) return "0min";
	const sign = isPositive ? "+" : "-";

	if (hours > 0 && minutes > 0) return `${sign}${hours}h ${minutes}min`;
	if (hours > 0) return `${sign}${hours}h`;
	return `${sign}${minutes}min`;
}

export function formatPLN(amount: number) {
	if (amount % 1 === 0) {
		return `${amount} zł`;
	} else {
		return `${amount.toFixed(2).replace(".", ",")} zł`;
	}
}

export function formatPercentage(percent: number) {
	if (percent === 0) return "0%";
	const sign = percent > 0 ? "+" : "";
	const formatted = percent % 1 === 0 ? percent.toString() : percent.toFixed(1);
	return `${sign}${formatted}%`;
}
