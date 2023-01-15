"use strict";

const request = require("request");
const querystring = require('querystring');
const Utilities = require("../Util/Utilities.js");
const Endpoints = require("./Endpoints");

/**
 * Handles APi requestsz
 */
class RequestHandler {
    constructor(client) {
        this._client = client;
        this.baseURL = Endpoints.BASE_URL;
        this.userAgent = `SpotifyAPI (https://github.com/MistakeTeam/spotify-api, ${require('../package.json').version})`;
        this.Utilities = new Utilities();
    }

    /**
     * Make an API request
     * @arg {String} method Uppercase HTTP method
     * @arg {String} url URL of the endpoint
     */
    request(method, url) {
        return new Promise((resolve, reject) => {
            var headers = {
                "User-Agent": this.userAgent,
                "content-type": "application/json",
                "accept": "application/json",
                "Authorization": "Bearer " + this._client.options.token
            };

            var req = request({
                method: method,
                url: "https://api.spotify.com" + this.baseURL + url,
                headers: headers
            });

            var reqError;

            req.once("abort", () => {
                reqError = reqError || new Error(`Pedido abortado pelo cliente em ${method} ${url}`);
                reqError.req = req;
                reject(reqError);
            }).once("aborted", () => {
                reqError = reqError || new Error(`Pedido abortado pelo servidor em ${method} ${url}`);
                reqError.req = req;
                reject(reqError);
            }).once("error", (err) => {
                reqError = err;
                req.abort();
            });

            req.once("response", (resp) => {
                var response = "";

                resp.on("data", (str) => {
                    response += str;
                }).once("end", () => {
                    if (resp.statusCode >= 300) {
                        if (resp.statusCode === 401) { // refresh token
                            request({
                                method: "GET",
                                url: this._client.options.refreshCallback + "?" + querystring.stringify({
                                    refresh_token: this._client.options.refreshtoken
                                }),
                                headers: {
                                    "User-Agent": this.userAgent,
                                    "content-type": "application/json",
                                    "accept": "application/json"
                                }
                            }).once("response", async (refresh) => {
                                var responserefresh = "";

                                await refresh.on("data", (str) => {
                                    responserefresh += str;
                                }).once("end", async () => {
                                    await this._client.setAccessToken(JSON.parse(responserefresh).access_token);
                                    return reject();
                                });
                            });
                        } else if (resp.statusCode === 429) {
                            if (resp.headers["retry-after"]) {
                                setTimeout(() => {
                                    this.request(method, url).then(resolve).catch(reject);
                                }, +resp.headers["retry-after"]);
                                return;
                            } else {
                                this.request(method, url).then(resolve).catch(reject);
                                return;
                            }
                        } else if (resp.statusCode === 502) {
                            setTimeout(() => {
                                this.request(method, url).then(resolve).catch(reject);
                            }, Math.floor(Math.random() * 1900 + 100));
                            return;
                        }
                        var err = new Error(`${resp.statusCode} ${resp.statusMessage} on ${method} ${url}\n\n${response.substring(0, 200)}`);
                        err.resp = resp;
                        err.response = response;
                        err.req = req;
                        reject(err);
                        return;
                    }

                    try {
                        if (this.Utilities.isJson(response)) {
                            return resolve(JSON.parse(response));
                        } else {
                            return resolve(response);
                        }
                    } catch (err) {
                        err.response = response;
                        reject(err);
                    }
                });
            });
        });
    }
}

module.exports = RequestHandler;