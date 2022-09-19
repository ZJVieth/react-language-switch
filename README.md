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
- If you are using components, that iterate over components, avoid using this library's inline components due to their recursive nature (creating a LanguageDisplay component inbetween each dom layer). See the following code for an example.
```jsx
// DO NOT DO => (because it will most likely lead to incorrect behaviour of your child-iterating component)
<LanguageDisplay>
  <Carousel>
    <div>
      <en>English language content</en>
      <de>German language content</de>
      <jp>Japanese language content</jp>
    </div>
    <div>
      {/*...*/}
    </div>
  </Carousel>
</LanguageDisplay>
// Because this library will generate the following:
<LanguageDisplay>
  <Carousel>
    <LanguageDisplay>
      <div>
        <LanguageDisplay>
          <en>English language content</en>
          <de>German language content</de>
          <jp>Japanese language content</jp>
        </LanguageDisplay>
      </div> 
      <div>
        <LanguageDisplay>
          {/*...*/}
        </LanguageDisplay>
      </div>
      </LanguageDisplay>
  </Carousel>
</LanguageDisplay>

// Optimally you should use the LanguageText component in this case or a custom mapping using the useLanguage hook or simply make sure that LanguageDisplay primarily wraps language tags:
<Carousel>
  <div>
    <LanguageDisplay>
      <en>English language content</en>
      <de>German language content</de>
      <jp>Japanese language content</jp>
    </LanguageDisplay>
  </div>
  <div>
      {/*...*/}
  </div>
</Carousel>
```

## Future Features
- [ ] JSON-based select component (void element LanguageSelect)
- [ ] External JSON-fetching
- [ ] Make json.content more easily updatable from lower dom level?

## Version History

### 1.0.4 Package and Readme Updates
- Added keywords.
- Updated usage notes.

### 1.0.3 Quickfiy
- Removed leftover console logs.

### 1.0.2 Major Fixes
- Fixed defaultTo bug when using json component.
- Fixed a bug causing children of LanguageDisplay and LanguageSelect to lose their properties.
- LanguageText now throws an error when no name-property is passed to it.

### 1.0.1 Readme Fixes

### 1.0.0 Original Release
Containing
- useLanguage
- inline components: LanguageDisplay, LanguageSelect
- json component: LanguageText
- LanguageContext and LanguageProvider (mandatory to use)

## License

MIT © [ZJVieth](https://github.com/ZJVieth)
