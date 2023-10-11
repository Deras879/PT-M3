const process = require('process');
const { Z_ASCII } = require('zlib');
const commands = require('./commands/index.js');
const print = (output) => {
   let out = output.toString();
   process.stdout.write(out);
   process.stdout.write( "\nprompt > ");
}
function bash() {
   process.stdout.write("prompt > ");
   process.stdin.on("data", (data) => {
      let args = data.toString().trim()
   let cmd = args.split(' ')[0];


   let argsSinCmd = args.split(' ').slice(1).join(' ');
   
      if(commands.hasOwnProperty(cmd)){
         commands[cmd](print, argsSinCmd);
      }else{
         print(`command not found: ${cmd}`);
      }

      process.stdout.write( "\nprompt > ");
      // for(let i = 0; i < commands.lenght; i++){
      //    if(commands[i] == cmd){
      //       commands[cmd](print, args);
      //    }else{
      //       print(`command not found: ${cmd}`);
      //    }
      // }
      // if(commands.includes(cmd)){
      //    commands[cmd](print, args);
      // }else{
      //    print(`command not found: ${cmd}`);
      // }

   })
}

bash();
module.exports = {
   print,
   bash,
};
