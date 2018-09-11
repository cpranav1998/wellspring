import React, { Component } from 'react';
import SplitterLayout from 'react-splitter-layout';
import Editor from './editor.js';
import './App.css';
import {
  HashRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'
import RouteWithProps from './routeWithProps'
import ListeningModalWindow from './listeningTool'
//import { Container,Segment, Tab, Grid } from 'semantic-ui-react'
import { Select, Button, Modal, Menu, Card, Row, Col, Tabs } from 'antd';
import List from './listComponent.js'
const electron = window.require('electron');
const fs = electron.remote.require('fs');
const {dialog} = electron.remote;
const ipcRenderer  = electron.ipcRenderer;
const fountain = require('./fountain.js');
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: "Enter your text here",
      preview: fountain.parse("Your processed output can be previewed here"),
      filepath: "",
      current: 'notes',
      tokens: [],
      locations: [],
      dialogs:[],
      listeningTool: false
    }
    this.fountainToHTML = this.fountainToHTML.bind(this);
    this.locationOrNotes = this.locationOrNotes.bind(this);
    this.goToLine = this.goToLine.bind(this);
    this.getEditorInstance = this.getEditorInstance.bind(this);
    this.editor = null;
    this.showModal.bind(this.showModal);
  };
  componentDidMount() {
    console.log(fs)
    ipcRenderer.on('openNewFile', (event) => {
      this.setState({source:""});
      this.setState({filepath:""});
    });
    ipcRenderer.on('openFile', (event) => {
      dialog.showOpenDialog({
        properties: ['openFile']
      },(file) => {
        console.log(file[0]); 
        if(file === undefined) { 
          return
        }
        var textByLine = null
        if (file !== undefined) {
          var text = fs.readFileSync(file[0]).toString('utf-8');
          textByLine = text.split("\n");
          this.setState({source:textByLine});
          this.setState({filepath: file[0]});
        }
      })
    });
    ipcRenderer.on('saveFile', (event) => {
      if(this.state.filepath == "") {
        dialog.showSaveDialog({
          properties: ['openFile']
        },(file) => {
          console.log(file[0]); 
          if(file === undefined) { 
            return
          }
          if (file !== undefined) {
            fs.writeFile(file[0], this.state.source);
            this.setState({filepath:file[0]});
          }
        })
      }
      else {
        fs.writeFile(this.state.filepath, this.state.source);
      }
      
    });
    ipcRenderer.on('saveFile', (event) => {
      dialog.showSaveDialog({
        properties: ['openFile']
      },(file) => {
        if(file === undefined) { 
          return
        }
        if (file !== undefined) {
          fs.writeFile(file[0], this.state.source);
        }
      })
    });
    ipcRenderer.on('exportFile', (event) => {
      console.log('in ipcRenderer')
      dialog.showSaveDialog({
        properties: ['openFile']
      },(file) => {
        console.log('in dialog')
        if(file === undefined) { 
          console.log('file invalid')
          return
        }
        if (file !== undefined) {
          console.log('file valid!')          
          ipcRenderer.send('htmlToPdf', file[0], 
            this.state.preview.html.title_page + this.state.preview.html.script, 
            () =>{console.log('callback valid')});
        }
      })
    });
    ipcRenderer.on('openListeningTool', (event) => {
      if (this.state.dialogs != []){
        this.setState({listeningTool: true})
    }});
  }
  componentDidUpdate(){
    console.log(this.state.current)
  }
  fountainToHTML = (value) => {
    let sourceText = this.state.source
    let sourceLines = sourceText.split(/\r?\n/)
    console.log("in fountain")
    let tokens = []
    let locations = []
    let dialogs = []
    fountain.parse(value, true, (output)=> {
      let items = Object.values(output)[2]
      for(let i = 0; i < items.length; i++){
        let item = Object.values(items[i])
        if(item[0] == 'scene_heading'){
          tokens.push(item[1])
        }
      }
      for(let i = 0; i < tokens.length; i++){
        let j = 0
        for(j = 0; j < sourceLines.length; j++){
          if(sourceLines[j].includes(tokens[i])){
            locations.push(j)
            break;
          }
        }
      }
      console.log(locations)
      let dialogObject = {character:"",dialog:""}
      let readFlag = false
      for(let i = 0; i < items.length; i++){
        let item = Object.values(items[i])
        if(item[0] == 'dialogue_begin'){
          readFlag = true
        }
        if(readFlag == true && item[0] == 'character'){
          dialogObject.character = item[1]
        }
        if(readFlag == true && item[0] == 'dialogue'){
          dialogObject.dialog = item[1]
        }
        if(item[0] == 'dialogue_end'){
          let pushableObject = {character:dialogObject.character, dialog:dialogObject.dialog}
          dialogs.push(pushableObject)
          dialogObject.character = ""
          dialogObject.dialog = ""
          readFlag = false
        }
      }
    })
    let preview = null
    try {
      preview = fountain.parse(value)
    }
    catch(error) {
      preview = this.state.preview
      // expected output: SyntaxError: unterminated string literal
      // Note - error messages will vary depending on browser
    }
    console.log(dialogs)
    this.setState({source:value, preview: preview,tokens:tokens,locations:locations,dialogs:dialogs})
    // this.state.source = value
    // this.state.preview = fountain.parse(value) 
    //console.log(this.state.preview.html.title_page)
    //console.log(this.state.preview.html.script)
    //this.forceUpdate();
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
  sidebarPadding = {
    "background-color":"white",
    "height":"100%",
    "float": "none",
    "clear":"both",
    "padding-top": "40px",
    "-webkit-user-select": "none",
  }
  goToLine= (i) => {
    this.editor.setCursor(this.state.locations[i],0)
  }
  locationOrNotes = () => {
    console.log('this is really happening')
    if (this.state.current == 'location') {
      let listArray = []
      for(let i=0; i<this.state.tokens.length; i++){
        listArray.push(
          <List text={this.state.tokens[i]} click={() => {this.goToLine(i)}}/>
        )
      }
      return listArray
    }
  }
  getEditorInstance = (editor) => {
    this.editor = editor
  }
  handleNoOutput = () => {
    if(this.state.preview.html===undefined) {
      return "Your processed output can be previewed here"
    }
    else {
      try{
        return this.state.preview.html.title_page + this.state.preview.html.script
      }
      catch(error) {
        return ""
      }
    }
  }
  selectVoices = () => {

  }
  showModal = () => {
    if (this.state.listeningTool) {
      return (
        <ListeningModalWindow dialogs={this.state.dialogs} listeningTool={this.state.listeningTool}/>
      );
    }
  }
  render() {
    const SubMenu = Menu.SubMenu;
    const MenuItemGroup = Menu.ItemGroup;
    const TabPane = Tabs.TabPane;
    // const panes = [
    //   { menuItem: 'Tab 1', render: () => <Tab.Pane attached='top'><Container attached='bottom' style={{height:"500px"}}/></Tab.Pane> },
    //   { menuItem: 'Tab 2', render: () => <Tab.Pane attached='top'><Container attached='bottom' style={{height:"500px"}}/></Tab.Pane> }
    // ]
    return (
      <div className="App">
        {this.showModal()}
        <SplitterLayout percentage={true} style = {{"overflow-y": "hidden"}} primaryIndex={1} secondaryInitialSize={60}>
          <div>
            <SplitterLayout percentage={true} style = {{"overflow-y": "hidden"}}primaryIndex={1} secondaryInitialSize={30}>
              <div>
                <Menu
                  style={{ position:'fixed', top:'0', width:'100%'}}
                  selectedKeys={[this.state.current]}
                  mode="horizontal"
                >
                  <Menu.Item key="location"
                  onClick={()=>{this.setState({current:'location'})}}>
                    Location
                  </Menu.Item>
                  <Menu.Item key="notes"
                  onClick={()=>{this.setState({current:'notes'})}}>
                    Notes
                  </Menu.Item>
                </Menu>
                {this.locationOrNotes()}
              </div>
              <div className="editor-pane">
                <Editor className="editor" style={this.editorCSS} value={this.state.source} function = {this.fountainToHTML} onMount={this.getEditorInstance}/>
              </div>
            </SplitterLayout>
          </div>
          <div dangerouslySetInnerHTML={{ __html: this.handleNoOutput()}}>
          </div>
        </SplitterLayout>
      </div>
    );
  }
}

