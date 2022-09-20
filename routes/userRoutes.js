const router = require("express").Router();
const { User } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "fskdjbk242&*@#*&@¨*)@(#";

const groupRoutes = require("./groupRoutes");
router.use("/group", groupRoutes);

router.post("/change-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user._id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { _id },
      {
        $set: { password: hashedPassword },
      }
    );

    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Usuário ou Senha Inválido" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET
    );

    return res.status(200).json({ user, token });
  }

  return res.json({ status: "error", error: "Usuário ou Senha Inválido" });
});

router.post("/register", async (req, res) => {
  const { name, username, password: pass } = req.body;

  const password = await bcrypt.hash(pass, 10);

  const user = { name, password, username };

  try {
    const userReq = await User.create(user);
    res.status(201).json(userReq);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const groups = await User.find();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const groups = await User.findOne({ _id }).populate({
      path: "group",
      model: "Group",
    });
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const { title, description, days } = req.body;

  const group = { title, description, days };

  try {
    const update = await User.updateOne({ _id }, group);
    res.status(200).json(update);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
