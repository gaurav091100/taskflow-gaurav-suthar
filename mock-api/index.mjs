import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT) || 4000;

let users = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
  },
];

let projects = [
  {
    id: "1",
    name: "Demo Project",
    description: "Test project",
    owner_id: "1",
    created_at: "2026-04-01T10:00:00.000Z",
  },
];

let mockTasks = [
  {
    id: "1",
    title: "Design UI",
    description: "Homepage",
    status: "todo",
    priority: "high",
    project_id: "1",
    assignee_id: "1",
    due_date: "2026-04-15",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "API integration",
    description: "Wire tasks to backend",
    status: "in_progress",
    priority: "medium",
    project_id: "1",
    assignee_id: "2",
    due_date: "2026-04-20",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Write README",
    description: "Setup and architecture",
    status: "done",
    priority: "low",
    project_id: "1",
    assignee_id: null,
    due_date: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email };
}

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "unauthorized" });
  }
  res.json({ token: "mock-token", user: publicUser(user) });
});

app.post("/auth/register", (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (!name || !email || !password) {
    return res.status(400).json({
      error: "validation failed",
      fields: {
        ...(!name && { name: "is required" }),
        ...(!email && { email: "is required" }),
        ...(!password && { password: "is required" }),
      },
    });
  }
  if (users.some((u) => u.email === email)) {
    return res.status(400).json({
      error: "validation failed",
      fields: { email: "user already exists" },
    });
  }
  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
  };
  users.push(newUser);
  res.status(201).json({ token: "mock-token", user: publicUser(newUser) });
});

app.get("/projects", (_req, res) => {
  res.json({ projects });
});

app.get("/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: "not found" });
  }
  const tasks = mockTasks.filter((t) => t.project_id === req.params.id);
  res.json({ ...project, tasks });
});

app.post("/projects", (req, res) => {
  const body = req.body ?? {};
  const newProject = {
    id: crypto.randomUUID(),
    name: body.name ?? "",
    description: body.description ?? "",
    owner_id: "1",
    created_at: new Date().toISOString(),
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

app.patch("/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: "not found" });
  }
  Object.assign(project, req.body ?? {});
  res.json(project);
});

app.delete("/projects/:id", (req, res) => {
  const pid = req.params.id;
  projects = projects.filter((p) => p.id !== pid);
  mockTasks = mockTasks.filter((t) => t.project_id !== pid);
  res.status(204).send();
});

app.get("/projects/:id/tasks", (req, res) => {
  const statusQ = req.query.status;
  const assigneeQ = req.query.assignee;
  let tasks = mockTasks.filter((t) => t.project_id === req.params.id);
  if (statusQ) {
    tasks = tasks.filter((t) => t.status === statusQ);
  }
  if (assigneeQ === "unassigned") {
    tasks = tasks.filter((t) => t.assignee_id == null);
  } else if (assigneeQ) {
    tasks = tasks.filter((t) => t.assignee_id === assigneeQ);
  }
  res.json({ tasks });
});

app.post("/projects/:id/tasks", (req, res) => {
  const body = req.body ?? {};
  const pid = req.params.id;
  const rawAssignee = body.assignee_id;
  const assigneeId =
    rawAssignee != null && String(rawAssignee) !== ""
      ? String(rawAssignee)
      : null;
  const newTask = {
    id: crypto.randomUUID(),
    title: String(body.title ?? ""),
    description: String(body.description ?? ""),
    status: body.status || "todo",
    priority: body.priority || "medium",
    project_id: pid,
    assignee_id: assigneeId,
    due_date: body.due_date || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockTasks.push(newTask);
  res.status(201).json(newTask);
});

app.patch("/tasks/:id", (req, res) => {
  const task = mockTasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: "not found" });
  }
  const body = req.body ?? {};
  const next = { ...task, ...body, updated_at: new Date().toISOString() };
  if ("assignee_id" in body && body.assignee_id === "") {
    next.assignee_id = null;
  }
  Object.assign(task, next);
  res.json(task);
});

app.delete("/tasks/:id", (req, res) => {
  mockTasks = mockTasks.filter((t) => t.id !== req.params.id);
  res.status(204).send();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`TaskFlow mock API listening on http://0.0.0.0:${PORT}`);
});
