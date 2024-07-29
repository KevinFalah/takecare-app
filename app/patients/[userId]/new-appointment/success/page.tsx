import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Success = async({ params: { userId }, searchParams }: SearchParamProps) => {
  const appointmentId = (searchParams.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find(
    (doc) => doc.name === appointment.primaryPhysician
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            height={1000}
            width={1000}
            className="h-10 w-fit"
          />
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={260}
            alt="success"
          />
          <h2 className="header mb-6 max-h-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted
          </h2>
          <p>We will be in touch shortly to confirm.</p>
        </section>

        <section className="request-details">
            <p>Requested appointment details:</p>
            <div className="flex items-center gap-3">
              {doctor?.image ? (
                <Image src={doctor.image} alt="Doctor" width={32} height={32} />
              ) : null}
              <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
            </div>

            <div className="flex gap-2">
              <Image
                src="/assets/icons/calendar.svg"
                height={24}
                width={24}
                alt="calendar"
              />
              <p>{formatDateTime(appointment.schedule).dateTime}</p>
            </div>
          </section>

        <Button variant="outline" className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>

        <p className="copyright">©️ 2024 TakecarePulse</p>
      </div>
    </div>
  );
};

export default Success;
