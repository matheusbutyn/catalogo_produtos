require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.query(`
    CREATE TABLE IF NOT EXISTS produtos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        categoria VARCHAR(100) NOT NULL,
        descricao TEXT NOT NULL,
        preco DECIMAL(10, 2) NOT NULL
    )
`, (err, result) => {
    if (err) console.error("Erro ao criar tabela:", err);
    else console.log("Tabela sincronizada com o banco de dados.");
});

app.post('/enviar-produto', (req, res) => {
    const { nome, categoria, descricao, preco } = req.body;
    const query = "INSERT INTO produtos (nome, categoria, descricao, preco) VALUES (?, ?, ?, ?)";
    
    db.query(query, [nome, categoria, descricao, preco], (err, result) => {
        if (err) return res.status(500).send("Erro ao salvar");
        res.send("Produto saved");
    });
});

app.get('/produtos', (req, res) => {
    db.query("SELECT * FROM produtos", (err, results) => {
        if (err) return res.status(500).send("Erro ao buscar");
        res.json(results);
    });
});

app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM produtos WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).send("Erro ao excluir");
        if (result.affectedRows === 0) return res.status(404).send("Não encontrado");
        res.send("Excluído com sucesso");
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => {
        console.log('Servidor rodando localmente na porta 3000');
    });
}
module.exports = app;