const express = require('express');
const router = express.Router();
let missoes = require('../data/missoes');
const { getApod } = require('../services/nasa.service');
 
/**
 * @swagger
 * /status:
 *   get:
 *     summary: Verifica funcionamento da API
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/status', (req, res) => {
  res.status(200).json({ status: "ok" });
});
 
/**
 * @swagger
 * /missoes:
 *   get:
 *     summary: Lista todas as missões
 *     responses:
 *       200:
 *         description: Lista de missões retornada com sucesso.
 */
router.get('/missoes', (req, res) => {
  res.status(200).json(missoes);
});
 
/**
 * @swagger
 * /missoes/{id}:
 *   get:
 *     summary: Busca missão por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Missão encontrada.
 *       404:
 *         description: Missão não encontrada.
 */
router.get('/missoes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const missao = missoes.find(m => m.id === id);
  if (!missao) {
    return res.status(404).json({ erro: "Not Found", mensagem: "Missão não encontrada" });
  }
  res.status(200).json(missao);
});
 
/**
 * @swagger
 * /missoes:
 *   post:
 *     summary: Cadastra nova missão
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               ano:
 *                 type: integer
 *               agencia:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 */
router.post('/missoes', (req, res) => {
  const { nome, ano, agencia, status } = req.body;
  if (!nome || !ano || !agencia || !status) {
    return res.status(400).json({ erro: "Bad Request", mensagem: "Campos obrigatórios ausentes ou inválidos." });
  }
 
  const novoId = missoes.length > 0 ? Math.max(...missoes.map(m => m.id)) + 1 : 1;
  const novaMissao = { id: novoId, nome, ano, agencia, status };
 
  missoes.push(novaMissao);
  res.status(201).json(novaMissao);
});
 
/**
 * @swagger
 * /missoes/{id}:
 *   put:
 *     summary: Atualiza missão existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Atualizado com sucesso.
 *       404:
 *         description: Missão não encontrada.
 */
router.put('/missoes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = missoes.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: "Not Found", mensagem: "Missão não encontrada" });
  }
 
  const { nome, ano, agencia, status } = req.body;
  missoes[index] = { id, nome: nome || missoes[index].nome, ano: ano || missoes[index].ano, agencia: agencia || missoes[index].agencia, status: status || missoes[index].status };
 
  res.status(200).json(missoes[index]);
});
 
/**
 * @swagger
 * /missoes/{id}:
 *   delete:
 *     summary: Remove missão por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Removido com sucesso (sem corpo).
 *       404:
 *         description: Missão não encontrada.
 */
router.delete('/missoes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = missoes.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ erro: "Not Found", mensagem: "Missão não encontrada" });
  }
 
  missoes.splice(index, 1);
  res.status(204).send();
});
 
/**
 * @swagger
 * /apod:
 *   get:
 *     summary: Foto astronômica do dia (NASA APOD)
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Data no formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Sucesso.
 *       400:
 *         description: Data inválida.
 *       502:
 *         description: Bad Gateway.
 *       504:
 *         description: Gateway Timeout.
 */
router.get('/apod', async (req, res) => {
  try {
    const { date } = req.query;
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ erro: "Bad Request", mensagem: "Data em formato inválido." });
    }
    const dataApod = await getApod(date);
    res.status(200).json(dataApod);
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.erro || "Erro", mensagem: error.mensagem });
  }
});
export {getApod}
 