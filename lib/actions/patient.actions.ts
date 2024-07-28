import { ID, Query } from "node-appwrite";
import {InputFile} from "node-appwrite/file"
import { databases, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";

const bucketId = process.env.NEXT_PUBLIC_BUCKET_ID!;
const databasesId = process.env.NEXT_PUBLIC_DATABASE_ID!;
const collectionPatientId = process.env.NEXT_PUBLIC_PATIENT_COLLECTION_ID!;
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newUser);
  } catch (error: any) {
    console.log(error, "<- error create user");
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser?.users[0];
    }
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.log("error get user => ", error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(databasesId, collectionPatientId, [Query.equal('userId', userId)])

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.log("error get user => ", error);
  }
};

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    console.log(InputFile, '<- ')
    let file;
    if (identificationDocument) {
      const inputFile = InputFile.fromBuffer(
        identificationDocument?.get('blobFile') as Blob,
        identificationDocument?.get('fileName') as string
      );
      
      file = await storage.createFile(bucketId, ID.unique(), inputFile);
    }

    const newPatient = await databases.createDocument(
      databasesId,
      collectionPatientId,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file?.$id : null,
        identificationDocumentUrl: `${endpoint}/storage/buckets/${bucketId}/files=${file?.$id}/view?project=${projectId}`,
        ...patient
      }
    )

    return parseStringify(newPatient);

  } catch (error) {
    console.log("error register patient => ", error);
  }
};
