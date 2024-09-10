import BaseExtractNode from './BaseExtractNode';

function CSVExtractNode(props) {
  return <BaseExtractNode {...props} type="csv" />;
}

function JSONExtractNode(props) {
    return <BaseExtractNode {...props} type="json" />;
  }
  
function XMLExtractNode(props) {
    return <BaseExtractNode {...props} type="xml" />;
  }
  
function XLSXExtractNode(props) {
    return <BaseExtractNode {...props} type="xlsx" />;
  }
  
export  {CSVExtractNode, JSONExtractNode, XMLExtractNode, XLSXExtractNode};