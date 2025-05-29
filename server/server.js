const pg = require('pg')
const express = require('express')
const app = express()
const port = 3001
const cors = require("cors")
const { Pool } = pg
 
const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'FinanceManager',
  password: '12345',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Started http://localhost:${port}`)
})

app.get('/number', (req, res) => {
    res.send({message: "69"})
})

app.post('/register', async (req, res) => {
    const {login, email, password} = req.body

    const loginAmount = await pool.query('select * from users where (login = $1::text)', [login])

    if (loginAmount.rows.length >= 1) {

        res.status(400).send()

        return;
    }

    const insertResult = await pool.query('insert into users