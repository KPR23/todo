"use client";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { FilterIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
	startTime: z.string().min(1, "Wybierz datę i godzinę rozpoczęcia"),
	endTime: z.string().min(1, "Wybierz datę i godzinę zakończenia"),
});

export default function WorkSessionsPage() {
	const [showForm, setShowForm] = useState(false);
	const createSession = useMutation(api.workSessions.createSession);
	const getSessions = useQuery(api.workSessions.getSessions);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			startTime: "",
			endTime: "",
		},
	});

	function onSubmit(data: z.infer<typeof formSchema>) {
		const start = new Date(data.startTime).getTime();
		const end = new Date(data.endTime).getTime();
		if (end <= start) {
			toast.error("Czas zakończenia musi być po czasie rozpoczęcia");
			return;
		}
		createSession({
			company: "m57f216xwjyeg7ydktjty9p0qn7ps19n" as Id<"company">,
			startTime: start,
			endTime: end,
		})
			.then(() => {
				toast.success("Sesja pracy utworzona!");
				setShowForm(false);
				form.reset();
			})
			.catch((e) =>
				toast.error("Błąd przy tworzeniu sesji", { description: e.message })
			);
	}

	return (
		<main className="flex flex-col p-6 grow">
			<div className="flex flex-col gap-4 mx-auto w-full max-w-6xl">
				<div className="flex justify-between items-center">
					<h1 className="text-lg md:text-2xl font-semibold">Shift Logs</h1>
					<div className="flex gap-2">
						<Button onClick={() => setShowForm((v) => !v)} disabled={showForm}>
							<PlusIcon className="w-4 h-4" />
							Add Task
						</Button>
						<Button variant="outline">
							<FilterIcon className="w-4 h-4" />
							Filters
						</Button>
					</div>
				</div>
				<hr className="my-2 w-full border-t border-zinc-950/10 dark:border-white/10" />
				<div className="flex flex-col gap-2">
					{showForm && (
						<Card className="flex gap-2 p-4">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="flex flex-col space-y-2"
								>
									<FormField
										control={form.control}
										name="startTime"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														type="datetime-local"
														placeholder="Start time"
														{...field}
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
											<FormItem>
												<FormControl>
													<Input
														type="datetime-local"
														placeholder="End time"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<CardFooter className="items-center mt-2 grid grid-cols-2 gap-2 w-full justify-end">
										<Button
											className="w-full"
											variant="outline"
											onClick={() => setShowForm(false)}
											type="button"
										>
											Cancel
										</Button>
										<Button className="w-full" type="submit">
											Add Session
										</Button>
									</CardFooter>
								</form>
							</Form>
						</Card>
					)}
				</div>
				<div className="flex flex-col gap-4">
					{getSessions?.map((session) => (
						<Card key={session._id} className="flex gap-2 p-4">
							<div className="flex-1">
								<p className="font-semibold">
									{new Date(session.startTime).toLocaleString()} -{" "}
									{new Date(session.endTime).toLocaleString()} Czas pracy:{" "}
									{Math.floor(
										(session.endTime - session.startTime) / (1000 * 60 * 60)
									)}
									:
									{Math.floor(
										((session.endTime - session.startTime) % (1000 * 60 * 60)) /
											(1000 * 60)
									)}
								</p>
							</div>
						</Card>
					))}
				</div>
			</div>
		</main>
	);
}
