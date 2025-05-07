import express from 'express';
import Tutorial from '../models/Tutorial.js';

const router = express.Router();

// Get all tutorials
router.get('/', async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort('order');
    res.json(tutorials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single tutorial
router.get('/:id', async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }
    res.json(tutorial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;