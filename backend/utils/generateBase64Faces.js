import fs from 'fs'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/userModel.js'

import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config()

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch((err) => console.error('❌ Erreur MongoDB', err))

const encodeAndSave = async (userEmail, imagePath) => {
  try {
    const user = await User.findOne({ email: userEmail })
    if (!user) {
      console.log(`❌ Utilisateur ${userEmail} introuvable`)
      return
    }

    const buffer = fs.readFileSync(imagePath)
    const base64 = 'data:image/jpeg;base64,' + buffer.toString('base64')

    user.faceImage = base64
    await user.save()

    console.log(`✅ Image encodée et sauvegardée pour ${userEmail}`)
  } catch (err) {
    console.error('❌ Erreur :', err)
  }
}

// 🔁 Appelle cette fonction pour chaque utilisateur
encodeAndSave('soufiane@gmail.com', './frontend/public/images/faces/photo2.jpg')
encodeAndSave('douaa@gmail.com', './frontend/public/images/faces/photo1.jpg')
