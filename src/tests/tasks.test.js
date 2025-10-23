import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

let token;

beforeAll(async () => {
  await request(app).post("/api/auth/register").send({
    name: "Task User",
    email: "taskuser@example.com",
    password: "password123",
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "taskuser@example.com",
    password: "password123",
  });

  token = res.body.token;
});

describe("Task API", () => {
  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task", description: "Task desc" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Test Task");
  });

  it("should get all tasks", async () => {
    await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Task 1", description: "Desc" });

    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should update a task", async () => {
    const taskRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Old Task" });

    const res = await request(app)
      .put(`/api/tasks/${taskRes.body._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Task" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
  });

  it("should delete a task", async () => {
    const taskRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Task to Delete" });

    const res = await request(app)
      .delete(`/api/tasks/${taskRes.body._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted successfully");
  });
});
