import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./Users.css";

const Users = () => {

    const history = useHistory();


    let [usersLoading, setUsersLoading] = useState(false);

    let admin = JSON.parse(sessionStorage.getItem('admin'));

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [users, setUsers] = useState(null);
    const config = {
        headers: {
            Authorization: admin.token,
            'Content-Type': 'application/json',
        },
    };

    const [userFilter, setUserFilter] = useState({ genders: [] });


    const goToUserProfile = (userId) => {
        history.push(`/UserInfo/${userId}`);
    };
    const handleChange = (e) => {
        const { value, checked } = e.target;
        const { genders } = userFilter;

        console.log(`${value} is ${checked}`);

        if (checked) {
            setUserFilter({
                genders: [...genders, value],
            });
        }
        else {
            setUserFilter({
                genders: genders.filter((e) => e !== value),
            });
        }
    };
    const handleSortChange = (event) => {
        // console.log(searchQuery.)
        const sortOption = event.target.value;
        let sortedUsers = [...users];
        console.log(sortOption);
        if (sortOption === "newest to oldest") {
            sortedUsers = sortedUsers.reverse();
        }
        if (sortOption === "oldest to newest") {
            sortedUsers = sortedUsers.reverse();
        }

        setUsers(sortedUsers);
    };

    const performSearch = () => {
        const query = searchQuery.toLowerCase();
        const results = users && users.filter(
            (user) =>
                user.full_name.toLowerCase().includes(query) ||
                user.id.toString().includes(query) ||
                user.phone_number.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.national_id.toLowerCase().includes(query)
        );
        setSearchResults(results);
    };


    async function getUsers() {
        setUsersLoading(true);
        var { data } = await axios.get(`http://127.0.0.1:8000/api/admins/users/`, config);
        if (data.success === true) {
            setUsers(data.data.users.reverse())
            setUsersLoading(false);

        }
    }

    useEffect(() => {
        performSearch();
    }, [searchQuery]);

    useEffect(() => {
        getUsers();
    }, []);


    return (
        <section id="users">
            <div className="row g-0">
                <div className="col-lg-10 mx-auto">
                    <div className="d-flex justify-content-between align-items-center search">
                        <input type="text" className="form-control w-25" placeholder="search for a user" value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} />
                        <div className="d-flex justify-content-center align-items-center">
                            <label className="me-1 w-50"><strong>Sort By:</strong> </label>
                            <select name="sort" className="form-select form-select-sm" onChange={handleSortChange} >
                                <option>newest to oldest</option>
                                <option>oldest to newest</option>
                            </select>

                            <div className="nav-item dropdown ms-2">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="navbarDropdownMenuLink"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <strong>Filter By</strong>

                                </a>
                                <div className="dropdown-menu p-2" aria-labelledby="navbarDropdownMenuLink">
                                    <strong>Gender:</strong>
                                    <div className="d-flex align-items-center mb-0">
                                        <input onChange={handleChange} type='checkbox' className="me-1" name="gender" value='male' />
                                        <label for="gender" className="mb-0">male</label>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <input onChange={handleChange} type='checkbox' className="me-1" name="gender" value='female' />
                                        <label for="gender">female</label>
                                    </div>
                                </div>
                            </div>
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
                                {usersLoading ? <i className='fas fa-spinner fa-spin fa-2x mt-3'></i> :
                                    <tbody>
                                        {users && (searchResults == null || searchResults.length == 0 || searchQuery == '' || searchQuery == null
                                            ? users :
                                            searchResults).filter((user) => {
                                                if (
                                                    userFilter.genders.length > 0 &&
                                                    !userFilter.genders.includes(user.gender.toLowerCase())
                                                ) {
                                                    return false;
                                                }
                                                return true;
                                            }).map(user => (
                                                <>
                                                    <tr key={user.id}>
                                                        <th scope="row" className="col-1">{user.id}</th>
                                                        <td className="col-3">{user.full_name}</td>
                                                        <td className="col-2">{user.phone_number}</td>
                                                        <td className="col-2">{user.email}</td>
                                                        <td className="col-2">{user.national_id}</td>

                                                        <td className="col-2"><p className="mb-0 go-to-profile" onClick={() => { goToUserProfile(user.id) }}>View profile <i class="fa-solid fa-circle-arrow-right"></i></p></td>
                                                    </tr>
                                                </>

                                            ))}
                                    </tbody>
                                }

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>);
}

export default Users;