import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  lookImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      return { uploadedAt: new Date().toISOString() }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedAt: metadata.uploadedAt, url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