export default App;

// style = {this.padding}

// <div className="card-container">
//                   <Tabs type="card">
//                     <TabPane tab="Tab Title 1" key="1">
//                      
//                     </TabPane>
//                     <TabPane tab="Tab Title 2" key="2">
//                       <p>Content of Tab Pane 2</p>
//                       <p>Content of Tab Pane 2</p>
//                       <p>Content of Tab Pane 2</p>
//                     </TabPane>
//                   </Tabs>
//                 </div>

// <Card title="Card title" extra={<a href="#">More</a>} style={{"margin":"10px 10px", position:'relative','z-index':'-5'}}>
//   <p>Card content</p>
// </Card>
// <Card title="Card title" extra={<a href="#">More</a>} style={{"margin":"10px 10px", position:'relative','z-index':'-5' }}>
//   <p>Card content</p>
// </Card>
// <Card title="Card title" extra={<a href="#">More</a>} style={{"margin":"10px 10px", position:'relative','z-index':'-5' }}>
//   <p>Card content</p>
// </Card>
// <Card title="Card title" extra={<a href="#">More</a>} style={{"margin":"10px 10px", position:'relative','z-index':'-5' }}>
//   <p>Card content</p>
// </Card>
// <Card title="Card title" extra={<a href="#">More</a>} style={{"margin":"10px 10px", position:'relative','z-index':'-5' }}>
//   <p>Card content</p>
// </Card>

