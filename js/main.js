const tracker = [];
const fileInputElement = document.getElementById("file");
const rootEle = document.getElementById("root");
const uploadComponent = document.getElementById("upload-component");
const searchComponent = document.getElementById("search-component");
let file, xmlDoc;

const handelUploadFile = () => {
	fileInputElement.click();
};

const handleChange = (e) => {
	//accepting the xml file
	file = e.target.files[0];
	//parsing the xml and showing it in the dom
	if (!file) return alert("Not A valid File");

	let reader = new FileReader();
	reader.onload = function () {
		xmlDoc = new DOMParser().parseFromString(reader.result, "text/xml");

		rootEle.innerHTML = xmlDoc.documentElement.outerHTML;
		//showXml(root,0,rootEle);
	};

	reader.readAsText(file);

	uploadComponent.style.display = "none";
	searchComponent.removeAttribute("hidden");
};

function getOffset(el) {
	const rect = el.getBoundingClientRect();
	return {
		left: rect.left + window.scrollX,
		top: rect.top + window.scrollY,
	};
}
// }


//a recursive function to find the text in the DOM
function findText(elem, text, bg) {
	//checking if the element is a text node
	if (elem.nodeType === 3) {
		//matching the text in the text node
		if (elem.nodeValue.match(new RegExp(text, "g"))) {
			//creating the mark element
			const newChild = document.createElement("span");
			newChild.innerHTML = elem.nodeValue.replace(
				new RegExp(text, "g"),
				`<mark style="background:${bg}">${text}</mark>`
			);
			tracker.push({
				pos: elem.nodeValue.indexOf(text),
				elem: elem.nodeValue,
				parent: elem.parentNode,
				offset: getOffset(elem.parentNode),
			});
			//replacing the text node with the mark element
			elem.parentNode.replaceChild(newChild, elem);
		}
	} else {
		//if the element is not a text node then check its children
		for (let i = 0; i < elem.childNodes.length; i++) {
			findText(elem.childNodes[i], text, bg);
		}
	}
	return elem.outerHTML;
}

const handelSearch = (e) => {
	let bg = "#45ff";
	//TODO: We should reset the DOM here
	let newText = findText(rootEle, e.target.value, bg);
	//A function to search and highlight the text in the element
	const text = e.target.value;
	//searching the element for given text
	// tracker.push({
	// 	pos: i,
	// 	elem: child[j].nodeValue,
	// 	parent: child[j].parentNode,
	// 	offset: getOffset(child[j].parentNode),
	// });
	//searching the element for given text
	console.log(newText);
	rootEle.innerHTML = newText;

	//console.log(elems);
	// for (let i = 0; i < elems.length; i++) {
	// 	console.log(elems[i]);
	// }

	// for (let i = 0; i < elems.length; i++) {
	// 	if (elems[i].innerHTML.match(re)) {
	// 		tracker.push({
	// 			pos: i,
	// 			elem: elems[i].innerHTML,
	// 			parent: elems[i].parentNode,
	// 			offset: getOffset(elems[i].parentNode),
	// 		});
	// 		elems[i].innerHTML = elems[i].innerHTML.replace(
	// 			new RegExp(text, "g"),
	// 			`<mark>${text}</mark>`
	// 		);
	// 	}
	// 	console.log("replacing");
	// }

	//THis is where the magix happens wht's
	// rootEle.innerHTML = rootEle.innerHTML.replace(
	// 	new RegExp(text, "g"),
	// 	`<mark>${text}</mark>`
	// );

	displayMinimap();
};


function displayMinimap() {
	//Dispaying the items in minimap
	console.log(tracker);
	//const screenHeight = window.innerHeight;
	let ele = document.getElementById("map");
	ele.removeAttribute("hidden");
	tracker.forEach((element, index) => {
		const newEelem = document.createElement("div");
		newEelem.classList.add("minimap-item");
		//margin = last element - current element + 1
		newEelem.addEventListener("click", function (e) {
			scrollBy({
				top: element.offset.top - window.scrollY,
				block: "center",
			});
			console.log(element.offset.top - window.scrollY);
		});
		//preventing it from overflowing the screen

		//preventing it from overflowing the screen
		let margin;

		margin =
			index === 0
				? element.pos / 5 + 0.5
				: (element.pos - tracker[index - 1].pos) / 5 + 0.5;

		console.log(margin);
		newEelem.style.marginTop = margin + "px";
		ele.appendChild(newEelem);
	});
}
