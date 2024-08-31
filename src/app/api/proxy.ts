import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { endpoint } = req.query
  const apiUrl = `https://api.citybik.es/v2/networks/${endpoint}`

  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" })
  }
}
