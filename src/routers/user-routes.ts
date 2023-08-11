/**
 * User Routes.
 */
import express, { Router, Express } from "express";
import { User } from "../models/user";
import multer from "multer";
import UserModel from "../../interface/userModel";
import { auth } from "../middleware/auth";
import sharp from "sharp";
import iRequest from "../../interface/request";
const router: Router = express.Router(); // Create an instance of Express Router
// Creatinal Endpoints
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    // @ts-ignore
    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
// Login route
router.post("/users/login", async (req, res) => {
  try {
    // @ts-ignore
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});
// Log out route
router.post("/users/logout", auth, async (req, res) => {
  try {
    //@ts-ignore
    req.user.tokens = req.users.tokens.filter((token) => {
      //@ts-ignore
      return token.token !== req.token;
    });
    //@ts-ignore
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
// Log out route
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    //@ts-ignore
    req.user.tokens = [];
    //@ts-ignore
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
// Reading Endpoints
router.get("/users/me", auth, async (req, res) => {
  //@ts-ignore
  res.send(req.user);
});

// Updating Endpoints
router.patch("/users", auth, async (req, res) => {
  // Proveri dali se validni polinjata na modelot shto sakame da gi updateneme
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "email", "age"];
  const isValidOpperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOpperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  try {
    // Instance of the user model
    //@ts-ignore
    const user = req.user;
    // Type the user model
    const typedUser = user as unknown as {
      name: string;
      age: number;
      email: string;
      password: string;
      [key: string]: any;
    };
    updates.forEach((update: string) => {
      typedUser[update] = req.body[update];
    });
    //@ts-ignore
    await req.user?.save();

    if (!user) {
      return res.status(404).send();
    }
    //@ts-ignore
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Deleting routes
router.delete("/users/me", auth, async (req, res) => {
  try {
    //@ts-ignore
    await req.user.remove();
    //@ts-ignore
    res.send(req.user);
  } catch (error) {
    return res.status(500).send();
  }
});
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as buffer

  dest: "avatar",
  limits: {
    fileSize: 100000,
  },
  fileFilter(req, file, cb) {
    // Check if file is a Pdf
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload an image"));
    }
    //@ts-ignore
    cb(undefined, true);
  },
});

// Upload an avatar
router.post(
  "/users/me/avatar",
  auth,
  //@ts-ignore
  upload.single("avatar"),
  //@ts-ignore
  async (req: MulterRequest, res) => {
    if (!req.file) {
      return res.status(400).send();
    }
    console.log("JSON " + JSON.stringify(req.file));
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();
    //@ts-ignore
    req.user.avatar = buffer;
    //@ts-ignore
    await req.user.save();
    res.send();
  },
  //@ts-ignore
  (error, req: any, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("users/me/avatar", auth, async (req, res) => {
  //@ts-ignore
  req.user.avatar = undefined;
  //@ts-ignore
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    console.log("req.params.id " + req.params.id);
    const user = await User.findById(req.params.id);
    console.log("User " + JSON.stringify(user));
    if (!user || !user?.avatar) {
      throw new Error("No user founds");
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (error) {
    //
    res.status(404).send();
  }
});

// Export Module
export default router;
