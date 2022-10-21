import axios from "axios";
import * as React from "react";
import { Component, useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Tutorial from "../components/Tutorial/Tutorial";
import { useUserContext } from "../Context/userContext";

const { Group, Text, Label, Control } = Form;
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showMsg, setShowMsg] = useState(true);

  const { login, user, windowSize } = useUserContext();
  const navigate = useNavigate();

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URL}/users/login`, {
        username,
        password,
      })
      .then((res) => {
        login(res.data.user);
        navigate("/");
      })
      .catch((e) => {
        const { error } = e.response.data;
        if (error) {
          setError(error);
        }
      });
  }

  // if(!user) return <h1>Loading...</h1>
  if (user) return <Navigate to={"/"} />;
  return (
    <div className="d-flex flex-column align-items-center justify-content-center h-100">
      {error !== "" && (
        <Alert variant="warning" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      {showMsg && <Tutorial setShowMsg={() => setShowMsg(false)} />}
      <Card
        style={{
          width: windowSize > 1000 ? "25rem" : "100%",
        }}
      >
        <Card.Header className="text-center">Login</Card.Header>
        <Form onSubmit={(e) => handleLogin(e)}>
          <Group className="mb-4 mt-3" controlId="formUsername">
            <Label className="ms-3">Username</Label>
            <Control
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter username"
            />
          </Group>
          <Group className="mb-4" controlId="formPassword">
            <Label className="ms-3">Password</Label>
            <Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter a password"
            />
          </Group>
          <Button type="submit" className="m-2">
            Login
          </Button>
          <p className="m-2">
            Don't have an account? <Link to={"/register"}>Sign up here!</Link>
          </p>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
