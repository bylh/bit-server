import express from 'express';
const router = express.Router();

router.get('/mtp_api/admin', (req, res) => {
  res.status(200).json({
    code: 0,
    msg: 'OK',
    data: {
      username: 'test'
    }
  });
});

export default router;