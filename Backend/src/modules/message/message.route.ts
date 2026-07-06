import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { MessageController } from "./message.controller";

const router = Router();
const auth = checkAuth("BUYER", "SELLER", "ADMIN");

router.post("/send", auth, MessageController.sendMessage);
router.get("/thread", auth, MessageController.getThread);
router.get("/contacts", auth, MessageController.getContacts);

export const MessageRoutes = router;
