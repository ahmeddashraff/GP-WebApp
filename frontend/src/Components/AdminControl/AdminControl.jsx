import axios from "axios";
import React, { useEffect, useState } from "react";
import "./AdminControl.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { myGlobalVariable } from '../../globalVariables.js';

const AdminControl = () => {

    const history = useHistory();


    const [displayModal, setDisplayModal] = useState(false);
    const [activeModalId, setActiveModalId] = useState(null);
    const [modalContent, setModalContent] = useState(null);

    let [modalLoading, setModalLoading] = useState(false);
    let [adminsLoading, setAdminsLoading] = useState(false);
    let [addAdminLoading, setAddAdminLoading] = useState(false);

    let [errorList, setErrorList] = useState(null);
    let admin = JSON.parse(sessionStorage.getItem('admin'));

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [editMode, setEditMode] = useState(false);

    let [successMessage, setSuccessMessage] = useState(false);

    const [admins, setAdmins] = useState(null);
    const config = {
        headers: {
            Authorization: admin.token,
            'Content-Type': 'application/json',
        },
    };

    let [addedAdmin, setAddedAdmin] = useState({
        email: ' ',
        password: ' ',
        full_name: ' ',
        phone_number: ' ',
        national_id: ' ',
        role: 'admin',
        password_confirmation: '',
    });



    const handleEditClick = () => {
        setEditMode(true);
    };


    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                history.push('/SignIn');
            }
            return Promise.reject(error);
        }
    );

    const performSearch = () => {
        const query = searchQuery.toLowerCase();
        const results = admins && admins.filter(
            (admin) =>
                admin.full_name.toLowerCase().includes(query) ||
                admin.phone_number.toLowerCase().includes(query) ||
                admin.email.toLowerCase().includes(query) ||
                admin.national_id.toLowerCase().includes(query)
        );
        setSearchResults(results);
    };

    const handleSortChange = (event) => {
        // console.log(searchQuery.)
        const sortOption = event.target.value;
        let sortedAdmins = [...admins];
        console.log(sortOption);
        if (sortOption === "newest to oldest") {
            sortedAdmins = sortedAdmins.reverse();
        }
        if (sortOption === "oldest to newest") {
            sortedAdmins = sortedAdmins.reverse();
        }
        setAdmins(sortedAdmins);
    };

    function getAddedAdmin(e) {
        const name = e.target.name;
        const value = e.target.value;

        // Create a copy of addedAdmin
        let updatedAddedAdmin = { ...addedAdmin };

        updatedAddedAdmin[name] = value;


        console.log(updatedAddedAdmin)
        setAddedAdmin(updatedAddedAdmin);
    }



    const handleModalOpen = (modalId) => {
        setActiveModalId(modalId);
        const matchedAdmin = admins.find(admin => ('modal' + admin.id) === modalId);
        if (matchedAdmin) {
            setModalContent(matchedAdmin);
            console.log('matched');
        }
        console.log(modalContent);
        setDisplayModal(true);
        console.log('Modal opened', modalId);
    };

    const handleModalClose = (event) => {
        console.log("inside close handler ", event)
        if (event.target.className === "modal" || event.target.className === "close") {
            setDisplayModal(false);
            setActiveModalId(null);
        }
    };


    async function getAdmins() {
        setAdminsLoading(true);
        try {
            var { data } = await axios.get(`http://${myGlobalVariable}/api/admins/getAllAdminsInDepartment`, config);
            if (data.success === true) {
                setAdmins(data.data.admins.reverse())
                setAdminsLoading(false);
            }
        } catch (error) {

        }

    }

    async function updateStatus(id, status) {
        const bodyRequest = { status: status };
        setModalLoading(true);
        try {
            var { data } = await axios.put(`http://${myGlobalVariable}/api/admins/updateAdminStatus/${id}`, bodyRequest, config);
            if (data.success === true) {
                const updatedModalContent = { ...modalContent };
                updatedModalContent.status = status;
                setModalContent(updatedModalContent);
                setModalLoading(false);
                const adminIndex = admins.findIndex(admin => admin.id === modalContent.id);
                if (adminIndex !== -1) {
                    const updatedAdmins = [...admins];
                    updatedAdmins[adminIndex] = data.data.admin;
                    setAdmins(updatedAdmins);
                }
            }
        }
        catch (error) {

        }

    }

    async function deleteAdmin(id) {
        setModalLoading(true);

        try {
            var { data } = await axios.delete(`http://${myGlobalVariable}/api/admins/delete/${id}`, config);
            if (data.success === true) {
                const updatedAdmins = admins.filter((admin) => admin.id !== id);
                setAdmins(updatedAdmins);
                setModalLoading(false);
                setDisplayModal(false);
                setActiveModalId(null);
            }

        }catch(error)
        {

        }

    }
    async function formSubmit(e) {
        e.preventDefault();
        setAddAdminLoading(true);

        try {
            console.log(addedAdmin);
            const { first_name, middle_name, last_name, ...addAdminRequest } = addedAdmin;
            console.log(addAdminRequest);
            var { data } = await axios.post(`http://${myGlobalVariable}/api/admins/addAdmin`, addAdminRequest, config);
            console.log(data);
            if (data.success === true) {
                const updatedAdmins = [...admins, data.data.admin];
                setAdmins(updatedAdmins);
                setAddAdminLoading(false);
                setErrorList(null);
            }
            else {
                setSuccessMessage(false);
                setErrorList(data.errors)
            }
        } catch (error) {
            setSuccessMessage(false);
            setAddAdminLoading(false);
            setErrorList(error.response.data.errors)
            console.log("axios error:", error.request.error);
        }
    }

    async function saveAdminInfo(modalContent) {
        console.log(modalContent);
        const bodyRequest = { phone_number: modalContent.phone_number, email: modalContent.email, password: modalContent.password };
        setModalLoading(true);
        try{
            var { data } = await axios.put(`http://${myGlobalVariable}/api/admins/updateAdminInfo/${modalContent.id}`, bodyRequest, config);
            if (data.success === true) {
                // const updatedModalContent = { ...modalContent };
                // updatedModalContent.status = status;
                const adminIndex = admins.findIndex(admin => admin.id === modalContent.id);
                if (adminIndex !== -1) {
                    const updatedAdmins = [...admins];
                    updatedAdmins[adminIndex] = data.data.admin;
                    setAdmins(updatedAdmins);
                }
                setModalContent(modalContent);
                setModalLoading(false);
            }
        }
        catch(error)
        {

        }

    }

    useEffect(() => {
        performSearch();
    }, [searchQuery]);


    useEffect(() => {
        getAdmins();
        console.log('search results', searchResults);
    }, []);

    useEffect(() => {
        console.log(errorList);
    }, [errorList]);

    return (
        <section id="AdminControl">
            <div className="w-100">
                <div className="row g-0">
                    <div className="col-lg-10 mx-auto">
                        <div className="d-flex justify-content-between align-items-center search">
                            <input type="text" className="form-control w-25" placeholder="search for an admin" value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} />
                            <div className="d-flex justify-content-center align-items-center">
                                <label className="me-1 w-50"><strong>Sort By:</strong> </label>
                                <select name="sort" className="form-select form-select-sm" onChange={handleSortChange} >
                                    <option>newest to oldest</option>
                                    <option>oldest to newest</option>
                                </select>
                            </div>
                        </div>
                        <div className="rounded shadow bg-white">

                            <div className="table-responsive">
                                <table className="table table-fixed table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="col-1 table-header">ID</th>
                                            <th scope="col" className="col-3 table-header">Name</th>
                                            <th scope="col" className="col-2 table-header">Phone Number</th>
                                            <th scope="col" className="col-2 table-header">Email</th>
                                            <th scope="col" className="col-2 table-header">National ID</th>
                                            <th scope="col" className="col-2 table-header">Action</th>
                                        </tr>
                                    </thead>
                                    {adminsLoading ? <i className='fas fa-spinner fa-spin fa-2x mt-3'></i> :
                                        <tbody>
                                            {admins && (searchResults == null || searchResults.length == 0 ? admins : searchResults).map(admin => (
                                                <>
                                                    <tr key={admin.id}>
                                                        <th scope="row" className="col-1">{admin.id}</th>
                                                        <td className="col-3">{admin.full_name}</td>
                                                        <td className="col-2">{admin.phone_number}</td>
                                                        <td className="col-2">{admin.email}</td>
                                                        <td className="col-2">{admin.national_id}</td>

                                                        <td className="col-2"><i onClick={() => handleModalOpen('modal' + admin.id)} data-modal={"modal" + admin.id} className="fa-solid fa-circle-info" style={{ color: '#9aaac6', fontSize: 20 }}></i></td>
                                                    </tr>
                                                </>

                                            ))}
                                        </tbody>
                                    }

                                </table>
                            </div>
                        </div>



                        <div className="add-admin mt-5 mb-5">
                            <h2>Do you want to add an admin?</h2>
                            <div className="d-flex justify-content-center">
                                <div className="mt-3 form-content w-100 rounded shadow bg-light">
                                    <form className="mx-1 mx-md-4" onSubmit={formSubmit}>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <div className="row d-flex ">
                                                    <div className="col-md-12">
                                                        <input onChange={getAddedAdmin} type="text" placeholder="Enter full name" name="full_name" className="form-control " />
                                                    </div>



                                                </div>
                                                {errorList && (errorList.full_name && <div className="error-alert">full name is required</div>)}
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input onChange={getAddedAdmin} name="email" type="email" className="form-control" />
                                                {errorList && (errorList.email && <div className="error-alert">{errorList.email[0]}</div>)}

                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i class="fa-solid fa-phone fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input onChange={getAddedAdmin} name="phone_number" type="text" className="form-control" />
                                                {errorList && (errorList.phone_number && <div className="error-alert">{errorList.phone_number[0]}</div>)}

                                            </div>

                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fa-solid fa-id-card fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input onChange={getAddedAdmin} name="national_id" type="text" className="form-control" />
                                                {errorList && (errorList.national_id && <div className="error-alert">{errorList.national_id[0]}</div>)}

                                            </div>

                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input onChange={getAddedAdmin} name="password" type="password" className="form-control" />
                                                {errorList &&
                                                    (errorList.password &&
                                                        <div className="error-alert">{errorList.password[0] === 'The password field format is invalid.' ?
                                                            'The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character from @$!%*?&'
                                                            :
                                                            errorList.password[0]}</div>)}

                                            </div>
                                        </div>

                                        <div className="d-flex flex-row align-items-center mb-4">
                                            <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                            <div className="form-outline flex-fill mb-0">
                                                <input onChange={getAddedAdmin} name="password_confirmation" type="password" className="form-control" />
                                                {errorList && (errorList.password_confirmation && <div className="error-alert">{errorList.password_confirmation[0]}</div>)}
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                            <button type="submit" className="btn btn-primary btn-md">{addAdminLoading ? <i className='fas fa-spinner fa-spin'></i> : 'Add Admin'}</button>
                                        </div>

                                    </form>
                                    {successMessage && <p className="text-success"><strong>Added Successfully</strong></p>}

                                </div>

                            </div>


                        </div>
                    </div>
                </div>
                {displayModal && <div className="popup">
                    <div id={activeModalId} onClick={handleModalClose} className="modal" style={{ display: 'block' }}>
                        <div className="modal-content">
                            <div className="contact-form">
                                <a onClick={handleModalClose} className="close">&times;</a>
                                {modalLoading ? <i className='fas fa-spinner fa-spin'></i> :

                                    <div className="popup-content">
                                        <div className="card shadow-sm">
                                            <div className="card-header bg-transparent border-0">
                                                <h3 className="mb-0"><i className="far fa-clone pr-1"></i>Admin Information</h3>
                                            </div>
                                            <div className="card-body pt-0">
                                                <table className="table table-bordered">
                                                    <tr>
                                                        <th width="30%">ID</th>
                                                        <td width="2%">:</td>
                                                        <td>{modalContent.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <th width="30%">Full Name</th>
                                                        <td width="2%">:</td>
                                                        <td>{modalContent.full_name}</td>
                                                    </tr>
                                                    {editMode ? (
                                                        <>
                                                            <tr>
                                                                <th width="30%">Phone Number</th>
                                                                <td width="2%">:</td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control p-0 my-1 bg-light text-center"
                                                                        value={modalContent.phone_number}
                                                                        onChange={(e) =>
                                                                            setModalContent({
                                                                                ...modalContent,
                                                                                phone_number: e.target.value,
                                                                            })
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th width="30%">Email</th>
                                                                <td width="2%">:</td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control p-0 my-1 bg-light text-center"
                                                                        value={modalContent.email}
                                                                        onChange={(e) =>
                                                                            setModalContent({
                                                                                ...modalContent,
                                                                                email: e.target.value,
                                                                            })
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <tr>
                                                                <th width="30%">Phone Number</th>
                                                                <td width="2%">:</td>
                                                                <td>{modalContent.phone_number}</td>
                                                            </tr>
                                                            <tr>
                                                                <th width="30%">Email</th>
                                                                <td width="2%">:</td>
                                                                <td>{modalContent.email}</td>
                                                            </tr>
                                                        </>
                                                    )}

                                                    <tr>
                                                        <th width="30%">National ID:</th>
                                                        <td width="2%">:</td>
                                                        <td>{modalContent.national_id}</td>
                                                    </tr>
                                                    <tr>
                                                        <th width="30%">Status:</th>
                                                        <td width="2%">:</td>
                                                        <td>{modalContent.status == 0 ? <strong className="text-danger p-0">deactivated</strong> : <strong className="p-0 text-success">active</strong>}</td>
                                                    </tr>
                                                    <tr>
                                                        <th width="30%">Employed at:</th>
                                                        <td width="2%">:</td>
                                                        <td>{modalContent.created_at && modalContent.created_at.split('T').slice(0, 1).join(' ')}</td>
                                                    </tr>
                                                    {editMode &&
                                                        <tr>
                                                            <th width="30%">Password:</th>
                                                            <td width="2%">:</td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="form-control p-0 my-1 bg-light text-center"

                                                                    onChange={(e) => {
                                                                        setModalContent({
                                                                            ...modalContent,
                                                                            password: e.target.value,
                                                                        });
                                                                        console.log("inside password", modalContent);
                                                                    }
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    }
                                                </table>
                                                <div>
                                                    <h5><strong>Available Actions:</strong></h5>
                                                    <div className="actions">
                                                        <div className="d-flex justify-content-center align-items-center">

                                                            {modalContent.status == 0 ?
                                                                <>
                                                                    <div className="text">User is deactivated, do you want to activate?</div>
                                                                    <button className="btn btn-success w-25" name="status" onClick={() => { updateStatus(modalContent.id, 1) }}>activate</button></>
                                                                :
                                                                <>
                                                                    <div className="text">User is activated, do you want to deactivate?</div>
                                                                    <button name="status" onClick={() => { updateStatus(modalContent.id, 0) }} className="status btn btn-danger w-25">deactivate</button>
                                                                </>}
                                                        </div>
                                                        <div className="mt-2 d-flex justify-content-center align-items-center">
                                                            <div className="text">Do you want to delete the user?</div> <button name="deleteBtn" onClick={() => { deleteAdmin(modalContent.id); getAdmins(); }} className="btn btn-danger w-25">delete</button>
                                                        </div>
                                                        <div className="mt-2 d-flex justify-content-center align-items-center">
                                                            {!editMode ? (
                                                                <div className="text">Do you want to edit the user?</div>
                                                            ) : <div className="text-end ">Do you want to save changes?</div>
                                                            }
                                                            {!editMode ? (
                                                                <button
                                                                    name="editBtn"
                                                                    className="btn btn-secondary w-25"
                                                                    onClick={handleEditClick}
                                                                >
                                                                    Edit
                                                                </button>
                                                            ) : (
                                                                <div className="w-50 d-flex justify-content-center">
                                                                    <div className="d-flex justify-content-center w-50">

                                                                        <button
                                                                            name="saveBtn"
                                                                            className="btn btn-secondary w-50 me-2"
                                                                            onClick={() => {
                                                                                setEditMode(false);
                                                                            }}
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            name="saveBtn"
                                                                            className="btn btn-primary w-50"
                                                                            onClick={() => {
                                                                                // Save the updated admin info
                                                                                saveAdminInfo(modalContent);
                                                                                setEditMode(false);
                                                                            }}
                                                                        >
                                                                            Save
                                                                        </button>
                                                                    </div>

                                                                </div>

                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div >
                }


            </div>
        </section>);
}

export default AdminControl;