import React, { useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.css';
import img from '../../images/istockphoto-174662203-612x612.jpg';

// Import Font Awesome CSS

import './Reports.css';
import Modal from "./Modal";
import axios from 'axios';
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { myGlobalVariable } from '../../globalVariables.js';



const Reports = (props) => {

    let history = useHistory();

    const [displayModal, setDisplayModal] = useState(false);
    const [activeModalId, setActiveModalId] = useState(null);
    const [reports, setReports] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    let [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [reportFilter, setReportFilter] = useState({ severities: [], types: [], status: [] });
    let admin = JSON.parse(sessionStorage.getItem('admin'));

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                history.push('/SignIn');
            }
            return Promise.reject(error);
        }
    );

    const handleChange = (e) => {
        // Destructuring
        const { value, checked } = e.target;
        const { severities, types, status } = reportFilter;

        console.log(`${value} is ${checked}`);

        // Case 1 : The user checks the box
        if (checked) {
            if (e.target.name == 'severity') {
                setReportFilter({
                    severities: [...severities, value],
                    types: [...types],
                    status: [...status]

                });
            }
            else if (e.target.name == 'incident-type') {
                setReportFilter({
                    severities: [...severities],
                    types: [...types, value],
                    status: [...status]
                });
            }
            else {
                setReportFilter({
                    severities: [...severities],
                    types: [...types],
                    status: [...status, value]
                });
            }
            console.log("report filter", reportFilter);
        }

        // Case 2  : The user unchecks the box
        else {
            setReportFilter({
                severities: severities.filter((e) => e !== value),
                types: types.filter((e) => e !== value),
                status: status.filter((e) => e !== value),

            });
            console.log("report filter", reportFilter);
        }
    };

    const performSearch = () => {
        const query = searchQuery.toLowerCase();
        const results = reports && reports.filter(
            (report) =>
                report.id.toString().includes(query)
        );
        setSearchResults(results);
    };

    const handleModalOpen = (modalId) => {
        setActiveModalId(modalId);
        const matchedReport = reports.find(report => ('modal' + report.id) === modalId);
        if (matchedReport) {
            setModalContent(matchedReport);
            console.log('matched');

        }
        console.log(modalContent);
        setDisplayModal(true);
        console.log('Modal opened', modalId);
    };

    const handleModalClose = (event) => {
        if (event.target.className === "modal" || event.target.className === "close") {
            setDisplayModal(false);
            setActiveModalId(null);
        }

    };



    async function getReports() {
        const config = {
            headers: {
                Authorization: admin.token,
                'Content-Type': 'application/json',
            },
        };
        console.log(admin.token);
        setLoading(true);
        try {
            var { data } = await axios.get(`http://${myGlobalVariable}/api/admins/reports/`, config);
            if (data.success === true) {
                setReports(data.data.reports.reverse());
                setLoading(false);
            }
        }
        catch (error) {

        }

    }

    const handleSortChange = (event) => {
        // console.log(searchQuery.)
        const sortOption = event.target.value;
        let sortedReports = [...reports];
        console.log(sortOption);
        if (sortOption === "newest to oldest") {
            sortedReports = sortedReports.reverse();
        }
        if (sortOption === "oldest to newest") {
            sortedReports = sortedReports.reverse();
        }

        setReports(sortedReports);
    };

    useEffect(() => {
        performSearch();
    }, [searchQuery]);



    useEffect(() => {
        getReports();
    }, []);

    useEffect(() => {
        console.log(modalContent);
    }, [modalContent]);

    return (
        // <div><h1>Reports</h1></div> 
        <section id="reports">
            <div className="w-100">

                <div className="row g-0">
                    <div className="col-lg-10 mx-auto">
                        <div className="d-flex justify-content-between align-items-center search">
                            <input type="text" value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)} className="form-control w-25" placeholder="search for a report" />
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
                                        <strong>Severity:</strong>
                                        <div className="d-flex align-items-center mb-0">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="severity" value='1' />
                                            <label for="severity" className="mb-0">Critical</label>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="severity" value='2' />
                                            <label for="severity">Not critical</label>
                                        </div>


                                        <strong>Type:</strong>
                                        <div className="d-flex align-items-center mb-0">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="incident-type" value='pothole' />
                                            <label for="incident-type" className="mb-0">potholes</label>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="incident-type" value='flooding' />
                                            <label for="incident-type">flooding</label>
                                        </div>
                                        <div className="d-flex align-items-center mb-0">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="incident-type" value='fire' />
                                            <label for="incident-type" className="mb-0">fire and expl.</label>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="incident-type" value='fallen tree' />
                                            <label for="incident-type">fallen trees</label>
                                        </div>

                                        <strong>Status:</strong>
                                        <div className="d-flex align-items-center">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="status" value='2' />
                                            <label for="status">pending</label>
                                        </div>
                                        <div className="d-flex align-items-center mb-0">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="status" value='0' />
                                            <label for="status" className="mb-0">in progress</label>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="status" value='1' />
                                            <label for="status">done</label>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="status" value='3' />
                                            <label for="status">Not Approved</label>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="status" value='4' />
                                            <label for="status">Waiting</label>
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
                                            <th scope="col" className="col-2 table-header">ID</th>
                                            <th scope="col" className="col-2 table-header">Incident Type</th>
                                            <th scope="col" className="col-3 table-header">Date</th>
                                            <th scope="col" className="col-2 table-header">Status</th>
                                            <th scope="col" className="col-2 table-header">Severity</th>
                                            <th scope="col" className="col-1 table-header">Action</th>
                                        </tr>
                                    </thead>
                                    {loading ? <i className='fas fa-spinner fa-spin fa-2x mt-3'></i> :
                                        <tbody>
                                            {reports &&
                                                (searchResults == null || searchResults.length === 0 || searchQuery == '' || searchQuery == null
                                                    ? reports
                                                    : searchResults
                                                )
                                                    .filter((report) => {
                                                        if (
                                                            reportFilter.severities.length > 0 &&
                                                            !reportFilter.severities.includes(report.severity.toString())
                                                        ) {
                                                            return false;
                                                        }
                                                        if (
                                                            reportFilter.types.length > 0 &&
                                                            !reportFilter.types.includes(report.type.toLowerCase())
                                                        ) {
                                                            return false;
                                                        }
                                                        if (
                                                            reportFilter.status.length > 0 &&
                                                            !reportFilter.status.includes(report.status.toString())
                                                        ) {
                                                            return false;
                                                        }
                                                        return true;
                                                    }).map(report => (
                                                        <tr key={report.id}>
                                                            <th scope="row" className="col-2">{report.report_id}</th>
                                                            <td scope="row" className="col-2">{report.type}</td>
                                                            <td className="col-3">{new Date(report.created_at).toLocaleString("en-US", {
                                                                year: "numeric",
                                                                month: "2-digit",
                                                                day: "2-digit",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit",
                                                            })}</td>
                                                            <td className="col-2">{report.status == 1 ? <p className="text-success mb-0"><strong>done</strong></p> : (report.status == 0 ? <p className="text-secondary mb-0"><strong>in progress</strong></p> :(report.status == 4 ? <p className="text-secondary mb-0"><strong>waiting</strong></p>: <p className="text-warning mb-0"><strong>pending</strong></p>))}</td>
                                                            <td className="col-2">{report.severity == 1 ? <p className="text-danger mb-0"><strong>critical</strong></p> : (report.severity == 0 ? <p className="text-secondary mb-0"><strong>none</strong></p> : <p className="text-warning mb-0"><strong>not ctitical</strong></p>)}</td>

                                                            <td className="col-1"><i onClick={() => handleModalOpen('modal' + report.id)} data-modal={"modal" + report.id} className="fa-solid fa-circle-info" style={{ color: '#9aaac6', fontSize: 20 }}></i></td>
                                                        </tr>
                                                    ))}
                                        </tbody> 
                                    }

                                </table>
                            </div>

                        </div>
                    </div>

                </div>
                {displayModal && (
                    <Modal modalId={activeModalId} isGovUser={false} {...props} modalContent={modalContent} onClose={handleModalClose} />
                )}
            </div>
        </section>
    );
}

export default Reports;