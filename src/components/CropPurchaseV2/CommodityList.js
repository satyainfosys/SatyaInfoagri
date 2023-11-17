import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Table, Form, Modal, Card, Row, Col } from 'react-bootstrap';
import EnlargableTextbox from 'components/common/EnlargableTextbox';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import axios from 'axios';

const CommodityList = () => {

    const dispatch = useDispatch();
    const [rowData, setRowData] = useState([]);

    const columnsArray = [
        'S.No',
        'Crop',
        'Rate',
        'Unit',
        'GD',
        'I/O',
        'TP'
    ]

    return (
        <>
            <Card className="h-100 mb-2">
                <FalconCardHeader
                    title="Commodity List"
                    titleTag="h6"
                    className="py-2"
                    light
                // endEl={
                //     <Flex>
                //         <div >
                //             <Button
                //                 variant="primary"
                //                 size="sm"
                //                 className="btn-reveal"
                //                 type="button"
                //                 onClick={() => handleAddItem()}
                //             >
                //                 Add Items
                //             </Button>
                //         </div>
                //     </Flex>
                // }
                />

                <Card.Body className="position-relative pb-0 p3px tab-page-button-table-card">
                    <Form
                        noValidate
                        // validated={formHasError || (materialDataErr.materialReceiptDetailErr && materialDataErr.materialReceiptDetailErr.invalidMaterialReceiptDetail)}
                        className="details-form"
                        id="AddCropPurchaseDetails"
                    >
                        <Table striped bordered responsive id="TableList" className="no-pb text-nowrap tab-page-table">
                            <thead className='custom-bg-200'>
                                {rowData &&
                                    (<tr>
                                        {columnsArray.map((column, index) => {
                                            return (
                                                <th className="text-left" key={index}>
                                                    {column}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                    )}
                            </thead>
                        </Table>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}

export default CommodityList