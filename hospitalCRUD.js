const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const filePath = path.join(__dirname, 'hospital_data.json');

// Read data JSON
function readData() {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Write data JSON 
function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/hospitals' && req.method === 'GET') {

// GET methord

    const hospitals = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(hospitals));

} else if (pathname === '/hospitals' && req.method === 'POST') {

// POST methord
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const newHospital = JSON.parse(body);
      const hospitals = readData();
      hospitals.push(newHospital);
      writeData(hospitals);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newHospital));
    });
} else if (pathname.startsWith('/hospitals/') && req.method === 'PUT') {

// PUT methord

    const hospitalIndex = parseInt(pathname.split('/')[2]);
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
   });
    req.on('end', () => {
      const updatedHospital = JSON.parse(body);
      const hospitals = readData();
      hospitals[hospitalIndex] = updatedHospital;
      writeData(hospitals);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(updatedHospital));
    });
} else if (pathname.startsWith('/hospitals/') && req.method === 'DELETE') {

// DELETE methord

    const hospitalIndex = parseInt(pathname.split('/')[2]);
    const hospitals = readData();
    const deletedHospital = hospitals.splice(hospitalIndex, 1);
    writeData(hospitals);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(deletedHospital));
} else {

// invalid 

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// APP listening

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});