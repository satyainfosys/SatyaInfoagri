import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../actions/index';
import ReCAPTCHA from "react-google-recaptcha";
import $ from 'jquery';

const LoginForm = ({ hasLabel }) => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    remember: false
  });
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaErr, setCaptchaErr] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleCaptchaValidation = () => {
    let isValid = true;
    var captchaResponse = $("form").find("[name='g-recaptcha-response']").first().val();

    if (!captchaResponse) {
      isValid = false;
      setValidated(true);
      setCaptchaErr("Please verify captcha");
    }
    else
      setCaptchaErr('');

    return isValid;
  }

  const handleSubmit = e => {
    e.preventDefault();
      const form = e.currentTarget;
      if (form.checkValidity() === false || 
          !handleCaptchaValidation()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        const userData = {
          userId: formData.userId,
          loginPassword: formData.password
        }
        dispatch(loginAction(userData));
        setIsLoading(true);
        axios.post(process.env.REACT_APP_API_URL + '/login', userData)
          .then(res => {
            setIsLoading(false)
            if (res.data.status == 200) {
              toast.success(`Logged in as ${formData.userId}`, {
                theme: 'colored',
                autoClose: 10000
              });
              setLocalStorages(res.data.data);
              setTimeout(() => {
                window.location.href = "/dashboard";
              }, 1000);
            } 
            else if(res.data.data.emailSent){
              toast.warning(res.data.message, {
                theme: 'colored',
                autoClose: 10000
              });
            }
            else {
              toast.error(res.data.message, {
                theme: 'colored',
                autoClose: 10000
              });
            }
          })
      }
    
    setValidated(true);
  };
  const setLocalStorages = (data) => {
    let isRememberMe = $('#rememberMe').prop('checked');
    let expiration = isRememberMe ? 31556952000 : 3600000;  // if remember me checked then user will be logged in for 1 year otherwise user will be loggout every hour.
    const config = {
      value: data.token,
      expiry: new Date().getTime() + expiration,
    }
    localStorage.setItem('Token', JSON.stringify(config));
    localStorage.setItem('EncryptedSecurityUserId', data.encryptedSecurityUserId);
    localStorage.setItem('EncryptedClientCode', data.encryptedClientCode);    
    localStorage.setItem('LoginUserName', data.loginUserName);
    localStorage.setItem('LoginUserEmailId', data.loginUserEmailId);
    localStorage.setItem('LoginUserMobileNumber', data.loginUserMobileNumber);
    localStorage.setItem('NoOfCompany', data.noOfCompany);
    localStorage.setItem('GSTNumber', data.gstNumber);
    localStorage.setItem('Name', data.name);
    if(data.distributionCentreCode)
    {
      localStorage.setItem('DistributionCenterCode',data.distributionCentreCode);
    }
    if(data.collectionCentreCode)
    {
      localStorage.setItem('CollectionCentreCode', data.collectionCentreCode);
    }
    if(data.companyCode)
    {
      localStorage.setItem('CompanyCode', data.companyCode);
    }
    if(data.encryptedCompanyCode)
    {
      localStorage.setItem('EncryptedCompanyCode', data.encryptedCompanyCode);
    }
  };

  const handleFieldChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (

    <>
      {isLoading ? (
        <Spinner
          className="position-absolute start-50 loader-color"
          animation="border"
        />
      ) : null}

      <Form noValidate validated={validated} onSubmit={e => { handleSubmit(e) }}>
        <Form.Group className="mb-3">
          {hasLabel && <Form.Label>username, email or phone number</Form.Label>}
          <Form.Control
            placeholder={'Username, email or phone number'}
            value={formData.userId}
            name="userId"
            maxLength="50"
            onChange={handleFieldChange}
            type="text"
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide username, email or phone number
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          {hasLabel && <Form.Label>Password</Form.Label>}
          <Form.Control
            placeholder={hasLabel ? 'Password' : ''}
            value={formData.password}
            name="password"
            onChange={handleFieldChange}
            type="password"
            required
          />

          <Form.Control.Feedback type="invalid">
            Please provide password
          </Form.Control.Feedback>
        </Form.Group>

        <Row className="justify-content-between align-items-center">
          <Col xs="auto">
            <Form.Check type="checkbox" id="rememberMe" className="mb-0">
              <Form.Check.Input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={e =>
                  setFormData({
                    ...formData,
                    remember: e.target.checked
                  })
                }
              />
              <Form.Check.Label className="mb-0 text-700">
                Remember me
              </Form.Check.Label>
            </Form.Check>
          </Col>

          <Col xs="auto">
            <Link
              className="fs--1 mb-0"
              to={`/forgot-password`}
            >
              Forgot Password?
            </Link>
          </Col>
        </Row>

        <Form.Group className="mt-3">
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          />
          { captchaErr ? <p className="form-error">{captchaErr} </p> : null }
        </Form.Group>
        
        <Form.Group>
          <Button type="submit" color="primary" className="mt-3 w-100">
            Log in
          </Button>
        </Form.Group>
      </Form>
    </>
  );
};

LoginForm.propTypes = {
  layout: PropTypes.string,
  hasLabel: PropTypes.bool
};

LoginForm.defaultProps = {
  layout: 'simple',
  hasLabel: false
};

export default LoginForm;