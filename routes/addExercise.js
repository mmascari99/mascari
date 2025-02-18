 const express = require('express');
const { createExercise, getExerciseByName } = require('../db/exercisesdb');
const router = express.Router();

router.post('/admin', async (req, res) => {
    const { name, description, video_link, image } = req.body;
    try {
      const existingExercise = await getExerciseByName(name);
      if (existingExercise) return res.status(400).send('Exercise already exists');
  
      createExercise(name, description, video_link, image);
    } catch (err) {
      res.status(500).send('Error creating exercise');
    }
});

module.exports = router;