"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const isComplete = toolInvocation.state === "result" && Boolean(toolInvocation.result);
  const label = getToolDescription(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}

function basename(path: string | undefined): string {
  if (!path) return "file";
  const segments = path.split("/").filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : path;
}

function getToolDescription(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const isDone = toolInvocation.state === "result";

  if (toolName === "str_replace_editor") {
    const path = basename(args?.path);
    switch (args?.command) {
      case "create":
        return isDone ? `Created ${path}` : `Creating ${path}`;
      case "str_replace":
      case "insert":
        return isDone ? `Edited ${path}` : `Editing ${path}`;
      case "view":
        return isDone ? `Viewed ${path}` : `Viewing ${path}`;
      case "undo_edit":
        return isDone ? `Reverted ${path}` : `Reverting ${path}`;
      default:
        return isDone ? `Updated ${path}` : `Updating ${path}`;
    }
  }

  if (toolName === "file_manager") {
    const path = basename(args?.path);
    switch (args?.command) {
      case "rename": {
        const newPath = basename(args?.new_path);
        return isDone ? `Renamed ${path} to ${newPath}` : `Renaming ${path} to ${newPath}`;
      }
      case "delete":
        return isDone ? `Deleted ${path}` : `Deleting ${path}`;
      default:
        return isDone ? `Updated ${path}` : `Updating ${path}`;
    }
  }

  return isDone ? `Ran ${toolName}` : `Running ${toolName}`;
}
