// Variables are storage of values 
let board;
let score = 0;
let rows = 4;
let columns = 4;
 
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

// Declaring variables used for touch input

let startX = 0;
let startY = 0;

// Function are callable programmed tasks

// Create function to set the game board
function setGame(){
	// Initializes the 4x4 game board with all tiles set to 0
	board = [
	    [0, 0, 0, 0],
	    [0, 0, 0, 0],
	    [0, 0, 0, 0],
	    [0, 0, 0, 0]
	];
	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			let tile = document.createElement("div");
			tile.id = r.toString() + "-" + c.toString();
			let num = board[r][c];
			updateTile(tile, num);
			document.getElementById("board").append(tile);
		}
	}	

	setTwo();
	setTwo();
}

//This function is to update the appearance of the tile based on its number
function updateTile(tile, num) {

	tile.innerText ="";
	tile.classList.value="";
	tile.classList.add("tile");
 
	if(num > 0) {
        // This will display the number of the tile 
        tile.innerText = num.toString();
           
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192");
        }
    }
}

window.onload = function() {
	setGame();


}


function handleSlide(event) {
	console.log(event.code);
	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
		if(event.code == "ArrowLeft") {
			slideLeft();
			setTwo();
		}
		else if(event.code == "ArrowRight") {
			slideRight();
			setTwo();
		}
		else if(event.code == "ArrowUp") {
			slideUp();
			setTwo();
		}
		else {
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;


	setTimeout(() => {
		checkWin();
	}, 1000); 	

	if(hasLost() == true ) {

		setTimeout(() => {
			alert("Game Over! Aww, Bawi ka next game beh");
			restartGame();
			alert("Click any arrow key to restart");
		}, 100)
	}
}

document.addEventListener("keydown", handleSlide);

//This funciton removes the zeroes from the row/column
function filterZero(row) {
	return row.filter(num => num != 0);
}

//slide function is the one merging the adjacent tiles 
function slide (row) {
	row = filterZero(row);

	for(let i = 0; i<row.length - 1; i++) {
		if(row[i] == row[i+1]) {
			row[i] *=2;
			row[i +1] = 0;

			// this adds the merged tile value to the score.
			score += row[i];
		}
	}

	row = filterZero(row);
	//Add zeroes on the back after merging

	while(row.length < columns) {
		row.push(0);
	}

	return row;
}
function slideLeft() {
	for(let r = 0; r < rows; r++){
        let row = board[r];

        //Line for animation
        let originalRow = row.slice();

        row = slide(row); //we used the slide function so that the it will merge the adjacent tiles
        board[r] = row;
        //After merging, the position and the value of tiles might change, thus it follow that the id, number, color of the tile must be changed.
        
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            

            //Line for animation
            if(originalRow[c] !== num && num !== 0){ //if the original tile is not equal to the current tile, let's apply animation
            	tile.style.animation = "slide-from-right 0.3s" //applies animation 

            	//removes the animation class after tha animation is complete 
            	setTimeout(() => {
            		tile.style.animation = "";
            	},300)
            }
            updateTile(tile, num);
            
        }
    }

}

function slideRight() {
	for(let r = 0; r < rows; r++){
        let row = board[r];
         //Line for animation
         //This documents the original position of the tiles before sliding
        let originalRow = row.slice();
        row.reverse();
        row = slide(row); //we used the slide function so that the it will merge the adjacent tiles
        row.reverse();
        board[r] = row;
        //After merging, the position and the value of tiles might change, thus it follow that the id, number, color of the tile must be changed.
        
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            //Line for animation
            if(originalRow[c] !== num && num !== 0){ //if the original tile is not equal to the current tile, let's apply animation
            	tile.style.animation = "slide-from-left 0.3s" //applies animation 

            	//removes the animation class after tha animation is complete 
            	setTimeout(() => {
            		tile.style.animation = "";
            	},300)
            }
            updateTile(tile, num);
        }
    }

}

function slideUp() {
	for(let c = 0; c < columns; c++) {
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
		 //Line for animation
         //This documents the original position of the tiles before sliding
        let originalCol = col.slice();

		col = slide(col);

		let changedIndices = [];
		for(let r =0; r<rows; r++) {
			if(originalCol[r] !== col[r]) {
				changedIndices.push(r);
			}
			
		}

		for(let r = 0; r < rows; r++){
			board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            //Line for animation
            if(changedIndices.includes(r) && num !== 0){ //if the original tile is not equal to the current tile, let's apply animation
            	tile.style.animation = "slide-from-top 0.3s" //applies animation 

            	//removes the animation class after tha animation is complete 
            	setTimeout(() => {
            		tile.style.animation = "";
            	},300)
            }
            updateTile(tile, num);
        }

	}
}

