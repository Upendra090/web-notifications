import express from "express";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
process.env.GOOGLE_APPLICATION_CREDENTIALS;

initializeApp({
  credential: applicationDefault(),
  projectId: "",
});

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const port = 8080;
app.use(cors());

app.get("/tokens", async (req, res) => {
  try {
    const tokens = await prisma.token.findMany();
    return res.status(200).json({
      status: "success",
      message: "All tokens",
      data: tokens,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "Some error",
    });
  }
});

app.post("/store-tokens", async (req, res) => {
  const { data } = req.body;
  const { gsmToken } = data;
  if (!gsmToken) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const token = await prisma.token.findUnique({ where: { token: gsmToken } });
    if (token)
      return res.status(200).json({
        status: "success",
        message: "Token already exist!",
      });

    await prisma.token.create({
      data: { token: gsmToken },
    });
    return res.status(201).json({
      status: "success",
      message: "token added",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
      status: "failed",
      message: "Some error",
    });
  }
});

app.post("/send", async (req, res) => {
  try {
    const data = req.body;
    console.log("data", data);
    const { title, body } = data.data;

    if (!title || !body) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide title and body!",
      });
    }

    const tokensData = await prisma.token.findMany();
    const tokens = tokensData.map((tokenObj) => tokenObj.token);

    const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens,
    };

    const response = await getMessaging().sendEachForMulticast(message);
    console.log(response);
    return res.status(200).json({
      status: "success",
      message: "Notification sent",
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: "Error sending notifications",
      error: err,
    });
  }
});

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});
