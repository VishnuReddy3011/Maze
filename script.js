const mazeContainer = document.getElementById("maze-container");
let isMazeSolved = false;
let isNotSolvable = false;
let interval;
function generateRandomMaze() {
  const numRows = 6;
  const numCols = 6;
  const maze = [];

  for (let i = 0; i < numRows; i++) {
    const row = [];
    for (let j = 0; j < numCols; j++) {
      // Generate a random value (0 or 1)
      if((i === 0 && j === 0) || (i === numRows-1 && j === numCols-1)){
        row.push(1);
      }
      else{
        const cellValue = Math.random() < 0.3 ? 0 : 1; // Adjust 0.3 to control the density of 0s
        row.push(cellValue);
      }
    }
    maze.push(row);
  }
  return maze;
}

// Example usage:
let maze = generateRandomMaze();

const mazeWidth = maze[0].length; // Get the width of the maze
const cellSize = 70; // Define the cell size in pixels

mazeContainer.style.gridTemplateColumns = `repeat(${mazeWidth}, ${cellSize}px)`; 

const ratPosition = { x: 0, y: 0 };
const endPosition = { x: maze.length-1, y: maze[0].length-1 };

function createMaze() {
  mazeContainer.innerHTML = "";
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if(i === 0 && j === maze[0].length-1){
        cell.classList.add("top-right");
      }
      else if(j === 0 && i === maze.length-1){
        cell.classList.add("bottom-left");
      }
      if (i === ratPosition.x && j === ratPosition.y) {
        cell.classList.add("rat");
        cell.textContent = "S";
      }
      else if(i === endPosition.x && j === endPosition.y){
        cell.classList.add("end");
        cell.textContent = "E";
      }
      else {
        if(maze[i][j] === 0){
          cell.classList.add("wall");
        }
        else if(maze[i][j] === 2){
          cell.classList.add("path");
        }
        else if(maze[i][j] === 3){
          cell.classList.add("foot");
        }
      }
      mazeContainer.appendChild(cell);
    }
  }
}

function solveMaze() {
    const queue = [{ x: ratPosition.x, y: ratPosition.y, path: [] }];
    const visited = Array.from({ length: maze.length }, () => Array(maze[0].length).fill(false));
    visited[ratPosition.x][ratPosition.y] = true;

    

    function visualizePath(path) {
        let stepIndex = 0;
        interval = setInterval(() => {
            if (stepIndex <= path.length-1) {
                const step = path[stepIndex];
                maze[step.x][step.y] = 2; // Mark the solved path
                setTimeout(()=>{
                  maze[step.x][step.y] = 3;
                },200);
                createMaze();
                stepIndex++;
            } 
            else {
                clearInterval(interval);
            }
        }, 500); // Adjust the interval time as needed
    }

    while (queue.length > 0) {
        const { x, y, path } = queue.shift();
        const newPath = [...path, { x, y }];

        if (x === endPosition.x && y === endPosition.y) {
            visualizePath(newPath); // Visualize the shortest path
            return true; // return BFS once shortest path is found
        }
        const neighbors = [
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: -1 },
            // { dx: 1, dy: 1 },
            // { dx: -1, dy: -1 },
            // { dx: 1, dy: -1 },
            // { dx: -1, dy: 1 }
        ];

        for (const { dx, dy } of neighbors) {
            const newX = x + dx;
            const newY = y + dy;
            if ((newX >= 0 && newX < maze[0].length) && (newY >= 0 && newY < maze.length) && maze[newX][newY] === 1 && visited[newX][newY] === false) {
                visited[newX][newY] = true;
                console.log(newPath);
                queue.push({ x: newX, y: newY, path: newPath });
            }
        }
    }
    return false;
}


document.addEventListener("keydown", (event) => {
  if (event.key === "s") {
    if(isMazeSolved && !isNotSolvable){
      document.getElementById("err").innerText = "Already solved...";
    }
    else if(!isMazeSolved){
      const sol = solveMaze();
      isMazeSolved = true;
      if (!sol) {
        isNotSolvable = true;
          document.getElementById("err").innerText = "No solution exists...";
      }
    }
  }
});

document.getElementById("start").addEventListener("click",()=>{
  if(isMazeSolved && !isNotSolvable){
    document.getElementById("err").innerText = "Already solved...";
    return;
  }
  isMazeSolved = true;
  const sol = solveMaze();
  if (!sol) {
      isNotSolvable = true;
      document.getElementById("err").innerText = "No solution exists...";
  }
})


// Function to generate a new random maze
function randomizeMaze() {
  maze = generateRandomMaze(); // Use your generateRandomMaze function to create a new random maze
  createMaze(); // Update the maze visualization
  document.getElementById("err").innerText = ""; // Clear any error message
  isMazeSolved = false;
  isNotSolvable = false;
  clearInterval(interval);
}

// Add an event listener for the btn 
document.getElementById("btn").addEventListener("click", () => {
  randomizeMaze(); // Call the randomizeMaze function when btn is clicked
  // location.reload();
});

createMaze();
