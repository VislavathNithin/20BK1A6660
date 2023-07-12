const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  
  if (!urls) {
    return res.status(400).json({ error: 'No URLs provided' });
  }
  
  const allNumbers = [];
  
  try {
    for (const url of urls) {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract numbers using a regular expression
      const numbers = html.match(/\d+/g);
      
      if (numbers) {
        allNumbers.push(...numbers.map(Number));
      }
    }
    
    res.json({ numbers: allNumbers });
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while processing the URLs' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});