import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

export async function recognizeFace(imagePath) {
  const form = new FormData()
  form.append('file', fs.createReadStream(imagePath))

  try {
    const response = await axios.post(
      'http://localhost:8000/recognize/',
      form,
      {
        headers: form.getHeaders(),
      }
    )
    return response.data
  } catch (error) {
    console.error('❌ Erreur API Python:', error.message)
    return { status: 'error', message: error.message }
  }
}
