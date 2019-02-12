import React from 'react';
import Editor from './editor';
import { collectionEditor } from '../../types';

const CollectionEditor = props => (
  <Editor
    route={`cms/${props.id}`}
    collection={props.id}
    editorFields={props.fields}
  />
);

CollectionEditor.propTypes = collectionEditor;

export default CollectionEditor;
