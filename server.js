const express = require('express');
const cors = require('cors');
const path = require('path');

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});

var publicPath = path.join(__dirname, 'public');

app.get('/api', function (req, res) {
    res.sendFile(path.join(publicPath + '/api.html'));
});

app.get('/api/create/organisation', function (req, res) {
    res.sendFile(path.join(publicPath + '/api_organisation.html'));
});

app.post('/api/create/organisation', async function (req, res) {
    try {
        const name = req.body.name;
        const description = req.body.description;

        const result = await fetch('https://api.codecarbon.io/organization?token=jessica', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                description: description
            })
        });

        const json = await result.json();
        res.status(result.status).send(json);
    } catch (ex) {
        console.log(ex);
        res.status(500).send(ex.message);
    }
});

app.get('/api/create/team', function (req, res) {
    res.sendFile(path.join(publicPath + '/api_team.html'));
});

app.post('/api/create/team', async function (req, res) {
    try {
        const organization_id = req.body.organization_id;
        const name = req.body.name;
        const description = req.body.description;

        const result = await fetch('https://api.codecarbon.io/team?token=jessica', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                description: description,
                organization_id: organization_id
            })
        });

        console.log(result.status);
        console.log(result.statusText);

        const json = await result.json();
        res.status(result.status).send(json);
    } catch (ex) {
        console.log(ex);
        res.status(500).send(ex.message);
    }
});

app.get('/api/create/project', function (req, res) {
    res.sendFile(path.join(publicPath + '/api_project.html'));
});

app.post('/api/create/project', async function (req, res) {
    try {
        const team_id = req.body.team_id;
        const name = req.body.name;
        const description = req.body.description;

        const result = await fetch('https://api.codecarbon.io/project?token=jessica', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                description: description,
                team_id: team_id
            })
        });

        console.log(result.status);
        console.log(result.statusText);

        const json = await result.json();
        res.status(result.status).send(json);
    } catch (ex) {
        console.log(ex);
        res.status(500).send(ex.message);
    }
});

app.get('/api/create/experiment', function (req, res) {
    res.sendFile(path.join(publicPath + '/api_experiment.html'));
});

app.post('/api/create/experiment', async function (req, res) {
    try {
        const project_id = req.body.project_id;
        const name = req.body.name;
        const description = req.body.description;
        const timestamp = req.body.timestamp;
        const country_name = req.body.country_name;
        const country_iso_code = req.body.country_iso_code;
        const region = req.body.region;
        const on_cloud = req.body.on_cloud;
        const cloud_provider = req.body.cloud_provider;
        const cloud_region = req.body.cloud_region;

        const result = await fetch('https://api.codecarbon.io/experiment?token=jessica', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                description: description,
                timestamp: timestamp,
                country_name: country_name,
                country_iso_code: country_iso_code,
                region: region,
                on_cloud: on_cloud,
                cloud_provider: cloud_provider,
                cloud_region: cloud_region,
                project_id: project_id
            })
        });

        console.log(result.status);
        console.log(result.statusText);

        const json = await result.json();
        res.status(result.status).send(json);
    } catch (ex) {
        console.log(ex);
        res.status(500).send(ex.message);
    }
});

app.get('/api/help', function (req, res) {
    res.sendFile(path.join(publicPath + '/api_help.html'));
});

//TODO Delete this it's useless
app.get('/api/experimentdata', async function (req, res) {
    try {
        const result = await fetch('https://api.codecarbon.io/experiment/def8b87f-d0a7-43d5-9bcc-6174f7f7179d?token=jessica');
        const json = await result.json();
        res.status(result.status).send(json);
    } catch (ex) {
        console.log(ex);
        res.status(500).send(ex.message);
    }
});

app.get('/api/rundata/:experimentid', async function (req, res) {
    try {
        const experiment_id = req.params.experimentid;
        const result = await fetch('https://api.codecarbon.io/runs/experiment/' + experiment_id + '?token=jessica');
        const json = await result.json();
        res.status(result.status).send(json);
    } catch (ex) {
        console.log(ex);
        res.status(500).send(ex.message);
    }
});

app.get('/api/emissionsdata/:runid', async function (req, res) {
    try {
        const run_id = req.params.runid;
        const result = await fetch('https://api.codecarbon.io/emissions/run/' + run_id + '?token=jessica&page=1&size=100');
        const json = await result.json();
        res.status(result.status).send(json);
    } catch (ex) {
        console.log(ex);
        res.status(500).send(ex.message);
    }
});

app.listen(port);
console.log('Server started at http://localhost:' + port);