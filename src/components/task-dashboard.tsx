import { useMemo, useState, type FormEvent } from "react";
import {
  Archive,
  CalendarDays,
  Check,
  ChevronDown,
  CircleAlert,
  Clock3,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings2,
  SlidersHorizontal,
  Trash2,
  UserRound,
} from "lucide-react";
import { format, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type RagStatus = "red" | "orange" | "green";
type Priority = "High" | "Medium" | "Low";
type TimeFilter = "all" | "today" | "week" | "upcoming" | "completed";

type Task = {
  id: number;
  title: string;
  notes: string;
  due: string;
  project: string;
  status: RagStatus;
  priority: Priority;
  assignee: string;
  completed: boolean;
};

type TaskDraft = Omit<Task, "id" | "completed">;

const statusMeta: Record<
  RagStatus,
  { label: string; summary: string; description: string; classes: string; dot: string }
> = {
  red: {
    label: "Urgent",
    summary: "RED · URGENT",
    description: "Overdue or at risk",
    classes: "border-rag-red-border bg-rag-red-soft text-rag-red",
    dot: "bg-rag-red",
  },
  orange: {
    label: "Attention",
    summary: "ORANGE · ATTENTION",
    description: "Needs a little focus",
    classes: "border-rag-orange-border bg-rag-orange-soft text-rag-orange",
    dot: "bg-rag-orange",
  },
  green: {
    label: "On track",
    summary: "GREEN · ON TRACK",
    description: "Moving along nicely",
    classes: "border-rag-green-border bg-rag-green-soft text-rag-green",
    dot: "bg-rag-green",
  },
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Submit quarterly report",
    notes: "Finalise the financial summary and send for approval.",
    due: "2026-09-22",
    project: "Operations",
    status: "red",
    priority: "High",
    assignee: "ZS",
    completed: false,
  },
  {
    id: 2,
    title: "Prepare presentation slides",
    notes: "Refine the narrative and add the latest research notes.",
    due: "2026-09-24",
    project: "Strategy",
    status: "orange",
    priority: "Medium",
    assignee: "ZS",
    completed: false,
  },
  {
    id: 3,
    title: "Review project timeline",
    notes: "Confirm milestones and dependencies with the team.",
    due: "2026-09-28",
    project: "Studio",
    status: "green",
    priority: "Low",
    assignee: "MA",
    completed: false,
  },
  {
    id: 4,
    title: "Approve supplier shortlist",
    notes: "Compare the final three proposals before Friday.",
    due: "2026-09-25",
    project: "Operations",
    status: "orange",
    priority: "Medium",
    assignee: "ZS",
    completed: false,
  },
  {
    id: 5,
    title: "Share meeting notes",
    notes: "Send actions and decisions to the project group.",
    due: "2026-09-21",
    project: "Studio",
    status: "green",
    priority: "Low",
    assignee: "KN",
    completed: true,
  },
];

const blankDraft: TaskDraft = {
  title: "",
  notes: "",
  due: "2026-09-22",
  project: "Personal",
  status: "green",
  priority: "Medium",
  assignee: "ZS",
};

