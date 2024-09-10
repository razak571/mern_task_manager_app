import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.put("/reorder", reorderTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
