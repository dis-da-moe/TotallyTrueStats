import express = require("express");
import path = require("path");
import useragent = require("express-useragent");
import fs = require("fs");
import {Express} from "express";
import {decode, validateEncoded} from "./public/javascript-common/statsCipher.js";

const staticFiles = path.join(__dirname, "public");

const app: Express = express();
app.use(express.static(staticFiles));
app.use(express.json());
app.use(useragent.express());

const statsPage = fs.readFileSync("./public/stats.html", "utf-8");

function arrayToString(array: Array<string>){
   const strings = Array.from(array, (word) => `"${word}"`);
   return strings.join(",");
}

const getPageData = (isMobile:boolean, isChrome:boolean, words:undefined|Array<string>) => {
   return statsPage
       .replace(`"{isMobile}"`, isMobile ? "true" : "false")
       .replace(`"{isChrome}"`, isChrome ? "true" : "false")
       .replace(`"{getWords}"`, words === undefined ? "undefined" : `[${arrayToString(words)}]`);
}

const parseIds = (ids) => {
   if(ids === undefined) return undefined;
   const split: string[] = ids.split(",");
   if(split.length !== 3) return undefined;
   if(!split.every(word => validateEncoded(word))) return undefined;
   return Array.from(split, word => decode(word));
}

app.get("/",  (req, res) => {
   const isMobile = req.useragent.isMobile;
   const isChrome = req.useragent.browser.includes("Chrome");

   const pageWithData = getPageData(isMobile,isChrome,parseIds(req.query.id));
   res.send(pageWithData);
});

app.listen(2000, () => console.log("App available on http://localhost:2000"));
