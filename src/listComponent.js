import React, { Component } from 'react'
import { Divider } from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'
const bgColors = {
  default: '#000000',
  hover: '#0093FF',
}
export default class List extends Component {
	constructor(props) {
		super(props)
		this.state = {hover: false}
	}
	toggleHover = () => {
		this.setState({ hover: !this.state.hover })
	}
	render() {
	    return (
	    	<div>
		    		<h5 onClick={() => {this.props.click(this.props.i)}}
		    			style={{"font-family": "-apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
		    					'padding-top': '0px',
		    					'padding-right': '0px',
		    					'padding-bottom': '0px',
		    					'padding-left': '20px',
		    					'color': this.state.hover ? bgColors.hover : bgColors.default}}
		    			onMouseEnter={this.toggleHover}
		    			onMouseLeave={this.toggleHover}
		    		>{this.props.text}</h5>
		    	<Divider />
		    </div>
	    );
	}
    
}
