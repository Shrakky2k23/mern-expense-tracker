const router = require("express").Router();
const auth = require("../middleware/auth");
const Transaction = require("../models/Transaction");

router.use(auth);

router.get("/all", async (req, res) => {
  const list = await Transaction.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(list);
});

router.post("/add", async (req, res) => {
  try {
    const { title, amount, type } = req.body;
    if (!title || !amount || !["income", "expense"].includes(type))
      return res.status(400).json({ message: "Invalid input" });
    const txn = await Transaction.create({
      userId: req.userId,
      title,
      amount: Number(amount),
      type,
    });
    res.json(txn);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  await Transaction.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ ok: true });
});

module.exports = router;
