import express from 'express'

export function controlRouter(getState, setState) {
  const router = express.Router()

  router.post('/start', (_, res) => {
    setState({ running: true })
    res.json({ ok: true, state: getState() })
  })

  router.post('/stop', (_, res) => {
    setState({ running: false })
    res.json({ ok: true, state: getState() })
  })

  router.post('/risk', (req, res) => {
    const { level } = req.body
    setState({ risk: level })
    res.json({ ok: true, state: getState() })
  })

  router.post('/size', (req, res) => {
    const { size } = req.body
    setState({ position_size: size })
    res.json({ ok: true, state: getState() })
  })

  return router
}
