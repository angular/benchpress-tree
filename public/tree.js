var maxDepth = getIntParameter('depth');
var baselineRootTreeComponent;
var count = 0;

var BASELINE_TREE_TEMPLATE = createTemplate(
    '<span>_<template class="ng-binding"></template><template class="ng-binding"></template></span>');
var BASELINE_IF_TEMPLATE = createTemplate(
    '<span template="if"><tree></tree></span>');

function createTemplate (html) {
  var t = document.createElement('template');
  t.innerHTML = html;
  return t;
}

function getIntParameter(name) {
  return parseInt(getStringParameter(name), 10);
}

function getStringParameter(name) {
  var els = document.querySelectorAll('input[name="'+name+'"]');
  var value;
  var el;

  for (var i=0; i<els.length; i++) {
    el = els[i];
    var type = el.type;
    if ((type !== 'radio' && type !== 'checkbox') || el.checked) {
      value = el.value;
      break;
    }
  }

  if (isBlank(value)) {
    throw new Error('Could not find and input field with name '+name+'}');
  }

  return value;
}

function isBlank(obj) {
  return obj === undefined || obj === null;
}

function baselineDestroyDom() {
  baselineRootTreeComponent.update(new TreeNode('', null, null));
}
function baselineCreateDom() {
  var values = count++ % 2 == 0 ? ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*'] : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', '-'];
  baselineRootTreeComponent.update(buildTree(maxDepth, values, 0));
}
function initBaseline() {
  var tree = document.createElement('tree');
  document.querySelector('baseline').appendChild(tree);
  baselineRootTreeComponent = new BaseLineTreeComponent(tree);

  bindAction('#baselineDestroyDom', baselineDestroyDom);
  bindAction('#baselineCreateDom', baselineCreateDom);
}
function bindAction(selector, callback) {
  var el = document.querySelector(selector);
  el.addEventListener('click', function callbackWrapper() {
    callback();
  });
}

function buildTree(maxDepth, values, curDepth) {
  if (maxDepth === curDepth) return new TreeNode('', null, null);
  return new TreeNode(
      values[curDepth],
      buildTree(maxDepth, values, curDepth+1),
      buildTree(maxDepth, values, curDepth+1));
}

function TreeNode (value, left, right) {
  // value:string;
  // left:TreeNode;
  // right:TreeNode;
  this.value = value;
  this.left = left;
  this.right = right;
}

function BaseLineTreeComponent (element) {
  // element:Element;
  // value:BaseLineInterpolation;
  // left:BaseLineIf;
  // right:BaseLineIf;
  
  this.element = element;
  var clone = BASELINE_TREE_TEMPLATE.content.firstChild.cloneNode(true);
  var shadowRoot = this.element.createShadowRoot();
  shadowRoot.appendChild(clone);
  var child = clone.firstChild;
  this.value = new BaseLineInterpolation(child);
  child = child.nextSibling;
  this.left = new BaseLineIf(child);
  child = child.nextSibling;
  this.right = new BaseLineIf(child);
}
BaseLineTreeComponent.prototype.update = function(value) {
  this.value.update(value.value);
  this.left.update(value.left);
  this.right.update(value.right);
}

function BaseLineInterpolation (textNode) {
  this.value = null;
  this.textNode = textNode;
}

BaseLineInterpolation.prototype.update = function(value) {
  if (this.value !== value) {
    this.value = value;
    this.textNode.textContent =  value + ' ';
  }
}

function BaseLineIf (anchor) {
  // condition:boolean;
  // component:BaseLineTreeComponent;
  // anchor:Element;
  
  this.anchor = anchor;
  this.condition = false;
  this.component = null;
}

function isPresent(obj) {
  return obj !== undefined && obj !== null;
}

BaseLineIf.prototype.update = function (value) {
  var newCondition = isPresent(value);
  if (this.condition !== newCondition) {
    this.condition = newCondition;
    if (isPresent(this.component)) {
      this.component.element.parentNode.remove(this.component.element);
      this.component = null;
    }
    if (this.condition) {
      var element = BASELINE_IF_TEMPLATE.cloneNode(true).content.firstChild;
      this.anchor.parentNode.insertBefore(element, this.anchor.nextSibling);
      this.component = new BaseLineTreeComponent(element.firstChild);
    }
  }
  if (isPresent(this.component)) {
    this.component.update(value);
  }
}

initBaseline();