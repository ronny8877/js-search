const tracker = [];
const fileInputElement = document.getElementById("file");
const rootEle = document.getElementById("root");
const uploadComponent = document.getElementById("upload-component");
const searchComponent = document.getElementById("search-component");
const minimap = document.getElementById("map");



//TODO: THe search should not be listed here as we will spawn more then one element 
//programmatically then it will be a mess up

const searchBar = document.getElementById("search");
const colorBar = document.getElementById("search-color");

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
			let id = Math.random().toString(36).substr(2, 9);
			const newChild = document.createElement("span");
			newChild.innerHTML = elem.nodeValue.replace(
				new RegExp(text, "g"),
				`<mark id=${id}  style="background:${bg}">${text}</mark>`
			);
			tracker.push({
				bg,
				id,
				elem: elem.nodeValue,
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

const handelSearch = () => {
	let highlightColor = colorBar.value;
	let text = searchBar.value;
	if (text === "") {
		alert("Please Enter a Text");
		return;
	}
	if (!xmlDoc) {
		return alert("Something went wrong");
	}

	//Resetting the doc here
	//Empty the tracker array
	tracker.length = 0;
	//Empty the minimap
	minimap.innerHTML = "";
	rootEle.innerHTML = xmlDoc.documentElement.outerHTML;
	let newText = findText(rootEle, text, highlightColor);

	rootEle.innerHTML = newText;

	displayMinimap();
};

function displayMinimap() {
	//Displaying the items in minimap
	console.log(tracker);
	//const screenHeight = window.innerHeight;

	minimap.removeAttribute("hidden");
	tracker.forEach((element, index) => {
		const newEelem = document.createElement("div");
		newEelem.classList.add("minimap-item");
		//margin = last element - current element + 1
		newEelem.addEventListener("click", function (e) {
			document.getElementById(element.id).scrollIntoView({
				block: "center",
			});
		});

		//calculating the margin to fit the elements in the screen
		let margin;

		margin =
			(element.offset.top / minimap.offsetHeight) *
			(minimap.offsetHeight / (rootEle.offsetHeight / minimap.offsetHeight));
		newEelem.style.top = margin + "px";
		newEelem.style.background = element.bg;
		newEelem.style.position = "absolute";
		minimap.appendChild(newEelem);
	});
}

const scrollToCustom = () => {
	//scrolling to top of element
	console.log("here");
	window.scrollTo(0, 0);
};

window.addEventListener("scroll", () => {
	//scrolling to top of element
	let sc = document.getElementById("to-top");
	if (window.scrollY > window.innerHeight) {
		sc.style.display = "block";
	} else {
		sc.style.display = "none";
	}
});