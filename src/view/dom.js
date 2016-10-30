import { isArr, isProm, curry } from '../utils';
import { fireHooks } from './hooks';
import { views } from './ViewModel';

export function createElement(tag) {
	return document.createElement(tag);
}

export function createTextNode(body) {
	return document.createTextNode(body);
}

// ? removes if !recycled
export function nextSib(sib) {
	return sib.nextSibling;
}

// ? removes if !recycled
export function prevSib(sib) {
	return sib.previousSibling;
}

function _removeChild(parEl, el, immediate) {
	var node = el._node, hooks = node.hooks;

//	if (node.ref != null && node.ref[0] == "^")			// this will fail for fixed-nodes?
//		console.log("clean exposed ref", node.ref);

	if (isArr(node.body)) {
	//	var parEl = node.el;
		for (var i = 0; i < node.body.length; i++)
			removeChild(el, node.body[i].el);
	}

	parEl.removeChild(el);

	hooks && fireHooks("didRemove", node, null, immediate);
}

// todo: hooks
export function removeChild(parEl, el) {
	var node = el._node, hooks = node.hooks;

	var res = hooks && fireHooks("willRemove", node);

	if (res != null && isProm(res))
		res.then(curry(_removeChild, [parEl, el, true]));
	else
		_removeChild(parEl, el);
}

// todo: hooks
export function insertBefore(parEl, el, refEl) {
	var node = el._node, hooks = node.hooks, inDom = el.parentNode;

	hooks && fireHooks(inDom ? "willReinsert" : "willInsert", node);
	parEl.insertBefore(el, refEl);
	hooks && fireHooks(inDom ? "didReinsert" : "didInsert", node);
}

export function insertAfter(parEl, el, refEl) {
	insertBefore(parEl, el, refEl ? nextSib(refEl) : null);
}