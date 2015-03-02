var BASELINE_TREE_TEMPLATE = createTemplate(
    '<div><div class="value">_</div><template></template><template></template></div>');
var BASELINE_IF_TEMPLATE = createTemplate(
    '<tree class="leaf"></tree>');

function TreeComponent(element) {
  this.element = element;
  var clone = BASELINE_TREE_TEMPLATE.content.firstChild.cloneNode(true);
  this.element.appendChild(clone);
  var child = clone.firstChild;
  this.value = new Interpolation(child.firstChild);
  child = child.nextSibling;
  this.left = new If(child);
  child = child.nextSibling;
  this.right = new If(child);
}

TreeComponent.prototype.update = function(value) {
  this.value.update(value.value);
  this.left.update(value.left);
  this.right.update(value.right);
}

function Interpolation(textNode) {
  this.value = null;
  this.textNode = textNode;
}

Interpolation.prototype.update = function(value) {
  if (this.value !== value) {
    this.value = value;
    this.textNode.textContent =  value + ' ';
  }
}

function If(anchor) {
  this.anchor = anchor;
  this.condition = false;
  this.component = null;
}

If.prototype.update = function(value) {
  var newCondition = !!value;
  if (this.condition !== newCondition) {
    this.condition = newCondition;
    if (this.component) {
      this.component.element.remove();
      this.component = null;
    }
    if (this.condition) {
      var element = BASELINE_IF_TEMPLATE.cloneNode(true).content.firstChild;
      this.anchor.parentNode.insertBefore(element, this.anchor.nextSibling);
      this.component = new TreeComponent(element);
    }
  }
  if (this.component) {
    this.component.update(value);
  }
}

function createTemplate (html) {
  var t = document.createElement('template');
  t.innerHTML = html;
  return t;
}
