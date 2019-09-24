import express = require('express');
import path = require('path');
import chalk from 'chalk';

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.use(express.static(__dirname));

app.use((req, res, next, err) => {
  console.log(chalk.red(err.message));
  res.status(500).send();
});

app.listen(PORT, () => {
  console.log(chalk.green(`App serving on localhost:${PORT}`));
});
