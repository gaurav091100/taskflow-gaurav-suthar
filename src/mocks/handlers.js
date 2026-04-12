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
    status: "todo",
    priority: "high",
    project_id: "1",
    assignee_id: "1",
    due_date: "2026-04-15",
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

  // TASKS
  http.get("http://localhost:4000/projects/:id/tasks", ({ params }) => {
    const tasks = mockTasks.filter(
      (t) => t.project_id === params.id
    );

    return HttpResponse.json({ tasks });
  }),
];