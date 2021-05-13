import React from 'react'

const Grid = ({grid, numCols, draw, currentFigure}) => {

    return (
        <div style={{
            display: `grid`,
            gridTemplateColumns: `repeat(${numCols}, 20px)`,
            gap: '5px',
            justifyContent: 'center',
        }}>
            {grid.map((row, i) => 
                row.map((col, j) => {

                const cellStatus =  grid[i][j]

                return <div key={`${i}-${j}`} 
                            className={`cell ${cellStatus ? 'live' : 'dead'}`}
                            onClick={()=>draw(i, j, currentFigure)}/>
                }
            ))}
        </div>
    )
}

export default Grid




