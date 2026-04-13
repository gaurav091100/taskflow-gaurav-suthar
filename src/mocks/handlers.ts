import { http, HttpResponse } from "msw";
import { API_BASE_URL } from "../config";
import type { Task } from "@/features/tasks/types";
import type { UserRecord } from "@/features/auth/types";
import type { Project } from "@/features/projects/types";



const users: UserRecord[] = [
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

let projects:Project[] = [
  {
    id: "1",
    name: "Demo Project",
    description: "Test project",
    owner_id: "1",
    created_at: "2026-04-01T10:00:00.000Z",
  },
];

let mockTasks: Task[] = [
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

function publicUser(u: UserRecord) {
  return { id: u.id, name: u.name, email: u.email };
}

export const handlers = [
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const user = users.find(
      (u) => u.email === body.email && u.password === body.password
    );

    if (!user) {
      return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    return HttpResponse.json({
      token: "mock-token",
      user: publicUser(user),
    });
  }),

  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json(
        {
          error: "validation failed",
          fields: {
            ...(!body.name && { name: "is required" }),
            ...(!body.email && { email: "is required" }),
            ...(!body.password && { password: "is required" }),
          },
        },
        { status: 400 }
      );
    }

    const exists = users.find((u) => u.email === body.email);
    if (exists) {
      return HttpResponse.json(
        {
          error: "validation failed",
          fields: { email: "user already exists" },
        },
        { status: 400 }
      );
    }

    const newUser: UserRecord = {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email,
      password: body.password,
    };

    users.push(newUser);

    return HttpResponse.json(
      {
        token: "mock-token",
        user: publicUser(newUser),
      },
      { status: 201 }
    );
  }),

  http.get(`${API_BASE_URL}/projects`, () => {
    return HttpResponse.json({ projects });
  }),


  http.get(`${API_BASE_URL}/projects/:id`, ({ params }) => {
    const project = projects.find((p) => p.id === params.id);
  
    if (!project) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }
  
    const tasks = mockTasks
      .filter((t) => t.project_id === params.id)
      .map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        assignee_id: task.assignee_id || null,
        due_date: task.due_date || null,
        created_at: task.created_at,
        updated_at: task.updated_at,
      }));
  
    return HttpResponse.json({
      id: project.id,
      name: project.name,
      description: project.description || "",
      owner_id: project.owner_id,
      tasks,
    });
  }),

  http.post(`${API_BASE_URL}/projects`, async ({ request }) => {
    const body = (await request.json()) as {
      name?: string;
      description?: string;
    };

    const newProject = {
      id: crypto.randomUUID(),
      name: body.name ?? "",
      description: body.description ?? "",
      owner_id: "1",
      created_at: new Date().toISOString(),
    };

    projects.push(newProject);

    return HttpResponse.json(newProject, { status: 201 });
  }),

  http.patch(`${API_BASE_URL}/projects/:id`, async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const project = projects.find((p) => p.id === params.id);

    if (!project) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }

    Object.assign(project, body);

    return HttpResponse.json(project);
  }),

  http.delete(`${API_BASE_URL}/projects/:id`, ({ params }) => {
    const pid = params.id as string;
    projects = projects.filter((p) => p.id !== pid);
    mockTasks = mockTasks.filter((t) => t.project_id !== pid);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_BASE_URL}/projects/:id/tasks`, ({ params, request }) => {
    const url = new URL(request.url);
    const statusQ = url.searchParams.get("status") ?? undefined;
    const assigneeQ = url.searchParams.get("assignee") ?? undefined;
    const pid = params.id as string;

    let tasks = mockTasks.filter(() => pid === params.id);

    if (statusQ) {
      tasks = tasks.filter((t) => t.status === statusQ);
    }
    if (assigneeQ === "unassigned") {
      tasks = tasks.filter((t) => t.assignee_id == null);
    } else if (assigneeQ) {
      tasks = tasks.filter((t) => t.assignee_id === assigneeQ);
    }

    return HttpResponse.json({ tasks });
  }),

  http.post(
    `${API_BASE_URL}/projects/:id/tasks`,
    async ({ request }) => {
      const body = (await request.json()) as Record<string, unknown>;

      const rawAssignee = body.assignee_id;
      const assigneeId =
        rawAssignee != null && String(rawAssignee) !== ""
          ? String(rawAssignee)
          : null;

      const newTask: Task = {
        id: crypto.randomUUID(),
        title: String(body.title ?? ""),
        description: String(body.description ?? ""),
        priority: (body.priority as Task["priority"]) || "medium",
        assignee_id: assigneeId,
        due_date: (body.due_date as string) || null,
      };

      mockTasks.push(newTask);

      return HttpResponse.json(newTask, { status: 201 });
    }
  ),

  http.patch(`${API_BASE_URL}/tasks/:id`, async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const task = mockTasks.find((t) => t.id === params.id);

    if (!task) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }

    const next = { ...task, ...body, updated_at: new Date().toISOString() };
    if ("assignee_id" in body && body.assignee_id === "") {
      next.assignee_id = null;
    }
    Object.assign(task, next);

    return HttpResponse.json(task);
  }),

  http.delete(`${API_BASE_URL}/tasks/:id`, ({ params }) => {
    mockTasks = mockTasks.filter((t) => t.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];
