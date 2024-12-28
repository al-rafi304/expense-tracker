import { Router } from "express";
const router = Router();

import { authenticate } from "../middlewares/auth.js";
import { validID } from "../middlewares/validate.js";
import * as user from '../controllers/user.js'

router.route('/fund').patch(authenticate, user.updateFund)

router.route('/').get(authenticate, user.getUser)

export default router