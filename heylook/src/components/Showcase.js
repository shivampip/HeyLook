import "./Showcase.css";
import React from 'react';
import { render } from '@testing-library/react';
import placeholder from "../images/placeholder.png";
import vplaceholder from "../images/vplaceholder.png";
import mobile_img from "../images/mobile.jpg";
import demo from "../images/sim_image.png";

class Showcase extends React.Component{
    constructor(props){
        super(props);
        this.state= {cwidth: 0, cheight: 0};
        this.imgRef = React.createRef();
    }

    componentDidMount() {
		console.log(this.imgRef);
		this.imgRef.current.addEventListener("load", this.setSpan);
	}

	setSpan = () => {
		console.log(this.imgRef);
		let cHeight = this.imgRef.current.clientHeight;
		let cWidth = this.imgRef.current.clientWidth;
		let width = this.imgRef.current.naturalWidth;
        let height = this.imgRef.current.naturalHeight;
        let contains= true;
        let fwidth= 0;
        let fheight= 0;
        
        console.log("cWidth: "+cWidth);
        console.log("cHeight: "+cHeight);
        console.log("Width: "+width);
        console.log("Height: "+height);
        
        let oRatio = width / height;
        let cRatio = cWidth / cHeight;

        if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
          fwidth = cWidth;
          fheight = cWidth / oRatio;
        } else {
          fwidth = cHeight * oRatio;
          fheight = cHeight;
        }   

        console.log("fWidth: "+fwidth);
        console.log("fHeight: "+fheight);
		this.setState({ cwidth: fwidth, cheight: fheight });
	};
    

    render(){
        return (<div className="showcase">
            <img src={placeholder} ref={this.imgRef} onresize={this.setSpan}/>
            <canvas width={this.state.cwidth} height={this.state.cheight}/>
        </div>);
    }
}

export default Showcase;