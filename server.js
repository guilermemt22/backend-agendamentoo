```javascript
require("dotenv").config();
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post("/webhook-agendamento", async (req, res) => {
  const { nome, data, hora } = req.body;

  console.log("Novo agendamento:", nome, data, hora);

  try {
    await admin.messaging().send({
      topic: "admin",
      notification: {
        title: "Novo agendamento recebido",
        body: `${nome} • ${data} às ${hora}`
      }
    });

    res.send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).send("erro");
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
