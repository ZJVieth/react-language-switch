import React from 'react'

import LanguageProvider, { useLanguage, LanguageDisplay, LanguageSelect, LanguageText } from 'react-language-switch';

// import useLanguage from './langModule/langHook';


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

const exampleLanguageSetup = {
  id: "json-example",
  remember: false,
  languages: ["en", "jp", "de"],
  init: "de",
  defaultTo: "en",
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
  },
  header: { ...exampleHeader }
}

function App() {

  const lang = useLanguage('json-example')

  return (
    <>
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
            <button onClick={() => lang.setContent("name", { en: "by some guy", de: "von sonem Typen", jp: "ばかからです" })}>Change Name</button>
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
              <div className="name-display" style={{ color: "red" }}>
                <en>by Zino J. Vieth</en>
                <jp>ヴィース　ジーノ　ジョエル　からです</jp>
                {/* Omitting German here will cause it to default to the English text*/}
              </div>
              <div>Just another div.</div>
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
            <div>
              {lang.getContent("title")}
            </div>
          </header>
        </div>
      </LanguageProvider>
    </>
  )
}

export default App;