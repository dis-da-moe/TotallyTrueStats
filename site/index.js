"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var useragent = require("express-useragent");
var fs = require("fs");
var statsCipher_js_1 = require("./public/javascript-common/statsCipher.js");
var staticFiles = path.join(__dirname, "public");
var app = express();
app.use(express.static(staticFiles));
app.use(express.json());
app.use(useragent.express());
var statsPage = fs.readFileSync("./public/stats.html", "utf-8");
function arrayToString(array) {
    var strings = Array.from(array, function (word) { return "\"".concat(word, "\""); });
    return strings.join(",");
}
var getPageData = function (isMobile, isChrome, words) {
    return statsPage
        .replace("\"{isMobile}\"", isMobile ? "true" : "false")
        .replace("\"{isChrome}\"", isChrome ? "true" : "false")
        .replace("\"{getWords}\"", words === undefined ? "undefined" : "[".concat(arrayToString(words), "]"));
};
var parseIds = function (ids) {
    if (ids === undefined)
        return undefined;
    var split = ids.split(",");
    if (split.length !== 3)
        return undefined;
    if (!split.every(function (word) { return (0, statsCipher_js_1.validateEncoded)(word); }))
        return undefined;
    return Array.from(split, function (word) { return (0, statsCipher_js_1.decode)(word); });
};
app.get("/", function (req, res) {
    var isMobile = req.useragent.isMobile;
    var isChrome = req.useragent.browser.includes("Chrome");
    var pageWithData = getPageData(isMobile, isChrome, parseIds(req.query.id));
    res.send(pageWithData);
});
app.listen(2000, function () { return console.log("App available on http://localhost:2000"); });
