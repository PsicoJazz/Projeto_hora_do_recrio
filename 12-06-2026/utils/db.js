// utils/db.js
const fs = require("fs");
const path = require("path");

function lerJSON(nome) {
  const caminho = path.join(__dirname, "..", "data", `${nome}.json`);
  return JSON.parse(fs.readFileSync(caminho, "utf-8"));
}

function salvarJSON(nome, dados) {
  const caminho = path.join(__dirname, "..", "data", `${nome}.json`);
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}

module.exports = { lerJSON, salvarJSON };