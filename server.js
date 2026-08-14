// server.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { lerJSON, salvarJSON } = require("./utils/db");

const app = express();
app.use(express.json());
app.use(express.static("public")); // serve seus HTMLs

const SEGREDO = "troque-por-uma-chave-forte-em-env";

// LOGIN ALUNO
app.post("/api/login/aluno", (req, res) => {
  const { ra, senha } = req.body;
  const alunos = lerJSON("alunos");
  const aluno = alunos.find(a => a.ra === ra);

  if (!aluno || !bcrypt.compareSync(senha, aluno.senhaHash)) {
    return res.status(401).json({ erro: "RA ou senha incorretos" });
  }

  const token = jwt.sign({ id: aluno.id, tipo: "aluno" }, SEGREDO, { expiresIn: "2h" });
  res.json({ token, nome: aluno.nome });
});

// LOGIN ADMIN
app.post("/api/login/admin", (req, res) => {
  const { email, senha } = req.body;
  const admins = lerJSON("administradores");
  const admin = admins.find(a => a.email === email);

  if (!admin || !bcrypt.compareSync(senha, admin.senhaHash)) {
    return res.status(401).json({ erro: "Email ou senha incorretos" });
  }

  const token = jwt.sign({ id: admin.id, tipo: "admin" }, SEGREDO, { expiresIn: "2h" });
  res.json({ token, nome: admin.nome });
});

const autenticar = require("./middlewares/auth");

// Cadastro de admin (só quem já é admin pode cadastrar outro)
app.post("/api/administradores", autenticar(["admin"]), (req, res) => {
  const { nome, email, senha } = req.body;
  const admins = lerJSON("administradores");
  const novo = {
    id: Date.now(),
    nome, email,
    senhaHash: bcrypt.hashSync(senha, 10)
  };
  admins.push(novo);
  salvarJSON("administradores", admins);
  res.status(201).json({ mensagem: "Administrador cadastrado" });
});

// Cardápio (público, sem login)
app.get("/api/pratos", (req, res) => {
  res.json(lerJSON("pratos"));
});

// Adicionar prato (só admin)
app.post("/api/pratos", autenticar(["admin"]), (req, res) => {
  const { nome, descricao, imagem } = req.body;
  const pratos = lerJSON("pratos");
  const novo = { id: Date.now(), nome, descricao, imagem };
  pratos.push(novo);
  salvarJSON("pratos", pratos);
  res.status(201).json(novo);
});

// Listar alunos (só admin)
app.get("/api/alunos", autenticar(["admin"]), (req, res) => {
  const alunos = lerJSON("alunos").map(({ senhaHash, ...resto }) => resto);
  res.json(alunos);
});

app.listen(3000, () => console.log("API rodando em http://localhost:3000"));

document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const ra = document.getElementById("ra").value;
    const senha = document.getElementById("senha").value;
  
    const resp = await fetch("/api/login/aluno", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ra, senha })
    });
  
    const dados = await resp.json();
    if (resp.ok) {
      localStorage.setItem("token", dados.token);
      window.location.href = "indexAl.html";
    } else {
      alert(dados.erro);
    }
  });