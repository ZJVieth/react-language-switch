import React from 'react'

import { ExampleComponent } from 'react-language-switch'

import LanguageProvider, { LanguageDisplay, LanguageSelect } from 'react-language-switch';

// import useLanguage from './langModule/langHook';

function App() {
  return (
    <LanguageProvider
      languages={["en", "jp"]}
      init={"jp"}
      defaultTo={"en"}
    >
      <div className="App">
        <header className="App-header">
          <LanguageDisplay>
            <h1>
              <en>Portfolio</en>
              <jp>ポートフォリオ</jp>
            </h1>
            <div className="name-display">
              <en>Zino J. Vieth</en>
              <jp>ヴィース　ジーノ　ジョエル</jp>
            </div>
          </LanguageDisplay>
          <div style={{ display: 'inline' }}>
            <LanguageSelect>
              <en>EN</en>
              &nbsp;|&nbsp;
              <jp>JP</jp>
              {/* <div>
                <en>English</en>
                <br />
                <jp>Japanese</jp>
              </div>
              <h2>Some Text</h2> */}
            </LanguageSelect>
          </div>
        </header>
      </div>
    </LanguageProvider>
  );
}

export default App;