const express = require('express')
const cors = require('cors');
const path = require('path')
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

//const rpb = 'C:/Temp/VSC-Projects/Backend'

// Use CORS with default settings (Allow all origins)
app.use(cors());

// Boody parser to decode form submission
app.use(bodyParser.urlencoded({ extended: true }));

// JSON parser
app.use(express.json());

// Array that saves persons 
let mypersonlist = [
  { vorname: "Hans", nachname: "Muster", alter: 67, haarfarbe: "blau", id: 1 },
  { vorname: "Gaby", nachname: "Müller", alter: 6, haarfarbe: "braun", id: 6 }
];

// Tells the port in console
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Returns next free id
function getNextFreeId() {
  let highest = 0;
  mypersonlist.forEach(p => {
    if (p.id > highest) {
      highest = p.id
    }
  })
  return highest + 1;
}

// Root
app.get('/', (req, res) => {
  res.json({
    "now": new Date()
  });
});

// Liste von Personen als JSON zurück
app.get('/personlist', (req, res) => {
  res.json(mypersonlist)
});

// Gets new Person site
/* app.get('/person', (req, res) => {
  res.sendFile(path.join(rpf, 'NewPerson.html'))
}); */

// Updates data of a person
app.put('/person/:personId', (req, res) => {

  let personToUpadte = mypersonlist.find(p => p.id == req.params.personId)

  if (!personToUpadte) {
    return res.status(404).send('Person not found');
  }

  personToUpadte.vorname = req.body['vorname']
  personToUpadte.nachname = req.body['nachname']
  personToUpadte.alter = req.body['alter']
  personToUpadte.haarfarbe = req.body['haarfarbe']

  res.sendStatus(200)
});

app.delete('/person/:personId', (req, res) => {
  let id = parseInt(req.params.personId);
  let personToDelete = mypersonlist.findIndex(p => p.id === id);
  if (personToDelete === -1) {
    console.log("No person found");
    res.sendStatus(404)
    return;
  }

  mypersonlist.splice(personToDelete, 1);
  res.sendStatus(200);

});


// Gets a person via Id and returns JSON
app.get('/getpersonbyid/:id', (req, res) => {
  const personId = req.params.id;
  const person = mypersonlist.find(p => p.id == personId);
  res.json(person);
});

// Returns HTML to update person
/* app.get('/person/:personId', (req, res) => {
  const personId = req.params.personId;
  const person = mypersonlist.find(p => p.id == personId);
  if (person) {
    res.sendFile(path.join(rpf, 'EditPerson.html/23'));
  } else {
    res.status(404).send('Person not found');
  }
}); */

// diese Methode soll Daten vom Frontend empfangen (JSON) und dieses Objekt an die Personenlsiste anfügen
//this is person create
app.post("/person", (req, res) => {

  if (Array.isArray(req.body)) {
    return res.status(400).json({
      message: "Arrays are not supported"
    });
  }

  const test = req.body;

  let isObjectCorrect = Object.keys(req.body).every(key => {
    let value = req.body[key];
    return value !== undefined && value !== null && value !== ''
  });

  if (isObjectCorrect) {
    let highest = 0;
    mypersonlist.forEach(p => {
      if (p.id > highest) {
        highest = p.id
      }
    })

    req.body['id'] = getNextFreeId();
    mypersonlist.push(req.body);

    return res.status(200).send("");
  }

  else {
    return res.status(400).json({
      message: "The person-data is invalid."
    });
  }
});