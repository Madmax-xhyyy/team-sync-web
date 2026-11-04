import { Search, Pencil, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { OrganizationMember } from "@/features/organizations/types/member.types";
import type { Task, TaskColumn } from "../types/task.types";

interface TaskListProps {
  tasks: Task[];
  columns: TaskColumn[];
  members: OrganizationMember[];
  loading: boolean;
  moving: boolean;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onAssign: (task: Task) => void;
  onDelete: (task: Task) => void;
  onMove: (task: Task, columnId: string) => void;
}

export function TaskList({
  tasks,
  columns,
  members,
  loading,
  moving,
  onView,
  onEdit,
  onAssign,
  onDelete,
  onMove,
}: TaskListProps) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const visible = tasks.filter(
    (task) =>
      `${task.title} ${task.description ?? ""}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()) &&
      (type === "all" || task.type === type),
  );
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-col justify-between gap-3 border-b p-4 sm:flex-row">
        <div className="relative sm:w-80">
          <Search
            className="absolute top-3 left-3 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label="Search tasks and issues"
            placeholder="Search tasks and issues…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          aria-label="Filter by issue type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="h-10 rounded-lg border bg-background px-3 text-sm"
        >
          <option value="all">All types</option>
          {["TASK", "BUG", "FEATURE", "CHORE", "REFACTOR"].map((value) => (
            <option key={value} value={value}>
              {value.charAt(0) + value.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p role="status" className="p-10 text-center text-sm text-muted-foreground">
          Loading tasks…
        </p>
      ) : visible.length === 0 ? (
        <div className="p-12 text-center">
          <h3 className="font-medium">{tasks.length ? "No matching tasks" : "No tasks yet"}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {tasks.length
              ? "Try another search or issue type."
              : "Add a task to start planning your project."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Task / issue</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Priority</th>
                <th className="px-3 py-3 font-medium">Assignee</th>
                <th className="px-3 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {visible.map((task) => {
                const assignee = members.find((member) => member.userId === task.assigneeId);
                return (
                  <tr key={task.id} className="hover:bg-muted/20">
                    <td className="max-w-sm px-5 py-4">
                      <button
                        onClick={() => onView(task)}
                        className="block max-w-full truncate rounded-sm text-left font-medium hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                        title={task.title}
                      >
                        {task.title}
                      </button>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {task.type.charAt(0) + task.type.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <select
                        aria-label={`Status for ${task.title}`}
                        value={task.columnId}
                        disabled={moving}
                        onChange={(event) => onMove(task, event.target.value)}
                        className="max-w-40 rounded-lg border bg-background px-2 py-1.5 text-xs disabled:opacity-50"
                      >
                        {columns.map((column) => (
                          <option key={column.id} value={column.id}>
                            {column.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${task.priority === "URGENT" || task.priority === "HIGH" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}
                      >
                        {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-xs text-muted-foreground">
                      {assignee ? `${assignee.firstName} ${assignee.lastName}` : "Unassigned"}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Edit ${task.title}`}
                          onClick={() => onEdit(task)}
                        >
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Assign ${task.title}`}
                          onClick={() => onAssign(task)}
                        >
                          <UserRound aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${task.title}`}
                          onClick={() => onDelete(task)}
                        >
                          <Trash2 className="text-destructive" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p role="status" className="border-t px-5 py-3 text-xs text-muted-foreground">
        {loading ? "Loading…" : `${visible.length} of ${tasks.length} tasks`}
      </p>
    </div>
  );
}
