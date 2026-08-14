// middlewares/auth.js
const jwt = require("jsonwebtoken");
const SEGREDO = "troque-por-uma-chave-forte-em-env";

function autenticar(tiposPermitidos) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ erro: "Token não enviado" });

    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, SEGREDO);
      if (tiposPermitidos && !tiposPermitidos.includes(payload.tipo)) {
        return res.status(403).json({ erro: "Sem permissão" });
      }
      req.usuario = payload;
      next();
    } catch {
      res.status(401).json({ erro: "Token inválido ou expirado" });
    }
  };
}

module.exports = autenticar;