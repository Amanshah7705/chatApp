import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.accessKeyId || "",
    secretAccessKey: process.env.secretAccessKey || "",
  },
});

// async function putObject(filename: any, ContentType: any) {
//   const commond = new PutObjectCommand({
//     Bucket: "amanchatapp",
//     Key: `/uploads/user-upload/${filename}`,
//     ContentType,
//   });
//   const url = await getSignedUrl(s3Client, commond);
//   return url;
// }

// async function init() {
//   console.log(
//     "url for upload",
//     await putObject(`image-${Date.now()}.jpeg`, "image/jpeg")
//   );
// }

// init();

async function getImage(Key:any){
  console.log(process.env.accessKeyId)
    const commond = new GetObjectCommand({
        Bucket:'amanchatapp',
        Key,
    })
       const url = await  getSignedUrl(s3Client,commond)
      return url;
}

async function init(){
     console.log("url fro", await getImage("images/first.jpg"))

}

 init()
