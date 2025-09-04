import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([
    { id: 1, title: "Hello NovaTok" },
    { id: 2, title: "Your API is live!" }
  ])
}
