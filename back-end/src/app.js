import dotenv from 'dotenv'
dotenv.config() // Carrega as variáveis de ambiente do arquivo .env

import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

const app = express()

import cors from 'cors'

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
}))


app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

// Rate limiter: limita a quantidade de requisições que cada usuário/IP
// pode efetuar dentro de um determinado intervalo de tempo
import { rateLimit } from 'express-rate-limit'

/*
  Vulnerabilidade: API4:2023 - Consumo irrestrito de recursos.
  Esta vulnerabilidade foi evitada no código ao fazer a importacao da biblioteca express-rate-limit,
  que nos possibilita limitar a quantidade de requisicoes que cada user poderá efetuar durante um
  intervalo de tempo, no nosso caso, 1 minuto, com um limite de 20 requisições. (linhas 36-39).
*/


const limiter = rateLimit({
 windowMs: 60 * 1000,    // Intervalo: 1 minuto
 limit: 20               // Máximo de 20 requisições
})


app.use(limiter)

/*********** ROTAS DA API **************/

// Middleware de verificação do token de autorização
import auth from './middleware/auth.js'
app.use(auth)

import carsRouter from './routes/cars.js'
app.use('/cars', carsRouter)

import customersRouter from './routes/customers.js'
app.use('/customers', customersRouter)

import usersRouter from './routes/users.js'
app.use('/users', usersRouter)

export default app
