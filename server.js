const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: 'bpdckavpt6atz2yif6px-mysql.services.clever-cloud.com',
    user: 'uvqxuhnaawa6qfc4',
    password: 'asEpTQ6lQcGyS6Iz6Q5R',
    database: 'bpdckavpt6atz2yif6px',
    port: 3306
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
    else console.log("Tabela pronta para uso na nuvem!");
});

app.post('/enviar-produto', (req, res) => {
    const { nome, categoria, descricao, preco } = req.body;
    const query = "INSERT INTO produtos (nome, categoria, descricao, preco) VALUES (?, ?, ?, ?)";
    
    db.query(query, [nome, categoria, descricao, preco], (err, result) => {
        if (err) return res.status(500).send("Erro ao salvar");
        res.send("Produto salvo com sucesso!");
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
        res.send("Excluído com sucesso");
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});