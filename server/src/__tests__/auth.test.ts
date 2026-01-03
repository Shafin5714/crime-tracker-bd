import request from "supertest";
import app from "../index";
import { prisma } from "../utils/prisma";

describe("Auth API", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  };

  let accessToken: string;
  let refreshToken: string;

  // Clean up before tests
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(201);

      expect(res.body.message).toBe("User registered successfully");
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it("should fail with duplicate email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(409);

      expect(res.body.error).toBe("Email already registered");
    });

    it("should fail with invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "invalid-email",
          password: "password123",
        })
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
      expect(res.body.errors.email).toBeDefined();
    });

    it("should fail with short password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "valid@example.com",
          password: "short",
        })
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
      expect(res.body.errors.password).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(res.body.message).toBe("Login successful");
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();

      // Save tokens for later tests
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it("should fail with wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(res.body.error).toBe("Invalid email or password");
    });

    it("should fail with non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(res.body.error).toBe("Invalid email or password");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should get current user with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
    });

    it("should fail without token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .expect(401);

      expect(res.body.error).toBe("No token provided");
    });

    it("should fail with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(res.body.error).toBe("Invalid or expired access token");
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("should refresh tokens successfully", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(res.body.message).toBe("Token refreshed successfully");
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it("should fail with invalid refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({ refreshToken: "invalid-token" })
        .expect(401);

      expect(res.body.error).toBe("Invalid or expired refresh token");
    });

    it("should fail without refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh")
        .send({})
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .expect(200);

      expect(res.body.message).toBe("Logged out successfully");
    });
  });
});
