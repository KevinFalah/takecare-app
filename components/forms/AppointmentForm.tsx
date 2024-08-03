"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { getAppointmentSchema, ScheduleAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";

interface IAppointmentForm {
  userId: string;
  patientId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen?: (isOpen: boolean) => void;
}

export default function AppointmentForm({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: IAppointmentForm) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormSchema = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormSchema>>({
    resolver: zodResolver(AppointmentFormSchema),
    defaultValues: {
      primaryPhysician: appointment && appointment.primaryPhysician,
      schedule: appointment ? new Date(appointment.schedule) : new Date(),
      reason: appointment ? appointment.reason : '',
      cancellationReason: appointment?.cancellationReason ? appointment.cancellationReason : '',
      note: appointment ? appointment.note : '',
    },
  });

  const onSubmit = async (values: z.infer<typeof AppointmentFormSchema>) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
        break;
    }
    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);

        if (appointment) {

          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          newAppointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {type === "create" ? (
          <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">
              Request a new appointment in 10 seconds
            </p>
          </section>
        ) : null}

        {type !== "cancel" ? (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Primary Physician"
              placeholder="Select a physician"
            >
              <DoctorItem />
            </CustomFormField>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />

            <div className="flex gap-6">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Enter notes"
                placeholder="Enter notes"
              />
            </div>
          </>
        ) : (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Enter cancellation reason"
            placeholder="Enter cancellation reason"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full bg-red-200`}
        >
          {getButtonLabel(type)}
        </SubmitButton>
      </form>
    </Form>
  );
}

const DoctorItem = () => {
  return Doctors.map((doctor, idx) => (
    <SelectItem key={idx} value={doctor.name}>
      <div className="flex cursor-pointer items-center gap-2">
        <Image
          src={doctor.image}
          width={32}
          height={32}
          alt={doctor.name}
          className="rounded-full border border-dark-500"
        />
        <p>{doctor.name}</p>
      </div>
    </SelectItem>
  ));
};

const getButtonLabel = (type: string): string => {
  let buttonLabel = "";

  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      break;
  }

  return buttonLabel;
};
