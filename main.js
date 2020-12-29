const { app, BrowserWindow, ipcMain } = require("electron");
const express = require("express");
app.on("ready", function () {
  var ex = express();

  var mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  ex.get("/whats/:num/:msg", function (req, res) {
    var numero = req.params.num;
    var msg = req.params.msg;
    enviar(numero, msg);
    if(numero=='hide' || msg == 'hide'){
      mainWindow.hide();
    }
    if(numero=='show' || msg == 'show'){
      mainWindow.show();
    }
    ipcMain.on("para",(event,arg)=>{
      if(arg.status){
        return res.send("true");
      }else{
        return res.send("false");
      }
    });
  });
  ex.listen(3400);

  function enviar(telefone, mensagem) {
    mainWindow.loadURL(
      "https://web.whatsapp.com/send?phone=" + telefone + "&text=" + mensagem,
      {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36",
      }
    );
    mainWindow.webContents.executeJavaScript(
      'var{ipcRenderer} = require("electron");var enviado = false;function tempo(){var btsend = document.getElementsByClassName("_2Ujuu")[0];var inputSend = document.getElementsByClassName("_1awRl")[1];if(typeof inputSend !== "undefined" && inputSend.innerText && !enviado){btsend.click();enviado=true;}else if(enviado){ipcRenderer.send("para", {status:true});}}setInterval(tempo,3000);'
    );
  }
});