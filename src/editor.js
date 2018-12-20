import React, { Component } from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2'
require('codemirror/lib/codemirror.css');
require('codemirror/theme/monokai.css');
class Editor extends Component {
  constructor(props) {
    super(props);
    this.instance = null;
    this.makeMarker = this.makeMarker.bind(this);
  }
  makeMarker = () => {
    let marker = document.createElement("div");
    marker.style.color = "#00DCFF";
    marker.innerHTML = "●";
    return marker;
  };
  render() {
    var options = {
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true
    }
    return (
      <CodeMirror
        autoCursor = {false}
        value={this.props.value}
        options={options}
        gutters= {["CodeMirror-linenumbers"]}
        onChange={(editor, data, value) => {
          console.log(this.props.i)
          this.props.function(value)
        }}
        onGutterClick = {(editor, lineNumber, gutter, event) => {
          let info = this.instance.lineInfo(lineNumber);
          this.instance.setGutterMarker(lineNumber, "CodeMirror-linenumbers", info.gutterMarkers? null : this.makeMarker());
        }}
        editorDidMount={editor => { this.instance = editor;
          this.props.onMount(this.instance);}}
      />
    );
  }
}
export default Editor;