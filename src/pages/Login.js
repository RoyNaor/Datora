import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css'; // Import CSS for styling

// Validation schema using Yup
const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function Login() {
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Attempt to login with provided data
      const response = await axios.post('http://localhost:3002/auth/login', data);

      // Check for server error in response
      if (response.data.error) {
        alert(response.data.error);
      } else {
        // Navigate to home page on successful login and save the accessToken
        sessionStorage.setItem("accessToken", response.data.token);
        sessionStorage.setItem("username", response.data.username);
        navigate('/home');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed due to an internal server error.');
    }
  };

  return (
    <div className="login-container">
      {/* Left side for login form */}
      <div className="login-left">
        <h2>Sign In</h2>

        {/* Formik component for form handling */}
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={onSubmit} // Pass the onSubmit function to Formik
        >
          {() => (
            <Form className="login-form">
              {/* Username input field */}
              <div className="input-group">
                <Field type="text" name="username" placeholder="Username..." />
                <ErrorMessage name="username" component="div" className="error" />
              </div>

              {/* Password input field */}
              <div className="input-group">
                <Field type="password" name="password" placeholder="Password..." />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              {/* Remember me and forgot password section */}
              {/* <div className="remember-forgot">
                <label>
                  <Field type="checkbox" name="remember" /> Remember Me
                </label>
                <a href="/">Forgot Password</a>
              </div> */}

              {/* Submit button */}
              <button type="submit" className="login-button">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Right side welcome message */}
      <div className="login-right">
        <h2>Welcome to Datora</h2>
        <p>Unlock the Power of Your Data</p>
      </div>
    </div>
  );
}

export default Login;
