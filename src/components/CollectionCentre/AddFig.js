import React, { useState, useEffect } from 'react'
import { Button, Table, Form, Modal, Card } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import Flex from 'components/common/Flex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const AddFig = () => {

    const [rowData, setRowData] = useState([]);

    const emptyRow = {
        id: rowData.length + 1,
        figName: '',
        figShortName: '',
        stateCode: '',
        address: '',
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

    const handleAddRow = async () => {
        const updatedRowData = [...rowData];
        updatedRowData.unshift(emptyRow)
        setRowData(updatedRowData);
    };

    return (
        <>
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

                <Card.Body className="position-relative pb-0 p3px full-tab-card-body">
                    <Form
                        noValidate
                        // validated={formHasError || (farmerError.familyErr && farmerError.familyErr.invalidFamilyDetail)}
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
                                            />
                                        </td>

                                        <td key={index}>
                                            <Form.Control
                                                id="txtFigShortName"
                                                name="figShortName"
                                                placeholder="FIG Short Name"
                                                className="form-control"
                                                maxLength={20}
                                            />
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                type="text"
                                                id="txtCountry"
                                                name="countryCode"
                                                className="form-control"
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            // value={familyDetailData.farmerMemberRelation}
                                            // required
                                            >
                                                <option value=''>Select Country</option>
                                            </Form.Select>
                                        </td>

                                        <td key={index}>
                                            <Form.Select
                                                type="text"
                                                id="txtState"
                                                name="stateCode"
                                                className="form-control"
                                            // onChange={(e) => handleFieldChange(e, index)}
                                            // value={familyDetailData.farmerMemberRelation}
                                            // required
                                            >
                                                <option value=''>Select State</option>
                                            </Form.Select>
                                        </td>

                                        <td key={index} >
                                            <Form.Control
                                                id="txtAddress"
                                                name="address"
                                                placeholder="Address"
                                                className="form-control"
                                                maxLength={50}
                                            />
                                        </td>

                                        <td key={index} >
                                            <Form.Select id="txtStatus" name="status" >
                                                <option value="Active">Active</option>
                                                <option value="Suspended">Suspended</option>
                                            </Form.Select>
                                        </td>

                                        <td>
                                            <FontAwesomeIcon icon={'trash'} className="fa-2x" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

export default AddFig