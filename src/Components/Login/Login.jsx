import axios from "axios";
import Joi from "joi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login({ decodeToken }) {
  let navigate = useNavigate();

  let [errorList, setErrorList] = useState([]);
  let [errorApi, setErrorApi] = useState(null);
  let [user, setUser] = useState({
    email: "",
    password: "",
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
    setUser(newUser);
  }

  async function submit(e) {
    e.preventDefault();

    let testValidate = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(/^[a-z0-9]{5,}$/i)
        .required(),
    });
    let joiResponse = testValidate.validate(user, { abortEarly: false });
    if (joiResponse.error) {
      setErrorList(joiResponse.error.details);
    } else {
      let { data } = await axios.post(
        "https://route-egypt-api.herokuapp.com/signin",
        user
      );

      if (data.status === 401) {
        setErrorApi(data);
        console.log(setErrorApi);
      } else {
        localStorage.setItem("tkn", data.token);
        navigate("/profile");
        decodeToken();
      }
    }
  }

  return (
    <>
      <div className="container signup d-flex align-items-center justify-content-center ">
        <form className="w-50 m-auto" onSubmit={submit}>
          <div className="m-auto">
            <div className="row">
              <div className="col-md-12">
                <input onChange={getUser} className="form-control my-3" type="email" placeholder="Enter Your Email" id="email" />
                {getCurrentError("email").length === 0 ? ""  :  <div className="alert alert-danger"> {getCurrentError("email")} </div> }
                {errorApi == null ?  "" : <div className="alert alert-danger">{errorApi.message}</div> }

                <input onChange={getUser} className="form-control my-3" type="password" placeholder="Enter Password" id="password" />
                {getCurrentError("password").length === 0 ? "" : <div className="alert alert-danger"> {getCurrentError("password")} </div> }
                <button className="btn btn-info form-control">Sign in</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
