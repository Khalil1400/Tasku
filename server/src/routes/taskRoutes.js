const { Router } = require("express");
const { z } = require("zod");
const taskController = require("../controllers/taskController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = Router();

const baseTaskBody = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  favorite: z.boolean().optional(),
  reminderAt: z.string().datetime().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

const createSchema = z.object({
  body: baseTaskBody,
});

const updateSchema = z.object({
  body: baseTaskBody.partial(),
});

router.use(auth);

router.get("/", taskController.list);
router.get("/:id", taskController.get);
router.post("/", validate(createSchema), taskController.create);
router.put("/:id", validate(updateSchema), taskController.update);
router.patch("/:id", validate(updateSchema), taskController.update);
router.delete("/:id", taskController.remove);

module.exports = router;
