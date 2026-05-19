import { Router } from "express";
import { db } from "@workspace/db";
import { eyParticipantsTable, eyRoundsTable, eyCoordinatorsTable, eyEventsTable } from "@workspace/db";
import { CreateEyParticipantBody, UpdateEyParticipantBody, DeleteEyParticipantParams } from "@workspace/api-zod";
import { desc, eq, count, like, or, asc } from "drizzle-orm";
import { randomBytes } from "crypto";
import { BadgeGenerationService } from "../lib/badge-service";
import { initializeNotificationService } from "../lib/notification-service";
import { initializeFaydaVerificationService } from "../lib/fayda-verification";
import { TelebirrPaymentService } from "../lib/telebirr-payment";
import { initializeBankPaymentService } from "../lib/bank-payment";

const router = Router();
const notificationService = initializeNotificationService();
const faydaVerificationService = initializeFaydaVerificationService();
const telebirrPaymentService = new TelebirrPaymentService();
const bankPaymentService = initializeBankPaymentService();

const verifyFayda = async (faydaId: string): Promise<boolean> => {
  const result = await faydaVerificationService.verifyFaydaId(faydaId);
  return result.verified;
};

const verifyPayment = async (paymentMethod: string, reference?: string): Promise<boolean> => {
  if (paymentMethod === "telebirr") {
    if (!reference) return false;
    const verification = await telebirrPaymentService.verifyPayment(reference);
    return verification.verified;
  }

  if (paymentMethod === "bank") {
    if (!reference) return false;
    const verification = await bankPaymentService.verifyPayment(reference);
    return verification.verified;
  }

  return false;
};

const generateRegistrationNumber = (): string => {
  return `EY${Date.now()}${randomBytes(2).toString("hex").toUpperCase()}`;
};

