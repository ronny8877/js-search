const tracker=[];

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
		var xmlText = new XMLSerializer().serializeToString(xml);
		var xmlTextNode = document.createTextNode(xmlText);
		rootEle.appendChild(xmlTextNode);
		//getting the root element of the xml file
		//
		//getting the child elements of the root element

		//displaying the root element in the dom
		//  rootEle.innerHTML=root.nodeName;

		//displaying the child elements of the root element in the dom
		rootEle.innerHTML = reader.result;
		//showXml(root,0,rootEle);
	};

	reader.readAsText(file);
};
//a recusrsive function to show the xml in the DOM
function showXml(ele, level, rootEle) {
	//getting the child elements of the root element
	let child = ele.childNodes;
	for (let i = 0; i < child.length; i++) {
		//if the child element is an element
		if (child[i].nodeType == 1) {
			//displaying the child element in the dom
			let ele = document.createElement(child[i].nodeName);
			ele.innerText = child[i].nodeName;
			ele.style.marginLeft = level * 20 + "px";
			rootEle.appendChild(ele);
			//calling the function recursively to show the child elements of the child element
			showXml(child[i], level + 1, rootEle);
		}
		//if the child element is a text node
		else if (child[i].nodeType == 3) {
			//displaying the text node in the dom
			let ele = document.createElement("span");
			ele.innerText = child[i].nodeValue;
			ele.style.marginLeft = level * 20 + "px";
			rootEle.appendChild(ele);
		}
	}
}

// const handelSearch = (e)=>{
//   const text=e.target.value
//   //searching the element for given text
//   let ele=document.getElementById("root");

//   //searching the element for given text
//   let elems=ele.getElementsByTagName("*");
//   for(let i=0;i<elems.length;i++){
//     if(elems[i].innerText.includes(text)){
//      //find the words in the element
//      let regex = new RegExp(/G[ab].*/i);
//       let elements=elems[i].innerText.split(" ");
//       for(let j=0;j<elements.length;j++){;
//         if(elements[j].includes(text)){
//           //highlight the words
//           //getting the index of text to be highlight
//         elements[j]=elements[j].replace(`<span class="highlight">${elements[j]}</span>`);
//           //highlighting the words

//           //elems[i].style.backgroundColor="yellow";
//         }
//         else{
//           elems[i].style.backgroundColor="white";
//         }
//       }
//       //getting the index of the text from match array
//       // let index=match.indexOf(text.toLowerCase());
//       // console.log(index)
//       // //highlighting the element with the text
//       // elems[i].innerHTML=elems[i].innerText.slice(0,index)+"<span class='highlight'>"+text+"</span>"+elems[i].innerText.slice(index+text.length);

//     }
//   }

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
					});

					//creating a new XML node with the highlighted text
					let newNode = document.createElement("span");
					newNode.style.backgroundColor = "yellow";
					newNode.innerText = child[j].nodeValue.slice(0, index);
					newNode.innerText += text;
					newNode.innerText += child[j].nodeValue.slice(index + text.length);

					let xml = new DOMParser().parseFromString(newNode, "text/xml");
					var xmlText = new XMLSerializer().serializeToString(xml);
					var xmlTextNode = document.createTextNode(xmlText);

					child[j].nodeValue =
						child[j].nodeValue.slice(0, index) +
						text +
						child[j].nodeValue.slice(index + text.length);

					//TODO:Find a way to refresh the dom without loosing the content
					//TODO: Way one parse this as an html document
					//this will just highlight whole elemt
					elems[i].style.backgroundColor = "yellow";
				}
			}
		}
	}
	let xml = new DOMParser().parseFromString(elems, "text/xml");
	var xmlText = new XMLSerializer().serializeToString(xml);
	var xmlTextNode = document.createTextNode(xmlText);
	ele.appendChild(xmlTextNode);
	displayMinimap();
};

function displayMinimap() {
	//Dispaying the items in minimap
	const screenHeight = window.innerHeight;
	let ele = document.getElementById("map");
	tracker.forEach((element, index) => {
		//margin = last element - current element + 1

		const newEelem = document.createElement("div");
		newEelem.classList.add("minimap-item");
		newEelem.id = index;
		newEelem.addEventListener("click", function (e) {
			element.parent.scrollIntoView(true);
		});
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