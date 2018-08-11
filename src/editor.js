import React, { Component } from 'react';
import {UnControlled as CodeMirror} from 'react-codemirror2'
require('codemirror/lib/codemirror.css');
require('codemirror/mode/markdown/markdown');
require('codemirror/theme/monokai.css');
class Editor extends Component {
  constructor(props) {
    super(props);
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
          console.log("in editor")
          this.props.function(value)
        }}
      />
    );
  }
}
export default Editor;