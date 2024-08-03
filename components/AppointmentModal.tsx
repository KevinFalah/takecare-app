"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import AppointmentForm from "./forms/AppointmentForm";
import { Appointment } from "@/types/appwrite.types";

type AppointmentModalProps = {
  type: "schedule" | "cancel";
  patientId: string;
  userId: string;
  appointment?: Appointment;
};

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize font-semibold h-8 ${
            type === "schedule" ? "text-green-500 bg-white" : "text-red-500"
          }`}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
          <DialogDescription>
            Please fill in the following details to {type} an appointment.
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm userId={userId} patientId={patientId} type={type} appointment={appointment} setOpen={setOpen}/>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
