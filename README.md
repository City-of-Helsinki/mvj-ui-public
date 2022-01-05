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

## Code style
Formatting wise, consistent code style is primarily enforced with [Prettier](https://prettier.io/)
automatically when files are committed to the repository. Some code style guidelines should be
followed manually by the developer as listed below.

### Functional vs class-based components
Prefer functional components, hooks, and other modern React concepts over the more traditional
class and HOC based approaches.

### Style definitions and class names
Prefer specifying the styles for components in Sass stylesheets. Inline CSS rules should
primarily be used when they need to be dynamic (for example, a background image based on the
current application state).

All class names we are in control of should follow the [Block-Element-Modifier](http://getbem.com/naming/)
naming system. In the context of a React application, each component represents one block, 
so the outermost element rendered by that component should have a class named after the component 
itself if there are any styles to attach to it or its children. Any inner elements rendered by that 
same component will then follow the BEM style normally, all using the component name as the block base.
Use PascalCase for the block part of the name and kebab-case for the element and modifier parts.

For example, note how the class names are laid out in the component definition below:

```typescript jsx
type Props = {
  disabled?: boolean;
  wrapText?: boolean;
  text?: string;
}

const CustomButton = ({ disabled = false, wrapText = false, text = '' } : Props): JSX.Element => {
  return <button className={classNames(
   "CustomButton", {
     "CustomButton--disabled": disabled,
     "CustomButton--wrap-text": wrapText
   })
  }>
    <span className="CustomButton__label">
     {text}
    </span>
  </button>;
};
```

"Magic" class names that are first defined somewhere and then sprinkled over different 
components when needed should not be used; if parts of different components need to be 
styled the same way, either make a new shared component that will provide that style or
use Sass mixins, whichever is more appropriate for that situation.

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
