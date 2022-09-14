# react-language-switch

> Simple context-based language-differentiating display and selector components for react. Implements both switches for inline editing and json-based content.

[![NPM](https://img.shields.io/npm/v/react-language-switch.svg)](https://www.npmjs.com/package/react-language-switch) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-language-switch
```

## Usage

```jsx
import React from 'react'

import LanguageProvider, { LanguageDisplay, LanguageSelect, LanguageText } from 'react-language-switch'

/*
* Inline-based Component --------------------------------------------
*/
const exampleHeader = {
  title: {
    en: "Example: react-language-switch",
    jp: "事例: react-language-switch",
    de: "Beispiel: react-language-switch"
  },
  meta: [
    {
      name: "description",
      en: "An example page for the react-language-switch library.",
      jp: "Yea my japanese aint good enough for this either...",
      de: "Eine Beispiel Seite für die react-language-switch library."
    }
  ]
}
export function InlineApp() {
  const lang = useLanguage('inline-example')

  return (
      <LanguageProvider
        languages={["en", "jp", "de"]}
        init={'jp'}
        defaultTo={"en"}
        remember={true}
        id="inline-example"
        header={exampleHeader}
      >
        <div className="App">
          <header className="App-header">
            Current Language: {lang.get()}<br />
            <button onClick={() => lang.set('en')}>Change to English</button>
            <LanguageDisplay>
              <en>Hello</en><jp /><de /> {/* If a component at any dom level should
              not be displayed for a specific language, simply add a void language
              tag for that language at that dom level*/}
              <h1>
                <en>Example App</en> {/* Each language tag will only be displayed if 
                the corresponding language is selected. */}
                <jp>事例</jp>
                <de>Beispiel App</de>
              </h1>
              <div className="name-display">
                <en>by Zino J. Vieth</en>
                <jp>ヴィース　ジーノ　ジョエル　からです</jp>
                {/* Omitting German here will cause it to default to the English text*/}
              </div>
            </LanguageDisplay>
            <div>
              <LanguageSelect>
                <en>EN</en>
                &nbsp;|&nbsp;
                <jp>JP</jp>
                &nbsp;|&nbsp;
                <de>DE</de>
              </LanguageSelect>
            </div>
          </header>
        </div>
      </LanguageProvider>
    )
}

/*
* JSON-based Component ----------------------------------------------
*/
const exampleLanguageSetup = {
  id: "json-example",
  remember: true,
  languages: ["en", "jp", "de"],
  init: "en",
  defaultTo: "en",
  header: {
    title: {
        en: "Example: react-language-switch",
        jp: "事例: react-language-switch",
        de: "Beispiel: react-language-switch"
    },
    meta: [
        {
        name: "description",
        en: "An example page for the react-language-switch library.",
        jp: "Yea my japanese aint good enough for this either...",
        de: "Eine Beispiel Seite für die react-language-switch library."
        }
    ]
  },
  content: {
    title: {
      en: "Example App",
      jp: "事例",
      de: "Beispiel App"
    },
    name: {
      en: "by Zino J. Vieth",
      jp: "ヴィース　ジーノ　ジョエル　からです"
      // omitting German here will cause it to default to English
    }
  }
}
export function JsonApp() {
    <LanguageProvider
        json={exampleLanguageSetup}
      >
        <div className="App">
          <header className="App-header">
            <h1>
              <LanguageText name="title" />
            </h1>
            <div className="name-display">
              <LanguageText name="name" />
            </div>
            <div>
              <LanguageSelect>
                <en>EN</en>
                &nbsp;|&nbsp;
                <jp>JP</jp>
                &nbsp;|&nbsp;
                <de>DE</de>
              </LanguageSelect>
            </div>
          </header>
        </div>
      </LanguageProvider>
}

```

## Usage Notes
- Do not nest LanguageDisplay and LanguageSelect! Both of these functions work recursively to move through the tree of its children.
- If you are using multiple LanguageProviders with localStorage active in your app, pass each of them a unique id if you want them to be able to remember different language settings.
- Passing header data via json to the LanguageProvider causes it to use react-helmet to update header/meta tags dynamically. These can be overwritten using react-helmet at a nested level anywhere else in your app. Currently only supports title and meta tag!
- If you are using multiple LanguageProviders that you pass header-data to, the last to render will always take priority, not the last to be updated! Therefore you should avoid using multiple LanguageProviders to update meta data, unless they update different tags.
- For the language list, avoid names that are the same as html or jsx tags, if you are planning to use the inline LanguageDisplay component.
- It is possible, and in certain scenarios necessary, to use both inline and json-based components. For example when wanting to display different text for the LanguageSelector buttons depending on the currently selected language, or when wanting to omitt entire components in some languages while primarily using the json-based component.
- When using inline componentns, if a component at any dom level should not be displayed for a specific language, simply add a void language tag for that language at that dom level.
- Generally avoid using multiple of the same language tags at the same dom level when using the inline component, as it may not behave as you expect if you omit any of the language tags listed in the languages list.
- To use a language of one LanguageProvider within the scope of another LanguageProvider, use the useLanguage hook.

## Future Features
- [x] Storing language locally
- [x] JSON-based display component (LanguageText)
- [ ] JSON-based select component (void element LanguageSelect)
- [x] defaultTo (both for inline and json components)
- [x] Changing header and meta data per language
- [X] Access and change current language outside of DOM
- [ ] External JSON-fetching
- [ ] Make json.content more easily updatable from lower dom level?

## License

MIT © [ZJVieth](https://github.com/ZJVieth)
