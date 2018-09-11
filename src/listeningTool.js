import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'
import * as Scroll from 'react-scroll';
import { Select, Button, Modal, Menu, Card, Row, Col, Tabs } from 'antd';
import {Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
var levenshtein = require('fast-levenshtein');
export default class ListeningModalWindow extends Component {
	constructor(props) {
		super(props)
		this.selectVoices.bind(this.selectVoices);
	}
	selectVoices = () => {
		let characters = this.props.dialogs.map(dialog => dialog.character.match(/[^(]*/)[0].trim())
		console.log(characters)
		// for(let i = 0; i < characters.length; i++){
		// 	for(let j = 0; j < characters.length; j++){
		// 		if(levenshtein.get(characters[i], characters[j]) > 1){
		// 			characters.splice(j,1)
		// 		}
		// 	}
		// }
		let uniqueCharacters = Array.from(new Set(characters));
		console.log(uniqueCharacters)
		
	}
	render() {
	    return (
	    	<Modal
	    	  title="Listen"
	    	  visible={this.props.listeningTool}
	    	  closable={false}
	    	  destroyOnClose={true}
	    	  maskClosable={false}
	    	  width={900}
	    	  footer={<Button key="back" onClick={()=>this.setState({listeningTool:false})}>Return</Button>}
	    	>
	    	  <Row>
	    	    <Col span={12}>
	    	      <div style={{height:"70%"}}>
	    	        <Element name="test7" className="element" id="containerElement" style={{
	    	          position: 'relative',
	    	          height: '250px',
	    	          overflow: 'scroll'
	    	        }}>
	    	          {this.selectVoices()}
	    	          <Element id="firstInsideContainer" style={{
	    	          }}>
	    	            first element inside container
	    	          </Element>

	    	          <Element id="secondInsideContainer" style={{
	    	          }}>
	    	            second element inside container
	    	          </Element>
	    	        </Element>
	    	      </div>
	    	      <div style={{height:"30%"}}>
	    	      lmao
	    	      </div>
	    	    </Col>
	    	    <Col span={12}>
	    	      <Element name="test7" className="element" id="containerElement" style={{
	    	        position: 'relative',
	    	        height: '280px',
	    	        overflow: 'scroll'
	    	      }}>
	    	        <Element id="firstInsideContainer" style={{
	    	        }}>
	    	          first element inside container
	    	        </Element>

	    	        <Element id="secondInsideContainer" style={{
	    	        }}>
	    	          second element inside container
	    	        </Element>
	    	      </Element>
	    	    </Col>
	    	  </Row>
	    	</Modal>
	    );
	}
    
}
