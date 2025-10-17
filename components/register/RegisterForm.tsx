"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Roles } from "@/enum/role";
import { VolunteerForm } from "./VolunteerForm";
import { OrganizerForm } from "./OrganizerForm";

export function RegisterForm() {
  const [role, setRole] = useState<Roles>(Roles.Volunteer);

  return (
    <Card className="w-full max-w-2xl shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold text-center">
          Create Account
        </CardTitle>
        <CardDescription className="text-center text-base">
          Join us as a volunteer or organizer
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs
          value={role}
          onValueChange={(value) => setRole(value as Roles)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="Volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="Organizer">Organizer</TabsTrigger>
          </TabsList>

          <TabsContent value="Volunteer" className="mt-0">
            <VolunteerForm />
          </TabsContent>

          <TabsContent value="Organizer" className="mt-0">
            <OrganizerForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
