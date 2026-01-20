import { prisma } from "../utils/prisma";
import {
  CrimeType,
  Severity,
  ReportStatus,
  ValidationType,
  Prisma,
} from "@prisma/client";
import { NotFoundError, ForbiddenError, ConflictError } from "../utils/errors";
import {
  CreateCrimeInput,
  UpdateCrimeInput,
  ValidateCrimeInput,
  ListCrimesQuery,
  HeatmapQuery,
} from "../schemas/crime.schema";

// Thresholds for auto-verification
const VERIFICATION_THRESHOLD = 5; // Reports with 5+ confirmations become VERIFIED
const DISPUTE_THRESHOLD = 3; // Reports with 3+ denials become DISPUTED

// Create a new crime report
export const createCrimeReport = async (
  data: CreateCrimeInput,
  userId?: string,
) => {
  const report = await prisma.crimeReport.create({
    data: {
      userId: data.isAnonymous ? null : userId,
      isAnonymous: data.isAnonymous ?? false,
      crimeType: data.crimeType,
      description: data.description,
      severity: data.severity,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      division: data.division,
      district: data.district,
      occurredAt: new Date(data.occurredAt),
      media: data.media || [],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return report;
};

// Get crime report by ID
export const getCrimeReportById = async (id: string) => {
  const report = await prisma.crimeReport.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      validations: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!report) {
    throw new NotFoundError("Crime report not found");
  }

  return report;
};

// List crime reports with filters and pagination
export const listCrimeReports = async (query: ListCrimesQuery) => {
  const {
    page = 1,
    limit = 20,
    crimeType,
    severity,
    status,
    division,
    district,
    startDate,
    endDate,
    minLat,
    maxLat,
    minLng,
    maxLng,
    lat,
    lng,
    radius,
  } = query;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: Prisma.CrimeReportWhereInput = {
    // Don't show REMOVED reports to regular users
    status: status ?? { not: ReportStatus.REMOVED },
  };

  // Apply filters
  if (crimeType) where.crimeType = crimeType;
  if (severity) where.severity = severity;
  if (division) where.division = division;
  if (district) where.district = district;

  // Date range filter
  if (startDate || endDate) {
    where.occurredAt = {};
    if (startDate) where.occurredAt.gte = new Date(startDate);
    if (endDate) where.occurredAt.lte = new Date(endDate);
  }

  // Bounding box filter
  if (
    minLat !== undefined &&
    maxLat !== undefined &&
    minLng !== undefined &&
    maxLng !== undefined
  ) {
    where.latitude = { gte: minLat, lte: maxLat };
    where.longitude = { gte: minLng, lte: maxLng };
  }

  // Radius search (approximation using bounding box, then filter)
  let radiusFilter = false;
  if (lat !== undefined && lng !== undefined && radius !== undefined) {
    // Convert radius (km) to approximate degrees
    const latDelta = radius / 111; // 1 degree ≈ 111 km
    const lngDelta = radius / (111 * Math.cos((lat * Math.PI) / 180));

    where.latitude = { gte: lat - latDelta, lte: lat + latDelta };
    where.longitude = { gte: lng - lngDelta, lte: lng + lngDelta };
    radiusFilter = true;
  }

  const [reports, total] = await Promise.all([
    prisma.crimeReport.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            validations: true,
          },
        },
      },
    }),
    prisma.crimeReport.count({ where }),
  ]);

  // If radius filter, do precise distance filtering
  let filteredReports = reports;
  if (
    radiusFilter &&
    lat !== undefined &&
    lng !== undefined &&
    radius !== undefined
  ) {
    filteredReports = reports.filter((report) => {
      const distance = haversineDistance(
        lat,
        lng,
        report.latitude,
        report.longitude,
      );
      return distance <= radius;
    });
  }

  return {
    data: filteredReports,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Update crime report (MODERATOR+)
export const updateCrimeReport = async (id: string, data: UpdateCrimeInput) => {
  const existing = await prisma.crimeReport.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError("Crime report not found");
  }

  const report = await prisma.crimeReport.update({
    where: { id },
    data: {
      ...(data.crimeType && { crimeType: data.crimeType }),
      ...(data.description && { description: data.description }),
      ...(data.severity && { severity: data.severity }),
      ...(data.status && { status: data.status }),
      ...(data.address && { address: data.address }),
      ...(data.division !== undefined && { division: data.division }),
      ...(data.division !== undefined && { division: data.division }),
      ...(data.district !== undefined && { district: data.district }),
      ...(data.media !== undefined && { media: data.media }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return report;
};

// Delete crime report (ADMIN+)
export const deleteCrimeReport = async (id: string) => {
  const existing = await prisma.crimeReport.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError("Crime report not found");
  }

  await prisma.crimeReport.delete({ where: { id } });

  return { message: "Crime report deleted successfully" };
};

// Validate (confirm/deny) crime report
export const validateCrimeReport = async (
  reportId: string,
  userId: string,
  data: ValidateCrimeInput,
) => {
  const report = await prisma.crimeReport.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError("Crime report not found");
  }

  // Check if user already validated this report
  const existingValidation = await prisma.crimeValidation.findUnique({
    where: {
      reportId_userId: {
        reportId,
        userId,
      },
    },
  });

  if (existingValidation) {
    throw new ConflictError("You have already validated this report");
  }

  // Don't allow self-validation
  if (report.userId === userId) {
    throw new ForbiddenError("You cannot validate your own report");
  }

  // Create validation
  const validation = await prisma.crimeValidation.create({
    data: {
      reportId,
      userId,
      type: data.type,
      comment: data.comment,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Update verification/denial counts
  const updateData: Prisma.CrimeReportUpdateInput = {};
  if (data.type === ValidationType.CONFIRM) {
    updateData.verificationCount = { increment: 1 };
  } else {
    updateData.denialCount = { increment: 1 };
  }

  const updatedReport = await prisma.crimeReport.update({
    where: { id: reportId },
    data: updateData,
  });

  // Auto-update status based on thresholds
  let newStatus = updatedReport.status;
  if (
    updatedReport.verificationCount >= VERIFICATION_THRESHOLD &&
    updatedReport.status === ReportStatus.UNVERIFIED
  ) {
    newStatus = ReportStatus.VERIFIED;
  } else if (
    updatedReport.denialCount >= DISPUTE_THRESHOLD &&
    updatedReport.status !== ReportStatus.HIDDEN &&
    updatedReport.status !== ReportStatus.REMOVED
  ) {
    newStatus = ReportStatus.DISPUTED;
  }

  if (newStatus !== updatedReport.status) {
    await prisma.crimeReport.update({
      where: { id: reportId },
      data: { status: newStatus },
    });
  }

  return {
    validation,
    reportStatus: newStatus,
    verificationCount: updatedReport.verificationCount,
    denialCount: updatedReport.denialCount,
  };
};

// Get heatmap data
export const getHeatmapData = async (query: HeatmapQuery) => {
  const { crimeType, severity, startDate, endDate, division } = query;

  const where: Prisma.CrimeReportWhereInput = {
    status: { in: [ReportStatus.UNVERIFIED, ReportStatus.VERIFIED] },
  };

  if (crimeType) where.crimeType = crimeType;
  if (severity) where.severity = severity;
  if (division) where.division = division;

  if (startDate || endDate) {
    where.occurredAt = {};
    if (startDate) where.occurredAt.gte = new Date(startDate);
    if (endDate) where.occurredAt.lte = new Date(endDate);
  }

  const reports = await prisma.crimeReport.findMany({
    where,
    select: {
      latitude: true,
      longitude: true,
      severity: true,
      crimeType: true,
    },
  });

  // Convert severity to intensity for heatmap
  const severityWeight: Record<Severity, number> = {
    LOW: 0.25,
    MEDIUM: 0.5,
    HIGH: 0.75,
    CRITICAL: 1.0,
  };

  return reports.map((report) => ({
    lat: report.latitude,
    lng: report.longitude,
    intensity: severityWeight[report.severity],
    crimeType: report.crimeType,
  }));
};

// Get crime statistics
export const getCrimeStats = async (division?: string) => {
  const where: Prisma.CrimeReportWhereInput = {
    status: { in: [ReportStatus.UNVERIFIED, ReportStatus.VERIFIED] },
  };

  if (division) where.division = division;

  const [byType, bySeverity, byStatus, total, recentReports] =
    await Promise.all([
      prisma.crimeReport.groupBy({
        by: ["crimeType"],
        where,
        _count: true,
      }),
      prisma.crimeReport.groupBy({
        by: ["severity"],
        where,
        _count: true,
      }),
      prisma.crimeReport.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.crimeReport.count({ where }),
      prisma.crimeReport.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          crimeType: true,
          severity: true,
          address: true,
          createdAt: true,
        },
      }),
    ]);

  return {
    total,
    byType: byType.map((item) => ({
      type: item.crimeType,
      count: item._count,
    })),
    bySeverity: bySeverity.map((item) => ({
      severity: item.severity,
      count: item._count,
    })),
    byStatus: byStatus.map((item) => ({
      status: item.status,
      count: item._count,
    })),
    recentReports,
  };
};

// Haversine formula to calculate distance between two points
function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
