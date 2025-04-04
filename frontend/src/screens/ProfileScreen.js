import React, { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Store } from '../Store'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import axios from 'axios'

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { userInfo } = state
  const [name, setName] = useState(userInfo.name)
  const [email, setEmail] = useState(userInfo.email)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [image, setImage] = useState(null)

  const submitHandler = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('email', email)
      if (password) {
        formData.append('password', password)
      }
      if (image) {
        formData.append('image', image)
      }

      const { data } = await axios.put('/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      ctxDispatch({ type: 'USER_SIGNIN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      toast.success('Profil mis à jour avec succès')
    } catch (err) {
      toast.error(getError(err))
    }
  }

  return (
    <div className="container small-container">
      <Helmet>
        <title>Profil</title>
      </Helmet>
      <h1 className="my-3">Modifier le Profil</h1>
      <form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirmer mot de passe</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image">
          <Form.Label>Image faciale (optionnel)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Form.Group>
        <div className="mb-3">
          <Button type="submit">Mettre à jour</Button>
        </div>
      </form>
    </div>
  )
}
