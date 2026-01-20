"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapPin,
  Plus,
  Search,
  MoreHorizontal,
  Map as MapIcon,
  Trash2,
  Edit,
  Globe,
} from "lucide-react";
import { PrivateRoute } from "@/components/auth";
import {
  useAreas,
  useCreateArea,
  useUpdateArea,
  useDeleteArea,
} from "@/hooks/useAreas";
import { EmptyState } from "@/components/common/EmptyState";
import { showSuccess, showError } from "@/lib/toast";
import { UserRole, type Area } from "@/types/api.types";

function LocationsContent() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedArea, setSelectedArea] = React.useState<Area | null>(null);

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    latitude: "",
    longitude: "",
    district: "Dhaka",
    division: "Dhaka",
  });

  const { data: areas, isLoading, refetch } = useAreas();
  const { mutate: createArea, isPending: isCreating } = useCreateArea();
  const { mutate: updateArea, isPending: isUpdating } = useUpdateArea();
  const { mutate: deleteArea, isPending: isDeleting } = useDeleteArea();

  const filteredAreas = areas?.filter((area) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenDialog = (area?: Area) => {
    if (area) {
      setSelectedArea(area);
      setFormData({
        name: area.name,
        latitude: area.latitude.toString(),
        longitude: area.longitude.toString(),
        district: area.district || "Dhaka",
        division: area.division || "Dhaka",
      });
    } else {
      setSelectedArea(null);
      setFormData({
        name: "",
        latitude: "",
        longitude: "",
        district: "Dhaka",
        division: "Dhaka",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      district: formData.district,
      division: formData.division,
    };

    if (selectedArea) {
      updateArea(
        { id: selectedArea.id, data: payload },
        {
          onSuccess: () => {
            showSuccess("Location updated successfully");
            setIsDialogOpen(false);
            refetch();
          },
          onError: (error) => {
            showError(
              error instanceof Error
                ? error.message
                : "Failed to update location",
            );
          },
        },
      );
    } else {
      createArea(payload, {
        onSuccess: () => {
          showSuccess("Location added successfully");
          setIsDialogOpen(false);
          refetch();
        },
        onError: (error) => {
          showError(
            error instanceof Error ? error.message : "Failed to add location",
          );
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this location?")) {
      deleteArea(id, {
        onSuccess: () => {
          showSuccess("Location deleted successfully");
          refetch();
        },
        onError: (error) => {
          showError(
            error instanceof Error
              ? error.message
              : "Failed to delete location",
          );
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Location Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage pre-defined locations and coordinates for search
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Stats/Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-500/10">
              <MapPin className="size-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Locations</p>
              <p className="text-2xl font-bold">{areas?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-500/10">
              <Globe className="size-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Division</p>
              <p className="text-2xl font-bold">Dhaka</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-600 text-white">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
              <MapIcon className="size-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Search Optimization</p>
              <p className="text-lg font-semibold leading-tight">
                Local Coordinates Enabled
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Locations</CardTitle>
              <CardDescription>
                A list of locations mapped to coordinates
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !filteredAreas?.length ? (
            <EmptyState
              icon={MapPin}
              title="No locations found"
              description="Add a new location to get started."
            />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Area Name</TableHead>
                    <TableHead>Latitude</TableHead>
                    <TableHead>Longitude</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAreas.map((area, index) => (
                    <TableRow key={area.id}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium text-indigo-600">
                        {area.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {area.latitude.toFixed(6)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {area.longitude.toFixed(6)}
                      </TableCell>
                      <TableCell>{area.district}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleOpenDialog(area)}
                            >
                              <Edit className="mr-2 size-4" />
                              Edit Location
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(area.id)}
                            >
                              <Trash2 className="mr-2 size-4" />
                              Delete Location
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {selectedArea ? "Edit Location" : "Add New Location"}
              </DialogTitle>
              <DialogDescription>
                Enter the details of the location. Coordinates can be found on
                Google Maps.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Area Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Gulshan 1"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="23.7925"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="90.4078"
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({ ...formData, longitude: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="division">Division</Label>
                  <Input
                    id="division"
                    value={formData.division}
                    onChange={(e) =>
                      setFormData({ ...formData, division: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {selectedArea ? "Save Changes" : "Add Location"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LocationsPage() {
  return (
    <PrivateRoute requiredRole={UserRole.ADMIN}>
      <LocationsContent />
    </PrivateRoute>
  );
}
