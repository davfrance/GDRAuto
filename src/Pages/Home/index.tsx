import { Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <Button
        onClick={() => {
          navigate('/newGame');
        }}
      >
        Create new game
      </Button>
    </div>
  );
}

export default Home;
