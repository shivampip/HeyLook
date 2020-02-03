import "./Showcase.css";
import React from 'react';
import { render } from '@testing-library/react';
import demo_image from "../images/sim_image.png";
import mobile_img from "../images/mobile.jpg";

class Showcase extends React.Component{

    render(){
        return (<div className="showcase">
            <img src={mobile_img}/>
            <canvas />
        </div>);
    }
}

export default Showcase;