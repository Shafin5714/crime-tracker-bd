import { CrimeReport, CrimeType, ReportStatus, Severity } from "@/types/api.types";

const now = new Date();
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

export const MOCK_CRIMES: CrimeReport[] = [
  {
    id: "mock-1",
    crimeType: CrimeType.ROBBERY,
    description: "Armed robbery at a convenience store. Two suspects fled on a motorbike.",
    severity: Severity.HIGH,
    status: ReportStatus.VERIFIED,
    latitude: 23.8103,
    longitude: 90.4125,
    address: "Gulshan Avenue, Dhaka",
    division: "Dhaka",
    district: "Dhaka",
    occurredAt: oneHourAgo,
    isAnonymous: false,
    reporterId: "user-1",
    createdAt: oneHourAgo,
    updatedAt: oneHourAgo,
    confirmations: 5,
    denials: 0,
    reporter: {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com"
    }
  },
  {
    id: "mock-2",
    crimeType: CrimeType.THEFT,
    description: "Mobile phone snatched from a pedestrian while waiting for a bus.",
    severity: Severity.MEDIUM,
    status: ReportStatus.VERIFIED,
    latitude: 23.7937,
    longitude: 90.4066,
    address: "Banani, Road 11",
    division: "Dhaka",
    district: "Dhaka",
    occurredAt: twoHoursAgo,
    isAnonymous: true,
    reporterId: null,
    createdAt: twoHoursAgo,
    updatedAt: twoHoursAgo,
    confirmations: 12,
    denials: 1
  },
  {
    id: "mock-3",
    crimeType: CrimeType.VANDALISM,
    description: "Public park benches damaged and graffiti sprayed on walls.",
    severity: Severity.LOW,
    status: ReportStatus.VERIFIED,
    latitude: 23.8222,
    longitude: 90.4219,
    address: "Baridhara Park",
    division: "Dhaka",
    district: "Dhaka",
    occurredAt: yesterday,
    isAnonymous: false,
    reporterId: "user-2",
    createdAt: yesterday,
    updatedAt: yesterday,
    confirmations: 3,
    denials: 0,
    reporter: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com"
    }
  },
  {
    id: "mock-4",
    crimeType: CrimeType.ASSAULT,
    description: "Physical altercation between two groups near the market entrance.",
    severity: Severity.CRITICAL,
    status: ReportStatus.VERIFIED,
    latitude: 23.7511,
    longitude: 90.3934,
    address: "Karwan Bazar",
    division: "Dhaka",
    district: "Dhaka",
    occurredAt: twoDaysAgo,
    isAnonymous: false,
    reporterId: "user-3",
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo,
    confirmations: 20,
    denials: 2,
    reporter: {
      id: "user-3",
      name: "Admin User",
      email: "admin@example.com"
    }
  },
  {
    id: "mock-5",
    crimeType: CrimeType.VEHICLE_THEFT,
    description: "Car stolen from parking lot. Silver Toyota Corolla.",
    severity: Severity.HIGH,
    status: ReportStatus.VERIFIED,
    latitude: 23.8688,
    longitude: 90.4007,
    address: "Uttara Sector 7",
    division: "Dhaka",
    district: "Dhaka",
    occurredAt: yesterday,
    isAnonymous: true,
    reporterId: null,
    createdAt: yesterday,
    updatedAt: yesterday,
    confirmations: 8,
    denials: 0
  },
  {
    id: "mock-6",
    crimeType: CrimeType.HARASSMENT,
    description: "Verbal harassment reported near the university campus.",
    severity: Severity.MEDIUM,
    status: ReportStatus.VERIFIED,
    latitude: 23.7330,
    longitude: 90.3850,
    address: "Dhaka University Area",
    division: "Dhaka",
    district: "Dhaka",
    occurredAt: oneHourAgo,
    isAnonymous: true,
    reporterId: null,
    createdAt: oneHourAgo,
    updatedAt: oneHourAgo,
    confirmations: 15,
    denials: 1
  }
];
