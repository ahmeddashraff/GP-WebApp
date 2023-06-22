import React, { useEffect, useState } from 'react'
import axios from 'axios';
import roadImg from '../../images/road-frontline-sodera-4.png';
import logoImg from '../../images/logo.png';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './SignIn.css';
import Joi from 'joi';
import '@fortawesome/fontawesome-free/css/all.css';


function SignIn(props) {

    console.log(props);
    let [admin, setAdmin] = useState({ email: '', password: '' });
    let [errorList, setErrorList] = useState([]);
    let [error, setError] = useState('');
    let [loading, setLoading] = useState(false);

    function getAdmin(e) {

        let myAdmin = { ...admin };//Note
        myAdmin[e.target.name] = e.target.value;
        setAdmin(myAdmin);
    }

    function validateRegisterForm() {
        let scheme = Joi.object({

            email: Joi.string().email({ tlds: { allow: ['com', 'net', 'org'] } }).required(),
            password: Joi.string(),
        });

        return scheme.validate(admin, { abortEarly: false });
    }

    async function formSubmit(e) {
        e.preventDefault();
        setLoading(true);
        let validationResponse = validateRegisterForm();

        if (validationResponse.error) {
            setErrorList(validationResponse.error.details)
            setLoading(false);
            setError("Wrong email or password");

            console.log("validation error")
        }
        else {
            try {
                var { data } = await axios.post(`http://127.0.0.1:8000/api/admins/login`, admin);
                if (data.success === true) {
                    const { password,created_at, updated_at, ...loginAdmin } = data.data.admin;
                    localStorage.setItem('admin', JSON.stringify(loginAdmin));

                    // var retrievedObject = localStorage.getItem('testObject');
                    // console.log('retrievedObject: ', JSON.parse(retrievedObject));

                    props.onLogin();
                    props.history.push('/Home');
                    setLoading(false);
                }
            } catch (error) {
                // Handle the error gracefully
                console.log("axios error:", error);
                setLoading(false);
                setError("Wrong email or password");
            }
        }


    }

    return (
        <div id='signIn'>
            <div id="login-nav" className="text-center d-flex justify-content-left">
                <div className="position-relative">
                    <img width={150} height={120} src={logoImg} />
                    <h3>MyWay</h3>
                </div>
            </div>


            <div id="login">
                <div className="text-center">
                    <h1>Sign in to</h1>
                    <h1>MyWay</h1>
                </div>
                <div className="form-group w-25">
                    <form method="post" onSubmit={formSubmit}>
                        <h3 className='text-start'>Sign in</h3>
                        <input onChange={getAdmin} type="text" className="form-control mb-4" name="email" placeholder="Enter Email" />
                        <input onChange={getAdmin} type="password" className="form-control" name="password" placeholder="Enter Password" />
                        <div className="d-flex justify-content-end">
                            <a className="" href='home.php'>Forgot password ?</a>
                        </div>
                        <button type="submit" className="btn mt-5 w-100 py-2">
                            {loading ? <i className='fas fa-spinner fa-spin'></i> : 'login'}
                        </button>
                    </form>
                    {error && <div className="error-alert">{error}</div>}
                </div>
            </div>

            <div id="footer">
                <img width={600} height={250} src={roadImg} />
            </div>
        </div>

    );
}
export default SignIn;
