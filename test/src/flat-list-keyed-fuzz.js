QUnit.module("Flat List w/keys (fuzz)", function() {
	// https://stackoverflow.com/a/12646864/973988
	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
	// impl borrowed from https://github.com/ivijs/ivi
	function longestIncreasingSubsequence(a) {
		const p = a.slice();
		const result = [];
		result.push(0);
		let u;
		let v;

		for (let i = 0, il = a.length; i < il; ++i) {
			const j = result[result.length - 1];
			if (a[j] < a[i]) {
				p[i] = j;
				result.push(i);
				continue;
			}

			u = 0;
			v = result.length - 1;

			while (u < v) {
				const c = ((u + v) / 2) | 0;
				if (a[result[c]] < a[i]) {
					u = c + 1;
				} else {
					v = c;
				}
			}

			if (a[i] < a[result[u]]) {
				if (u > 0) {
					p[i] = result[u - 1];
				}
				result[u] = i;
			}
		}

		u = result.length;
		v = result[u - 1];

		while (u-- > 0) {
			result[u] = v;
			v = p[v];
		}

		return result;
	}

	var pool = ["a","b","c","d","e","f","g","h","i"];

	function rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function ins(arr, qty) {
		var p = pool.slice();

		while (qty-- > 0)
			arr.splice(rand(0, arr.length - 1), 0, p.shift());
	}

	function del(arr, qty) {
		while (qty-- > 0)
			arr.splice(rand(0, arr.length - 1), 1);
	}

	function mov(arr, qty) {
		while (qty-- > 0) {
			var from = rand(0, arr.length - 1);
			var to = rand(0, arr.length - 1);

			arr.splice(to, 0, arr.splice(from, 1)[0]);
		}
	}

	function ListViewKeyed(vm) {
		return function(vm, list) {
			return el("ul", list.map(function(item) {
				return el("li", {_key: item}, item);
			}));
		};
	}

	function fuzzTest(delMax, movMax, insMax) {
		var list = [0,1,2,3,4,5,6,7,8,9];
		var copy = list.slice();

		var delCount = rand(0, delMax),
			movCount = rand(0, movMax),
			insCount = rand(0, insMax);

		del(copy, delCount);
		mov(copy, movCount);
		ins(copy, insCount);

		var expCounts = {};

		if (delCount > 0)
			expCounts.removeChild = delCount;
		if (movCount > 0) {
			var newPos = copy.map(function(v) {
				return list.indexOf(v);
			}).filter(function(i) {
				return i != -1;
			});
			var tombs = longestIncreasingSubsequence(newPos);
			var lenDiff = copy.length - tombs.length;
			if (lenDiff > 0)
				expCounts.insertBefore = lenDiff;
		}
		if (insCount > 0) {
			expCounts.createElement = expCounts.textContent = insCount;

			if (movCount == 0)
				expCounts.insertBefore = insCount;
		}

		QUnit.test(list.join() + " -> " + copy.join(), function(assert) {
			var vm = domvm.createView(ListViewKeyed, list).mount(testyDiv);

			instr.start();
			vm.update(copy);
			var callCounts = instr.end();

			var expcHtml = vm.html();
			evalOut(assert, vm.node.el, expcHtml, expcHtml, callCounts, expCounts);
		});
	}

	[
		{delMax: 0, movMax: 50,  insMax: 9},
		{delMax: 3, movMax: 5,   insMax: 5},
		{delMax: 7, movMax: 15,  insMax: 0},
		{delMax: 5, movMax: 100, insMax: 3},
		{delMax: 5, movMax: 0,   insMax: 3},
	].forEach(function(c) {
		var tests = 250;

		while (tests--)
			fuzzTest(c.delMax, c.movMax, c.insMax);
	});
});