import express from "express";
import multer from "multer";
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "GabbySoft/EcommerceStore", // Specify the folder in your Cloudinary account
    allowed_formats: ["jpeg", "png", "jpg", "avif"], // Accepted file formats
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional transformations
  },
});

export const upload = multer({ storage });
