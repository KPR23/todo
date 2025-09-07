import BigDateTimePicker from "@/components/ui/big-datetime-picker";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const formSchema = z
	.object({
		company: z.string().min(1, "Company is required"),
		startTime: z.date(),
		endTime: z.date(),
	})
	.refine((data) => data.endTime > data.startTime, {
		message: "End time must be after start time",
		path: ["endTime"],
	});

export default function AddSessionDialog() {
	const [open, setOpen] = useState(false);
	const addSession = useMutation(api.workSessions.createSession);
	const companies = useQuery(api.company.getCompanies) || [];

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			company: "",
			startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
			endTime: new Date(),
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			await addSession({
				company: data.company as Id<"company">,
				startTime: data.startTime.getTime(),
				endTime: data.endTime.getTime(),
			});

			toast.success("Work session added successfully!");
			setOpen(false);
			form.reset();
		} catch (error) {
			toast.error("Failed to add work session");
			console.error(error);
		}
	};

	const calculateDuration = () => {
		const start = form.watch("startTime");
		const end = form.watch("endTime");

		if (start && end && end > start) {
			const durationMs = end.getTime() - start.getTime();
			const hours = Math.floor(durationMs / (1000 * 60 * 60));
			const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
			return `${hours}h ${minutes}min`;
		}
		return "0h 0min";
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="ml-auto">
					<PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
					Add session
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Add Work Session</DialogTitle>
					<DialogDescription>
						Record your work hours. Set start and end times, select company, and
						add any notes.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Date Time Pickers */}
						<div className="flex flex-col sm:flex-row gap-4">
							<FormField
								control={form.control}
								name="startTime"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Start Time</FormLabel>
										<FormControl>
											<BigDateTimePicker
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endTime"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>End Time</FormLabel>
										<FormControl>
											<BigDateTimePicker
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Duration Display */}
						<div className="text-center p-3 bg-muted rounded-lg">
							<span className="text-sm text-muted-foreground">Duration: </span>
							<span className="font-semibold">{calculateDuration()}</span>
						</div>

						{/* Company Selection */}
						<FormField
							control={form.control}
							name="company"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Company</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Select a company" />
											</SelectTrigger>
											<SelectContent>
												{companies.map(
													(company: { _id: string; name: string }) => (
														<SelectItem key={company._id} value={company._id}>
															{company.name}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Buttons */}
						<div className="flex justify-end gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit">Add Session</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
