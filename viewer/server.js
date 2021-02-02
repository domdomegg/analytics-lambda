const express = require('express');
const path = require('path');
const app = express();
const { execSync } = require('child_process');
const fs = require('fs');

const S3_BUCKET_NAME = 's3://your-s3-bucket-env';

// Check the S3 bucket exists and we can read from it with the AWS CLI
execSync('aws s3 ls ' + S3_BUCKET_NAME);

app.get('/api/projects', (req, res) => {
    return res.send(fs.readdirSync(path.join(__dirname, 'data')));
});

const alphaNumRegex = /^[a-zA-Z0-9_-]+$/;

app.get('/api/projects/:project/streams', (req, res) => {
    if (!alphaNumRegex.test(req.params.project)) return res.status(400).send({ message: 'Invalid project' });

    const projectDirPath = path.join(__dirname, 'data', req.params.project);
    if (!fs.existsSync(projectDirPath)) return res.status(404).send({ message: 'Project not found' });

    return res.send(fs.readdirSync(projectDirPath));
});

const filenameToMilliseconds = (filename) => new Date(filename.slice(0, 10).replace(/_/g, '-') + 'T' + filename.slice(11, 19).replace(/_/g, ':') + '.' + filename.slice(20, 24)).getTime();

app.get('/api/projects/:project/streams/:streamId', (req, res) => {
    if (!alphaNumRegex.test(req.params.project)) return res.status(400).send({ message: 'Invalid project' });
    if (!alphaNumRegex.test(req.params.streamId)) return res.status(400).send({ message: 'Invalid streamId' });

    const streamDirPath = path.join(__dirname, 'data', req.params.project, req.params.streamId);
    if (!fs.existsSync(streamDirPath)) return res.status(404).send({ message: 'Stream not found' });

    const streamEventFilenames = fs.readdirSync(streamDirPath);
    const streamMap = {};
    streamEventFilenames.forEach(filename => streamMap[filenameToMilliseconds(filename)] = JSON.parse(fs.readFileSync(path.join(streamDirPath, filename), { encoding: 'utf-8' })));
    return res.send(streamMap);
});

app.post('/api/sync', (req, res) => {
    execSync('aws s3 sync ' + S3_BUCKET_NAME + ' ' + path.join(__dirname, 'data') + ' --delete');
    return res.send();
});

app.get('/api', (req, res) => {
    res.send({ message: 'Hello, I\'m alive!' })
});

const port = 3001;
app.listen(port);
console.log('Server listening on port', port)