const tracker = [];

const handleChange = (e) => {
	const rootEle = document.getElementById("root");
	//accepting the xml file
	let file = e.target.files[0];
	//parsing the xml and showing it in the dom
	let reader = new FileReader();
	reader.onload = function () {
		// rootEle.innerText=reader.result;
		// hljs.highlightE(rootEle)
		//parsing the xml file
		let xml = new DOMParser().parseFromString(reader.result, "text/xml");
		//getting the root element of the xml file
		let root = xml.documentElement;
		//getting the child elements of the root element

		//displaying the root element in the dom
		//  rootEle.innerHTML=root.nodeName;

		//displaying the child elements of the root element in the dom
		rootEle.innerHTML = reader.result;
		//showXml(root,0,rootEle);
	};

	reader.readAsText(file);
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
		let ele = document.getElementById("root");
		//searching the element for given text
		let elems = ele.getElementsByTagName("*");
		//TODO: we need to remember the position of the element
		for (let i = 0; i < elems.length; i++) {
			if (elems[i].innerText.includes(text)) {
				let child = elems[i].childNodes;
				for (let j = 0; j < child.length; j++) {
					if (child[j].nodeValue && child[j].nodeValue.includes(text)) {
						console.log(child[j].nodeValue);
						let index = child[j].nodeValue.indexOf(text);
						tracker.push({
							pos: i,
							elem: child[j].nodeValue,
							parent: child[j].parentNode,
							offset: getOffset(child[j].parentNode),
						});

						//creating a new XML node with the highlighted text

						// newText =
						// 	child[j].nodeValue.slice(0, index) +
						// 	`<mark>
						// 	${text }
						// 	</mark>` +
						// 	child[j].nodeValue.slice(index + text.length);

						//TODO:Find a way to refersh the dom without loosing the content
						//TODO:Find a way to refresh the dom without loosing the content
						//TODO: Way one parse this as an html document
						//this will just highlight whole elemt
						//elems[i].style.backgroundColor = "yellow";
					}
				}
			}
		}

		ele.innerHTML = ele.innerHTML.replace(
			new RegExp(text, "g"),
			`<mark>${text}</mark>`
		);

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
					behavior: "smooth",
				});
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
