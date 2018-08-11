//CONTROLLERS:     add BUTTON for display calculate DIV

		//Storage Controller
		const StorageCtrl = (function () {
			//Public methods
			return {
				storeItem: function (item) {
					let items;
					if (localStorage.getItem("items") === null) {
						items = [];
						items.push(item);
						localStorage.setItem("items", JSON.stringify(items));
					} else {
						items = JSON.parse(localStorage.getItem("items"));
						items.push(item);
						localStorage.setItem("items", JSON.stringify(items));
					}
				},

				getItemsFromStorage: function () {
					let items;
					if (localStorage.getItem("items") === null) {
						items = [];
					} else {
						items = JSON.parse(localStorage.getItem("items"));
					}
					return items;
				},

				updateItemStorage: function (updatedItem) {
					let items = JSON.parse(localStorage.getItem("items"));

					items.forEach(function (item, index) {
						if (updatedItem.id === item.id) {
							items.splice(index, 1, updatedItem); //delete 1 item and replace it with updated item;
						}
					});
					localStorage.setItem("items", JSON.stringify(items));
				},

				deleteItemFromStorage: function (id) {
					let items = JSON.parse(localStorage.getItem("items"));

					items.forEach(function (item, index) {
						if (id === item.id) {
							items.splice(index, 1); //delete 1 item and don't replace it;
						}
					});
					localStorage.setItem("items", JSON.stringify(items));
				},

				clearItemsFromStorage: function () {
					localStorage.removeItem("items");
				}
			};
		})();

		//Item Controller
		const ItemCtrl = (function () {
			//Item constructor
			const Item = function (id, food, calories) {
				this.id = id;
				this.food = food;
				this.calories = calories;
			};

			const data = {
				//dummy hard coded data:
				//items: []
				//   // {id: 0, name: 'Steak Dinner', calories: 1200},
				//   // {id: 1, name: 'Cookie', calories: 400},
				//   // {id: 2, name: 'Eggs', calories: 400},
				// ],
				items: StorageCtrl.getItemsFromStorage(),
				currentItem: null,
				totalCalories: 0
			};
			//Public methods
			return {
				calculateMeal: function () {
					//get qty
					const qty = document.getElementById("Quantity").value;
					//get cals 100/g
					const cals_100 = document.getElementById("calories100").value;
					//calculate
					const result = (qty * cals_100) / 100;
					document.getElementById("totalMeal").innerHTML = result;

					document.getElementById("Quantity").value = "";
					document.getElementById("calories100").value = "";
					document.getElementById("totalMeal").innerHTML = result;
				},
				addItem: function (food, calories) {
					let ID;
					//create ID
					if (data.items.length > 0) {
						ID = data.items[data.items.length - 1].id + 1;
					} else {
						ID = 0;
					}

					//calories to number
					calories = parseInt(calories);

					//create new item
					newItem = new Item(ID, food, calories);

					//add to items array (data structure);
					data.items.push(newItem);

					return newItem;
				},

				getItemById: function (id) {
					let found = null;
					//loop through items
					data.items.forEach(function (item) {
						if (item.id === id) {
							found = item;
						}
					});

					return found;
				},

				updateItem: function (food, calories) {
					//calories to number;
					calories = parseInt(calories);

					let found = null;

					data.items.forEach(function (item) {
						if (item.id === data.currentItem.id) {
							item.food = food;
							item.calories = calories;
							found = item;
						}
					});
					return found;
				},

				deleteItem: function (id) {
					//get IDs
					const ids = data.items.map(function (item) {
						return item.id;
					});

					//get index
					const index = ids.indexOf(id);

					//remove item from array
					data.items.splice(index, 1);
				},

				clearAllItems: function () {
					data.items = [];
				},

				setCurrentItem: function (item) {
					data.currentItem = item;
				},

				getCurrentItem: function () {
					return data.currentItem;
				},

				logData: function () {
					return data;
				},
				getTotalCalories: function () {
					let total = 0;

					//loop through items and add calories
					data.items.forEach(function (item) {
						total += item.calories;
					});

					//set total calories in data structure;
					data.totalCalories = total;

					//return total
					return data.totalCalories;
				},
				getItems: function () {
					return data.items;
				}
			};
		})();

		//UI Controller
		const UICtrl = (function () {
			//object with all the selectors (in case we need to change/update them later on)
			const UISelectors = {
				logInApp: "#logInApp",
				addMeal: "#addMeal",
				calculateCalMeal: "#calculateCalMeal",
				spinner: ".spinner",
				pizza: "#pizza",
				addMealBtn: "#addMealBtn",
				updateMealBtn: "#update",
				deleteMealBtn: "#delete",
				backBtn: "#back",
				itemMeal: "#item-meal",
				calorie: "#item-calories",
				itemsList: "#calorieList",
				totalCalories: ".total-calories",
				clearMeals: "#clear",
				itemsListLIs: "#calorieList li",
				calculate: "#calc",
				remove_calc: "#remove_calc",
				calculate_meal: "#calculate_meal",
				clearMeal: "#clear_meal"
			};
			//Public Methods
			return {
				//make UISelectors public
				getSelectors: function () {
					return UISelectors;
				},

				ShowcalculateMeal: function () {
					document.querySelector(UISelectors.calculateCalMeal).style.display =
						"block";
				},

				HidecalculateMeal: function () {
					document.querySelector(UISelectors.calculateCalMeal).style.display =
						"none";
				},

				showLogInStateApp: function () {
					document.querySelector(UISelectors.logInApp).style.display = "block";
					document.querySelector(UISelectors.addMeal).style.display = "none";
					document.querySelector(UISelectors.calculateCalMeal).style.display =
						"none";
					document.querySelector(UISelectors.spinner).style.display = "none";
				},

				logInApp: function () {
					document.querySelector(UISelectors.logInApp).style.display = "block";
					document.querySelector(UISelectors.spinner).style.display = "block";
					setTimeout(function () {
						document.querySelector(UISelectors.logInApp).style.display = "none";
						document.querySelector(UISelectors.spinner).style.display = "none";
						document.querySelector(UISelectors.addMeal).style.display = "block";
					}, 2000);
				},

				getInput: function () {
					return {
						food: document.querySelector(UISelectors.itemMeal).value,
						calories: document.querySelector(UISelectors.calorie).value
					};
				},

				addListItem: function (item) {
					document.querySelector(UISelectors.itemsList).style.display = "block";
					const listItem = document.createElement("li");
					listItem.className = "collection-item";
					//add ID
					listItem.id = `item-${item.id}`;
					listItem.innerHTML = `
      <strong>${item.food}: </strong>
      <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="material-icons waves-effect waves-blue">edit</i>
      </a>
      `;
					//insert item into the DOM (insertAdjacentElement with 2 params)
					document
						.querySelector(UISelectors.itemsList)
						.insertAdjacentElement("beforeend", listItem);
				},

				removeItems: function () {
					let listItems = document.querySelectorAll(UISelectors.itemsListLIs);

					//turn node list into array
					listItems = Array.from(listItems);

					listItems.forEach(function (item) {
						item.remove();
					});
				},

				showTotalCalories: function (totalCalories) {
					document.querySelector(
						UISelectors.totalCalories
					).innerHTML = totalCalories;
				},

				clearInput: function () {
					document.querySelector(UISelectors.itemMeal).value = "";
					document.querySelector(UISelectors.calorie).value = "";
				},

				addItemToForm: function () {
					document.querySelector(
						UISelectors.itemMeal
					).value = ItemCtrl.getCurrentItem().food;
					document.querySelector(
						UISelectors.calorie
					).value = ItemCtrl.getCurrentItem().calories;
					UICtrl.showEditState();
				},

				updateListItem: function (item) {
					let listItems = document.querySelectorAll(UISelectors.itemsListLIs);

					//convert node list into array
					listItems = Array.from(listItems);

					listItems.forEach(function (listItem) {
						const itemID = listItem.getAttribute("id");

						if (itemID === `item-${item.id}`) {
							document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.food}: </strong>
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i class="material-icons waves-effect waves-blue">edit</i>
            </a>
           `;
						}
					});
				},

				deleteListItem: function (id) {
					const itemID = `#item-${id}`;

					const item = document.querySelector(itemID);

					item.remove();
				},

				hideList: function () {
					document.querySelector(UISelectors.itemsList).style.display = "none";
				},

				populateItemList: function (items) {
					let html = "";
					items.forEach(function (item) {
						html += `
        <li class="collection-item" id="item-${item.id}">
        <strong>${item.food}: </strong>
        <em>${item.calories}</em>
        <a href="#" class="secondary-content">
          <i class="material-icons waves-effect waves-blue">edit</i>
        </a>
        </li>
        `;
					});

					//insert list items
					document.querySelector(UISelectors.itemsList).innerHTML = html;
				},

				clearEditState: function () {
					UICtrl.clearInput();
					document.querySelector(UISelectors.deleteMealBtn).style.display = "none";
					document.querySelector(UISelectors.updateMealBtn).style.display = "none";
					document.querySelector(UISelectors.backBtn).style.display = "none";
					document.querySelector(UISelectors.addMealBtn).style.display = "inline";
					document.querySelector(UISelectors.clearMeals).style.display = "inline";
				},

				showEditState: function () {
					document.querySelector(UISelectors.deleteMealBtn).style.display =
						"inline";
					document.querySelector(UISelectors.updateMealBtn).style.display =
						"inline";
					document.querySelector(UISelectors.backBtn).style.display = "inline";
					document.querySelector(UISelectors.clearMeals).style.display = "none";
					document.querySelector(UISelectors.addMealBtn).style.display = "none";
				}
			};
		})();

		//App Controller
		const App = (function (itemCtrl, StorageCtrl, UICtrl) {
			//get UI selectors
			const UISelectors = UICtrl.getSelectors();

			//Load Event Listeners
			const loadEventListeners = function () {
				//event listener for log in App
				document
					.querySelector(UISelectors.pizza)
					.addEventListener("click", UICtrl.logInApp);

				//event listener for AddItemSubmit
				document
					.querySelector(UISelectors.addMealBtn)
					.addEventListener("click", addItemSubmit);

				//edit icon click event
				document
					.querySelector(UISelectors.itemsList)
					.addEventListener("click", itemEditClick);

				//update item event
				document
					.querySelector(UISelectors.updateMealBtn)
					.addEventListener("click", itemUpdateSubmit);

				//delete item event
				document
					.querySelector(UISelectors.deleteMealBtn)
					.addEventListener("click", itemDeleteSubmit);

				//back button event
				document
					.querySelector(UISelectors.backBtn)
					.addEventListener("click", UICtrl.clearEditState);

				//clear meals event listener
				document
					.querySelector(UISelectors.clearMeals)
					.addEventListener("click", clearAllItemsClick);

				//show calculate
				document
					.querySelector(UISelectors.calculate)
					.addEventListener("click", UICtrl.ShowcalculateMeal);

				//hide calculate
				document
					.querySelector(UISelectors.remove_calc)
					.addEventListener("click", UICtrl.HidecalculateMeal);

				//calculate meal
				document
					.querySelector(UISelectors.calculate_meal)
					.addEventListener("click", ItemCtrl.calculateMeal);
			};

			//add Item Submit
			const addItemSubmit = function (e) {
				//get input
				const input = UICtrl.getInput();

				if (input.food !== "" && input.calories !== "") {
					//add item to data structure
					const newItem = ItemCtrl.addItem(input.food, input.calories);

					//Add item to UI list
					UICtrl.addListItem(newItem);

					//Get total calories
					const totalCalories = ItemCtrl.getTotalCalories();

					//add total calories to the UI
					UICtrl.showTotalCalories(totalCalories);

					//Store in localStorage
					StorageCtrl.storeItem(newItem);

					//Clear fields
					UICtrl.clearInput();
				}
				e.preventDefault();
			};

			//item edit click
			const itemEditClick = function (e) {
				if (e.target.className === "material-icons waves-effect waves-blue") {
					//get list item id (item-0, item-1)
					const listId = e.target.parentNode.parentNode.id;

					//break into an array (split by dash)
					const listIdArr = listId.split("-");

					//get actual id from position 1 and parse as int
					const id = parseInt(listIdArr[1]);

					//get item
					const itemToEdit = ItemCtrl.getItemById(id);

					//set Current item
					ItemCtrl.setCurrentItem(itemToEdit);

					//Add item to form
					UICtrl.addItemToForm();
				}

				e.preventDefault();
			};

			//update item submit
			const itemUpdateSubmit = function (e) {
				//get input to be updated
				const input = UICtrl.getInput();

				//update item
				const updatedItem = ItemCtrl.updateItem(input.food, input.calories);

				//update ui
				UICtrl.updateListItem(updatedItem);

				//Get total calories
				const totalCalories = ItemCtrl.getTotalCalories();

				//add total calories to the UI
				UICtrl.showTotalCalories(totalCalories);

				//Clear fields
				UICtrl.clearInput();

				//update local storage
				StorageCtrl.updateItemStorage(updatedItem);

				//clear edit state
				UICtrl.clearEditState();

				e.preventDefault();
			};

			//delete item event listener
			const itemDeleteSubmit = function (e) {
				//get current item id
				const currentItem = ItemCtrl.getCurrentItem();

				//delete from data structure
				ItemCtrl.deleteItem(currentItem.id);

				//delete from the UI
				UICtrl.deleteListItem(currentItem.id);

				//Get total calories
				const totalCalories = ItemCtrl.getTotalCalories();

				//add total calories to the UI
				UICtrl.showTotalCalories(totalCalories);

				//Delete from local storage
				StorageCtrl.deleteItemFromStorage(currentItem.id);

				//Clear fields
				UICtrl.clearInput();

				//clear edit state
				UICtrl.clearEditState();

				e.preventDefault();
			};

			//clear items event listener
			const clearAllItemsClick = function () {
				//delete all items from data structure
				ItemCtrl.clearAllItems();

				//remove items from UI
				UICtrl.removeItems();

				//remove from local storage
				StorageCtrl.clearItemsFromStorage();
				//Get total calories
				const totalCalories = ItemCtrl.getTotalCalories();

				//add total calories to the UI
				UICtrl.showTotalCalories(totalCalories);

				//hide ul
				UICtrl.hideList();
			};

			return {
				//initialize App
				init: function () {
					UICtrl.showLogInStateApp();

					//clear edit state
					UICtrl.clearEditState();

					//Load Event listeners
					loadEventListeners();

					//Fetch items from data structure
					const items = ItemCtrl.getItems();

					//Check if any items
					if (items.length === 0) {
						UICtrl.hideList();
					} else {
						//Populate List with items
						UICtrl.populateItemList(items);
					}
					//Get total calories
					const totalCalories = ItemCtrl.getTotalCalories();
					//add total calories to the UI
					UICtrl.showTotalCalories(totalCalories);
				}
			};
		})(ItemCtrl, StorageCtrl, UICtrl);

		//Initialize App
		App.init();