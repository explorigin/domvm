var sv = domvm.defineSvgElement;

function randColor() {
	return '#'+Math.floor(Math.random()*16777215).toString(16);
}

var cRad = 20;
var sRot = 0;
var pFill = randColor();

function Scene(vm) {
	return function() {
		return sv("svg", {version: "1.1", width: "500", height: "160"}, [
			sv("polygon", {points: "150,75 112.5,140 37.5,140 0,75 37.5,10 112.5,10", fill: pFill}),
			sv("rect", {transform: "translate(180 0) rotate(" + sRot + " 65 65)", x: "10", y: "10", width: "130", height: "130", fill: "#006791"}),
			sv("circle", {transform: "translate(350 0)", r: cRad, cx: "75", cy: "75", fill:"#006791"}),
		]);
	};
}

function Icon(vm) {
	function msgbox(str) {
		alert(str);
	}

	return function() {
		return sv("svg.icon#icon-download", {viewBox: "0 0 40 40", style: {width: cRad}, onmousedown: [msgbox, "hi"]}, [
			sv("path", {d: "M30 14h-6v-12h-8v12h-6l10 10 10-10zM38.676 27.064c-0.42-0.448-3.222-3.446-4.022-4.228-0.53-0.518-1.288-0.836-2.084-0.836h-3.514l6.128 5.988h-7.088c-0.204 0-0.388 0.104-0.48 0.266l-1.632 3.746h-11.968l-1.632-3.746c-0.092-0.162-0.278-0.266-0.48-0.266h-7.088l6.126-5.988h-3.512c-0.794 0-1.552 0.318-2.084 0.836-0.8 0.784-3.602 3.782-4.022 4.228-0.978 1.042-1.516 1.872-1.26 2.898l1.122 6.148c0.256 1.028 1.382 1.872 2.504 1.872h32.624c1.122 0 2.248-0.844 2.504-1.872l1.122-6.148c0.252-1.026-0.284-1.856-1.264-2.898z"})
		]);
	};
}

function Use(vm) {
	return function() {
		return sv("svg", {viewBox: "0 0 400 100"}, [
			sv("rect#original-rect", {x: "50", y: "20", width: "50", height: "50", fill: "#29e"}),
			sv("use", {href: "#original-rect", x:"75", y:"10"}),
		]);
	}
}

var vm2 = domvm.createView(Icon).mount(document.body);

var vm = domvm.createView(Scene).mount(document.body);

var vm3 = domvm.createView(Use).mount(document.body);

var steps = 0;
while (steps++ < 80) {
	setTimeout(function() {
		cRad++;
		sRot++;
		pFill = randColor();
		vm.redraw();
		vm2.redraw();
	}, steps * 50);
}