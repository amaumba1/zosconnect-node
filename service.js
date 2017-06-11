/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var request = require('request');
var extend = require('extend');

module.exports = function (options, serviceName, invokeUri) {
  this.options = options;
  this.serviceName = serviceName;
  this.invokeUri = invokeUri;

  this.invoke = function (data, callback) {
    var options = {};
    options = extend(options, this.options);
    options.method = 'PUT';
    options.uri = this.invokeUri;
    options.json = true;
    options.body = data;
    return new Promise(function (resolve, reject) {
      request(options, function (error, response, data) {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  };

  this.getRequestSchema = function (callback) {
    var options = {};
    options = extend(options, this.options);
    options.uri += '?action=getRequestSchema';
    return new Promise(function (resolve, reject) {
      request.get(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else if (response.statusCode != 200) {
          reject(new Error('Failed to get schema (' + response.statusCode + ')'));
        } else {
          resolve(body);
        }
      });
    });
  };

  this.getResponseSchema = function (callback) {
      var options = {};
      options = extend(options, this.options);
      options.uri += '?action=getResponseSchema';
      return new Promise(function (resolve, reject) {
        request.get(options, function (error, response, body) {
          if (error) {
            reject(error);
          } else if (response.statusCode != 200) {
            reject(new Error('Failed to get schema (' + response.statusCode + ')'));
          } else {
            resolve(body);
          }
        });
      });
    };

  this.getStatus = function () {
    var options = {};
    options = extend(options, this.options);
    options.uri += '?action=status';
    return new Promise(function (resolve, reject) {
      request.get(options, function (error, response, body) {
        if (error) {
          reject(error);
        } else if (response.statusCode != 200) {
          reject(new Error('Failed to get status (' + response.statusCode + ')'));
        } else {
          var json = JSON.parse(body);
          var status = json.zosConnect.serviceStatus;
          resolve(status);
        }
      });
    });
  };
};
