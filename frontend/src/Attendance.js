import React, { useRef, useState } from 'react'

function Attendance() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [result, setResult] = useState('')
  const [stream, setStream] = useState(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      videoRef.current.srcObject = mediaStream
      setStream(mediaStream)
      setResult('')
    } catch (err) {
      console.error('Erreur d’accès à la caméra :', err)
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
          'http://localhost:5000/api/mark-attendance',
          {
            method: 'POST',
            body: formData,
          }
        )
        const data = await response.json()
        if (data.result === 'success') {
          setResult('✅ Bienvenue ' + data.data)
        } else if (data.result === 'error') {
          setResult('❌ ' + data.message)
        } else {
          setResult('❌ Visage non reconnu')
        }
      } catch (err) {
        console.error(err)
        setResult('❗ Erreur de connexion')
      } finally {
        stopCamera() // On stoppe la caméra après l'envoi
      }
    }, 'image/jpeg')
  }

  return (
    <div>
      <h2>Prendre la présence</h2>
      <video ref={videoRef} width="320" height="240" autoPlay></video>
      <br />
      <button onClick={startCamera}>📷 Activer Caméra</button>
      <button onClick={captureAndSend}>✅ Capturer & Envoyer</button>
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

export default Attendance
