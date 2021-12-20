# MVJ Public-UI

This is the public user interface that allows citizens and organizations in Helsinki to browse and attend into ongoing
plot search competitions. This is a part of MVJ ("Maanvuokrausjärjestelmä") which also contains UI for city
officials to handle ground rental related matters. This public UI and the closed-from-public UI for city 
officials share the same MVJ-backend.

Based on [React Boilerplate](https://github.com/nordsoftware/react-boilerplate)

## Development Environment

To build up a development environment please follow these steps:

1. Clone this repository from git: `git pull git@github.com:City-of-Helsinki/mvj-ui-public.git`
2. Start the docker container: `docker-compose up`

### Usage w/o docker

1. Check requirements:
   1. Project runs on node 16
   2. Yarn needs to be installed
2. On project root `run yarn` to install packages
3. Run `yarn start` to run dev server

## Localisation

The application is localised using the [react-i18next](https://react.i18next.com/) library.
All translatable messages should be defined through either its translation function or the
`Trans` component, whichever is more appropriate for the situation, and given a meaningful
translation key as well as a default message in English. The translation keys can then be
automatically collected into the translation files located in `src/i18n` by running the command

```shell
yarn run i18n
```

After this, all new messages as well as any old messages whose default translation changed
will now have an empty string in each of the respective non-English locale files, which can
then be translated. The English file will also be populated with the default values from the
source code files.
