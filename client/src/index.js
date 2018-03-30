import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './components/app';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { zomatoLiteYellow, zomatoLiteRed } from './common/constants';


const muiTheme = getMuiTheme({
	palette: {
		primary1Color: zomatoLiteRed,
		pickerHeaderColor: zomatoLiteRed,
		accent1Color: zomatoLiteYellow
	}
});

render((
    <MuiThemeProvider muiTheme={muiTheme}>
        <App />
    </MuiThemeProvider>)
    , document.getElementById('root')
);
