# WorkScheduleNodeServer
### In a nutshell, I use this application to create my weekly duty schedule query</li>

This application only takes care of the graphical display of the upcoming days of the working week, interacting with users and saving the days in the database.
However, sending the mail on Friday at 12:00 is handled by a C# service worker.

The following technologies were used for the realisation:
<div>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original-wordmark.svg" width=120px />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original-wordmark.svg" width=120px />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" width=120px />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodemon/nodemon-original.svg" width=120px/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original-wordmark.svg" width=120px />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongoose/mongoose-original-wordmark.svg" width=120px/>
</div>

### Try it out yourself:
1. Clone project from github
```console
https://github.com/TheConsoleLog/WorkScheduleNodeServer/
```
2. Install all modules (you need to have nodejs/ npm installed on your pc)
```console
npm install
```
3. A .env file is needed. In order for the server to run properly, you need a mongoose db connection. Please provide a connection string for key "MONGOOSE_URI"
```console
touch .env
echo -e "MONGOOSE_URI=[VALUE]" >>> .env
```
4. Start server & connect
```console
npm start
```
https://localhost:3000/
