import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRoutes.js'
import attendanceRouter from './routes/attendanceRoute.js'
import cors from 'cors'

dotenv.config()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB')
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB :', err.message)
  })

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/mark-attendance', attendanceRouter)

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`🚀 Serveur Express http://localhost:${port}`)
})
