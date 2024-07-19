import { styled } from '@mui/material';

const authContent = styled('div')({
  // general container
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
  fontSize: '1.25rem',
  marginTop: '30px',
});

const authButtonDiv = styled('div')({
  // submit button container
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '250px',
});

const AuthStyles = {
  authContent,
  authButtonDiv,
};

export default AuthStyles;
