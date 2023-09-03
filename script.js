const mazeContainer = document.getElementById("maze-container");

let isMazeSolved = false, isNotSolvable = false;
let interval;

const generateRandomMaze = ()=>{
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

let maze = generateRandomMaze();

const mazeWidth = maze[0].length; // Get the width of the maze
const cellSize = 70; // Define the cell size in pixels

mazeContainer.style.gridTemplateColumns = `repeat(${mazeWidth}, ${cellSize}px)`; 

const ratPosition = { x: 0, y: 0 };
const endPosition = { x: maze.length-1, y: maze[0].length-1 };

const createMaze = ()=>{
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
        cell.textContent = "Src";
      }
      else if(i === endPosition.x && j === endPosition.y){
        cell.classList.add("end");
        cell.textContent = "Dest";
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


const solveMaze = ()=>{
    const queue = [{ x: ratPosition.x, y: ratPosition.y, path: [] }];
    const visited = Array.from({ length: maze.length }, () => Array(maze[0].length).fill(false));
    visited[ratPosition.x][ratPosition.y] = true;

    const visualizePath = (path)=>{
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

    while(queue.length > 0) {
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
        ];

        for (const { dx, dy } of neighbors) {
            const newX = x + dx;
            const newY = y + dy;
            if ((newX >= 0 && newX < maze.length) && (newY >= 0 && newY < maze[0].length) && maze[newX][newY] === 1 && visited[newX][newY] === false) {
                visited[newX][newY] = true;
                queue.push({ x: newX, y: newY, path: newPath });
            }
        }
    }
    return false;
}

let err = document.getElementById("err");

document.getElementById("start").addEventListener("click",()=>{
  if(isMazeSolved && !isNotSolvable){
    err.innerText = "Already solved...";
    err.style.color = "green";
    err.style.transition = "0.3s ease-in";
    return;
  }
  isMazeSolved = true;
  const sol = solveMaze();
  if (!sol) {
      isNotSolvable = true;
      err.innerText = "No solution exists...";
      err.style.color = "red";
      err.style.transition = "0.3s ease-in";
  }
})


// // Function to generate a new random maze
// function randomizeMaze() {

// }

// Add an event listener for the btn 
document.getElementById("btn").addEventListener("click", () => {
  maze = generateRandomMaze(); // Use your generateRandomMaze function to create a new random maze
  createMaze(); // Update the maze visualization
  err.style.color = "rgb(32, 32, 32)";
  err.innerText = "..."; // Clear any error message
  err.style.transition = "none";
  isMazeSolved = false;
  isNotSolvable = false;
  clearInterval(interval);
});

createMaze();
