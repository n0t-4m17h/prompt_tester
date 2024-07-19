import Link from 'next/link';
import Button from '@mui/material/Button';

export default function RegisterPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>REGISTER to get started!</h1>
      <p>Please register to continue.</p>
      <Link href='/auth/login' passHref>
        <Button variant='contained' color='primary' size='medium'>
          Login?
        </Button>
      </Link>
    </div>
  );
}
