import Redis from "ioredis";

const redis = new Redis({
  host: "localhost",
  password: "example",
  port: 6379,
});

async function manageRedis(): Promise<void> {
  try {
    await redis.connect();
    console.log("Connected to Redis");

    await redis.set("name", "Alice");
    await redis.set("age", "30");
    await redis.set("city", "New York");

    console.log("Keys saved");

    const name = await redis.get("name");
    const age = await redis.get("age");
    const city = await redis.get("city");

    console.log(`Name: ${name}`);
    console.log(`Age: ${age}`);
    console.log(`City: ${city}`);

    await redis.disconnect();
    console.log("Disconnected from Redis");
  } catch (error) {
    console.error("Error interacting with Redis:", error);
  }
}

module.exports = { manageRedis };
