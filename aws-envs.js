const AWS = require('aws-sdk');
const awspublish= require('gulp-awspublish');

exports.envs = { "test": {  publisher: awspublish.create({
                          		region: "us-east-1",
                          		credentials: new AWS.SharedIniFileCredentials({profile: 'personal_default'}),
                          		params: {Bucket: "test.ericdmoore.com"}
                    			},{cacheFileName: 'cache-test'}),
                        	url: "https://testinit.ericdmoore.com/"
                        },
                  "prod": { publisher: awspublish.create({
	                            region: "us-east-1",
	                            credentials: new AWS.SharedIniFileCredentials({profile: 'personal_default'}),
	                            params: {Bucket: "ericdmoore.com"}
	                            },{cacheFileName: 'cache-prod'}),
                			url:"https://ericdmoore.com/"
                		},
                    "p":{redirectTo: "prod"}, 
                    "t":{redirectTo: "test"}
                  };