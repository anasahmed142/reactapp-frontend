  import React, { useState, useContext } from "react";
  import { useNavigate } from "react-router-dom";
  import { AuthContext } from "./App";

  const Login = () => {
    const { setLoggedIn, setEmail } = useContext(AuthContext);
    const [email, setEmailInput] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const onButtonClick = () => {
      setEmailError("");
      setPasswordError("");

      if (!email) {
        setEmailError("Please enter your email");
        return;
      }

      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        setEmailError("Please enter a valid email");
        return;
      }

      if (!password) {
        setPasswordError("Please enter a password");
        return;
      }

      if (password.length < 7) {
        setPasswordError("The password must be 8 characters or longer");
        return;
      }

      fetch("http://localhost:3080/auth", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
        .then(r => r.json())
        .then(r => {
          if (r.message === 'success') {
            localStorage.setItem("user", JSON.stringify({ email, token: r.token }));
            setLoggedIn(true);
            setEmail(email);  
            navigate("/");
          } else {
            window.alert("Wrong email or password");
          }
        });
    };

    return (
      <div className={"mainContainer"}>
        <div className={"titleContainer"}>Login</div>
        <br />
        <div className={"inputContainer"}>
          <input
            value={email}
            placeholder="Enter your email here"
            onChange={ev => setEmailInput(ev.target.value)}
            className={"inputBox"}
          />
          <label className="errorLabel">{emailError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
          <input
            value={password}
            placeholder="Enter your password here"
            type="password"
            onChange={ev => setPassword(ev.target.value)}
            className={"inputBox"}
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className={"inputContainer"}>
          <input
            className={"inputButton"}
            type="button"
            onClick={onButtonClick}
            value={"Log in"}
          />
        </div>
      </div>
    );
  };

  export default Login;
