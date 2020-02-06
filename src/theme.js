import { createMuiTheme } from 'material-ui/styles';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
  overrides: {
    MuiBadge: {
      badge: {
        width: 'auto',
        padding: '0 4px',
        borderRadius: '5px',
      },
    },
  },
});

export default theme
