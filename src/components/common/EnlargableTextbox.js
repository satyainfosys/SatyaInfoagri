import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';

export const EnlargableTextbox = (props) => {
    const [enlarged, setEnlarged] = useState(false);
    const inputRef = useRef(null);
    const [originalWidth, setOriginalWidth] = useState(0);
  
    useEffect(() => {
        setOriginalWidth(inputRef.current.offsetWidth);
    }, []);
  
    const toggleEnlarged = () => {
      setEnlarged(!enlarged);
    };
  
    const calculateWidth = () => {
      const minWidth = originalWidth > 60 ? originalWidth : 60;
      const enlargedWidth = `${props.value.length * 14}px`;
      return (props.value.length * 13) > minWidth && enlarged ? enlargedWidth : '100%';
    };
  
    return (
        <Form.Control
          type="text"
          id={props.id}
          name={props.name}
          value={props.value}
          className={props.className}
          style={{ width: calculateWidth() }}
          onFocus={toggleEnlarged}
          onBlur={toggleEnlarged}
          onChange={props.onChange}
          ref={inputRef}
          placeholder={props.placeholder}
          required={props.required ? props.required : false}
          maxLength={props.maxLength}
        />
    );
  };

  export default EnlargableTextbox;