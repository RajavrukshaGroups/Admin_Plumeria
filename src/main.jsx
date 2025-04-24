
import React from "react";
  import ReactDOM from "react-dom/client";
  import App from "./App";
  import { Provider } from "react-redux";
  import store, { persistor } from "./redux/store";
  import { PersistGate } from "redux-persist/integration/react";
  import './index.css'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);



// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
  //   <StrictMode>
  //     <App />
  //   </StrictMode>,
  // )
  
  // // src/index.js
  // import React from "react";
  // import ReactDOM from "react-dom/client";
  // import App from "./App";
  // import { Provider } from "react-redux";
  // import store from "./redux/store";
  
  // ReactDOM.createRoot(document.getElementById("root")).render(
    //   <Provider store={store}>
    //     <App />
    //   </Provider>
    // );