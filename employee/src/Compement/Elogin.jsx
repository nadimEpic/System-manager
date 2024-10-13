import React, { useState } from 'react';
import '../style/login.css';
import * as Components from './Components';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Elgin() {
    const [signIn, toggle] = React.useState(true);
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        secretCode: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/employee/employee_login', values)
            .then(result => {
                if (result.data.loginStatus) {
                    localStorage.setItem("valid", true);
                    navigate('/edashboard');
                } else {
                    setError(result.data.Error);
                    clearMessageAfterDelay(setError);
                }
            })
            .catch(err => console.log(err));
    };

  
   

    const clearMessageAfterDelay = (setMessage) => {
        setTimeout(() => {
            setMessage(null);
        }, 2000);
    };

    return (
        <div className='login-body'>
            <div className='login-container'>
                <div className='login-form-container'>
                    <Components.Container>
                        <Components.SignUpContainer signinIn={signIn}>
                            <Components.Form>
                                <Components.Title>Create Account</Components.Title>
                                {error && <Components.ErrorMessage>{error}</Components.ErrorMessage>}
                                {success && <Components.SuccessMessage>{success}</Components.SuccessMessage>}
                                <Components.Input type='text' placeholder='Name' onChange={(e) => setValues({ ...values, username: e.target.value })} />
                                <Components.Input type='email' placeholder='Email' onChange={(e) => setValues({ ...values, email: e.target.value })} />
                                <Components.Input type='password' placeholder='Password' onChange={(e) => setValues({ ...values, password: e.target.value })} />
                                <Components.Input type='password' placeholder='Secret Code' onChange={(e) => setValues({ ...values, secretCode: e.target.value })} />
                                <Components.Button>Sign Up</Components.Button>
                            </Components.Form>
                        </Components.SignUpContainer>

                        <Components.SignInContainer signinIn={signIn}>
                            <Components.Form onSubmit={handleSubmit}>
                                <Components.Title>Sign In Employee</Components.Title>
                                {error && <Components.ErrorMessage>{error}</Components.ErrorMessage>}
                                <Components.Input type='email' placeholder='Email' onChange={(e) => setValues({ ...values, email: e.target.value })} />
                                <Components.Input type='password' placeholder='Password' onChange={(e) => setValues({ ...values, password: e.target.value })} />
                                <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                                <Components.Button>Sign In</Components.Button>
                            </Components.Form>
                        </Components.SignInContainer>

                        <Components.OverlayContainer signinIn={signIn}>
                            <Components.Overlay signinIn={signIn}>
                                <Components.LeftOverlayPanel signinIn={signIn}>
                                    <Components.Title>Welcome Back!</Components.Title>
                                    <Components.Paragraph>
                                        To keep connected with us please login with your personal info
                                    </Components.Paragraph>
                                    <Components.GhostButton onClick={() => toggle(true)}>
                                        Sign In
                                    </Components.GhostButton>
                                </Components.LeftOverlayPanel>

                                <Components.RightOverlayPanel signinIn={signIn}>
                                    <Components.Title>Hello, Friend!</Components.Title>
                                    <Components.Paragraph>
                                        Enter your personal details and start your journey with us
                                    </Components.Paragraph>
                                    <Components.GhostButton className="first-btn" onClick={() => toggle(false)}>
                                        Sign Up
                                    </Components.GhostButton>

                                    <Link to='/adminlogin'>
                                    <Components.GhostButton className="second-btn" >
                                        Sign Up Admin
                                    </Components.GhostButton>
                                    </Link>
                                  
                                </Components.RightOverlayPanel>
                            </Components.Overlay>
                        </Components.OverlayContainer>
                    </Components.Container>
                </div>
                <div className='login-text-container'>
                    <h2>Welcome to Our Platform!</h2>
                    <p>Here you can manage your tasks, stay organized, and achieve your goals. Please login to continue or sign up if you don't have an account yet.</p>
                </div>
            </div>
        </div>
    );
}

export default Elgin;
