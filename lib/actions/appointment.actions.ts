import { ID } from "node-appwrite";
import { databases, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";


const bucketId = process.env.NEXT_PUBLIC_BUCKET_ID!;
const databasesId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const collectionAppointmentId = process.env.NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!;
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        
        const newAppointment = await databases.createDocument(
            databasesId,
            collectionAppointmentId,
            ID.unique(),
            appointment
          )
      
          return parseStringify(newAppointment); 
    } catch (error) {
        console.log('error create appointment => ', error)
    }
}