import express from 'express'
import multer from 'multer'
import fs from 'fs'
import { recognizeFace } from '../services/pythonService.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path
    const result = await recognizeFace(imagePath)
    fs.unlinkSync(imagePath) // Supprime l'image temporaire
    res.json(result)
  } catch (error) {
    console.error('❌ Erreur Reconnaissance:', error)
    res.status(500).json({ status: 'error', message: 'Erreur serveur' })
  }
})

export default router
