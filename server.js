import jsonServer from "json-server";
import { v4 as uuidv4 } from "uuid";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// REGISTER
server.post("/auth/register", (req, res) => {
  const db = router.db;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "validation failed",
      fields: {
        name: !name ? "is required" : undefined,
        email: !email ? "is required" : undefined,
        password: !password ? "is required" : undefined,
      },
    });
  }

  const existingUser = db.get("users").find({ email }).value();
  if (existingUser) {
    return res.status(400).json({
      error: "validation failed",
      fields: { email: "already exists" },
    });
  }

  const user = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  db.get("users").push(user).write();

  return res.status(201).json({
    token: "mock-token",
    user: { id: user.id, name, email },
  });
});

// LOGIN
server.post("/auth/login", (req, res) => {
  const db = router.db;
  const { email, password } = req.body;

  const user = db.get("users").find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ error: "unauthorized" });
  }

  return res.json({
    token: "mock-token",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// Use default routes
server.use(router);

server.listen(4000, () => {
  console.log("JSON Server running on http://localhost:4000");
});