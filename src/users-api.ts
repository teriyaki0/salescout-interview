import express, { Request, Response } from "express";
const app = express();

app.use(express.json());

const users: { name: string }[] = [];

app.post("/user", (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    throw new Error("Name is required");
  }
  users.push({ name });
  res.status(200).json({ message: "User added successfully" });
});

app.get("/users", (req: Request, res: Response) => {
  res.status(200).json(users);
});

if (process.env.NODE_ENV !== "test") {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
