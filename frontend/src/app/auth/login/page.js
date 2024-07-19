import Link from 'next/link';
import Button from '@mui/material/Button';

export default function LoginPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>LOGIN to get started!</h1>
      <p>Please login to continue.</p>
      <Link href='/auth/register' passHref>
        <Button variant='contained' color='primary' size='medium'>
          Register?
        </Button>
      </Link>
    </div>
  );
}
