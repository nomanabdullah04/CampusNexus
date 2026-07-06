import { Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post('/register', AuthControllers.createUser)
router.post('/login', AuthControllers.credentialLogin)
router.post('/check-email', AuthControllers.checkEmail)
router.post('/reset-password', AuthControllers.resetPassword)


export const AuthRotues = router;