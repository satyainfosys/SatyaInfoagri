import React, { useState, useEffect } from 'react'
import TabPage from 'components/common/TabPage';
import axios from 'axios';
import { Spinner, Modal, Button } from 'react-bootstrap';
import { productMasterDetailsAction } from 'actions';
import { useSelector, useDispatch } from 'react-redux';

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

    const dispatch = useDispatch();
    const [listData, setListData] = useState([]);
    const [perPage, setPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(false);
    const [formHasError, setFormError] = useState(false);
    const [activeTabName, setActiveTabName] = useState();
    const [modalShow, setModalShow] = useState(false);

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


    const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
    var formChangedData = formChangedReducer.formChanged;

    let isFormChanged = Object.values(formChangedData).some(value => value === true);

    $('[data-rr-ui-event-key*="Product Master List"]').off('click').on('click', function () {
        $("#btnNew").show();
        $("#btnSave").hide();
        $("#btnCancel").hide();
        $('[data-rr-ui-event-key*="Add Product Master"]').attr('disabled', true);
        // $('#AddProductLineDetailForm').get(0).reset();
        dispatch(productMasterDetailsAction(undefined));
    })

    $('[data-rr-ui-event-key*="Add Product Master"]').off('click').on('click', function () {
        setActiveTabName("Add Product Master")
        $("#btnNew").hide();
        $("#btnSave").show();
        $("#btnCancel").show();

        // if (productCategoryDetailData.length <= 0 &&
        //     !(localStorage.getItem("DeleteProductCategoryCodes")) &&
        //     (localStorage.getItem("EncryptedProductCode") ||
        //         productLineData.encryptedProductCode)) {
        //     getProductCategoryList();
        // }
    })

    const newDetails = () => {
        $('[data-rr-ui-event-key*="Add Product Master"]').attr('disabled', false);
        $('[data-rr-ui-event-key*="Add Product Master"]').trigger('click');
        $('#btnSave').attr('disabled', false);
    }

    const cancelClick = () => {
        $('#btnExit').attr('isExit', 'false');
        if (isFormChanged) {
            setModalShow(true);
        }
        else {
            $('[data-rr-ui-event-key*="Product Master List"]').trigger('click');
        }
    }

    const exitModule = () => {
        $('#btnExit').attr('isExit', 'true');
        if (isFormChanged) {
            setModalShow(true);
        }
        else {
            window.location.href = '/dashboard';
        }
    }

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
                newDetails={newDetails}
                // saveDetails={productLineData.encryptedProductCode ? updateProductLineDetails : addProductLineDetails}
                cancelClick={cancelClick}
                exitModule={exitModule}
            />
        </>
    )
}

export default ProductMaster