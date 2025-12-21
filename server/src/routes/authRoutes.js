const { Router } = require("express");
const { z } = require("zod");
const authController = require("../controllers/authController");
const validate = require("../middleware/validate");

const router = Router();

const credentialsSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

router.post("/register", validate(credentialsSchema), authController.register);
router.post("/login", validate(credentialsSchema), authController.login);

module.exports = router;
