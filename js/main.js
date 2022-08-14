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
const handelSearch = (e) => {
	//TODO: We should reset the DOM here

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
	let elems = rootEle.getElementsByTagName("*");

	let re = new RegExp(text, "g");

	console.log(elems[0]);
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

// const handelSearch = (e) => {
// 	const text = e.target.value;
// 	//searching the element for given text
// 	let ele = document.getElementById("root");
// 	let newText;

// 	let re = new RegExp(text, "g");
// 	//searching the element for given text
// 	let elems = ele.getElementsByTagName("*");
// 	for (let i = 0; i < elems.length; i++) {
// 		if (re.test(elems[i].innerText)) {
// 			console.log(re.test(elems[i].innerText));
// 			newText = elems[i].innerText.replace(
// 				re,
// 				`<mark style="background:red" >${text}</mark>`
// 			);
// 		}
// 	}
// };
// let elements = elems[i].innerText.split(" ");
// //find the words in the element
// for (let j = 0; j < elements.length; j++) {
//   if (elements[j].includes(text)) {

//     let re = new RegExp(text, "g"); // search for all instances
//     newText = text.replace(
//       re,
//       `<mark style="background:red" >${text}</mark>`
//       );
//       //highlight the words
//       //getting the index of text to be highlight
//       elements[j] = newText;
//       //highlighting the words

//       //elems[i].style.backgroundColor="yellow";
//     //}

// const handelSearch = (e) => {
// 	let searched = document.getElementById("search").value.trim();
// 	console.log(searched);
// 	if (searched !== "") {
// 		let text = document.getElementById("root").innerHTML;
// 		let re = new RegExp(searched, "g"); // search for all instances
// 		console.log(re);
// 		let newText = text.replace(
// 			re,
// 			`<mark style="background:red" >${searched}</mark>`
// 		);
// 		document.getElementById("root").innerHTML = newText;
// 	}
// 	displayMinimap();
// };

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
