import React, { Component } from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2'
require('codemirror/lib/codemirror.css');
require('codemirror/theme/monokai.css');
class Editor extends Component {
  constructor(props) {
    super(props);
    this.instance = null;
  }
  render() {
    var options = {
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true
    }
    return (
      <CodeMirror
        value={this.props.value}
        options={options}
        onChange={(editor, data, value) => {
          console.log(this.props.i)
          this.props.function(value)
        }}
        editorDidMount={editor => { this.instance = editor;
          this.props.onMount(this.instance);}}
      />
    );
  }
}
export default Editor;