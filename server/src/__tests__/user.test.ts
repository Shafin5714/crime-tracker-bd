import request from "supertest";
import app from "../index";
import { prisma } from "../utils/prisma";
import { UserRole } from "@prisma/client";

describe("Users API - RBAC", () => {
  // Test users
  const superAdminUser = {
    email: "superadmin-test@example.com",
    password: "password123",
    name: "Super Admin Test User",
  };

  const adminUser = {
    email: "admin-test@example.com",
    password: "password123",
    name: "Admin Test User",
  };

  const moderatorUser = {
    email: "moderator-test@example.com",
    password: "password123",
    name: "Moderator Test User",
  };

  const regularUser = {
    email: "regular-test@example.com",
    password: "password123",
    name: "Regular Test User",
  };

  const targetUser = {
    email: "target-test@example.com",
    password: "password123",
    name: "Target Test User",
  };

  let superAdminToken: string;
  let superAdminId: string;
  let adminToken: string;
  let adminId: string;
  let moderatorToken: string;
  let moderatorId: string;
  let userToken: string;
  let userId: string;
  let targetUserId: string;

  // Setup: Create test users with different roles
  beforeAll(async () => {
    // Clean up existing test users
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [
            superAdminUser.email,
            adminUser.email,
            moderatorUser.email,
            regularUser.email,
            targetUser.email,
          ],
        },
      },
    });

    // Create Super Admin
    const superAdminRes = await request(app)
      .post("/api/auth/register")
      .send(superAdminUser);
    superAdminId = superAdminRes.body.user.id;
    await prisma.user.update({
      where: { id: superAdminId },
      data: { role: UserRole.SUPER_ADMIN },
    });
    const superAdminLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: superAdminUser.email, password: superAdminUser.password });
    superAdminToken = superAdminLoginRes.body.accessToken;

    // Create Admin
    const adminRes = await request(app)
      .post("/api/auth/register")
      .send(adminUser);
    adminId = adminRes.body.user.id;
    await prisma.user.update({
      where: { id: adminId },
      data: { role: UserRole.ADMIN },
    });
    const adminLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: adminUser.email, password: adminUser.password });
    adminToken = adminLoginRes.body.accessToken;

    // Create Moderator
    const modRes = await request(app)
      .post("/api/auth/register")
      .send(moderatorUser);
    moderatorId = modRes.body.user.id;
    await prisma.user.update({
      where: { id: moderatorId },
      data: { role: UserRole.MODERATOR },
    });
    const modLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: moderatorUser.email, password: moderatorUser.password });
    moderatorToken = modLoginRes.body.accessToken;

    // Create Regular User
    const userRes = await request(app)
      .post("/api/auth/register")
      .send(regularUser);
    userId = userRes.body.user.id;
    userToken = userRes.body.accessToken;

    // Create Target User (for ban/unban tests)
    const targetRes = await request(app)
      .post("/api/auth/register")
      .send(targetUser);
    targetUserId = targetRes.body.user.id;
  });

  // ==========================================
  // GET /api/users - List Users
  // ==========================================
  describe("GET /api/users", () => {
    it("should list users as ADMIN", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.users).toBeDefined();
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
    });

    it("should list users as SUPER_ADMIN", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .expect(200);

      expect(res.body.users).toBeDefined();
    });

    it("should fail to list users as MODERATOR", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${moderatorToken}`)
        .expect(403);

      expect(res.body.error).toBe("Requires ADMIN role or higher");
    });

    it("should fail to list users as regular USER", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.error).toBe("Requires ADMIN role or higher");
    });

    it("should fail without authentication", async () => {
      const res = await request(app)
        .get("/api/users")
        .expect(401);

      expect(res.body.error).toBe("No token provided");
    });

    it("should filter by role", async () => {
      const res = await request(app)
        .get("/api/users?role=ADMIN")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.users).toBeDefined();
      res.body.users.forEach((user: { role: string }) => {
        expect(user.role).toBe("ADMIN");
      });
    });

    it("should paginate correctly", async () => {
      const res = await request(app)
        .get("/api/users?page=1&limit=2")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(2);
    });

    it("should search by name or email", async () => {
      const res = await request(app)
        .get(`/api/users?search=${encodeURIComponent("Target Test")}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.users).toBeDefined();
      expect(res.body.users.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ==========================================
  // GET /api/users/stats - User Statistics
  // ==========================================
  describe("GET /api/users/stats", () => {
    it("should get user stats as ADMIN", async () => {
      const res = await request(app)
        .get("/api/users/stats")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.stats).toBeDefined();
      expect(res.body.stats.totalUsers).toBeDefined();
      expect(res.body.stats.roleDistribution).toBeDefined();
      expect(res.body.stats.bannedCount).toBeDefined();
    });

    it("should fail to get stats as MODERATOR", async () => {
      const res = await request(app)
        .get("/api/users/stats")
        .set("Authorization", `Bearer ${moderatorToken}`)
        .expect(403);

      expect(res.body.error).toBe("Requires ADMIN role or higher");
    });
  });

  // ==========================================
  // GET /api/users/:id - Get User by ID
  // ==========================================
  describe("GET /api/users/:id", () => {
    it("should get user by ID as ADMIN", async () => {
      const res = await request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.id).toBe(userId);
      expect(res.body.user.email).toBe(regularUser.email);
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app)
        .get("/api/users/clxxxxxxxxxxxxxxxxxx")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.error).toBe("User not found");
    });

    it("should fail as regular USER", async () => {
      const res = await request(app)
        .get(`/api/users/${adminId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.error).toBe("Requires ADMIN role or higher");
    });
  });

  // ==========================================
  // PUT /api/users/:id/role - Update User Role
  // ==========================================
  describe("PUT /api/users/:id/role", () => {
    it("should update user role as SUPER_ADMIN", async () => {
      const res = await request(app)
        .put(`/api/users/${userId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "MODERATOR" })
        .expect(200);

      expect(res.body.message).toBe("User role updated successfully");
      expect(res.body.user.role).toBe("MODERATOR");

      // Reset role back to USER
      await request(app)
        .put(`/api/users/${userId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "USER" });
    });

    it("should fail to update role as ADMIN", async () => {
      const res = await request(app)
        .put(`/api/users/${userId}/role`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ role: "MODERATOR" })
        .expect(403);

      expect(res.body.error).toBe("Requires SUPER_ADMIN role or higher");
    });

    it("should fail to update own role", async () => {
      const res = await request(app)
        .put(`/api/users/${superAdminId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "ADMIN" })
        .expect(403);

      expect(res.body.error).toBe("Cannot change your own role");
    });

    it("should fail to modify another SUPER_ADMIN", async () => {
      // Create another super admin
      const anotherSuperAdmin = await prisma.user.create({
        data: {
          email: "another-superadmin@example.com",
          passwordHash: "somehash",
          name: "Another Super Admin",
          role: UserRole.SUPER_ADMIN,
        },
      });

      const res = await request(app)
        .put(`/api/users/${anotherSuperAdmin.id}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "ADMIN" })
        .expect(403);

      expect(res.body.error).toBe("Cannot modify another SUPER_ADMIN");

      // Clean up
      await prisma.user.delete({ where: { id: anotherSuperAdmin.id } });
    });

    it("should fail with invalid role", async () => {
      const res = await request(app)
        .put(`/api/users/${userId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "INVALID_ROLE" })
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app)
        .put("/api/users/clxxxxxxxxxxxxxxxxxx/role")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "ADMIN" })
        .expect(404);

      expect(res.body.error).toBe("User not found");
    });
  });

  // ==========================================
  // POST /api/users/:id/ban - Ban User
  // ==========================================
  describe("POST /api/users/:id/ban", () => {
    it("should ban user as ADMIN", async () => {
      const res = await request(app)
        .post(`/api/users/${targetUserId}/ban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.message).toBe("User banned successfully");
      expect(res.body.user.isBanned).toBe(true);
    });

    it("should fail to ban already banned user", async () => {
      const res = await request(app)
        .post(`/api/users/${targetUserId}/ban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(403);

      expect(res.body.error).toBe("User is already banned");
    });

    it("should fail to ban as MODERATOR", async () => {
      // First unban for this test
      await prisma.user.update({
        where: { id: targetUserId },
        data: { isBanned: false },
      });

      const res = await request(app)
        .post(`/api/users/${targetUserId}/ban`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .expect(403);

      expect(res.body.error).toBe("Requires ADMIN role or higher");
    });

    it("should fail to ban self", async () => {
      const res = await request(app)
        .post(`/api/users/${adminId}/ban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(403);

      expect(res.body.error).toBe("Cannot ban yourself");
    });

    it("should fail to ban user with equal role", async () => {
      // Create another admin
      const anotherAdmin = await prisma.user.create({
        data: {
          email: "another-admin@example.com",
          passwordHash: "somehash",
          name: "Another Admin",
          role: UserRole.ADMIN,
        },
      });

      const res = await request(app)
        .post(`/api/users/${anotherAdmin.id}/ban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(403);

      expect(res.body.error).toBe("Cannot ban a user with equal or higher role");

      // Clean up
      await prisma.user.delete({ where: { id: anotherAdmin.id } });
    });

    it("should fail to ban user with higher role", async () => {
      const res = await request(app)
        .post(`/api/users/${superAdminId}/ban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(403);

      expect(res.body.error).toBe("Cannot ban a user with equal or higher role");
    });
  });

  // ==========================================
  // POST /api/users/:id/unban - Unban User
  // ==========================================
  describe("POST /api/users/:id/unban", () => {
    beforeEach(async () => {
      // Ensure target user is banned before each test
      await prisma.user.update({
        where: { id: targetUserId },
        data: { isBanned: true },
      });
    });

    it("should unban user as ADMIN", async () => {
      const res = await request(app)
        .post(`/api/users/${targetUserId}/unban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.message).toBe("User unbanned successfully");
      expect(res.body.user.isBanned).toBe(false);
    });

    it("should fail to unban non-banned user", async () => {
      // First unban
      await prisma.user.update({
        where: { id: targetUserId },
        data: { isBanned: false },
      });

      const res = await request(app)
        .post(`/api/users/${targetUserId}/unban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(403);

      expect(res.body.error).toBe("User is not banned");
    });

    it("should fail to unban as MODERATOR", async () => {
      const res = await request(app)
        .post(`/api/users/${targetUserId}/unban`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .expect(403);

      expect(res.body.error).toBe("Requires ADMIN role or higher");
    });

    it("should unban user as SUPER_ADMIN", async () => {
      const res = await request(app)
        .post(`/api/users/${targetUserId}/unban`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .expect(200);

      expect(res.body.message).toBe("User unbanned successfully");
    });
  });

  // ==========================================
  // Role Hierarchy Tests
  // ==========================================
  describe("Role Hierarchy", () => {
    it("ADMIN can ban MODERATOR", async () => {
      const res = await request(app)
        .post(`/api/users/${moderatorId}/ban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.user.isBanned).toBe(true);

      // Unban for cleanup
      await prisma.user.update({
        where: { id: moderatorId },
        data: { isBanned: false },
      });
    });

    it("ADMIN can ban USER", async () => {
      const res = await request(app)
        .post(`/api/users/${userId}/ban`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.user.isBanned).toBe(true);

      // Unban for cleanup
      await prisma.user.update({
        where: { id: userId },
        data: { isBanned: false },
      });
    });

    it("SUPER_ADMIN can ban ADMIN", async () => {
      const res = await request(app)
        .post(`/api/users/${adminId}/ban`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .expect(200);

      expect(res.body.user.isBanned).toBe(true);

      // Unban and re-login for subsequent tests
      await prisma.user.update({
        where: { id: adminId },
        data: { isBanned: false },
      });
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ email: adminUser.email, password: adminUser.password });
      adminToken = loginRes.body.accessToken;
    });

    it("SUPER_ADMIN can promote USER to ADMIN", async () => {
      const res = await request(app)
        .put(`/api/users/${userId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "ADMIN" })
        .expect(200);

      expect(res.body.user.role).toBe("ADMIN");

      // Reset role
      await request(app)
        .put(`/api/users/${userId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "USER" });
    });

    it("SUPER_ADMIN can demote ADMIN to USER", async () => {
      // First promote
      await request(app)
        .put(`/api/users/${userId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "ADMIN" });

      const res = await request(app)
        .put(`/api/users/${userId}/role`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ role: "USER" })
        .expect(200);

      expect(res.body.user.role).toBe("USER");
    });
  });
});
