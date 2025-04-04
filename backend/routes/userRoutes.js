import express from 'express'
import bcrypt from 'bcryptjs'
import expressAsyncHandler from 'express-async-handler'
import multer from 'multer'
import axios from 'axios'
import User from '../models/userModel.js'
import { isAuth, isAdmin, generateToken } from '../utils.js'

const userRouter = express.Router()
const upload = multer()

//  Liste des utilisateurs
userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({})
    res.send(users)
  })
)

//  Mise à jour profil
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8)
      }
      const updatedUser = await user.save()
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      })
    } else {
      res.status(404).send({ message: 'User not found' })
    }
  })
)

//  Détails d’un utilisateur
userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      res.send(user)
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

//  Modifier utilisateur (admin)
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = Boolean(req.body.isAdmin)
      const updatedUser = await user.save()
      res.send({ message: 'User Updated', user: updatedUser })
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

// Supprimer utilisateur (admin)
userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (user) {
      if (user.email === 'boutabia@gmail.com') {
        res.status(400).send({ message: 'Cannot delete main admin user' })
        return
      }
      await user.deleteOne()
      res.send({ message: 'User Deleted' })
    } else {
      res.status(404).send({ message: 'User Not Found' })
    }
  })
)

//  Connexion email/mot de passe
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      })
      return
    }
    res.status(401).send({ message: 'Invalid email or password' })
  })
)

//  Inscription
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    })
    const user = await newUser.save()
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    })
  })
)

//  Enregistrer image faciale
userRouter.post(
  '/upload-face',
  isAuth,
  upload.single('image'),
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
      user.faceImage = req.file.buffer.toString('base64')
      await user.save()
      res.send({ message: 'Image faciale enregistrée' })
    } else {
      res.status(404).send({ message: 'User not found' })
    }
  })
)

//  Connexion par visage
userRouter.post(
  '/face-signin',
  upload.single('image'),
  expressAsyncHandler(async (req, res) => {
    const imageBuffer = req.file.buffer.toString('base64')
    const users = await User.find({})
    let recognizedUser = null

    console.log('📷 Image capturée (base64):', imageBuffer.slice(0, 100))

    for (const user of users) {
      if (user.faceImage) {
        console.log('👤 Test avec:', user.email)
        console.log(
          '🗂️ Image de la base (base64):',
          user.faceImage.slice(0, 100)
        )

        try {
          const result = await axios.post('http://localhost:8000/recognize/', {
            image1: imageBuffer,
            image2: user.faceImage,
          })

          console.log('🔎 Résultat FastAPI:', result.data)

          if (result.data.verified) {
            recognizedUser = user
            break
          }
        } catch (err) {
          console.error('❌ Erreur FastAPI:', err.message)
        }
      }
    }

    if (recognizedUser) {
      res.send({
        result: 'success',
        user: {
          _id: recognizedUser._id,
          name: recognizedUser.name,
          email: recognizedUser.email,
          isAdmin: recognizedUser.isAdmin,
          token: generateToken(recognizedUser),
        },
      })
    } else {
      res.send({ result: 'not_recognized' })
    }
  })
)

export default userRouter
