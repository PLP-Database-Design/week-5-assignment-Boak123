const express = require ('express') ;
const app = express();
const mysql = require ('mysql');
const dontenv = require ('dotenv')


app.use(express.json());
dontenv.config();


const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
});

db.connect((err) => {
    if(err){
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});


// Retrieve all patients
app.get('/patients', (req, res) => {
    db.query('SELECT * FROM patients', (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send('An error occurred while fetching patients');
        } else {
            res.send(result);
        }
    });
});


// Retrieve all providers
app.get('/providers', (req, res) => {
    db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while fetching providers');
        } else {
            res.send(result);
        }
    });
});


// Filter patients by First Name
app.get('/patients/:first_name', (req, res) => {
    const firstName = req.params.first_name;
    db.query('SELECT * FROM patients WHERE first_name = ?', [firstName], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while fetching patients');
        } else {
            res.send(result);
        }
    });
});

app.get('/providers/:provider_specialty', (req, res) => {
    const providerSpecialty = req.params.provider_specialty;
    db.query('SELECT * FROM providers WHERE provider_specialty = ?', [providerSpecialty], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while fetching providers');
        } else {
            res.send(result);
        }
    });
});


app.listen(process.env.PORT, () => {
    console.log('Server is running on port ${process.env.PORT}');

    console.log('sending message to the browser...');
    app.get('/', (req, res) => {
        res.send('Server Started Successfully');
    });
});