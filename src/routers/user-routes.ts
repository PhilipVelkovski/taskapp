/**
 * User Routes.
 */
import express, { Router, Express } from "express";
import { User } from "../models/user";
import UserModel from "../../interface/userModel";
import { auth } from "../middleware/auth";
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

// Export Module
export default router;