router.get("/ey-participants", async (req, res) => {
  try {
    const search = (req.query.search as string) || "";
    const sortBy = (req.query.sortBy as string) || "roundNumber";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? asc : desc;

    let query = db
      .select({
        participant: eyParticipantsTable,
        event: eyEventsTable,
        round: eyRoundsTable,
        coordinator: eyCoordinatorsTable,
      })
      .from(eyParticipantsTable)
      .innerJoin(eyEventsTable, eq(eyParticipantsTable.eventId, eyEventsTable.id))
      .innerJoin(eyRoundsTable, eq(eyParticipantsTable.roundId, eyRoundsTable.id))
      .leftJoin(eyCoordinatorsTable, eq(eyParticipantsTable.coordinatorId, eyCoordinatorsTable.id));

    if (search) {
      query = query.where(
        or(
          like(eyParticipantsTable.faydaId, `%${search}%`),
          like(eyParticipantsTable.firstName, `%${search}%`),
          like(eyParticipantsTable.middleName, `%${search}%`),
          like(eyParticipantsTable.lastName, `%${search}%`),
          like(eyParticipantsTable.email, `%${search}%`),
          like(eyParticipantsTable.phoneNumber, `%${search}%`),
          like(eyParticipantsTable.registrationNumber, `%${search}%`),
          like(eyEventsTable.title, `%${search}%`),
        ),
      );
    }

    const sortColumn =
      sortBy === "roundNumber"
        ? eyRoundsTable.roundNumber
        : sortBy === "event"
          ? eyEventsTable.title
          : sortBy === "faydaId"
            ? eyParticipantsTable.faydaId
            : sortBy === "firstName"
              ? eyParticipantsTable.firstName
              : eyParticipantsTable.createdAt;

    const participants = await query.orderBy(sortOrder(sortColumn), asc(eyEventsTable.title));

    res.json(
      participants.map((result) => ({
        ...result.participant,
        event: result.event,
        round: {
          ...result.round,
          createdAt: result.round.createdAt.toISOString(),
        },
        coordinator: result.coordinator || null,
        createdAt: result.participant.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list EY participants");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin endpoint with Event, Round, and Coordinator details
router.get("/ey-participants/admin/list", async (req, res) => {
  try {
    const search = (req.query.search as string) || "";
    const sortBy = (req.query.sortBy as string) || "roundNumber";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? asc : desc;

    const query = db
      .select({
        participant: eyParticipantsTable,
        event: eyEventsTable,
        round: eyRoundsTable,
        coordinator: eyCoordinatorsTable,
      })
      .from(eyParticipantsTable)
      .innerJoin(eyEventsTable, eq(eyParticipantsTable.eventId, eyEventsTable.id))
      .innerJoin(eyRoundsTable, eq(eyParticipantsTable.roundId, eyRoundsTable.id))
      .leftJoin(
        eyCoordinatorsTable,
        eq(eyParticipantsTable.coordinatorId, eyCoordinatorsTable.id),
      );

    // Add search filter if provided
    const filteredQuery = search
      ? query.where(
          or(
            like(eyParticipantsTable.faydaId, `%${search}%`),
            like(eyParticipantsTable.firstName, `%${search}%`),
            like(eyParticipantsTable.middleName, `%${search}%`),
            like(eyParticipantsTable.lastName, `%${search}%`),
            like(eyParticipantsTable.email, `%${search}%`),
            like(eyParticipantsTable.city, `%${search}%`),
            like(eyParticipantsTable.phoneNumber, `%${search}%`),
            like(eyParticipantsTable.registrationNumber, `%${search}%`),
            like(eyEventsTable.title, `%${search}%`),
          ),
        )
      : query;

    const sortColumn =
      sortBy === "roundNumber"
        ? eyRoundsTable.roundNumber
        : sortBy === "event"
          ? eyEventsTable.title
          : sortBy === "faydaId"
            ? eyParticipantsTable.faydaId
            : sortBy === "firstName"
              ? eyParticipantsTable.firstName
              : eyParticipantsTable.createdAt;

    const results = await filteredQuery.orderBy(sortOrder(sortColumn), asc(eyEventsTable.title));

    res.json(
      results.map((r) => ({
        ...r.participant,
        event: r.event,
        round: {
          ...r.round,
          createdAt: r.round.createdAt.toISOString(),
        },
        coordinator: r.coordinator || null,
        createdAt: r.participant.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list admin EY participants");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ey-participants", async (req, res) => {
  const parsed = CreateEyParticipantBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { faydaId, eventId, roundId, paymentMethod, bankReference, paymentSlip } = parsed.data;

  try {
    const [round] = await db
      .select({ capacity: eyRoundsTable.capacity, fromDate: eyRoundsTable.fromDate, toDate: eyRoundsTable.toDate, roundNumber: eyRoundsTable.roundNumber })
      .from(eyRoundsTable)
      .where(eq(eyRoundsTable.id, roundId));

    if (!round) {
      res.status(400).json({ error: "Round not found" });
      return;
    }

    const participantCount = await db
      .select({ count: count() })
      .from(eyParticipantsTable)
      .where(eq(eyParticipantsTable.roundId, roundId));

    if (participantCount[0].count >= round.capacity) {
      res.status(400).json({ error: "Round is full" });
      return;
    }

    const faydaVerified = await verifyFayda(faydaId);
    if (!faydaVerified) {
      res.status(400).json({ error: "Fayda verification failed" });
      return;
    }

    const paymentVerified = await verifyPayment(paymentMethod, bankReference);
    if (!paymentVerified) {
      res.status(400).json({ error: "Payment verification failed" });
      return;
    }

    const [event] = await db
      .select()
      .from(eyEventsTable)
      .where(eq(eyEventsTable.id, eventId));

    if (!event) {
      res.status(400).json({ error: "Event not found" });
      return;
    }

    const coordinators = await db.select({ id: eyCoordinatorsTable.id }).from(eyCoordinatorsTable);
    const coordinatorId = coordinators.length > 0
      ? coordinators[Math.floor(Math.random() * coordinators.length)].id
      : null;

    const registrationNumber = generateRegistrationNumber();
    const { paymentMethod: _paymentMethod, bankReference: _bankReference, paymentSlip: _paymentSlip, ...participantPayload } = parsed.data;
    const participantData = {
      ...participantPayload,
      faydaVerified,
      paymentStatus: paymentVerified,
      registrationNumber,
      coordinatorId,
      badgeGenerated: false,
    };

    const [participant] = await db
      .insert(eyParticipantsTable)
      .values(participantData)
      .returning();

if (participant) {
        await notificationService.sendNotification({
          email: participant.email,
          phoneNumber: participant.phoneNumber,
          registrationNumber: participant.registrationNumber,
          eventName: event.title,
          roundNumber: round.roundNumber,
          roundDates: {
            from: round.fromDate || "",
            to: round.toDate || "",
          },
          participantName: `${participant.firstName} ${participant.lastName}`,
          firstName: participant.firstName,
          middleName: participant.middleName,
          lastName: participant.lastName,
          coordinatorId: coordinatorId?.toString(),
        });
      }

    res.status(201).json({
      ...participant,
      createdAt: participant.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create EY participant");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ey-participants/:id/generate-badge", async (req, res) => {
  const participantId = Number(req.params.id);
  if (Number.isNaN(participantId)) {
    res.status(400).json({ error: "Invalid participant ID" });
    return;
  }

  try {
    const [result] = await db
      .select({ participant: eyParticipantsTable, event: eyEventsTable, round: eyRoundsTable })
      .from(eyParticipantsTable)
      .innerJoin(eyEventsTable, eq(eyParticipantsTable.eventId, eyEventsTable.id))
      .innerJoin(eyRoundsTable, eq(eyParticipantsTable.roundId, eyRoundsTable.id))
      .where(eq(eyParticipantsTable.id, participantId));

    if (!result) {
      res.status(404).json({ error: "Participant not found" });
      return;
    }

    const badgeData = await BadgeGenerationService.generateBadgeData({
      ...result.participant,
      event: result.event,
      round: result.round,
    });

    const badgeHtml = BadgeGenerationService.generateBadgeHTML([badgeData]);

    await db.update(eyParticipantsTable).set({ badgeGenerated: true }).where(eq(eyParticipantsTable.id, participantId));

    res.type("text/html").send(badgeHtml);
  } catch (err) {
    req.log.error({ err }, "Failed to generate badge");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/ey-participants/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid participant ID" });
    return;
  }

  const parsed = UpdateEyParticipantBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  try {
    const [participant] = await db
      .update(eyParticipantsTable)
      .set(parsed.data)
      .where(eq(eyParticipantsTable.id, id))
      .returning();

    if (!participant) {
      res.status(404).json({ error: "Participant not found" });
      return;
    }

    res.json({ ...participant, createdAt: participant.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update EY participant");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/ey-participants/:id", async (req, res) => {
  const parsed = DeleteEyParticipantParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid participant ID" });
    return;
  }
  try {
    await db.delete(eyParticipantsTable).where(eq(eyParticipantsTable.id, parsed.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete EY participant");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to check round capacity
router.get("/ey-participants/round/:roundId/capacity", async (req, res) => {
  const roundId = Number(req.params.roundId);
  if (Number.isNaN(roundId)) {
    res.status(400).json({ error: "Invalid round ID" });
    return;
  }

  try {
    const [round] = await db
      .select({ capacity: eyRoundsTable.capacity })
      .from(eyRoundsTable)
      .where(eq(eyRoundsTable.id, roundId));

    if (!round) {
      res.status(404).json({ error: "Round not found" });
      return;
    }

    const participantCount = await db
      .select({ count: count() })
      .from(eyParticipantsTable)
      .where(eq(eyParticipantsTable.roundId, roundId));

    const registered = participantCount[0]?.count || 0;
    const available = round.capacity - registered;
    const isFull = available <= 0;

    res.json({
      roundId,
      capacity: round.capacity,
      registered,
      available,
      isFull,
      message: isFull ? "This round is full" : `${available} slots available`,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to check round capacity");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;