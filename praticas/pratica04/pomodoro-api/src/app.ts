import express from 'express'
import { prisma } from './lib/prisma.js'

const app = express()
app.use(express.json())

// Rota GET /health
app.get('/health', (req, res) => {
  return res.json({ status: 'ok' })
})

// Rota GET /settings
app.get('/settings', async (req, res) => {
  const settings = await prisma.settings.findFirst()
  
  if (!settings) {
    return res.json({ focusTime: 25, shortBreak: 5, longBreak: 15 })
  }
  
  return res.json(settings)
})

export { app }