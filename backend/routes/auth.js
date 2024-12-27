import { Router } from "express";
const router = Router();

import * as auth from "../controllers/auth.js"
import * as authMid from "../middlewares/auth.js"

router.route('/register').post(auth.register)

router.route('/login').post(auth.login)

router.route('/test').get(authMid.authenticate, auth.test)

export default router