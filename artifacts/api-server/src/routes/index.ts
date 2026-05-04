import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import supportRouter from "./support";
import membershipRouter from "./membership";
import postsRouter from "./posts";
import eventsRouter from "./events";
import scriptureRouter from "./scripture";
import departmentsRouter from "./departments";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(supportRouter);
router.use(membershipRouter);
router.use(postsRouter);
router.use(eventsRouter);
router.use(scriptureRouter);
router.use(departmentsRouter);

export default router;
