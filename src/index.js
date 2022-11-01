import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import {createTheme,ThemeProvider} from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "./assets/css/feather.css"
import "./assets/css/materialdesignicons.css"
import "./assets/css/dripiIcons.css"
import "./assets/css/fa.css"
import "./assets/css/fonts.css"
import './assets/css/semantic-ui-css/semantic.min.css'
import './App.css'
import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/DefaultTheme.scss';
import './assets/css/react-tabs.css';
import "./assets/css/SuperResponsiveTableStyle.css"
import './assets/css/rsuite.css'
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import './assets/css/rc-collapse.css'

import moment from 'moment'
import 'moment/locale/fr'
moment.locale('fr')

const theme = createTheme({
    palette: {
        primary: {
            main: "#1565C0",
        },
        secondary: {
            main: '#8B3130',   //#A00015  //951d22
},
        default: {
            main: '#757575'
        },
        success: {
            main: '#27AE60',
            contrastText: '#fff',
        },
        danger: {
            main: '#D50000',
            contrastText: '#fff',
        },
        orange: {
            main: '#ff9800',
            contrastText: '#fff',
        },
        white: {
            main: '#ffffff',
            contrastText: '#000',
        },
        grey: {
            main: '#d3d3d3',
            contrastText: '#000',
        },

    },
    typography: {
        fontFamily: [
            "MontserratMedium",
            "serif"
        ].join(",")
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
          <div id="layout-wrapper">
              <App/>,
          </div>
      </ThemeProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
