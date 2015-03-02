var maxDepth;
var rootTreeComponent;
var count = 0;

initBaseline();

function initBaseline() {
  var depthInput = document.querySelector('input[name=depth]');
  var match = /depth=(\w+)/.exec(decodeURIComponent(location.search));
  if (match) {
    depthInput.value = match[1];
  }
  maxDepth = depthInput.valueAsNumber;

  var tree = document.createElement('tree');
  rootTreeComponent = new TreeComponent(tree);
  document.querySelector('baseline').appendChild(tree);

  document.querySelector('#destroyDom').addEventListener('click', destroyDom);
  document.querySelector('#createDom').addEventListener('click', createDom);
}

function destroyDom() {
  rootTreeComponent.update({
    value:'', 
    left: null, 
    right: null
  });
}

function createDom() {
  count++;
  rootTreeComponent.update(buildTree(maxDepth, count %2 ? 'a':'0', 0));
}

function buildTree(maxDepth, startCharacter, curDepth) {
  if (maxDepth === curDepth) {
    return {
      value: '',
      left: null,
      right: null
    };
  }
  return {
    value: String.fromCharCode(startCharacter.charCodeAt(0)+curDepth),
    left: buildTree(maxDepth, startCharacter, curDepth+1),
    right: buildTree(maxDepth, startCharacter, curDepth+1)
  };
}
