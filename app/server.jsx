import express from 'express'
import path from 'path'

import { renderToString } from 'react-dom/server';
import fs from 'fs';
import App from 'index.jsx';

const app = express();
app.use(express.static(path.join(__dirname, '/../build')));
const indexHTML = fs.readFileSync(__dirname + '/../build/index.html').toString();
function renderPage(appHtml,initialState) {
  return indexHTML.replace('<!-- {{app}} -->', appHtml)
  .replace('<!-- {{initialState}} -->','initialState = '+
  JSON.stringify(initialState)+';');
}


app.get('*', (req, res) => {
    res.send(renderPage(renderToString(
        <App/>
        ),{}))
});
const PORT =  8080;
app.listen(PORT, function() {
  console.log('Production Express server running at localhost:' + PORT);
});
