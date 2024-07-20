import { Button, styled } from '@mui/material';

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

const colorHoverButton = styled(Button)`
    :hover {
        color: black;
    } 
`;

const AuthStyles = {
  authContent,
  authButtonDiv,
  colorHoverButton,
};

export default AuthStyles;
