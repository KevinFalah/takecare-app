"use server";

import { ID, Query } from "node-appwrite";
import { databases, messaging, storage, users } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

const bucketId = process.env.NEXT_PUBLIC_BUCKET_ID!;
const databasesId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const collectionAppointmentId =
  process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!;
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      databasesId,
      collectionAppointmentId,
      ID.unique(),
      appointment
    );

    return parseStringify(newAppointment);
  } catch (error) {
    console.log("error create appointment => ", error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      databasesId,
      collectionAppointmentId,
      appointmentId
    );

    return parseStringify(appointment);
  } catch (error) {
    console.log("error get appointment => ", error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(
      databasesId,
      collectionAppointmentId,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      cancelledCount: 0,
      scheduleCount: 0,
      pendingCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, curr) => {
        if (curr.status === "cancelled") {
          acc.cancelledCount += 1;
        } else if (curr.status === "pending") {
          acc.pendingCount += 1;
        } else {
          acc.scheduleCount += 1;
        }

        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      documents: appointments.documents,
      ...counts,
    };

    return parseStringify(data);
  } catch (error) {
    console.log("error get recent appointment list => ", error);
  }
};

export const updateAppointment = async ({
  appointmentId,
  userId,
  newAppointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const updateAppointment = await databases.updateDocument(
      databasesId,
      collectionAppointmentId,
      appointmentId,
      newAppointment
    );

    if (!updateAppointment) {
      throw new Error("Appointment not found");
    }

    const smsMessage = `
    Hi, it's Takecare. 
    ${
      type === "schedule"
        ? `Your appointment has been scheduled for ${
            formatDateTime(newAppointment.schedule!).dateTime
          }`
        : `We regret to inform you that your appointment has been cancelled for the following reason: ${newAppointment.cancellationReason}`
    }
    `;

    await sendSMSNotification(userId, smsMessage)

    revalidatePath("/admin");
    return parseStringify(updateAppointment);
  } catch (error) {
    console.log("error update appointment => ", error);
  }
};

export const sendSMSNotification = async (userId: string, content: string) => {
  try {
    const message = await messaging.createSms(
      ID.unique(),
      content,
      [],
      [userId]
    );

    return parseStringify(message);
  } catch (error) {}
};
