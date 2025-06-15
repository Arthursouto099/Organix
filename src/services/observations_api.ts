


export async function createObservation(taskId: string, creatorId: string, content: string) {
  const request = await fetch(`${import.meta.env.VITE_API_URL}/observation/create/${creatorId}/${taskId}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({ content })
  })

  const response = await request.json()

  if (request.ok) return { status: true, message: response.message }
  return { status: false, message: response.message }

}



export async function getAllObservationsByTaskId(taskId: string) {
  const request = await fetch(`${import.meta.env.VITE_API_URL}/observation/observations/${taskId}`)


  const response = await request.json()


  if (request.ok) return { status: true, data: response.data, message: response.message }
  return { status: false, data: null, message: response.message }

}