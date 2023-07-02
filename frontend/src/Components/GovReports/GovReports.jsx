import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Modal from "../Reports/Modal";
import './GovReports.css';
const GovReports = (props) => {

    const [displayModal, setDisplayModal] = useState(false);
    const [activeModalId, setActiveModalId] = useState(null);
    const [reports, setReports] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    let [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [reportFilter, setReportFilter] = useState({ severities: [], types: [], status: [] });
    let admin = JSON.parse(sessionStorage.getItem('admin'));

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
            var { data } = await axios.get(`http://127.0.0.1:8000/api/GovUsers/reports/getAllReportsByField/${admin.field}`, config);
            if (data.success === true) {
                setReports(data.data.reports.reverse());
                setLoading(false);
            }
        }
        catch (error) {
            setLoading(false);
            console.log("axios", error);
        }

    }

    const handleSortChange = (event) => {
        // console.log(searchQuery.)
        const sortOption = event.target.value;
        if (reports) {
            let sortedReports = [...reports];
            console.log(sortOption);
            if (sortOption === "newest to oldest") {
                sortedReports = sortedReports.reverse();
            }
            if (sortOption === "oldest to newest") {
                sortedReports = sortedReports.reverse();
            }

            setReports(sortedReports);
        }

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
        <section id="GovReports">
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

                                        <strong>Status:</strong>
                                        <div className="d-flex align-items-center mb-0">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="status" value='0' />
                                            <label for="status" className="mb-0">in progress</label>
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <input onChange={handleChange} type='checkbox' className="me-1" name="status" value='1' />
                                            <label for="status">done</label>
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
                                            <th scope="col" className="col-3 table-header">Incident Type</th>
                                            <th scope="col" className="col-3 table-header">Date</th>
                                            <th scope="col" className="col-2 table-header">Status</th>
                                            {/* <th scope="col" className="col-2 table-header">Severity</th> */}
                                            <th scope="col" className="col-2 table-header">Action</th>
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
                                                            <th scope="row" className="col-2">{report.id}</th>
                                                            <td scope="row" className="col-3">{report.type}</td>
                                                            <td className="col-3">{new Date(report.created_at).toLocaleString("en-US", {
                                                                year: "numeric",
                                                                month: "2-digit",
                                                                day: "2-digit",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit",
                                                            })}</td>
                                                            <td className="col-2">{report.status == 1 ? <p className="text-success mb-0"><strong>done</strong></p> : <p className="text-warning mb-0"><strong>in progress</strong></p>}</td>
                                                            <td className="col-2"><i onClick={() => handleModalOpen('modal' + report.id)} data-modal={"modal" + report.id} className="fa-solid fa-circle-info" style={{ color: '#9aaac6', fontSize: 20 }}></i></td>
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
                    <Modal modalId={activeModalId} token={admin.token} isGovUser={true} {...props} modalContent={modalContent} onClose={handleModalClose} />
                )}
            </div>
        </section>
    );
}

export default GovReports;