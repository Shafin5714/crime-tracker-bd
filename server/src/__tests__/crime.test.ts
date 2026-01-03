import request from "supertest";
import app from "../index";
import { prisma } from "../utils/prisma";
import { UserRole } from "@prisma/client";

describe("Crimes API", () => {
  // Test users
  const testUser = {
    email: "crimetest@example.com",
    password: "password123",
    name: "Crime Test User",
  };

  const moderatorUser = {
    email: "crimemod@example.com",
    password: "password123",
    name: "Crime Moderator User",
  };

  const adminUser = {
    email: "crimeadmin@example.com",
    password: "password123",
    name: "Crime Admin User",
  };

  let userToken: string;
  let moderatorToken: string;
  let adminToken: string;

  // Get valid crime report data with fresh timestamp
  const getValidCrimeReport = () => ({
    crimeType: "ROBBERY",
    description: "A robbery occurred at the main street near the bank. The suspect fled on a motorcycle.",
    severity: "HIGH",
    latitude: 23.8103,
    longitude: 90.4125,
    address: "123 Main Street, Dhaka",
    division: "Dhaka",
    district: "Dhaka",
    occurredAt: new Date().toISOString(),
    isAnonymous: false,
  });

  // Helper to create a report - returns the report ID
  const createTestReport = async (token: string): Promise<string> => {
    const res = await request(app)
      .post("/api/crimes")
      .set("Authorization", `Bearer ${token}`)
      .send(getValidCrimeReport());
    
    if (!res.body.data?.id) {
      console.error("Failed to create report:", res.body);
      throw new Error(`Failed to create test report: ${JSON.stringify(res.body)}`);
    }
    return res.body.data.id;
  };

  // Setup: Create test users and get tokens
  beforeAll(async () => {
    // Clean up existing test data
    await prisma.crimeValidation.deleteMany();
    await prisma.crimeReport.deleteMany();
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [testUser.email, moderatorUser.email, adminUser.email],
        },
      },
    });

    // Register regular user
    const userRes = await request(app)
      .post("/api/auth/register")
      .send(testUser);
    userToken = userRes.body.accessToken;

    // Register and upgrade moderator
    const modRes = await request(app)
      .post("/api/auth/register")
      .send(moderatorUser);
    await prisma.user.update({
      where: { id: modRes.body.user.id },
      data: { role: UserRole.MODERATOR },
    });
    const modLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: moderatorUser.email, password: moderatorUser.password });
    moderatorToken = modLoginRes.body.accessToken;

    // Register and upgrade admin
    const adminRes = await request(app)
      .post("/api/auth/register")
      .send(adminUser);
    await prisma.user.update({
      where: { id: adminRes.body.user.id },
      data: { role: UserRole.ADMIN },
    });
    const adminLoginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: adminUser.email, password: adminUser.password });
    adminToken = adminLoginRes.body.accessToken;
  });

  // ==========================================
  // POST /api/crimes - Create Crime Report
  // ==========================================
  describe("POST /api/crimes", () => {
    it("should create a crime report with authentication", async () => {
      const res = await request(app)
        .post("/api/crimes")
        .set("Authorization", `Bearer ${userToken}`)
        .send(getValidCrimeReport())
        .expect(201);

      expect(res.body.message).toBe("Crime report submitted successfully");
      expect(res.body.data).toBeDefined();
      expect(res.body.data.crimeType).toBe("ROBBERY");
      expect(res.body.data.severity).toBe("HIGH");
      expect(res.body.data.status).toBe("UNVERIFIED");
    });

    it("should create an anonymous crime report without auth", async () => {
      const res = await request(app)
        .post("/api/crimes")
        .send({ ...getValidCrimeReport(), isAnonymous: true })
        .expect(201);

      expect(res.body.data.isAnonymous).toBe(true);
      expect(res.body.data.userId).toBeNull();
    });

    it("should fail non-anonymous report without auth", async () => {
      const res = await request(app)
        .post("/api/crimes")
        .send({ ...getValidCrimeReport(), isAnonymous: false })
        .expect(401);

      expect(res.body.error).toBe("Authentication required for non-anonymous reports");
    });

    it("should fail with invalid crime type", async () => {
      const res = await request(app)
        .post("/api/crimes")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ ...getValidCrimeReport(), crimeType: "INVALID_TYPE" })
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
    });

    it("should fail with short description", async () => {
      const res = await request(app)
        .post("/api/crimes")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ ...getValidCrimeReport(), description: "Too short" })
        .expect(400);

      expect(res.body.error).toBe("Validation failed");
    });
  });

  // ==========================================
  // GET /api/crimes - List Crime Reports
  // ==========================================
  describe("GET /api/crimes", () => {
    it("should list crime reports with default pagination", async () => {
      const res = await request(app)
        .get("/api/crimes")
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(20);
    });

    it("should filter by crime type", async () => {
      const res = await request(app)
        .get("/api/crimes?crimeType=ROBBERY")
        .expect(200);

      expect(res.body.data).toBeDefined();
      res.body.data.forEach((report: { crimeType: string }) => {
        expect(report.crimeType).toBe("ROBBERY");
      });
    });

    it("should paginate correctly", async () => {
      const res = await request(app)
        .get("/api/crimes?page=1&limit=5")
        .expect(200);

      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(5);
    });
  });

  // ==========================================
  // GET /api/crimes/:id - Get Single Report
  // ==========================================
  describe("GET /api/crimes/:id", () => {
    it("should get crime report by ID", async () => {
      const reportId = await createTestReport(userToken);
      
      const res = await request(app)
        .get(`/api/crimes/${reportId}`)
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBe(reportId);
    });

    it("should return 404 for non-existent report", async () => {
      const res = await request(app)
        .get("/api/crimes/clxxxxxxxxxxxxxxxxxx")
        .expect(404);

      expect(res.body.error).toBe("Crime report not found");
    });
  });

  // ==========================================
  // GET /api/crimes/heatmap - Heatmap Data
  // ==========================================
  describe("GET /api/crimes/heatmap", () => {
    it("should get heatmap data", async () => {
      const res = await request(app)
        .get("/api/crimes/heatmap")
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  // ==========================================
  // GET /api/crimes/stats - Statistics
  // ==========================================
  describe("GET /api/crimes/stats", () => {
    it("should get crime statistics", async () => {
      const res = await request(app)
        .get("/api/crimes/stats")
        .expect(200);

      expect(res.body.data).toBeDefined();
      expect(res.body.data.total).toBeDefined();
      expect(res.body.data.byType).toBeDefined();
      expect(res.body.data.bySeverity).toBeDefined();
    });
  });

  // ==========================================
  // POST /api/crimes/:id/validate - Validate Report
  // ==========================================
  describe("POST /api/crimes/:id/validate", () => {
    it("should confirm a crime report", async () => {
      const reportId = await createTestReport(userToken);
      
      const res = await request(app)
        .post(`/api/crimes/${reportId}/validate`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .send({ type: "CONFIRM", comment: "I witnessed this incident" })
        .expect(200);

      expect(res.body.message).toBe("Report confirmed successfully");
      expect(res.body.data.verificationCount).toBe(1);
    });

    it("should fail to validate own report", async () => {
      const reportId = await createTestReport(userToken);
      
      const res = await request(app)
        .post(`/api/crimes/${reportId}/validate`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ type: "CONFIRM" })
        .expect(403);

      expect(res.body.error).toBe("You cannot validate your own report");
    });

    it("should fail to validate same report twice", async () => {
      const reportId = await createTestReport(userToken);
      
      // First validation
      await request(app)
        .post(`/api/crimes/${reportId}/validate`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .send({ type: "CONFIRM" })
        .expect(200);

      // Second validation attempt - should fail
      const res = await request(app)
        .post(`/api/crimes/${reportId}/validate`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .send({ type: "CONFIRM" })
        .expect(409);

      expect(res.body.error).toBe("You have already validated this report");
    });

    it("should fail without authentication", async () => {
      const reportId = await createTestReport(userToken);
      
      const res = await request(app)
        .post(`/api/crimes/${reportId}/validate`)
        .send({ type: "CONFIRM" })
        .expect(401);

      expect(res.body.error).toBe("No token provided");
    });
  });

  // ==========================================
  // PUT /api/crimes/:id - Update Report
  // ==========================================
  describe("PUT /api/crimes/:id", () => {
    it("should update report as moderator", async () => {
      const reportId = await createTestReport(userToken);
      
      const res = await request(app)
        .put(`/api/crimes/${reportId}`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .send({ severity: "CRITICAL", status: "VERIFIED" })
        .expect(200);

      expect(res.body.message).toBe("Crime report updated successfully");
      expect(res.body.data.severity).toBe("CRITICAL");
      expect(res.body.data.status).toBe("VERIFIED");
    });

    it("should fail to update as regular user", async () => {
      const reportId = await createTestReport(userToken);
      
      const res = await request(app)
        .put(`/api/crimes/${reportId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ severity: "LOW" })
        .expect(403);

      expect(res.body.error).toBe("Requires MODERATOR role or higher");
    });

    it("should return 404 for non-existent report", async () => {
      const res = await request(app)
        .put("/api/crimes/clxxxxxxxxxxxxxxxxxx")
        .set("Authorization", `Bearer ${moderatorToken}`)
        .send({ severity: "LOW" })
        .expect(404);

      expect(res.body.error).toBe("Crime report not found");
    });
  });

  // ==========================================
  // DELETE /api/crimes/:id - Delete Report
  // ==========================================
  describe("DELETE /api/crimes/:id", () => {
    it("should fail to delete as regular user", async () => {
      const reportId = await createTestReport(userToken);
      
      const res = await request(app)
        .delete(`/api/crimes/${reportId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(res.body.error).toBe("Requires ADMIN role or higher");
    });

    it("should fail to delete as moderator", async () => {
      const reportId = await createTestReport(userToken);
      
      const res = await request(app)
        .delete(`/api/crimes/${reportId}`)
        .set("Authorization", `Bearer ${moderatorToken}`)
        .expect(403);

      expect(res.body.error).toBe("Requires ADMIN role or higher");
    });

    it("should delete report as admin", async () => {
      const reportId = await createTestReport(userToken);
      
      const res = await request(app)
        .delete(`/api/crimes/${reportId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.message).toBe("Crime report deleted successfully");
    });

    it("should return 404 for non-existent report", async () => {
      const res = await request(app)
        .delete("/api/crimes/clxxxxxxxxxxxxxxxxxx")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(404);

      expect(res.body.error).toBe("Crime report not found");
    });
  });
});
