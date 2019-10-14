import React from 'react';
import './Pixel.css';
export function Pixel(props) {

    const style = {
        backgroundColor: props.color || '#000'
    }
    return <div style={style} className="grz-pixel"></div>
}