import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { AuthService } from "../../services/auth.service";
import { useAppDispatch } from "./../../hooks/hooks";
import { setAuthUser } from "../../hooks/reducers/auth.reducer";
import { FirebaseError } from "firebase/app";
import { Alert } from "../../lib/alerts";
import { UserBio } from "../../utils/models/post.model";

interface RegisterFormState {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

function AppRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>();
  const [emailLoading, setEmailLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [usernameValid, setUsernameValid] = useState(false);
  const authservice = new AuthService();
  const dispatch = useAppDispatch();
  // const authUser = useAppSelector((state) => state.auth.authUser);

  const initialValues: RegisterFormState = {
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const registerSchema = Yup.object().shape({
    firstname: Yup.string()
      .required("Name is required")
      .min(2, "Firstname is too short!")
      .max(20, "Firstname too long!")
      .trim(),
    lastname: Yup.string()
      .required("Name is required")
      .min(2, "Lastname is too short!")
      .max(20, "Lastname too long!")
      .trim(),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be valid")
      .lowercase()
      .trim(),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password too short"),
    confirmPassword: Yup.string()
      .required("Password is required")
      .oneOf([Yup.ref("password"), null], "Password must match"),
  });

  // VALIDATE USERNAME

  const validateUsername = (value: any) => {
    console.log(value);
    let error;
    if (!usernameValid && value) {
      setUsernameLoading(true);
      return authservice
        .CheckIfUserUsernameExist(value)
        .then((response) => {
          console.log(response);
          if (!response.empty) {
            setUsernameLoading(false);
            setUsernameValid(false);
            error = "Username Already Exist!. Choose a different name";
            console.log(error, "error");
            return error;
          }

          setUsernameValid(true);
          setUsernameLoading(false);
          return (error = null);
        })
        .catch((err: FirebaseError) => {
          setUsernameValid(false);
          setUsernameLoading(false);
          Alert("error", "Username Validation", err.message);
        });
    }
  };

  // VALIDATE EMAIL
  const validateEmail = (value: any) => {
    console.log(value);
    let error;
    if (!emailValid && value) {
      setEmailLoading(true);
      return authservice
        .CheckIfUserEmailExist(value.toLowerCase())
        .then((response) => {
          console.log(response);
          if (!response.empty) {
            setEmailLoading(false);
            setEmailValid(false);
            error = "Username Already Exist!. Choose a different name";
            console.log(error, "error");
            return error;
          }
          setEmailValid(true);
          setEmailLoading(false);
          return (error = null);
        })
        .catch((err: FirebaseError) => {
          setEmailValid(false);
          setEmailLoading(false);
          Alert("error", "Email Validation", err.message);
        });
    }
  };

  useEffect(() => {
    const registerUser = (data: RegisterFormState) => {
      console.log(data, "data");
      const user: UserBio = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email.toLowerCase(),
        phone: null,
        username: data.username,
        gender: null,
        bio: null,
        dob: null,
        website: null,
        occupation: null,
        location: null,
        profilePic: {
          reference: "",
          downloadURL: "",
        },
        headerPhoto: {
          reference: "",
          downloadURL: "",
        },
        bookmarks: [],
        createdAt: new Date().toUTCString(),
      };
      authservice
        .RegisterUserInfo(user)
        .then((response) => {
          console.log(response, "after registering");
          signUpUserWithEmailAndPassword(response.id);
        })
        .catch((error: FirebaseError) => {
          console.log(error);
          Alert("error", "Authentication", error.message);
          setLoading(false);
        });
    };

    const signUpUserWithEmailAndPassword = (docId: string) => {
      console.log(formData);
      authservice
        .CreateUserWithEmailAndPassword(
          formData.email.toLowerCase(),
          formData.password
        )
        .then((userCredential) => {
          userCredential.user.getIdToken().then((token) => {
            if (token) {
              const authUser = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                accessToken: token,
                refreshToken: userCredential.user.refreshToken,
                infoId: docId,
                metadata: JSON.stringify(userCredential.user.metadata),
              };

              dispatch(setAuthUser(authUser));
              setLoading(false);
              navigate("/blog/home");
            }
          });
        })
        .catch((error: FirebaseError) => {
          console.log(error, "auth error");
          // Alert("error", "Authentication", error.message);
          setLoading(false);
        });
    };

    if (formData) {
      console.log(formData);
      setLoading(true);
      registerUser(formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <div id="register-container">
      <div className="row no-gutters h-100 w-100">
        <div className="col-lg-5 col-md-6 col-12">
          <section className="left-section">
            <section
              style={{ marginLeft: "40px" }}
              className="d-flex align-items-center"
            >
              <img
                src={require("../../assets/images/blogify_logo.png")}
                width="6%"
                alt=""
              />
              <h5 className="font-weight-bold ml-3 mb-0">Blogify</h5>
            </section>

            <div className="card card-custom register-card">
              <div className="card-body" style={{ padding: "40px" }}>
                <Formik
                  initialValues={initialValues}
                  validationSchema={registerSchema}
                  validateOnChange={false}
                  onSubmit={(values, actions) => {
                    actions.validateForm().then((response) => {
                      console.log(response, "validated");
                      setFormData(values);
                      // actions.resetForm();
                    });
                  }}
                >
                  {({
                    errors,
                    touched,
                    handleSubmit,
                    values,
                    handleChange,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <h5 className="font-weight-bold mb-5 text-center">
                        Create An Account
                      </h5>
                      <div className="form-group row">
                        <div className="col">
                          <div className="form-group">
                            <label>First Name</label>
                            <input
                              type="text"
                              className={`form-control ${
                                touched.firstname && errors.firstname
                                  ? "is-invalid"
                                  : null
                              }`}
                              placeholder="Enter firstname "
                              name="firstname"
                              autoComplete="true"
                              value={values.firstname}
                              onChange={handleChange}
                            />
                            <div className="invalid-feedback">
                              <span>{errors.firstname}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group">
                            <label>Last Name</label>
                            <input
                              type="text"
                              className={`form-control ${
                                touched.lastname && errors.lastname
                                  ? "is-invalid"
                                  : null
                              }`}
                              placeholder="Enter lastname "
                              name="lastname"
                              autoComplete="true"
                              value={values.lastname}
                              onChange={handleChange}
                            />
                            <div className="invalid-feedback">
                              <span>{errors.lastname}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col">
                          <div className="form-group">
                            <label>Username</label>

                            <div
                              className={
                                usernameLoading
                                  ? "spinner spinner-success spinner-right"
                                  : ""
                              }
                            >
                              <Field
                                type="text"
                                className={`form-control ${
                                  touched.username && errors.username
                                    ? "is-invalid"
                                    : null
                                }`}
                                placeholder="Enter username "
                                name="username"
                                autoComplete="true"
                                value={values.username}
                                onChange={handleChange}
                                validate={validateUsername}
                              />
                              <div className="invalid-feedback">
                                <span>{errors.username}</span>
                              </div>
                            </div>

                            <span className="form-text text-muted">
                              Give us a unique nickname that you'll known for.
                            </span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group">
                            <label>Email</label>

                            <div
                              className={
                                emailLoading
                                  ? "spinner spinner-success spinner-right"
                                  : ""
                              }
                            >
                              <Field
                                type="email"
                                className={`form-control ${
                                  touched.email && errors.email
                                    ? "is-invalid"
                                    : null
                                }`}
                                placeholder="Enter email "
                                name="email"
                                autoComplete="true"
                                value={values.email}
                                onChange={handleChange}
                                validate={validateEmail}
                              />
                              <div className="invalid-feedback">
                                <span>{errors.email}</span>
                              </div>
                            </div>

                            <span className="form-text text-muted">
                              Enter a valid email address
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col">
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
                              autoComplete="true"
                              value={values.password}
                              onChange={handleChange}
                            />
                            <div className="invalid-feedback">
                              <span>{errors.password}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-group">
                            <label>Confirm Password</label>
                            <input
                              type="password"
                              className={`form-control ${
                                touched.confirmPassword &&
                                errors.confirmPassword
                                  ? "is-invalid"
                                  : null
                              }`}
                              placeholder="Confirm password"
                              autoComplete="true"
                              name="confirmPassword"
                              value={values.confirmPassword}
                              onChange={handleChange}
                            />
                            <div className="invalid-feedback">
                              <span>{errors.confirmPassword}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        disabled={loading}
                        type="submit"
                        className={`btn btn-custom btn-block ${
                          loading ? "spinner spinner-white spinner-right" : ""
                        }`}
                      >
                        Sign Up
                      </button>

                      <Link
                        to="/login"
                        className="btn btn-link mt-3 font-weight-bold"
                      >
                        Already a member?, Sign In
                      </Link>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </section>
        </div>
        <div className="col-lg-7 col-md-6 col-12 right-section h-100">
          <img
            src={require("../../assets/images/blogify-register-illus-edited.png")}
            alt=""
          />
          <h1 className="text-white display-4 mt-2">
            Let your voice be heard!
          </h1>
        </div>
      </div>
      {/* <Toast ref={toast} /> */}
    </div>
  );
}

export default AppRegister;
