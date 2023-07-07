import React, { useEffect, useState } from 'react'
import axios from 'axios';
import roadImg from '../../images/road-frontline-sodera-4.png';
import logoImg from '../../images/logo.png';
import { useHistory } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './SignIn.css';
import Joi from 'joi';
import '@fortawesome/fontawesome-free/css/all.css';
import { myGlobalVariable } from '../../globalVariables.js';
function SignIn() {


    let history = useHistory();

    let [admin, setAdmin] = useState({ email: '', password: '' });
    let [errorList, setErrorList] = useState([]);
    let [error, setError] = useState('');
    let [loading, setLoading] = useState(false);

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        console.log('insidee handle channge', event.target.checked)
        setIsChecked(event.target.checked);
    };

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
                console.log('inside form submitt', isChecked)

                if (isChecked) {
                    var { data } = await axios.post(`http://${myGlobalVariable}/api/GovUsers/login`, admin);
                    if (data.success === true) {
                        const { password, created_at, updated_at, ...loginAdmin } = data.data.gov_user;
                        sessionStorage.setItem('admin', JSON.stringify({...loginAdmin, isGovUser: true}));
                        history.push('/GovReports');
                        setLoading(false);
                    }
                } else {
                    var { data } = await axios.post(`http://${myGlobalVariable}/api/admins/login`, admin);
                    if (data.success === true) {
                        const { password, created_at, updated_at, ...loginAdmin } = data.data.admin;
                        sessionStorage.setItem('admin', JSON.stringify({...loginAdmin, isGovUser: false}));
                        if(data.data.admin.role == "owner")
                        {
                            history.push('/Owner');
                        }
                        else{
                            history.push('/Home');
                        }
                        setLoading(false);
                    }
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
                        <div className="d-flex justify-content-between mt-1">
                            <div className='d-flex align-items-center'>
                                <input type='checkbox' onChange={handleCheckboxChange} className='' id="govCheck" name="govCheck" />
                                <label className='checkbox-label mb-0 ms-2' For="govCheck">Sign In as a gov user</label>
                            </div>
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
