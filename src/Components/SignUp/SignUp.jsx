import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";

export default function SignUp() {
  let navigate = useNavigate();

  let [errorList, setErrorList] = useState([]);
  let [errorApi, setErrorApi] = useState(null);
  let [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    age: "",
  });

  function getCurrentError(key) {
    for (const err of errorList) {
      if (err.context.key === key) {
        return err.message;
      }
    }
    return "";
  }

  function getUser(e) {
    let inputValue = e.target.value;
    let newUser = { ...user };
    newUser[e.target.id] = inputValue;
    console.log(newUser);
    setUser(newUser);
  }

  async function submit(e) {
    e.preventDefault();

    let testValidate = Joi.object({
      first_name: Joi.string().alphanum().min(3).max(20).required(),
      last_name: Joi.string().alphanum().min(3).max(20).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(/^[a-z0-9]{5,}$/i)
        .required(),
      age: Joi.number().min(18).max(60).required(),
    });
    let joiResponse = testValidate.validate(user, { abortEarly: false });
    console.log(joiResponse);
    if (joiResponse.error) {
      setErrorList(joiResponse.error.details);
    } else {
      let { data } = await axios.post(
        "https://route-egypt-api.herokuapp.com/signup",
        user
      );
      console.log(data);

      if (data.errors) {
        setErrorApi(data.errors);
        console.log(errorApi);
      } else {
        navigate("/login");
      }
    }
  }

  return (
    <>
      <div className="container signup d-flex align-items-center justify-content-center ">
        <form onSubmit={submit}>
          <div className="m-auto">
            <div className="row">
              <div className="col-md-6">
                <input
                  onChange={getUser}
                  className="form-control my-3"
                  type="text"
                  placeholder="Enter First Name"
                  id="first_name"
                />
                {getCurrentError("first_name").length == 0 ? (
                  ""
                ) : (
                  <div className="alert alert-danger">
                    {getCurrentError("first_name")}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <input
                  onChange={getUser}
                  className="form-control my-3"
                  type="text"
                  placeholder="Enter First Name"
                  id="last_name"
                />
                {getCurrentError("last_name").length == 0 ? (
                  ""
                ) : (
                  <div className="alert alert-danger">
                    {getCurrentError("last_name")}
                  </div>
                )}
              </div>
              <div className="col-md-12">
                <input
                  onChange={getUser}
                  className="form-control my-3"
                  type="email"
                  placeholder="Enter Your Email"
                  id="email"
                />
                {getCurrentError("email").length == 0 ? (
                  ""
                ) : (
                  <div className="alert alert-danger">
                    {getCurrentError("email")}
                  </div>
                )}
                {errorApi == null ? (
                  ""
                ) : (
                  <div className="alert alert-danger">
                    {errorApi.email.message}
                  </div>
                )}

                <input
                  onChange={getUser}
                  className="form-control my-3"
                  type="number"
                  placeholder="Enter Your Age"
                  id="age"
                />
                {getCurrentError("age").length == 0 ? (
                  ""
                ) : (
                  <div className="alert alert-danger">
                    {getCurrentError("age")}
                  </div>
                )}

                <input
                  onChange={getUser}
                  className="form-control my-3"
                  type="password"
                  placeholder="Enter Password"
                  id="password"
                />
                {getCurrentError("password").length == 0 ? (
                  ""
                ) : (
                  <div className="alert alert-danger">
                    {getCurrentError("password")}
                  </div>
                )}
                <button className="btn btn-info form-control">Sign Up</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