function StatusPill({ status }: { status: RagStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-2 rounded-full border px-2.5 text-[10px] font-bold uppercase tracking-[0.12em]",
        meta.classes,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

export function TaskDashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RagStatus | "all">("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<TaskDraft>(blankDraft);

  const today = startOfDay(new Date(2026, 8, 22));
  const weekEnd = new Date(2026, 8, 28);

  const filteredTasks = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return tasks.filter((task) => {
      const due = startOfDay(new Date(`${task.due}T12:00:00`));
      const matchesSearch =
        !normalized ||
        [task.title, task.notes, task.project, task.assignee].some((value) =>
          value.toLowerCase().includes(normalized),
        );
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;
      const matchesTime =
        timeFilter === "all" ||
        (timeFilter === "today" && isSameDay(due, today) && !task.completed) ||
        (timeFilter === "week" && !isBefore(due, today) && !isAfter(due, weekEnd) && !task.completed) ||
        (timeFilter === "upcoming" && isAfter(due, weekEnd) && !task.completed) ||
        (timeFilter === "completed" && task.completed);
      return matchesSearch && matchesStatus && matchesTime;
    });
  }, [query, statusFilter, tasks, timeFilter]);

  const counts = {
    red: tasks.filter((task) => task.status === "red" && !task.completed).length,
    orange: tasks.filter((task) => task.status === "orange" && !task.completed).length,
    green: tasks.filter((task) => task.status === "green" || task.completed).length,
  };

  const openNewTask = () => {
    setEditingId(null);
    setDraft(blankDraft);
    setDialogOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingId(task.id);
    setDraft({
      title: task.title,
      notes: task.notes,
      due: task.due,
      project: task.project,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
    });
    setDialogOpen(true);
  };

  const submitTask = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    if (editingId) {
      setTasks((current) =>
        current.map((task) => (task.id === editingId ? { ...task, ...draft } : task)),
      );
      toast.success("Task updated");
    } else {
      setTasks((current) => [{ ...draft, id: Date.now(), completed: false }, ...current]);
      toast.success("Task added");
    }
    setDialogOpen(false);
  };

  const archiveTask = (id: number) => {
    setTasks((current) => current.filter((task) => task.id !== id));
    toast("Task archived");
  };

  const updateStatus = (id: number, status: RagStatus) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status } : task)));
    toast.success(`Status changed to ${statusMeta[status].label}`);
  };

  const completeTask = (id: number, completed: boolean) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, completed } : task)),
    );
    toast(completed ? "Task completed" : "Task reopened");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/90">
        <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full border border-primary/20 bg-primary text-primary-foreground">
              <Check className="size-4" strokeWidth={1.8} />
            </div>
            <span className="font-serif text-xl font-semibold">Quietly.</span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" size="icon" aria-label="Settings" title="Settings">
              <Settings2 />
            </Button>
            <div className="grid size-10 place-items-center rounded-full border border-border bg-secondary text-xs font-semibold">
              ZS
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-20 pt-9 sm:px-8 lg:px-12 lg:pt-12">
        <section className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <CalendarDays className="size-3.5" /> Tuesday, 22 September
            </p>
            <h1 className="font-serif text-5xl font-medium leading-none sm:text-6xl">My Tasks</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
              A considered view of what needs your attention, and what is moving along well.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label className="relative block flex-1 lg:w-72" htmlFor="task-search">
              <span className="sr-only">Search tasks</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="task-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tasks"
                className="h-11 bg-surface pl-10 shadow-none"
              />
            </label>
            <Button className="h-11 px-5" onClick={openNewTask}>
              <Plus /> Add task
            </Button>
          </div>
        </section>

        <section className="mt-10 grid gap-3 md:grid-cols-3" aria-label="Task status summary">
          {(Object.keys(statusMeta) as RagStatus[]).map((status) => {
            const meta = statusMeta[status];
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                aria-pressed={statusFilter === status}
                className={cn(
                  "group relative min-h-36 overflow-hidden rounded-lg border p-5 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  meta.classes,
                  statusFilter === status && "ring-2 ring-current ring-offset-2 ring-offset-background",
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em]">{meta.summary}</p>
                    <p className="mt-4 font-serif text-5xl font-medium leading-none">{counts[status]}</p>
                  </div>
                  <span className={cn("mt-1 size-2.5 rounded-full ring-4 ring-current/10", meta.dot)} />
                </div>
                <p className="mt-4 text-xs font-medium opacity-80">{meta.description}</p>
              </button>
            );
          })}
        </section>

        <section className="mt-11">
          <div className="flex flex-col justify-between gap-5 border-b border-border pb-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Your list</p>
              <h2 className="mt-1 font-serif text-3xl font-medium">Tasks in focus</h2>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" aria-label="Time filters">
              {([
                ["all", "All"],
                ["today", "Today"],
                ["week", "This week"],
                ["upcoming", "Upcoming"],
                ["completed", "Completed"],
              ] as const).map(([value, label]) => (
                <Button
                  key={value}
                  variant={timeFilter === value ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setTimeFilter(value)}
                  className="shrink-0"
                >
                  {label}
                </Button>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="shrink-0">
                    <SlidersHorizontal /> Status <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Show status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setStatusFilter("all")}>All statuses</DropdownMenuItem>
                  {(Object.keys(statusMeta) as RagStatus[]).map((status) => (
                    <DropdownMenuItem key={status} onSelect={() => setStatusFilter(status)}>
                      <span className={cn("size-2 rounded-full", statusMeta[status].dot)} />
                      {statusMeta[status].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {filteredTasks.map((task) => (
              <article
                key={task.id}
                className={cn(
                  "group grid gap-4 rounded-lg border border-border bg-card px-4 py-4 shadow-soft transition-all hover:border-strong sm:px-5 lg:grid-cols-[auto_minmax(260px,1fr)_130px_110px_120px_auto] lg:items-center",
                  task.completed && "opacity-60",
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => completeTask(task.id, checked === true)}
                  aria-label={`Mark ${task.title} ${task.completed ? "active" : "complete"}`}
                  className="mt-1 size-5 lg:mt-0"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className={cn("font-medium", task.completed && "line-through")}>{task.title}</h3>
                    <StatusPill status={task.status} />
                  </div>
                  <p className="mt-1.5 truncate text-sm text-muted-foreground">{task.notes}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  <span>{format(new Date(`${task.due}T12:00:00`), "d MMM yyyy")}</span>
                </div>
                <div>
                  <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                    {task.project}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Priority</span>
                  <span className="font-semibold">{task.priority}</span>
                </div>
                <div className="flex items-center justify-between gap-3 lg:justify-end">
                  <div className="grid size-8 place-items-center rounded-full border border-border bg-secondary text-[10px] font-bold" title={`Assigned to ${task.assignee}`}>
                    {task.assignee}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`More actions for ${task.title}`}>
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onSelect={() => openEditTask(task)}>
                        <Pencil /> Edit task
                      </DropdownMenuItem>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">Change status</DropdownMenuLabel>
                      {(Object.keys(statusMeta) as RagStatus[]).map((status) => (
                        <DropdownMenuItem key={status} onSelect={() => updateStatus(task.id, status)}>
                          <span className={cn("size-2 rounded-full", statusMeta[status].dot)} />
                          {statusMeta[status].label}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => archiveTask(task.id)} className="text-destructive focus:text-destructive">
                        <Archive /> Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </article>
            ))}

            {filteredTasks.length === 0 && (
              <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 text-center">
                <CircleAlert className="size-5 text-muted-foreground" />
                <h3 className="mt-3 font-serif text-xl">Nothing needs your attention here</h3>
                <p className="mt-1 text-sm text-muted-foreground">Try another filter or add a new task.</p>
              </div>
            )}
          </div>
        </section>

        <footer className="mt-16 flex items-end justify-between border-t border-border pt-5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>{tasks.filter((task) => !task.completed).length} open tasks</span>
          <span className="font-serif text-base normal-case tracking-normal text-watermark">Zulayga Salie</span>
        </footer>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-lg border-border bg-surface sm:max-w-xl">
          <form onSubmit={submitTask}>
            <DialogHeader>
              <DialogTitle className="font-serif text-3xl font-medium">
                {editingId ? "Edit task" : "Add a new task"}
              </DialogTitle>
              <DialogDescription>Capture the task, then set its current level of risk.</DialogDescription>
            </DialogHeader>
            <div className="mt-6 grid gap-5">
              <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.1em]">
                Task name
                <Input
                  required
                  autoFocus
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  placeholder="What needs to be done?"
                  className="h-11 bg-background font-normal normal-case tracking-normal"
                />
              </label>
              <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.1em]">
                Notes
                <Textarea
                  value={draft.notes}
                  onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
                  placeholder="Add context or a helpful reminder"
                  className="min-h-24 bg-background font-normal normal-case tracking-normal"
                />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.1em]">
                  Due date
                  <Input
                    type="date"
                    required
                    value={draft.due}
                    onChange={(event) => setDraft({ ...draft, due: event.target.value })}
                    className="h-11 bg-background font-normal normal-case tracking-normal"
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.1em]">
                  Project
                  <Input
                    value={draft.project}
                    onChange={(event) => setDraft({ ...draft, project: event.target.value })}
                    className="h-11 bg-background font-normal normal-case tracking-normal"
                  />
                </label>
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.1em]">
                  RAG status
                  <Select value={draft.status} onValueChange={(value: RagStatus) => setDraft({ ...draft, status: value })}>
                    <SelectTrigger className="h-11 bg-background font-normal normal-case tracking-normal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">Urgent</SelectItem>
                      <SelectItem value="orange">Attention</SelectItem>
                      <SelectItem value="green">On track</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.1em]">
                  Priority
                  <Select value={draft.priority} onValueChange={(value: Priority) => setDraft({ ...draft, priority: value })}>
                    <SelectTrigger className="h-11 bg-background font-normal normal-case tracking-normal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.1em]">
                  Assignee
                  <Input
                    value={draft.assignee}
                    maxLength={3}
                    onChange={(event) => setDraft({ ...draft, assignee: event.target.value.toUpperCase() })}
                    className="h-11 bg-background font-normal normal-case tracking-normal"
                  />
                </label>
              </div>
            </div>
            <DialogFooter className="mt-7 gap-2">
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingId ? "Save changes" : "Add task"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}