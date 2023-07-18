import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';

const tabArray = ['Product Master List', 'Add Product Master'];

const listColumnArray = [
    { accessor: 'sl', Header: 'S. No' },
    { accessor: 'code', Header: 'Code' },
    { accessor: 'productLine', Header: 'Product Line' },
    { accessor: 'productCategory', Header: 'Product Category' },
    { accessor: 'productName', Header: 'Product Name' },
    { accessor: 'status', Header: 'Active Status' }
];

const ProductMaster = () => {

    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProductMasterList = async (page, size = perPage) => {
        let token = localStorage.getItem('Token');

        const listFilter = {
            pageNumber: page,
            pageSize: size
        };

        setIsLoading(true);
        await axios.post(process.env.REACT_APP_API_URL + '/get-product-master-list', listFilter, {
            headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
        })
            .then(res => {
                setIsLoading(false);
                if (res.data.status == 200) {
                    setListData(res.data.data);
                } else {
                    setListData([])
                }
            });
    }

    useEffect(() => {
        fetchProductMasterList(1);
        $('[data-rr-ui-event-key*="Add Product Master"]').attr('disabled', true);
    }, []);

    return (
        <>
            {isLoading ? (
                <Spinner
                    className="position-absolute start-50 loader-color"
                    animation="border"
                />
            ) : null}

            <TabPage
                listData={listData}
                tabArray={tabArray}
                listColumnArray={listColumnArray}
                module="ProductMaster"
            // newDetails={newDetails}
            // saveDetails={productLineData.encryptedProductCode ? updateProductLineDetails : addProductLineDetails}
            // cancelClick={cancelClick}
            // exitModule={exitModule}
            />
        </>
    )
}

export default ProductMaster