// Convert videos hosted on Google Cloud Storage
// Google Cloud Storage file interactions
// Local file interactions

import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();

const rawVideoBucketName = "victube-raw-videos"; // Bucket for Google Cloud storage to hold videos
const processedVideoBucketName = "victube-processed-videos"; // Seperate bucket for processed videos for us to upload

const localRawVideoPath = "./raw-videos"; // Raw video folder path
const localProcessedVideoPath = "./processed-videos"; // Processed video folder path

// Creates the local directories for raw and processed videos
export function setupDirectories() {
    ensureDirectoryExistence(localRawVideoPath)
    ensureDirectoryExistence(localProcessedVideoPath)
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted
 */

export function convertVideo(rawVideoName: string, processedVideoName: string) {
  // allows us at runtime to resolve or reject the promse ( return error or value )
  return new Promise<void>((resolve, reject) => {
    // Create the ffmpeg command
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=-1:360") // 360p
      .on("end", function () {
        console.log("Processing finished successfully");
        resolve(); // Resolve promise if successful
      })
      .on("error", function (err: any) {
        console.log("An error occurred: " + err.message);
        reject(err); // Reject promise if error
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

// File System Operations

export async function downloadRawVideo(fileName: string) {
  await storage
    .bucket(rawVideoBucketName)
    .file(fileName)
    .download({
      destination: `${localRawVideoPath}/${fileName}`,
    });
  console.log(`
    gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.
    `);
}

/**
 * @param fileName - The name of the file to upload from the
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */

export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName,
  });

  console.log(`
  gs://${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.
  `);

  await bucket.file(fileName).makePublic(); // Makes every uploaded video public
}

/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolve when the file has been deleted
 */

function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(`File ${filePath} does not exist.`);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Failed to delete file at ${filePath}`);
          reject(err);
        } else {
          console.log(`File deleted at ${filePath}`);
          resolve();
        }
      });
    } else {
      console.log(`File not found at ${filePath}, skipping the delete.`);
      resolve();
    }
  });
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables creating nested directories
      console.log(`Directory created at ${dirPath}`);
    }
  }
