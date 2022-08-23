import { Formik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { AuthService } from "./../../services/auth.service";
import { FirebaseError } from "firebase/app";
import { Alert } from "../../lib/alerts";
import { useAppDispatch } from "../../hooks/hooks";
import { setAuthUser } from "../../hooks/reducers/auth.reducer";

interface LoginState {
  email: string;
  password: string;
}

function AppLogin() {
  const [loading, setLoading] = useState(false);
  const authservice = new AuthService();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialValues: LoginState = {
    email: "",
    password: "",
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email().trim(),
    password: Yup.string()
      .required("Password is required")
      .min(2, "Password is too short"),
  });

  const loginUser = (values: LoginState) => {
    authservice
      .signInUserWithEmailAndPassword(values.email, values.password)
      .then((userCredential) => {
        console.log(userCredential.user);
        userCredential.user.getIdToken().then((token) => {
          if (token) {
            const authUser = {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              accessToken: token,
              refreshToken: userCredential.user.refreshToken,
              infoId: null,
              metadata: JSON.stringify(userCredential.user.metadata),
            };

            dispatch(setAuthUser(authUser));
            setLoading(false);
            navigate("/blog/home");
          }
        });
      })
      .catch((error: FirebaseError) => {
        Alert("error", "Login", error.message);
        setLoading(false);
      });
  };

  return (
    <div id="login-container">
      <div className="row w-100 justify-content-center align-items-center h-100 no-gutters">
        <div className="col-6 left-section h-100"></div>
        <div className="col-6 h-100 d-flex align-items-center right-section">
          <div className="card card-custom login-card">
            <div className="card-body" style={{ padding: "40px" }}>
              <section className="text-center">
                <img
                  src={require("../../assets/images/blogify_logo.png")}
                  width="6%"
                  alt=""
                />
                <h5 className="mt-3 font-weight-bold">BLOGIFY</h5>
              </section>

              <Formik
                initialValues={initialValues}
                validationSchema={loginSchema}
                validateOnChange={false}
                onSubmit={(values, action) => {
                  action.validateForm().then((response) => {
                    setLoading(true);
                    loginUser(values);
                  });
                }}
              >
                {({ errors, touched, handleSubmit, values, handleChange }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className={`form-control ${
                          touched.email && errors.email ? "is-invalid" : null
                        }`}
                        placeholder="Enter email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        autoComplete="true"
                      />
                      <div className="invalid-feedback">
                        <span>{errors.email}</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Password</label>
                      <input
                        className={`form-control ${
                          touched.password && errors.password
                            ? "is-invalid"
                            : null
                        }`}
                        type="password"
                        placeholder="Enter password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        autoComplete="true"
                      />
                      <div className="invalid-feedback">
                        <span>{errors.password}</span>
                      </div>
                    </div>

                    <button
                      disabled={loading}
                      type="submit"
                      className={`btn btn-custom btn-block ${
                        loading ? "spinner spinner-white spinner-right" : ""
                      }`}
                    >
                      Sign In
                    </button>

                    <Link
                      to="/register"
                      className="btn btn-link mt-3 font-weight-bold"
                    >
                      Not a member yet?, Sign Up
                    </Link>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLogin;
