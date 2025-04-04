import React, { useRef, useState, useContext } from 'react'
import { Store } from '../Store'
import { useNavigate } from 'react-router-dom'

export default function FaceSigninScreen() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [result, setResult] = useState('')
  const [stream, setStream] = useState(null)
  const { dispatch: ctxDispatch } = useContext(Store)
  const navigate = useNavigate()

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      videoRef.current.srcObject = mediaStream
      setStream(mediaStream)
      setResult('')
    } catch (err) {
      console.error('Erreur caméra :', err)
      setResult('❗ Erreur d’accès à la caméra')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const captureAndSend = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(async (blob) => {
      const formData = new FormData()
      formData.append('image', blob, 'capture.jpg')

      try {
        const response = await fetch(
          'http://localhost:5000/api/users/face-signin',
          {
            method: 'POST',
            body: formData,
          }
        )
        const data = await response.json()
        if (data.result === 'success') {
          setResult('✅ Bienvenue ' + data.user.name)
          ctxDispatch({ type: 'USER_SIGNIN', payload: data.user })
          localStorage.setItem('userInfo', JSON.stringify(data.user))
          navigate('/')
        } else {
          setResult('❌ Visage non reconnu')
        }
      } catch (err) {
        console.error(err)
        setResult('❗ Erreur connexion serveur')
      } finally {
        stopCamera()
      }
    }, 'image/jpeg')
  }

  return (
    <div>
      <h2>Connexion par visage</h2>
      <video ref={videoRef} width="320" height="240" autoPlay></video>
      <br />
      <button onClick={startCamera}>📷 Activer Caméra</button>
      <button onClick={captureAndSend}>✅ Capturer & Connexion</button>
      <canvas
        ref={canvasRef}
        width="320"
        height="240"
        style={{ display: 'none' }}
      ></canvas>
      <p>{result}</p>
    </div>
  )
}
