import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import supportRouter from "./support";
import membershipRouter from "./membership";
import postsRouter from "./posts";
import eventsRouter from "./events";
import scriptureRouter from "./scripture";
import departmentsRouter from "./departments";
import faydaRouter from "./fayda";
import eyEventsRouter from "./ey-events";
import eyRoundsRouter from "./ey-rounds";
import eyParticipantsRouter from "./ey-participants";
import eyCoordinatorsRouter from "./ey-coordinators";
import telebirrRouter from "./telebirr";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(supportRouter);
router.use(membershipRouter);
router.use(postsRouter);
router.use(eventsRouter);
router.use(scriptureRouter);
router.use(departmentsRouter);
router.use(faydaRouter);
router.use(eyEventsRouter);
router.use(eyRoundsRouter);
router.use(eyParticipantsRouter);
router.use(eyCoordinatorsRouter);
router.use(telebirrRouter);

export default router;
