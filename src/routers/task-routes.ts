/**
 * User Routes.
 */
import express, { Router, Express } from "express";
import { Task } from "../models/task";
import { auth } from "../middleware/auth";
const router: Router = express.Router(); // Create an instance of Express Router
// Creatinal Endpoints

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    //@ts-ignore
    owner: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});
// Reading Endpoints
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:asc ||
// GET /tasks?sortBy=createdAt:des
// Setup pagination and filter sorting
router.get("/tasks", auth, async (req, res) => {
  // filter completed tasks
  let isCompleated = null;
  let sort = {};
  if (req.query.completed) {
    let isCompleated = req.query.completed === "true";
  }
  // Check what order we are sorting
  if (req.query.sortBy) {
    //@ts-ignore
    const parts = req.query.sortBy.split(":");
    //@ts-ignore
    sort[parts[0]] = parts[1] == "desc" ? -1 : 1;
  }

  try {
    const tasks = await Task.find({
      //@ts-ignore
      owner: req.user._id,
      completed: isCompleated,
      // determine if options
      options: {
        // @ts-ignore
        limit: parseInt(req.query.limit),
        // @ts-ignore
        skip: parseInt(req.query.skip),
      },
      sort: { createdAt: -1 },
    });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

//
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    //@ts-ignore
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Updating Endpoints
router.patch("/tasks/:id", auth, async (req, res) => {
  // Proveri dali se validni polinjata na modelot shto sakame da gi updateneme
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOpperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOpperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      //@ts-ignore
      owner: req.user._id,
    });

    // Type the user model
    const typedTask = task as {
      description: string;
      completed: boolean;
      [key: string]: any;
    };

    updates.forEach((update: string) => {
      typedTask[update] = req.body[update];
    });
    await task?.save();
    // Koristeno na samiot model
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   // Setiraj go kako nov
    //   new: true,
    //   // Neka se validira spored model validation
    //   runValidators: true,
    // });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Deleting routes
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      //@ts-ignore
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    return res.status(500).send();
  }
});
export default router;
