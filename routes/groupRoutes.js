const router = require("express").Router();
const { User, Group } = require("../models/User");

router.get("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const group = await Group.findById(_id);

    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.post("/:id", async (req, res) => {
  const _id = req.params.id;

  const { title, description, days } = req.body;

  const group = { title, description, days };

  if (!title) {
    res.status(422).json({ error: "Titulo é obrigatório" });
  }

  try {
    const create = await Group.create(group).then((e) => {
      return User.findOneAndUpdate(_id, {
        $addToSet: {
          group: e._id,
        },
      });
    });

    res.status(201).json({ data: create });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.delete("/:id", async (req, res) => {
  const _id = req.params.id;

  if (!_id) {
    return res.json({ status: "Error", error: "Id não informado" });
  }

  try {
    await User.findOneAndUpdate(
      { "group._id": _id },
      {
        $unset: {
          "group.$[a]": "",
        },
      },
      {
        arrayFilters: [
          {
            "a._id": _id,
          },
        ],
      }
    );
    const deleteGroup = await Group.deleteOne({ _id }, { new: true });

    res.status(200).json(deleteGroup);
  } catch (err) {
    res.json({ status: "error", error: err });
  }
});

router.put("/:id", async (req, res) => {
  const _id = req.params.id;
  const { title, description, days } = req.body;

  const group = { title, description, days };

  try {
    const updateGroup = await Group.updateOne(
      { _id },
      {
        $set: group,
      }
    );

    res.status(200).json(updateGroup);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
