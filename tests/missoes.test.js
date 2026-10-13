const request = require('supertest');
const app = require('../src/app');
let missoes = require('../src/data/missoes');
const nasaService = require('../src/services/nasa.service');
 
jest.mock('../src/services/nasa.service');
 
describe('Testes da API de Missões Espaciais', () => {
 
  beforeEach(() => {
    // Reseta os dados em memória antes de cada teste
    missoes.length = 0;
    missoes.push(
      { id: 1, nome: "Apollo 11", ano: 1969, agencia: "NASA", status: "Concluída" },
      { id: 2, nome: "Voyager 1", ano: 1977, agencia: "NASA", status: "Em operação" },
      { id: 3, nome: "Artemis II", ano: 2026, agencia: "NASA", status: "Planejada" },
      { id: 4, nome: "James Webb", ano: 2021, agencia: "NASA", status: "Em operação" },
      { id: 5, nome: "Curiosity", ano: 2012, agencia: "NASA", status: "Em operação" }
    );
    jest.clearAllMocks();
  });
 
  test('GET /status deve retornar 200 e ok', async () => {
    const res = await request(app).get('/status');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
    expect(res.headers['content-type']).toMatch(/json/);
  });
 
  test('GET /missoes deve retornar 200 e um array com pelo menos 5 itens', async () => {
    const res = await request(app).get('/missoes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length.toBeGreaterThanOrEqual(5));
  });
 
  test('GET /missoes/:id deve retornar a missão correta ou 404 para ID inexistente', async () => {
    const res = await request(app).get('/missoes/1');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
 
    const res404 = await request(app).get('/missoes/999');
    expect(res404.status).toBe(404);
  });
 
  test('POST /missoes deve cadastrar nova missão ou retornar 400 se dados inválidos', async () => {
    const nova = { nome: "Artemis III", ano: 2027, agencia: "NASA", status: "Planejada" };
    const res = await request(app).post('/missoes').send(nova);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
 
    const res400 = await request(app).post('/missoes').send({ nome: "Incompleta" });
    expect(res400.status).toBe(400);
  });
 
  test('PUT /missoes/:id deve atualizar a missão ou retornar 404', async () => {
    const res = await request(app).put('/missoes/1').send({ status: "Atualizada" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("Atualizada");
 
    const res404 = await request(app).put('/missoes/999').send({ status: "Teste" });
    expect(res404.status).toBe(404);
  });
 
  test('DELETE /missoes/:id deve remover a missão e retornar 204', async () => {
    const res = await request(app).delete('/missoes/1');
    expect(res.status).toBe(204);
 
    const res404 = await request(app).delete('/missoes/999');
    expect(res404.status).toBe(404);
  });
 
  test('GET /apod com mock do axios simulando sucesso', async () => {
    nasaService.getApod.mockResolvedValueOnce({
      date: "2024-01-15",
      title: "Titulo da imagem",
      explanation: "Texto explicativo"
    });
 
    const res = await request(app).get('/apod?date=2024-01-15');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title');
  });
 
});
 