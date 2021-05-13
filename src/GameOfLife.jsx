import React, { useState, useEffect, useCallback, useRef } from 'react'

import './styles/GameOfLife.css'

// Entiendo que los helpers se utilizan cuando mas de uncomponente necesita de la logica.
// En este caso decidi poner la funcion de crear grilla afuera para que este componente
// quede mas prolijo

import { createGrid } from './utils/grid.helpers'

import { Grid, MenuBar, MenuItem, DropdownMenu, DropdownItem } from './components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars as barsIcon } from '@fortawesome/free-solid-svg-icons'

import produce from 'immer'

import { useInterval } from './hooks/useInterval'

import { ChakraProvider } from "@chakra-ui/react";

import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react"

function GameOfLife() {

//
  const [initialGrid, setInitialGrid] = useState({
    numRows: 30,
    numCols: 40,
    pattern: 'DEFAULT'
  })

  const { numRows, numCols, pattern } = initialGrid

  const [grid, setGrid] = useState(() =>
    createGrid(numRows, numCols, pattern)
  )
  
  const [figure, setFigure] = useState('BLINKER')

  const [stepmode, setStepmode] = useState(false)

  const [generation, setGeneration] = useState(1)

  const speedRef = useRef()

  // FUNCTIONS

  const setCellStatus = (row, col, figure) => {
    const updatedGrid = produce(grid, draftGrid => {
    
        switch(figure) {
          case 'DOT':
            draftGrid[row][col] = grid[row][col] ? 0 : 1
            break
       
          case 'GLIDER': { 
            draftGrid[row][col] = draftGrid[row][col] ? 0 : 1
            draftGrid[row][col+1] = draftGrid[row][col+1] ? 0 : 1
            draftGrid[row][col+2] = draftGrid[row][col+2] ? 0 : 1
            draftGrid[row+1][col] = draftGrid[row+1][col] ? 0 : 1
            draftGrid[row+2][col+1] = draftGrid[row+2][col+1] ? 0 : 1
            break
          }

          case 'BLINKER': { 
            draftGrid[row][col] = draftGrid[row][col] ? 0 : 1
            draftGrid[row][col+1] = draftGrid[row][col+1] ? 0 : 1
            draftGrid[row][col-1] = draftGrid[row][col-1] ? 0 : 1
            
            break
          }

          case 'BOAT': {
            draftGrid[row][col] = draftGrid[row][col] ? 0 : 1
            draftGrid[row][col+1] = draftGrid[row][col+1] ? 0 : 1
            draftGrid[row+1][col] = draftGrid[row+1][col] ? 0 : 1
            draftGrid[row+1][col+2] = draftGrid[row+1][col+2] ? 0 : 1
            draftGrid[row+2][col+1] = draftGrid[row+2][col+1] ? 0 : 1
            break
          }

          case 'SHIP': {
            draftGrid[row][col] = draftGrid[row][col] ? 0 : 1
            draftGrid[row][col+1] = draftGrid[row][col+1] ? 0 : 1
            draftGrid[row+1][col] = draftGrid[row+1][col] ? 0 : 1
            draftGrid[row+1][col+2] = draftGrid[row+1][col+2] ? 0 : 1
            draftGrid[row+2][col+1] = draftGrid[row+2][col+1] ? 0 : 1
            draftGrid[row+2][col+2] = draftGrid[row+2][col+2] ? 0 : 1
            break
          }
          case 'BEACON': {
            draftGrid[row][col] = draftGrid[row][col] ? 0 : 1
            draftGrid[row][col+1] = draftGrid[row][col+1] ? 0 : 1
            draftGrid[row+1][col] = draftGrid[row+1][col]  ? 0 : 1
            draftGrid[row+3][col+2] = draftGrid[row+3][col+2] ? 0 : 1
            draftGrid[row+3][col+3] = draftGrid[row+3][col+3] ? 0 : 1
            draftGrid[row+2][col+3] = draftGrid[row+2][col+3] ? 0 : 1
            break
          }
          default: 
            draftGrid[row][col] = grid[row][col] ? 0 : 1
            break
        
      }

    })

    setGrid(updatedGrid)

  }

  const countNeighbours = (row, col) => {
    
    const topRow = row - 1 < 0 ? numRows - 1 : row - 1
    const bottomRow = row + 1 === numRows ? 0 : row + 1
    const leftCol = col - 1 < 0 ? numCols - 1 : col - 1
    const rightCol = col + 1 === numCols ? 0 : col + 1

    const neighbours = 
      grid[topRow][leftCol] +
      grid[topRow][col] +
      grid[topRow][rightCol] + 
      grid[row][leftCol] +
      grid[row][rightCol] +
      grid[bottomRow][leftCol] +
      grid[bottomRow][col] +
      grid[bottomRow][rightCol]

    return neighbours;
  }
  
  const restart = () => {
    setGrid(createGrid(numRows, numCols, 'DEFAULT'))
    setGeneration(1)
  }

  const handleStep = () => {
    
    let stop = true
  
    const updatedGrid = produce(grid, draftGrid => {


      for (let i = 0; i < numRows; i++) {

        for (let j = 0; j < numCols; j++) {
          const cellNeighboursCount = countNeighbours(i, j)
          
          // celula muerta y tres vecinas vivas, nace
          if(!draftGrid[i][j] && cellNeighboursCount === 3) {
            draftGrid[i][j] = 1
            stop = false
            continue
          }
          
          // celula viva y dos o tres vecinas vivas, vive
          if(draftGrid[i][j] && [2, 3].includes(cellNeighboursCount)) {
            stop = false
            continue
          }

          // celula viva y menos de dos vecinas vivas, muere
          if(draftGrid[i][j] && cellNeighboursCount < 2) {
            draftGrid[i][j] = 0
            stop = false
            continue
          }

          // celula viva y mas de tres vecinas vivas, muere
          if(draftGrid[i][j] && cellNeighboursCount > 3) {
            draftGrid[i][j] = 0
            stop = false
            continue
          }
          
        }
      }
      
    })
  
      setGeneration(gen => gen + 1)
      setGrid(updatedGrid)

  }

  const handleStartButton = () => {
    if (stepmode) handleStep()
    else speedRef.current = 300
  }  
  
  useInterval(()=> {
    if (!speedRef.current) return
		handleStep()
    
	}, speedRef.current)


  return (
    <ChakraProvider>
    <div className='gameOfLife'>
      <div className='wrapper'>

        <MenuBar generation={generation}>

          <MenuItem callback={handleStartButton} name={stepmode ? 'Step' : 'Iniciar' }/>
            
          {/* Solo muestra el boton Detener en caso de que no estemos en step mode           */}
          { !stepmode && <MenuItem callback={()=> speedRef.current = 0} name={'Detener'} /> }

          <MenuItem callback={()=> restart()} name={'Reiniciar'} />
          <MenuItem callback={()=> setGrid(createGrid(numRows, numCols, 'RANDOM'))} name={'Random'} />

          <MenuItem  icon={<FontAwesomeIcon icon={barsIcon} />}>
            
            <DropdownMenu>
        
              <DropdownItem>
                Change Grid Size
              </DropdownItem>

              <DropdownItem callback={()=> setStepmode(!stepmode)}>
                Step Mode: { stepmode ? <b>ON</b> : <b>OFF</b> }
              </DropdownItem>  

              <DropdownItem callback={()=> {}}>
                Figure: <b>{ figure }</b>
              </DropdownItem>

              <DropdownItem>
                Speed

                <Slider aria-label="slider-ex-1" 
                        value={speedRef.current}
                        onChange={(v)=>speedRef.current = v } 
                        defaultValue={1000} 
                        min={10} 
                        max={800} 
                        colorScheme='pink' 
                        defaultValue={100}>
                  <SliderTrack>
                    <SliderFilledTrack isReversed={true} />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>

              </DropdownItem>  


            </DropdownMenu>

          </MenuItem>


        </MenuBar>

        <Grid setCellStatus={setCellStatus} 
              figure={figure} 
              grid={grid} 
              numCols={numCols} />
        
      </div>
    </div>
    </ChakraProvider>
  )
}

export default GameOfLife
