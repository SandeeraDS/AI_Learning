import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

test("shows in-progress label for create command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "create", path: "/App.jsx" },
      }}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows completed label for create command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "/App.jsx" },
        result: "Success",
      }}
    />
  );
  expect(screen.getByText("Created App.jsx")).toBeDefined();
});

test("shows in-progress label for str_replace command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "2",
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "str_replace", path: "/components/Card.jsx" },
      }}
    />
  );
  expect(screen.getByText("Editing Card.jsx")).toBeDefined();
});

test("shows completed label for str_replace command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "2",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "str_replace", path: "/components/Card.jsx" },
        result: "Success",
      }}
    />
  );
  expect(screen.getByText("Edited Card.jsx")).toBeDefined();
});

test("shows completed label for insert command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "3",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "insert", path: "/App.jsx" },
        result: "Success",
      }}
    />
  );
  expect(screen.getByText("Edited App.jsx")).toBeDefined();
});

test("shows in-progress label for view command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "4",
        toolName: "str_replace_editor",
        state: "partial-call",
        args: { command: "view", path: "/App.jsx" },
      }}
    />
  );
  expect(screen.getByText("Viewing App.jsx")).toBeDefined();
});

test("shows completed label for view command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "4",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "view", path: "/App.jsx" },
        result: "file contents",
      }}
    />
  );
  expect(screen.getByText("Viewed App.jsx")).toBeDefined();
});

test("shows completed label for undo_edit command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "5",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "undo_edit", path: "/App.jsx" },
        result: "Error: not supported",
      }}
    />
  );
  expect(screen.getByText("Reverted App.jsx")).toBeDefined();
});

test("shows in-progress label for rename command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "6",
        toolName: "file_manager",
        state: "call",
        args: { command: "rename", path: "/Foo.jsx", new_path: "/Bar.jsx" },
      }}
    />
  );
  expect(screen.getByText("Renaming Foo.jsx to Bar.jsx")).toBeDefined();
});

test("shows completed label for rename command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "6",
        toolName: "file_manager",
        state: "result",
        args: { command: "rename", path: "/Foo.jsx", new_path: "/Bar.jsx" },
        result: { success: true, message: "Successfully renamed" },
      }}
    />
  );
  expect(screen.getByText("Renamed Foo.jsx to Bar.jsx")).toBeDefined();
});

test("shows in-progress label for delete command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "7",
        toolName: "file_manager",
        state: "call",
        args: { command: "delete", path: "/Foo.jsx" },
      }}
    />
  );
  expect(screen.getByText("Deleting Foo.jsx")).toBeDefined();
});

test("shows completed label for delete command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "7",
        toolName: "file_manager",
        state: "result",
        args: { command: "delete", path: "/Foo.jsx" },
        result: { success: true, message: "Successfully deleted" },
      }}
    />
  );
  expect(screen.getByText("Deleted Foo.jsx")).toBeDefined();
});

test("shows only the basename for nested paths", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "8",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "/components/ui/Button.jsx" },
        result: "Success",
      }}
    />
  );
  expect(screen.getByText("Created Button.jsx")).toBeDefined();
});

test("falls back to a generic label for an unrecognized command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "9",
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "unknown_command" as any, path: "/App.jsx" },
      }}
    />
  );
  expect(screen.getByText("Updating App.jsx")).toBeDefined();
});

test("falls back to the raw tool name for an unrecognized tool", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "10",
        toolName: "some_other_tool",
        state: "call",
        args: {},
      }}
    />
  );
  expect(screen.getByText("Running some_other_tool")).toBeDefined();
});

test("shows a spinner while in progress and a dot when complete", () => {
  const { container, rerender } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "11",
        toolName: "str_replace_editor",
        state: "call",
        args: { command: "create", path: "/App.jsx" },
      }}
    />
  );
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();

  rerender(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "11",
        toolName: "str_replace_editor",
        state: "result",
        args: { command: "create", path: "/App.jsx" },
        result: "Success",
      }}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