function slideDown() {
	for(let c = 0; c < columns; c++) {
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		//Line for animation
         //This documents the original position of the tiles before sliding
        let originalCol = col.slice();

		col.reverse();
		col = slide(col);
		col.reverse();

		let changedIndices = [];
		for(let r =0; r<rows; r++) {
			if(originalCol[r] !== col[r]) {
				changedIndices.push(r);
			}
			
		}

		for(let r = 0; r < rows; r++){
			board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            //Line for animation
            if(changedIndices.includes(r) && num !== 0){ //if the original tile is not equal to the current tile, let's apply animation
            	tile.style.animation = "slide-from-bottom 0.3s" //applies animation 

            	//removes the animation class after tha animation is complete 
            	setTimeout(() => {
            		tile.style.animation = "";
            	},300)
            }
            updateTile(tile, num);
        }

	}
}

function hasEmptyTile() {
	for(let r = 0; r<rows; r++) {
		for(let c = 0; c<columns; c++) {
			if(board[r][c] == 0) {
				return true;
			}
		}
	}

	return false;
}

function setTwo() {
	if(hasEmptyTile() == false) {
		return
	}

	let found = false;

	while(found == false) {
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0) {
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}

}

function checkWin() {
		for(let r=0; r<rows; r++) {
			for(let c=0; c<columns; c++) {
				if(board[r][c] == 2048 && is2048Exist == false) {
					alert("You Win! You got the 2048");
					is2048Exist = true;
				}
				else if(board[r][c] == 4096 && is4096Exist == false) {
					alert("You are unstoppable at 4096");
					is4096Exist = true;
				}

				else if(board[r][c] == 8192 && is8192Exist == false) {
					alert("You're addicted to 2048 to reach 8192!");
					is8192Exist = true;
				}
			}
		}
	}

function hasLost() {
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {

			if(board[r][c] == 0) {
				return false;
			}

			const currentTile = board[r][c];

			if(
					r > 0 && board[r-1][c] === currentTile ||
					r < rows - 1 && board[r + 1][c] === currentTile ||

					c > 0 && board[r][c-1] === currentTile ||
					c < columns - 1 && board[r][c+1] === currentTile
			){
					// if we found a adjacent tile with the same value as the current tile, false, the use has not lost
					return false;
				}
		}
		
	}

	return true;
}

function restartGame() {
	for(let r=0; r<rows; r++) {
		for(let c=0; c<columns; c++) {
			board[r][c] = 0;
		}
	}
	score = 0;
	setTwo();
}

//This code will listen when we touch the screen and assigns the x and y coordinates of that touch/event
// Inputs the x coordinate value to the startX and y coordinate value to start y variable 
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
	if(!e.target.className.includes("tilef")) {
		return
	}

	//To disable scrolling feature
	e.preventDefault();
}, {passive: false}) // Use passive property to make sure that the preventDefault will work

document.addEventListener('touchend', (e) => {
	if(!e.target.className.includes("tile")) {
		return
	}

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	//Check if the horizontal swipe is greater in magnitude than the vertical swipe
	
		if (Math.abs(diffX) > Math.abs(diffY)) {
		    // Horizontal swipe
		    if (diffX > 0) {
		        slideLeft(); // Call a function for sliding left
		        setTwo(); // Call a function named "setTwo"
		    } else {
		        slideRight(); // Call a function for sliding right
		        setTwo(); // Call a function named "setTwo"
		    }
		}
		else {
		    // Vertical swipe
		    if (diffY > 0) {
		        slideUp(); // Call a function for sliding up
		        setTwo(); // Call a function named "setTwo"
		    } else {
		        slideDown(); // Call a function for sliding down
		        setTwo(); // Call a function named "setTwo"
		    }
		}

		document.getElementById("score").innerText = score;

			checkWin();

			// Call hasLost() to check for game over conditions
			if (hasLost()) {
			    // Use setTimeout to delay the alert
			    setTimeout(() => {
			    alert("Game Over! You have lost the game. Game will restart");
			    restartGame();
			    alert("Click any key to restart");
			    }, 100); 
			}

})