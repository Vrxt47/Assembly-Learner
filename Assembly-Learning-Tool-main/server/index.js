import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import tutorialRoutes from './routes/tutorials.js';
import codeExecutionRoutes from './routes/codeExecution.js';
import puppeteer from 'puppeteer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/assembly-learning')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Serve static files from the React build
app.use(express.static(join(__dirname, '../dist')));

// Routes
app.use('/api/tutorials', tutorialRoutes);
app.use('/api/code-execution', codeExecutionRoutes);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/generate-pdf/:id', async (req, res) => {
  const { id } = req.params;
  const tutorial = await getTutorialFromDatabase(id); // Your DB logic
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setContent(`
    <h1>${tutorial.title}</h1>
    <p>${tutorial.description}</p>
    ${tutorial.content}
  `);
  
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();
  
  // Save to server or cloud storage
  const fileName = `tutorial_${id}.pdf`;
  fs.writeFileSync(`./public/pdfs/${fileName}`, pdfBuffer);
  
  res.json({ pdfUrl: `/pdfs/${fileName}` });
});