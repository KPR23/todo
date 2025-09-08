"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	FilterFn,
	flexRender,
	getCoreRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import {
	ChevronDownIcon,
	ChevronFirstIcon,
	ChevronLastIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronUpIcon,
	CircleAlertIcon,
	CircleXIcon,
	Columns3Icon,
	EllipsisIcon,
	FilterIcon,
	ListFilterIcon,
	PlusIcon,
	TrashIcon,
} from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from "@/components/ui/pagination";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { formatDuration, formatPLN } from "@/lib/format-helpers";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import AddSessionDialog from "./add-session";

type Item = {
	id: Id<"workSessions">;
	date: string;
	startTime: string;
	endTime: string;
	company: string;
	wage: number;
	duration: number;
	formattedDuration: string;
};

type TimeTrackingTableProps = {
	rawSessions: Doc<"workSessions">[];
	companies: Doc<"company">[];
};

const multiColumnFilterFn: FilterFn<Item> = (row, columnId, filterValue) => {
	const searchableRowContent =
		`${row.original.date} ${row.original.startTime} ${row.original.endTime} ${row.original.company}`.toLowerCase();
	const searchTerm = (filterValue ?? "").toLowerCase();
	return searchableRowContent.includes(searchTerm);
};

const columns: ColumnDef<Item>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		maxSize: 40,
		enableSorting: false,
		enableHiding: false,
	},
	{
		header: "Date",
		accessorKey: "date",
		cell: ({ row }) => (
			<div className="font-medium whitespace-nowrap">
				{row.getValue("date")}
			</div>
		),
		minSize: 50,
		maxSize: 80,
		filterFn: multiColumnFilterFn,
		enableHiding: false,
	},
	{
		header: "Time In",
		accessorKey: "startTime",
		meta: {
			displayName: "Time In",
		},
		cell: ({ row }) => (
			<div className="whitespace-nowrap">{row.getValue("startTime")}</div>
		),
		size: 80,
	},
	{
		header: "Time Out",
		accessorKey: "endTime",
		meta: {
			displayName: "Time Out",
		},
		cell: ({ row }) => (
			<div className="whitespace-nowrap">{row.getValue("endTime")}</div>
		),
		size: 80,
	},
	{
		header: "Company",
		accessorKey: "company",
		meta: {
			displayName: "Company",
		},
		cell: ({ row }) => <div>{row.getValue("company")}</div>,
		minSize: 80,
		maxSize: 100,
	},
	{
		header: "Hours",
		accessorKey: "formattedDuration",
		meta: {
			displayName: "Hours",
		},
		cell: ({ row }) => (
			<div className="whitespace-nowrap">
				{row.getValue("formattedDuration")}
			</div>
		),
		size: 100,
	},
	{
		header: "Earnings",
		accessorKey: "wage",
		meta: {
			displayName: "Earnings",
		},
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("wage"));
			const formatted = formatPLN(amount);
			return <div className="whitespace-nowrap">{formatted}</div>;
		},
		size: 120,
	},
	{
		id: "actions",
		header: () => <span className="sr-only">Actions</span>,
		cell: ({ row }) => <RowActions sessionId={row.original.id} />,
		size: 60,
		enableHiding: false,
	},
];

