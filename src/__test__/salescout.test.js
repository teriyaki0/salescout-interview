import { filterAndSortProducts } from "../logic";
import axios from "axios";
jest.mock("axios");
import { fetchLongPosts } from "../work-with-api";
import mongoose from "mongoose";
jest.mock("mongoose", () => ({
  model: jest.fn().mockReturnValue({
    create: jest.fn(),
    aggregate: jest
      .fn()
      .mockResolvedValue([{ email: "duplicate@example.com" }]),
  }),
  connect: jest.fn(),
  disconnect: jest.fn(),
}));
import { manageUsers } from "../work-with-mongodb";
import request from "supertest";
import app from "../users-api";
import { fetchAll } from "../asynchonus-development";
jest.mock("redis", () => {
  const redisMock = require("redis-mock");
  return redisMock;
});
import { manageRedis } from "../work-with-redis";
import redis from "redis";
let server;
beforeAll(() => {
  server = app.listen(4000);
});
afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});
afterAll(async () => {
  await mongoose.disconnect();
  const mockRedisClient = redis.createClient();
  mockRedisClient.quit();
  if (server) {
    server.close();
  }
});
test("filterAndSortProducts should return unique products sorted by price", () => {
  const a = [
    { name: "A", price: 30 },
    { name: "B", price: 20 },
    { name: "A", price: 30 },
    { name: "C", price: 10 },
  ];
  const b = filterAndSortProducts(a);
  const c = [
    { name: "C", price: 10 },
    { name: "B", price: 20 },
    { name: "A", price: 30 },
  ];
  expect(b).toEqual(c);
});
test("fetchLongPosts should return posts longer than 100 characters", async () => {
  axios.get.mockResolvedValue({
    data: [
      { id: 1, userId: 1, title: "Post 1", body: "Short body" },
      {
        id: 2,
        userId: 1,
        title: "Post 2",
        body: "A long body exceeding 100 characters is here...",
      },
    ],
  });
  const a = await fetchLongPosts();
  expect(a).toEqual([
    {
      id: 2,
      userId: 1,
      title: "Post 2",
      body: "A long body exceeding 100 characters is here...",
    },
  ]);
});
test("manageUsers should find users with duplicate emails", async () => {
  const a = await manageUsers();
  expect(a).toEqual([{ email: "duplicate@example.com" }]);
});
test("POST /user and GET /users should work correctly", async () => {
  await request(server).post("/user").send({ name: "John" }).expect(200);
  const a = await request(server).get("/users").expect(200);
  expect(a.body).toEqual([{ name: "John" }]);
});
test("POST /user should return 400 if no name is provided", async () => {
  const a = await request(server).post("/user").send({}).expect(400);
  expect(a.body).toEqual({ error: "Name is required" });
});
test("fetchAll should fetch data from multiple URLs in parallel", async () => {
  axios.get.mockResolvedValueOnce({ data: "Result 1", status: 200 });
  axios.get.mockResolvedValueOnce({ data: "Result 2", status: 200 });
  const a = ["url1", "url2"];
  const b = await fetchAll(a);
  expect(b).toEqual([
    { data: "Result 1", status: 200 },
    { data: "Result 2", status: 200 },
  ]);
});
test("manageRedis should save and retrieve keys", async () => {
  const a = redis.createClient();
  jest.spyOn(a, "set").mockImplementation((b, c, d) => d(null, "OK"));
  jest.spyOn(a, "get").mockImplementation((b, c) => c(null, "value"));
  await manageRedis();
  expect(a.set).toHaveBeenCalledWith("key", "value", expect.any(Function));
  expect(a.get).toHaveBeenCalledWith("key", expect.any(Function));
  a.quit();
});
