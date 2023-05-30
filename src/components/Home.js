import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  let token = localStorage.getItem('Token');
  return (
    <Card className="text-center">
      <Card.Body className="p-5">
        <p className="lead mt-4 text-800 font-sans-serif fw-semi-bold">
          Welcome to khalihan.in
        </p>
        <hr />
        <p>
          Site is in under construction, for now please click below button to continue.
        </p>

        {token ?
          <Link className="btn btn-primary btn-sm mt-3" to="/dashboard">
            Dashboard
          </Link>
          :
          <Link className="btn btn-primary btn-sm mt-3" to="/login">
            Login
          </Link>
        }
      </Card.Body>
    </Card>
  );
};

export default Home;