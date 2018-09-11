var AWS = require('aws-sdk');
var Speaker = require('speaker');
var Stream = require('stream');

//Warning: Don't hardcode your AWS Keys
//Read more at http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html
var Polly = new AWS.Polly({
    region: 'us-east-2',
    accessKeyId: 'REPLACETHISWITHYOURACCESSKEYID',
    secretAccessKey: 'rePlaceThisWithYourSecretAccessKey1234567890'
});
