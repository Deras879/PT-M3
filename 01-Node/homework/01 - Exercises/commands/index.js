const fs = require("fs");
const utils = require("../utils/request");
const process = require("process");

function pwd(print) {
    let procesCwd = process.cwd();
    print(procesCwd);
}

function date(print) {
    print(Date());
}

function echo(print, args) {

    print(args);
}

function ls(print) {
 
    fs.readdir(".", (error, files) =>{
    if (error) {
        throw new TypeError("Error", error);
    } else {
        print(files.join(" "));
    }
    })
}

function cat(print, args) {
    fs.readFile(args, "utf-8", (error, data) => {
        if (error) {
            throw new TypeError("Error", error);
        } else {
            print(data);
        }
    })
}

function head(print, args) {
    fs.readFile(args, "utf-8", (error, data) => {
        if (error) {
            throw new TypeError("Error", error);
        } else {
            let lines = data.split('\n')
            print(lines[0]);
        }
    })
}

function tail(print, args) {
    fs.readFile(args, "utf-8", (error, data) => {
        if (error) {
            throw new TypeError("Error", error);
        } else {
            let lines = data.split('\n')
            let lastLine = lines[lines.length -1].trim();
            print(lastLine);
        }
    })
}

function curl(print, args) {
    utils.request(args, (error, data) => {
        if (error) {
            throw new TypeError("Error", error);
        } else {
            print(data);
        }
    })
}

module.exports = {pwd, date, echo, ls, cat, head, tail, curl};
