# PetWalkr-backend

Backend de aplicación web desktop utilizando el stack MEAN que permite a los usuarios operativos de
AdsForGood reportar por semana las horas de dedicación a cada uno de los proyectos de la empresa
![Image](https://i.postimg.cc/RhggLyRk/mockup-model-portfolio-3.png)

## Installation

1. Install NodeJS and NPM from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

2. Install MongoDB Community Server from [https://www.mongodb.com/download-center/community](https://www.mongodb.com/download-center/community), or you can use [MongoDB Atlas](https://www.mongodb.com/atlas/database).

3. Run MongoDB, instructions are available on the install page for each OS at [https://docs.mongodb.com/manual/administration/install-community/](https://docs.mongodb.com/manual/administration/install-community/).

4. Download or clone the hotel source code from [https://github.com/elonlegan/waterbnb-backend](https://github.com/elonlegan/waterbnb-backend).

5. Install all required NPM packages by running `npm install` or `npm i` from the command line in the hotel root folder (where the package.json is located).

6. Configure environment variables for hotel in `/.env` and `/test.env` (for testing) files.

### Environment Variables

```bash
GOOGLE_USER= 'GOOGLE_USER@GOOGLE_USER.com'

GOOGLE_PASSWORD= 'GOOGLE_PASSWORD'

EMAIL_SERVICE= 'gmail'

SECRET= 'SECRET_KEY_TO_JWT'

MONGODB_URI = 'MONGODB_URI'
```

---

7. Configure SMTP settings in the `/.env` file. For testing, you can create a free account in one click at [https://ethereal.email/](https://ethereal.email/).

8. Start the API by running `npm start` (or `npm run dev` to start with nodemon) from the command line in the hotel root folder, you should see the message `Server listening on port 4000`.

## [Frontend](https://github.com/elonlegan/waterbnb-frontend)

## License

[MIT](https://choosealicense.com/licenses/mit/)
