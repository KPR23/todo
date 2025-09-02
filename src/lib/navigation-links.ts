import {
	faBusinessTime,
	faCalendarDays,
	faCircleQuestion,
	faComment,
	faCompass,
	faFolderOpen,
	faHashtag,
	faHouse,
	faListUl,
} from "@fortawesome/free-solid-svg-icons";

export const projects = [
	{
		name: "Home",
		url: "/home",
		icon: faHouse,
	},
	{
		name: "My tasks",
		url: "/my-tasks",
		icon: faListUl,
	},
	{
		name: "Today",
		url: "/today",
		icon: faCompass,
	},
	{
		name: "Upcoming",
		url: "/upcoming",
		icon: faCalendarDays,
	},
	{
		name: "Projects",
		url: "/projects",
		icon: faFolderOpen,
	},
	{
		name: "Categories",
		url: "/categories",
		icon: faHashtag,
	},
	{
		name: "Time Tracking",
		url: "/time-tracking",
		icon: faBusinessTime,
	},
];

export const navSecondary = [
	{
		title: "Support",
		url: "#",
		icon: faCircleQuestion,
	},
	{
		title: "Feedback",
		url: "#",
		icon: faComment,
	},
];
