import React, { Component } from 'react';
import SplitterLayout from 'react-splitter-layout';
import Editor from './editor.js';
import './App.css';
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const ipcRenderer  = electron.ipcRenderer;
const fountain = require('./fountain.js')

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: "# Hello World",
      preview: fountain.parse("None") 
    }
    this.fountainToHTML = this.fountainToHTML.bind(this)
  };
  fountainToHTML = (value) => {
    console.log("in fountain")
    this.state.preview = fountain.parse(value) 
    console.log(this.state.preview.html.title_page)
    console.log(this.state.preview.html.script)
    this.forceUpdate();
  }
  topBorder = {
    "opacity": 0,
    "background-color":"red",
    "border-top":"30px solid green",
    "-webkit-user-select": "none",
    "-webkit-app-region": "drag",
    "overflow": "hidden"
  }
  previewCSS = {
    "background-color":"white",
    "height":"100%",
    "float": "none",
    "clear":"both",
    "padding-top": "30px",
    "overflow-y": "hidden",
    "-webkit-user-select": "none",
    "-webkit-app-region": "drag"
  }
  editorCSS = {
    "float": "none",
    "height":"100%",
    "clear":"both", 
    "padding-top": "30px",
    "background-color":"#272822",
    "overflow-y": "hidden"
  }
  padding = {
    "background-color":"#272822",
    "height":"100%",
    "float": "none",
    "clear":"both",
    "padding-top": "40px",
    "overflow-y": "hidden",
    "-webkit-user-select": "none",
    "-webkit-app-region": "drag"
  }

  render() {
    return (
      <div className="App">
        <SplitterLayout percentage={true} style = {{"overflow-y": "hidden"}}>
          <div className="editor-pane" style = {this.padding}>
            <Editor className="editor" style={this.editorCSS} value={this.state.source} function = {this.fountainToHTML}/>
          </div>
          <div dangerouslySetInnerHTML={{ __html: this.state.preview.html.title_page + this.state.preview.html.script}} 
            style={this.previewCSS}>

          </div>
        </SplitterLayout>
      </div>
    );
  }
}
//        <div className="drag-area" style={this.topBorder}/>

export default App;
