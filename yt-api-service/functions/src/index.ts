import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { Storage } from "@google-cloud/storage";
import { onCall } from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawVideoBucketName = "victube-raw-videos"; // Bucket for Google Cloud storage to hold videos

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,
  };

  firestore.collection("users").doc(user.uid).set(userInfo);
  logger.info(`User Created: ${JSON.stringify(userInfo)}`);
  return;
});

const videoCollectionId = "videos";

export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string
}

export const getVideos = onCall({maxInstances: 1}, async () => {
  const querySnapshot =
    await firestore.collection(videoCollectionId).limit(10).get();
  return querySnapshot.docs.map((doc) => doc.data());
});

export const generateUploadUrl = onCall(
  { maxInstances: 1 },
  async (request) => {
    // Check if the user is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Only authenticated users can upload files"
      );
    }

    const auth = request.auth;
    const data = request.data;
    const bucket = storage.bucket(rawVideoBucketName);

    // Generate a unique filename
    const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

    // Get a v4 signed URL for uploading file
    const [url] = await bucket.file(data.name).getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return { url, fileName };
  }
);
