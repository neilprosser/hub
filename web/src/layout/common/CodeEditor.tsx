import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/elegant.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/go/go';
import 'codemirror-rego/mode';

import classnames from 'classnames';
import { isUndefined } from 'lodash';
import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';

import styles from './CodeEditor.module.css';

interface Props {
  value: string;
  mode: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CodeEditor: React.ElementType = (props: Props) => {
  const isDisabled = !isUndefined(props.disabled) && props.disabled;

  return (
    <CodeMirror
      className={classnames('border position-relative', styles.code, { [styles.disabled]: isDisabled })}
      value={props.value}
      options={{
        mode: {
          name: props.mode,
          json: true,
          statementIndent: 2,
        },
        theme: 'elegant',
        lineNumbers: true,
        inputStyle: 'contenteditable',
        viewportMargin: Infinity,
        readOnly: isDisabled ? 'nocursor' : false,
        tabindex: 0,
      }}
      editorDidMount={(editor) => {
        editor.setSize('', '100%');
      }}
      onBeforeChange={(editor: any, data: any, value: string) => {
        props.onChange(value);
      }}
    />
  );
};

export default CodeEditor;
