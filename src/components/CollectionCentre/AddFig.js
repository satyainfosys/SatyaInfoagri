import React, { useState, useEffect } from 'react'
import { Button, Table, Form, Modal, Card } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { figDetailsAction, formChangedAction } from 'actions';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AddFig = () => {

    const [rowData, setRowData] = useState([]);
    const dispatch = useDispatch();
    const [formHasError, setFormError] = useState(false);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [paramsData, setParamsData] = useState({});

    const emptyRow = {
        id: rowData.length + 1,
        encryptedCompanyCode: localStorage.getItem("EncryptedCompanyCode") ? localStorage.getItem("EncryptedCompanyCode") : '',
        encryptedClientCode: localStorage.getItem("EncryptedClientCode") ? localStorage.getItem("EncryptedClientCode") : "",
        encryptedCollectionCentreCode: localStorage.getItem("EncryptedCollectionCentreCode") ? localStorage.getItem("EncryptedCollectionCentreCode") : "",
        figName: '',
        figShortName: '',
        countryCode: '',
        stateCode: '',
        address: '',
        activeStatus: 'Active',
        addUser: localStorage.getItem("LoginUserName"),
        modifyUser: localStorage.getItem("LoginUserName")
    }

    const columnsArray = [
        'S.No',
        'Fig Name',
        'Fig Short Name',
        'Country',
        'State',
        'Address',
        'Status',
        'Action'
    ];

    const figDetailsReducer = useSelector((state) => state.rootReducer.figDetailsReducer)
    var figDetailsData = figDetailsReducer.figDetails;

    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    const collectionCentreDetailsErrorReducer = useSelector((state) => state.rootReducer.collectionCentreDetailsErrorReducer)
    const collectionCentreErr = collectionCentreDetailsErrorReducer.collectionCentreDetailsError

    useEffect(() => {
        if (figDetailsReducer.figDetails.length > 0) {
            setRowData(figDetailsData);
            setTimeout(function () {
                setStateValue();
            }, 50);
        }

        if (countryList.length <= 0) {
            getCountries();
        }
    }, [figDetailsData, figDetailsReducer]);

    const setStateValue = () => {
        figDetailsData.map((row, index) => {
            getStates(row.countryCode, index);
        })
    };

    const getCountries = async () => {
        axios
            .get(process.env.REACT_APP_API_URL + '/country-list')
            .then(res => {
                if (res.data.status == 200) {
                    let countryData = [];
                    if (res.data && res.data.data.length > 0)
                        res.data.data.forEach(country => {
                            countryData.push({
                                key: country.countryName,
                                value: country.countryCode
                            });
                        });
                    setCountryList(countryData);
                }
            });
    }

    const getStates = async (countryCode, index) => {
        const stateRequest = {
            CountryCode: countryCode
        }
        let stateData = [];
        let response = await axios.post(process.env.REACT_APP_API_URL + '/state-list', stateRequest)


        if (response.data.status == 200) {
            if (response.data && response.data.data.length > 0) {
                response.data.data.forEach(state => {
                    stateData.push({
                        key: state.stateName,
                        value: state.stateCode
                    });
                });
            }
            setStateList(prevStateList => {
                const newStateList = [...prevStateList];
                newStateList[index] = stateData;
                return newStateList;
            });
        } else {
            setStateList(prevStateList => {
                const newStateList = [...prevStateList];
                newStateList[index] = [];
                return newStateList;
            });
        }
    }

    const validateFigDetailForm = () => {
        let isValid = true;

        if (figDetailsData && figDetailsData.length > 0) {
            figDetailsData.forEach((row, index) => {
                if (!row.figName || !row.stateCode || !row.countryCode) {
                    isValid = false;
                    setFormError(true);
                }
            });
        }

        if (isValid) {
            setFormError(false)
        }

        return isValid
    }

    const handleAddRow = async () => {
        let formValid = validateFigDetailForm()
        if (formValid) {
            figDetailsData.unshift(emptyRow);
            dispatch(figDetailsAction(figDetailsData));
        }
    };

    const handleFieldChange = (e, index) => {
        const { name, value } = e.target;
        var figDetails = [...rowData];
        figDetails[index][name] = value;
        figDetails = Object.keys(rowData).map(key => {
            return rowData[key];
        })

        if (name == 'countryCode') {
            figDetails[index].stateCode = '';
            value && getStates(value, index);
        }

        dispatch(figDetailsAction(figDetails))

        if (figDetails[index].encryptedFigCode) {
            dispatch(formChangedAction({
                ...formChangedData,
                figDetailUpdate: true
            }))
        } else {
            dispatch(formChangedAction({
                ...formChangedData,
                figDetailAdd: true
            }))
        }
    }

    const ModalPreview = (encryptedFigCode, figNameToDelete, figDetailData) => {
        setModalShow(true);
        setParamsData({ encryptedFigCode, figNameToDelete, figDetailData });
    }

    const deleteFigDetails = () => {
        if (!paramsData)
            return false;

        var objectIndex = figDetailsReducer.figDetails.findIndex(x => x.figName == paramsData.figNameToDelete);
        figDetailsReducer.figDetails.splice(objectIndex, 1)

        var deleteFigCode = localStorage.getItem("DeleteFigCodes");

        if (paramsData.encryptedFigCode) {
            var deleteFigDetail = deleteFigCode ? deleteFigCode + "," + paramsData.encryptedFigCode : paramsData.encryptedFigCode;
            localStorage.setItem("DeleteFigCodes", deleteFigDetail);
        }

        toast.success("Fig detail deleted successfully", {
            theme: 'colored'
        });

        dispatch(figDetailsAction(figDetailsData));

        dispatch(formChangedAction({
            ...formChangedData,
            figDelete: true
        }))

        setModalShow(false);
    }

    return (
        <>
            {modalShow && paramsData &&
                <Modal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Are you sure, you want to delete this family detail?</h4>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setModalShow(false)}>Cancel</Button>
                        <Button variant="danger" onClick={() => deleteFigDetails()}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            }

            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="Fig Details"
                    titleTag="h6"
                    className="py-2"
                    light
                    endEl={
                        <Flex>
                            <div >
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="btn-reveal"
                                    type="button"
                                    onClick={() => handleAddRow()}
                                >
                                    <i className="fa-solid fa-plus" />
                                </Button>
                            </div>
                        </Flex>
                    }
                />
                {
                    figDetailsData && figDetailsData.length > 0 &&
                    <Card.Body className="position-relative pb-0 p3px full-tab-card-body">
                        <Form
                            noValidate
                            validated={formHasError || (collectionCentreErr.figDetailErr && collectionCentreErr.figDetailErr.invalidFigDetail)}
                            className="details-form"
                            id="AddFigDetails"
                        >
                            <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                                <thead className='custom-bg-200'>
                                    {rowData && <tr>
                                        {columnsArray.map((column, index) => (
                                            <th className="text-left" key={index}>
                                                {column}
                                            </th>
                                        ))}
                                    </tr>}
                                </thead>
                                <tbody id="tbody" className="details-form">
                                    {rowData.map((figData, index) => (
                                        <tr key={index}>
                                            <td>
                                                {index + 1}
                                            </td>

                                            <td key={index}>
                                                <Form.Control
                                                    id="txtFigName"
                                                    name="figName"
                                                    placeholder="FIG Name"
                                                    className="form-control"
                                                    maxLength={50}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={figData.figName}
                                                    required
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Control
                                                    id="txtFigShortName"
                                                    name="figShortName"
                                                    placeholder="FIG Short Name"
                                                    className="form-control"
                                                    maxLength={20}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={figData.figShortName}
                                                />
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="countryCode"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={figData.countryCode}
                                                    required
                                                >
                                                    <option value=''>Select Country</option>
                                                    {countryList.map((option, index) => (
                                                        <option key={index} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <Form.Select
                                                    type="text"
                                                    name="stateCode"
                                                    className="form-control"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={figData.stateCode}
                                                    required
                                                >
                                                    <option value=''>Select State</option>
                                                    {stateList[index] && stateList[index].map((option, mapIndex) => (
                                                        <option key={mapIndex} value={option.value}>{option.key}</option>
                                                    ))}
                                                </Form.Select>
                                            </td>

                                            <td key={index} >
                                                <Form.Control
                                                    id="txtAddress"
                                                    name="address"
                                                    placeholder="Address"
                                                    className="form-control"
                                                    maxLength={250}
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={figData.address}
                                                />
                                            </td>

                                            <td key={index} >
                                                <Form.Select
                                                    id="txtStatus"
                                                    name="activeStatus"
                                                    onChange={(e) => handleFieldChange(e, index)}
                                                    value={figData.activeStatus}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Suspended">Suspended</option>
                                                </Form.Select>
                                            </td>

                                            <td key={index}>
                                                <FontAwesomeIcon icon={'trash'} className="fa-2x" onClick={() => { ModalPreview(figData.encryptedFigCode, figData.figName) }} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Form>
                    </Card.Body>
                }
            </Card>
        </>
    )
}

export default AddFig;