export default function TimeTrackingTable({
	rawSessions,
	companies,
}: TimeTrackingTableProps) {
	const id = useId();
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const inputRef = useRef<HTMLInputElement>(null);
	const [sorting, setSorting] = useState<SortingState>([]);

	const deleteSession = useMutation(api.workSessions.deleteSession);
	const deleteMultipleSessions = useMutation(
		api.workSessions.deleteMultipleSessions
	);

	const companyMap = useMemo(() => {
		const map = new Map();
		companies.forEach((company) => {
			map.set(company._id, company);
		});
		return map;
	}, [companies]);

	const data: Item[] = useMemo(() => {
		return rawSessions.map((session) => {
			const company = companyMap.get(session.companyId);
			const startTime = new Date(session.startTime);
			const endTime = new Date(session.endTime);
			const durationMs = endTime.getTime() - startTime.getTime();
			const minutes = durationMs / 1000 / 60;

			const formatDate = () => {
				if (startTime.toDateString() === endTime.toDateString()) {
					return startTime.toLocaleDateString("en-GB");
				} else {
					return `${startTime.toLocaleDateString(
						"en-GB"
					)} - ${endTime.toLocaleDateString("en-GB")}`;
				}
			};

			const wage = company ? (durationMs / (1000 * 60 * 60)) * company.rate : 0;

			return {
				id: session._id,
				date: formatDate(),
				startTime: startTime.toLocaleTimeString("en-GB", {
					hour: "2-digit",
					minute: "2-digit",
				}),
				endTime: endTime.toLocaleTimeString("en-GB", {
					hour: "2-digit",
					minute: "2-digit",
				}),
				company: company?.name || "Unknown Company",
				duration: durationMs / (1000 * 60 * 60),
				wage: wage,
				formattedDuration: formatDuration(minutes),
			};
		});
	}, [rawSessions, companyMap]);

	const handleDeleteRows = async () => {
		const selectedRows = table.getSelectedRowModel().rows;
		const sessionIds = selectedRows.map((row) => row.original.id);

		try {
			if (sessionIds.length === 1) {
				await deleteSession({ sessionId: sessionIds[0] });
			} else {
				await deleteMultipleSessions({ sessionIds });
			}
			table.resetRowSelection();
		} catch (error) {
			console.error("Failed to delete sessions:", error);
		}
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		enableSortingRemoval: false,
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		state: {
			sorting,
			pagination,
			columnFilters,
			columnVisibility,
		},
	});

	// Extract companyColumn for useMemo dependencies
	const companyColumn = table.getColumn("company");
	const companyFacetedUniqueValues = companyColumn?.getFacetedUniqueValues();
	const companyFilterValue = companyColumn?.getFilterValue();

	// Get unique company values
	const uniqueCompanyValues = useMemo(() => {
		if (!companyColumn) return [];
		const values = Array.from(companyFacetedUniqueValues?.keys() ?? []);
		return values.sort();
	}, [companyColumn, companyFacetedUniqueValues]);

	// Get counts for each company
	const companyCounts = useMemo(() => {
		if (!companyColumn) return new Map();
		return companyFacetedUniqueValues ?? new Map();
	}, [companyColumn, companyFacetedUniqueValues]);

	const selectedCompanies = useMemo(() => {
		const filterValue = companyFilterValue as string[];
		return filterValue ?? [];
	}, [companyFilterValue]);

	const handleCompanyChange = (checked: boolean, value: string) => {
		const filterValue = table
			.getColumn("company")
			?.getFilterValue() as string[];
		const newFilterValue = filterValue ? [...filterValue] : [];

		if (checked) {
			newFilterValue.push(value);
		} else {
			const index = newFilterValue.indexOf(value);
			if (index > -1) {
				newFilterValue.splice(index, 1);
			}
		}

		table
			.getColumn("company")
			?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
	};

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					{/* Filter by date, time, or company */}
					<div className="relative">
						<Input
							id={`${id}-input`}
							ref={inputRef}
							className={cn(
								"peer min-w-60 ps-9",
								Boolean(table.getColumn("date")?.getFilterValue()) && "pe-9"
							)}
							value={
								(table.getColumn("date")?.getFilterValue() ?? "") as string
							}
							onChange={(e) =>
								table.getColumn("date")?.setFilterValue(e.target.value)
							}
							placeholder="Filter by date, time, or company..."
							type="text"
							aria-label="Filter sessions"
						/>
						<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
							<ListFilterIcon size={16} aria-hidden="true" />
						</div>
						{Boolean(table.getColumn("date")?.getFilterValue()) && (
							<button
								className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
								aria-label="Clear filter"
								onClick={() => {
									table.getColumn("date")?.setFilterValue("");
									if (inputRef.current) {
										inputRef.current.focus();
									}
								}}
							>
								<CircleXIcon size={16} aria-hidden="true" />
							</button>
						)}
					</div>
					{/* Filter by company */}
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline">
								<FilterIcon
									className="-ms-1 opacity-60"
									size={16}
									aria-hidden="true"
								/>
								Company
								{selectedCompanies.length > 0 && (
									<span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
										{selectedCompanies.length}
									</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto min-w-36 p-3" align="start">
							<div className="space-y-3">
								<div className="text-muted-foreground text-xs font-medium">
									Filters
								</div>
								<div className="space-y-3">
									{uniqueCompanyValues.map((value, i) => (
										<div key={value} className="flex items-center gap-2">
											<Checkbox
												id={`${id}-${i}`}
												checked={selectedCompanies.includes(value)}
												onCheckedChange={(checked: boolean) =>
													handleCompanyChange(checked, value)
												}
											/>
											<Label
												htmlFor={`${id}-${i}`}
												className="flex grow justify-between gap-2 font-normal"
											>
												{value}{" "}
												<span className="text-muted-foreground ms-2 text-xs">
													{companyCounts.get(value)}
												</span>
											</Label>
										</div>
									))}
								</div>
							</div>
						</PopoverContent>
					</Popover>
					{/* Toggle columns visibility */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								<Columns3Icon
									className="-ms-1 opacity-60"
									size={16}
									aria-hidden="true"
								/>
								View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									const displayName =
										(column.columnDef.meta as { displayName?: string })
											?.displayName || column.id;
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
											onSelect={(event) => event.preventDefault()}
										>
											{displayName}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="flex items-center gap-3">
					{/* Delete button */}
					{table.getSelectedRowModel().rows.length > 0 && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button className="ml-auto" variant="outline">
									<TrashIcon
										className="-ms-1 opacity-60"
										size={16}
										aria-hidden="true"
									/>
									Delete
									<span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
										{table.getSelectedRowModel().rows.length}
									</span>
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
									<div
										className="flex size-9 shrink-0 items-center justify-center rounded-full border"
										aria-hidden="true"
									>
										<CircleAlertIcon className="opacity-80" size={16} />
									</div>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete{" "}
											{table.getSelectedRowModel().rows.length} selected{" "}
											{table.getSelectedRowModel().rows.length === 1
												? "session"
												: "sessions"}
											.
										</AlertDialogDescription>
									</AlertDialogHeader>
								</div>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleDeleteRows}>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
					{/* Add session button */}
					<AddSessionDialog />
				</div>
			</div>

			{/* Table */}
			<div className="bg-background overflow-hidden rounded-md border">
				<Table className="table-auto">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="hover:bg-transparent">
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="h-11"
											style={{ width: `${header.getSize()}px` }}
										>
											{header.isPlaceholder ? null : header.column.getCanSort() ? (
												<div
													className={cn(
														header.column.getCanSort() &&
															"flex h-full cursor-pointer items-center justify-between gap-2 select-none"
													)}
													onClick={header.column.getToggleSortingHandler()}
													onKeyDown={(e) => {
														if (
															header.column.getCanSort() &&
															(e.key === "Enter" || e.key === " ")
														) {
															e.preventDefault();
															header.column.getToggleSortingHandler()?.(e);
														}
													}}
													tabIndex={header.column.getCanSort() ? 0 : undefined}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
													{{
														asc: (
															<ChevronUpIcon
																className="shrink-0 opacity-60"
																size={16}
																aria-hidden="true"
															/>
														),
														desc: (
															<ChevronDownIcon
																className="shrink-0 opacity-60"
																size={16}
																aria-hidden="true"
															/>
														),
													}[header.column.getIsSorted() as string] ?? null}
												</div>
											) : (
												flexRender(
													header.column.columnDef.header,
													header.getContext()
												)
											)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="last:py-0">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No entries found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between gap-8">
				{/* Results per page */}
				<div className="flex items-center gap-3">
					<Label htmlFor={id} className="max-sm:sr-only">
						Rows per page
					</Label>
					<Select
						value={table.getState().pagination.pageSize.toString()}
						onValueChange={(value) => {
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger id={id} className="w-fit whitespace-nowrap">
							<SelectValue placeholder="Select number of results" />
						</SelectTrigger>
						<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
							{[5, 10, 25, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={pageSize.toString()}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				{/* Page number information */}
				<div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
					<p
						className="text-muted-foreground text-sm whitespace-nowrap"
						aria-live="polite"
					>
						<span className="text-foreground">
							{table.getState().pagination.pageIndex *
								table.getState().pagination.pageSize +
								1}
							-
							{Math.min(
								Math.max(
									table.getState().pagination.pageIndex *
										table.getState().pagination.pageSize +
										table.getState().pagination.pageSize,
									0
								),
								table.getRowCount()
							)}
						</span>{" "}
						of{" "}
						<span className="text-foreground">
							{table.getRowCount().toString()}
						</span>
					</p>
				</div>

				{/* Pagination buttons */}
				<div>
					<Pagination>
						<PaginationContent>
							{/* First page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.firstPage()}
									disabled={!table.getCanPreviousPage()}
									aria-label="Go to first page"
								>
									<ChevronFirstIcon size={16} aria-hidden="true" />
								</Button>
							</PaginationItem>
							{/* Previous page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.previousPage()}
									disabled={!table.getCanPreviousPage()}
									aria-label="Go to previous page"
								>
									<ChevronLeftIcon size={16} aria-hidden="true" />
								</Button>
							</PaginationItem>
							{/* Next page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.nextPage()}
									disabled={!table.getCanNextPage()}
									aria-label="Go to next page"
								>
									<ChevronRightIcon size={16} aria-hidden="true" />
								</Button>
							</PaginationItem>
							{/* Last page button */}
							<PaginationItem>
								<Button
									size="icon"
									variant="outline"
									className="disabled:pointer-events-none disabled:opacity-50"
									onClick={() => table.lastPage()}
									disabled={!table.getCanNextPage()}
									aria-label="Go to last page"
								>
									<ChevronLastIcon size={16} aria-hidden="true" />
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</div>
	);
}

function RowActions({ sessionId }: { sessionId: Id<"workSessions"> }) {
	const deleteSession = useMutation(api.workSessions.deleteSession);

	const handleDelete = async () => {
		try {
			await deleteSession({ sessionId });
		} catch (error) {
			console.error("Failed to delete session:", error);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex justify-end">
					<Button
						size="icon"
						variant="ghost"
						className="shadow-none"
						aria-label="Edit item"
					>
						<EllipsisIcon size={16} aria-hidden="true" />
					</Button>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<span>Edit</span>
						<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<span>Duplicate</span>
						<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<span>Archive</span>
						<DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-destructive focus:text-destructive"
					onClick={handleDelete}
				>
					<span>Delete</span>
					<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
