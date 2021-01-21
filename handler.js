'use strict';

const AWS = require('aws-sdk')
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

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

  const [err, data] = await new Promise((resolve) => s3.putObject({
    Body: JSON.stringify(body.data),
    Bucket: 'domdomegg-analytics-lambda-' + process.env.STAGE,
    Key: body.project + '/' + body.streamId + '/' + new Date().toISOString().replace(/[-:.T]/g, '_') + '.json',
  }, (err, data) => resolve([err, data]))); // bit yucky to return the error like this but saves us a try/catch
  if (err) {
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