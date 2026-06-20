import { Router } from "express";
import { db, transactionsTable, eq, sql } from "@workspace/db";

const router = Router();

function generateTrackingNumber(): string {
  const prefix = "HT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

router.get("/transactions", async (req, res) => {
  try {
    const { status } = req.query;
    let transactions;
    if (status && typeof status === "string") {
      transactions = await db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.status, status as "en_livraison" | "livree" | "retournee" | "annulee"))
        .orderBy(sql`${transactionsTable.createdAt} DESC`);
    } else {
      transactions = await db
        .select()
        .from(transactionsTable)
        .orderBy(sql`${transactionsTable.createdAt} DESC`);
    }
    return res.json(transactions);
  } catch (err) {
    req.log.error({ err }, "Failed to list transactions");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/transactions", async (req, res) => {
  try {
    const { senderName, senderPhone, recipientName, recipientPhone, recipientCity, description, weight, price } = req.body;
    if (!senderName || !recipientName || !recipientCity || weight == null || price == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const trackingNumber = generateTrackingNumber();
    const [transaction] = await db
      .insert(transactionsTable)
      .values({
        trackingNumber,
        senderName,
        senderPhone: senderPhone || null,
        recipientName,
        recipientPhone: recipientPhone || null,
        recipientCity,
        description: description || null,
        weight: Number(weight),
        price: Number(price),
        status: "en_livraison",
      })
      .returning();
    return res.status(201).json(transaction);
  } catch (err) {
    req.log.error({ err }, "Failed to create transaction");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [transaction] = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, id));
    if (!transaction) return res.status(404).json({ error: "Not found" });
    return res.json(transaction);
  } catch (err) {
    req.log.error({ err }, "Failed to get transaction");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/transactions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { senderName, senderPhone, recipientName, recipientPhone, recipientCity, description, weight, price, status } = req.body;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (senderName !== undefined) updates.senderName = senderName;
    if (senderPhone !== undefined) updates.senderPhone = senderPhone;
    if (recipientName !== undefined) updates.recipientName = recipientName;
    if (recipientPhone !== undefined) updates.recipientPhone = recipientPhone;
    if (recipientCity !== undefined) updates.recipientCity = recipientCity;
    if (description !== undefined) updates.description = description;
    if (weight !== undefined) updates.weight = Number(weight);
    if (price !== undefined) updates.price = Number(price);
    if (status !== undefined) updates.status = status;
    const [updated] = await db
      .update(transactionsTable)
      .set(updates as any)
      .where(eq(transactionsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update transaction");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/transactions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [deleted] = await db
      .delete(transactionsTable)
      .where(eq(transactionsTable.id, id))
      .returning();
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete transaction");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/transactions/:id/confirm", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [updated] = await db
      .update(transactionsTable)
      .set({ status: "livree", updatedAt: new Date() })
      .where(eq(transactionsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to confirm transaction");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const all = await db.select().from(transactionsTable);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const total = all.length;
    const enLivraison = all.filter((t) => t.status === "en_livraison").length;
    const livrees = all.filter((t) => t.status === "livree").length;
    const retournees = all.filter((t) => t.status === "retournee").length;
    const annulees = all.filter((t) => t.status === "annulee").length;
    const totalRevenue = all.filter((t) => t.status === "livree").reduce((sum, t) => sum + t.price, 0);
    const todayDeliveries = all.filter((t) => t.createdAt >= today).length;
    return res.json({ total, enLivraison, livrees, retournees, annulees, totalRevenue, todayDeliveries });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/recent", async (req, res) => {
  try {
    const recent = await db
      .select()
      .from(transactionsTable)
      .orderBy(sql`${transactionsTable.createdAt} DESC`)
      .limit(5);
    return res.json(recent);
  } catch (err) {
    req.log.error({ err }, "Failed to get recent transactions");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
