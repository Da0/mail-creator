# mail-creator
Creates email letters by template

### Нужны глобальные:
- mongodb

## Для установки: <br />
- `npm i` в корне;
- `npm i` в /clent
- `npm i` в /server

## Запуск:
- Натсроить файл конфигурации `server/src/config/config.js` (пример в server/readme.md)
- на Windows:
    - в файле `start.bat` указать путь к mongoDB
    - запустить файл `start.bat`
- Или:
    - клиентскую часть *(cd client)* командой `npm start --dev` <br />
    - серверную часть *(cd server)* командой `npm start` <br />
    - В корне `npm start`
    - Запуск MongoDB `start "mongod"`

Проект вырос из <a href="https://medium.com/devschacht/%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5-mevn-%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F-%D1%87%D0%B0%D1%81%D1%82%D1%8C-1-2-9ad714260037">этой статьи</a>

