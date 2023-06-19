import React, { useState, useEffect } from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import Treeview from 'components/common/Treeview';
import { formChangedAction, productDetailsAction, selectedProductsAction } from '../../actions/index';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export const ProductDetails = () => {

  const [formHasError, setFormError] = useState(false);
  const [treeViewItems, setTreeViewItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  var selectedItems = [];
  
  const setSelectedItems = (seletedTreeViewItems) => {
    dispatch(selectedProductsAction(seletedTreeViewItems));
    selectedItems = seletedTreeViewItems;
  }

  const fetchMenuTree = async () => {
    let token = localStorage.getItem('Token');

    const encryptedModuleCode = {
      encryptedModuleCode: localStorage.getItem("EncryptedResponseModuleCode") ? localStorage.getItem("EncryptedResponseModuleCode") : ''
    }

    setIsLoading(true);
    await axios
      .post(process.env.REACT_APP_API_URL + '/get-security-menu-tree-master-list', encryptedModuleCode, {
        headers: { Authorization: `Bearer ${JSON.parse(token).value}` }
      })
      .then(res => {
        setIsLoading(false);
        if (res.data.status == 200) {
          setTreeViewItems(res.data.data);
        }
      });
  };

  useEffect(() => {
    fetchMenuTree();
  }, []);

  const resetProductDetail = () => {
    dispatch(productDetailsAction({
      "moduleName": "",
      "status": "Active"
    }))
  }  

  const productDetailsReducer = useSelector((state) => state.rootReducer.productDetailsReducer)
  var productData = productDetailsReducer.productDetails;

  const productDetailsErrorReducer = useSelector((state) => state.rootReducer.productDetailsErrorReducer)
  const productError = productDetailsErrorReducer.productDetailsError;

  const formChangedReducer = useSelector((state) => state.rootReducer.formChangedReducer)
  var formChangedData = formChangedReducer.formChanged;

  if (!productDetailsReducer.productDetails ||
    productDetailsReducer.productDetails.length <= 0) {
    resetProductDetail();
  }

  const handleFieldChange = e => {
    dispatch(productDetailsAction({
      ...productData,
      [e.target.name]: e.target.value
    }));

    if(productData.encryptedModuleCode){
      dispatch(formChangedAction({
        ...formChangedData,
        productUpdate: true
      }))
    }else{
      dispatch(formChangedAction({
        ...formChangedData,
        productAdd: true
      }))
    }
  }

  return (
    <>
      {productData &&
        <Form noValidate validated={formHasError} className="details-form" id='AddProductDetailsForm'>
          <Row>
            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control id="txtModuleName" name="moduleName" maxLength={30} value={productData.moduleName} onChange={handleFieldChange} />
                {Object.keys(productError.moduleNameErr).map((key) => {
                  return <span className="error-message">{productError.moduleNameErr[key]}</span>
                })}
              </Row>
              <Row className="mb-3">
                <Treeview
                  data={treeViewItems}
                  selection
                  defaultSelected={[]}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  // expanded={['1', '2', '3', '7', '18']}
                />
              </Row>

            </Col>
            <Col className="me-3 ms-3">
              <Row className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select id="txtStatus" name="status" value={productData.status} onChange={handleFieldChange}>
                  <option value="Active" selected>Active</option>
                  <option value="Suspended">Suspended</option>
                </Form.Select>
              </Row>
            </Col>
          </Row>
        </Form>
      }

    </>
  )
}

export default ProductDetails;