"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  AlertCircle,
  Check,
  X,
  Loader2,
  Search,
} from "lucide-react";
import { useGetVolunteersInEventByOrg } from "@/hooks/events/useGetVolunteersInEventByOrg";
import { useEventVolunteerApprove } from "@/hooks/events/useEventVolunteerApprove";
import { useEventVolunteerReject } from "@/hooks/events/useEventVolunteerReject";
import { toast } from "sonner";

interface VolunteerUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface EventVolunteer {
  id: number;
  user: VolunteerUser;
  date_of_birth: string;
  address: string;
  emergency_contact: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  joined_at: string;
  volunteer_id: number;
}

interface VolunteersTabProps {
  eventId: number;
}

export default function VolunteersTab({ eventId }: VolunteersTabProps) {
  const { data: volunteers, isLoading } = useGetVolunteersInEventByOrg(eventId);
  const { mutateAsync: approveVolunteer, isPending: isApproving } =
    useEventVolunteerApprove();
  const { mutateAsync: rejectVolunteer, isPending: isRejecting } =
    useEventVolunteerReject();

  const [selectedVolunteer, setSelectedVolunteer] =
    useState<EventVolunteer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const volunteersData = (volunteers as unknown as EventVolunteer[]) || [];

  // Filter and search logic
  const filteredVolunteers = useMemo(() => {
    let filtered = volunteersData;

    // Filter by status tab
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (v) => v.status.toLowerCase() === activeTab.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.user.phone.includes(searchQuery)
      );
    }

    return filtered;
  }, [volunteersData, activeTab, searchQuery]);

  // Count by status
  const statusCounts = useMemo(() => {
    return {
      all: volunteersData.length,
      pending: volunteersData.filter((v) => v.status === "Pending").length,
      approved: volunteersData.filter((v) => v.status === "Approved").length,
      rejected: volunteersData.filter((v) => v.status === "Rejected").length,
      completed: volunteersData.filter((v) => v.status === "Completed").length,
    };
  }, [volunteersData]);

  const handleViewDetails = (volunteer: EventVolunteer) => {
    setSelectedVolunteer(volunteer);
    setDialogOpen(true);
  };

  const handleApprove = async (volunteerId: number) => {
    try {
      await approveVolunteer({ eventId, volunteerId });
      toast.success("Volunteer approved successfully");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to approve volunteer");
    }
  };

  const handleReject = async (volunteerId: number) => {
    try {
      await rejectVolunteer({ eventId, volunteerId });
      toast.success("Volunteer rejected successfully");
      setDialogOpen(false);
    } catch (error) {
      toast.error("Failed to reject volunteer");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
        );
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "Completed":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>
        );
      case "Pending":
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Volunteers</h2>
          <p className="text-muted-foreground">
            Manage volunteer applications and approvals
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {volunteersData.length} Total
        </Badge>
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="pl-9"
        />
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="relative">
            All
            <Badge
              variant="secondary"
              className="ml-2 rounded-full px-2 py-0.5 text-xs"
            >
              {statusCounts.all}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            <Badge
              variant="secondary"
              className="ml-2 rounded-full px-2 py-0.5 text-xs"
            >
              {statusCounts.pending}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="relative">
            Approved
            <Badge
              variant="secondary"
              className="ml-2 rounded-full px-2 py-0.5 text-xs"
            >
              {statusCounts.approved}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative">
            Rejected
            <Badge
              variant="secondary"
              className="ml-2 rounded-full px-2 py-0.5 text-xs"
            >
              {statusCounts.rejected}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchQuery
                          ? "No volunteers match your search."
                          : "No volunteers found for this status."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVolunteers.map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell className="font-medium">
                        {volunteer.user.name}
                      </TableCell>
                      <TableCell>{volunteer.user.email}</TableCell>
                      <TableCell>{volunteer.user.phone}</TableCell>
                      <TableCell>{getStatusBadge(volunteer.status)}</TableCell>
                      <TableCell>
                        {new Date(volunteer.joined_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(volunteer)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Volunteer Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Volunteer Details</DialogTitle>
            <DialogDescription>
              Review volunteer information and approve or reject their
              application
            </DialogDescription>
          </DialogHeader>

          {selectedVolunteer && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {selectedVolunteer.user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {selectedVolunteer.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">
                        {selectedVolunteer.user.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Date of Birth
                      </p>
                      <p className="font-medium">
                        {new Date(
                          selectedVolunteer.date_of_birth
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{selectedVolunteer.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Emergency Contact
                      </p>
                      <p className="font-medium">
                        {selectedVolunteer.emergency_contact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Current Status:
                </span>
                {getStatusBadge(selectedVolunteer.status)}
              </div>

              {/* Action Buttons */}
              {selectedVolunteer.status === "Pending" && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedVolunteer.volunteer_id)}
                    className="gap-2"
                    disabled={isRejecting || isApproving}
                  >
                    {isRejecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Reject
                  </Button>
                  <Button
                    onClick={() =>
                      handleApprove(selectedVolunteer.volunteer_id)
                    }
                    className="gap-2"
                    disabled={isRejecting || isApproving}
                  >
                    {isApproving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
