"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import StatusBadge from "../StatusBadge";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { Doctors } from "@/constants";
import Image from "next/image";
import AppointmentModal from "../AppointmentModal";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => <p className="text-14-medium">{row.original.patient.name}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      return (
        <p className="text-14-medium">
          {formatDateTime(row.original.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician
      );
      return (
        <div className="flex justify-between items-center gap-x-3">
          <Image
            src={doctor?.image!}
            alt={doctor?.name!}
            width={32}
            height={32}
          />
          <p className="text-14-medium">Dr.{doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex gap-1 justify-center">
          <AppointmentModal
            type="schedule"
            patientId={data.patient.$id}
            userId={data.$id}
            appointment={data}
            // title="Schedule Appointment"
            // description="Please confirm the following details to scheduled"
          />

          <AppointmentModal
            type="cancel"
            patientId={data.patient.$id}
            userId={data.$id}
            appointment={data}
            // title="Cancel Appointment"
            // description="Are you sure want to cancel this appointment?"
          />
        </div>
      );
    },
  },
];
