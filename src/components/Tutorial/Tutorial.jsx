import React, { Component } from "react";
import "./tutorial.css";

function Tutorial({ setShowMsg }) {
  return (
    <div className="tutorial-whole-c">
      <div className="tutorial-c">
        <button className="show-btn" onClick={() => setShowMsg()}></button>
        <h2>Manual :</h2>
        <section>
          <h3>Attention!</h3>
          <ul>
            <li>Render.com takes ~30 seconds to startup the backend</li>
            <li>Please be patient!</li>
            <li>
              You will know its up and running when there's a login/register
              page
            </li>
          </ul>
        </section>
        <section>
          <h3>Account</h3>
          <ul>
            <li>
              You can login from the following account or create a new one
            </li>
            <li>
              Username: <span>test</span>
            </li>
            <li>
              Password: <span>Password123</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Tutorial;
