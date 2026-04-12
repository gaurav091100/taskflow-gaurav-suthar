import { http, HttpResponse } from "msw";

let users = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  },
];

let projects = [
  {
    id: "1",
    name: "Demo Project",
    description: "Test project",
    owner_id: "1",
    created_at: "2026-04-01",
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
];

export const handlers = [
  // LOGIN
  http.post("http://localhost:4000/auth/login", async ({ request }) => {
    const body = await request.json();

    const user = users.find(
      (u) => u.email === body.email && u.password === body.password
    );

    if (!user) {
      return HttpResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      token: "mock-token",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  }),

  // REGISTER
  http.post("http://localhost:4000/auth/register", async ({ request }) => {
    const body = await request.json();

    if (!body.name || !body.email || !body.password) {
      return HttpResponse.json(
        {
          error: "validation failed",
          fields: {
            name: !body.name ? "is required" : undefined,
            email: !body.email ? "is required" : undefined,
            password: !body.password ? "is required" : undefined,
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

    const newUser = {
      id: crypto.randomUUID(),
      ...body,
    };

    users.push(newUser);

    return HttpResponse.json(
      {
        token: "mock-token",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  }),

  // PROJECTS
  http.get("http://localhost:4000/projects", () => {
    return HttpResponse.json({ projects });
  }), 

  // GET SINGLE PROJECT (with tasks)
  http.get("http://localhost:4000/projects/:id", ({ params }) => {
    const project = projects.find((p) => p.id === params.id);

    if (!project) {
      return HttpResponse.json(
        { error: "not found" },
        { status: 404 }
      );
    }

    const tasks = mockTasks.filter(
      (t) => t.project_id === params.id
    );

    return HttpResponse.json({
      ...project,
      tasks,
    });
  }),

  // CREATE PROJECT
  http.post("http://localhost:4000/projects", async ({ request }) => {
    const body = await request.json();

    const newProject = {
      id: crypto.randomUUID(),
      ...body,
      owner_id: "1",
      created_at: new Date().toISOString(),
    };

    projects.push(newProject);

    return HttpResponse.json(newProject, { status: 201 });
  }),

  // UPDATE PROJECT
  http.patch("http://localhost:4000/projects/:id", async ({ request, params }) => {
    const body = await request.json();

    const project = projects.find((p) => p.id === params.id);

    if (!project) {
      return HttpResponse.json({ error: "project not found" }, { status: 404 });
    }

    Object.assign(project, body);

    return HttpResponse.json(project)
  }),

  // DELETE PROJECT
  http.delete("http://localhost:4000/projects/:id", ({ params }) => {
    projects = projects.filter((p) => p.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),

  // TASKS
  http.get("http://localhost:4000/projects/:id/tasks", ({ params }) => {
    const tasks = mockTasks.filter(
      (t) => t.project_id === params.id
    );

    return HttpResponse.json({ tasks });
  }),

  // CREATE TASK
  http.post("http://localhost:4000/projects/:id/tasks", async ({ request, params }) => {
    const body = await request.json();

    const newTask = {
      id: crypto.randomUUID(),
      title: body.title,
      description: body.description || "",
      status: body.status || "todo",
      priority: body.priority || "medium",
      project_id: params.id,
      assignee_id: body.assignee_id || "1",
      due_date: body.due_date || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockTasks.push(newTask);

    return HttpResponse.json(newTask, { status: 201 });
  }),

  // UPDATE TASK
  http.patch("http://localhost:4000/tasks/:id", async ({ request, params }) => {
    const body = await request.json();

    const task = mockTasks.find((t) => t.id === params.id);

    if (!task) {
      return HttpResponse.json({ error: "not found" }, { status: 404 });
    }

    Object.assign(task, body, {
      updated_at: new Date().toISOString(),
    });

    return HttpResponse.json(task);
  }),

  // DELETE TASK
  http.delete("http://localhost:4000/tasks/:id", ({ params }) => {
    mockTasks = mockTasks.filter((t) => t.id !== params.id);
    return new HttpResponse(null, { status: 204 });
  }),
];