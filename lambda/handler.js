'use strict';

// Uses the AWS SDK v3 bundled into the nodejs18.x+ Lambda runtimes (the
// previously-used aws-sdk v2 was only bundled up to nodejs16.x)
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const s3 = new S3Client({})

module.exports.record = async (event) => {
  if (!event.body) return makeRes(400, "Missing payload");
  if (typeof event.body !== "string") return makeRes(400, "Payload not string");
  if (!isJSON(event.body)) return makeRes(400, "Payload not JSON");

  const body = JSON.parse(event.body);
  if (!('project' in body)) return makeRes(400, "Payload missing project");
  if (!('streamId' in body)) return makeRes(400, "Payload missing streamId");
  if (!('data' in body)) return makeRes(400, "Payload missing data");

  const alphaNumRegex = /^[a-zA-Z0-9_-]+$/;
  if (!alphaNumRegex.test(body.project)) return makeRes(400, "Invalid project name");
  if (!alphaNumRegex.test(body.streamId)) return makeRes(400, "Invalid streamId name");

  try {
    await s3.send(new PutObjectCommand({
      Body: JSON.stringify(body.data),
      Bucket: 'domdomegg-analytics-lambda-' + process.env.STAGE,
      Key: body.project + '/' + body.streamId + '/' + new Date().toISOString().replace(/[-:.T]/g, '_') + '.json',
    }));
  } catch (err) {
    console.error(err);
    return makeRes(503, "Service unavailable");
  }

  return { statusCode: 204 };
};

/**
 * @param {number} statusCode The status code
 * @param {string} message The error message
 * @returns {{ statusCode: number, body: string }}
 */
const makeRes = (statusCode, message) => ({ statusCode, body: JSON.stringify({ message }) })

/**
 * @param {string} maybeJSON A string to test
 * @returns {boolean}
 */
const isJSON = (maybeJSON) => {
  try {
    JSON.parse(maybeJSON);
    return true;
  } catch {
    return false;
  }
}