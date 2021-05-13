import React, { useState, useEffect, useCallback, useRef } from 'react'

import './styles/GameOfLife.css'

import { nextFigure } from './utils/helpers'

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

  // INIT FUNCTIONS  
  
  // Crea la grilla de acuerdo a las filas y columnas pasadas por parametro
  // Dependiendo del pattern (RANDOM, DEFAULT), setea las celulas iniciales
  // como vivas o muertas


  const setCellStatus = pattern => {
    switch(pattern) {
      case 'RANDOM': 
        return Math.round(Math.random())
      case 'DEFAULT':
        return 0
    }
  }
  
  const createGrid = (numRows, numCols, pattern) => {
    const rows = []

    for (let i = 0; i < numRows; i++){
      rows[i] = Array.from(Array(numCols), () => setCellStatus(pattern))
    }
    return rows
  }
  


  // STATE DECLARATIONS


  const [initialGrid, setInitialGrid] = useState({
    numRows: 30,
    numCols: 40,
    pattern: 'DEFAULT'
  })

  const { numRows, numCols, pattern } = initialGrid

  const [grid, setGrid] = useState(() =>
    createGrid(numRows, numCols, pattern)
  )
  
  
  const [stepmode, setStepmode] = useState(false)
  
  const [generation, setGeneration] = useState(1)

  const speedRef = useRef()
  
  // @dev: Array con las posibles figuras.. 
  // @dev: Es el que le paso a change nextFigure
  const figures = [
    'DOT',
    'GLIDER',
    'BLINKER',
    'BOAT',
    'SHIP',
    'BEACON',
    'BLOCK'
  ]
  
  const [currentFigure, setCurrentFigure] = useState('BLINKER')


  // FUNCTIONS


  const draw = (row, col, figure) => {
    const updatedGrid = produce(grid, draft => {
    
        switch(figure) {
          case 'DOT':
            draft[row][col] = grid[row][col] ? 0 : 1
            break
       
          case 'GLIDER': { 
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row][col+1] = draft[row][col+1] ? 0 : 1
            draft[row][col+2] = draft[row][col+2] ? 0 : 1
            draft[row+1][col] = draft[row+1][col] ? 0 : 1
            draft[row+2][col+1] = draft[row+2][col+1] ? 0 : 1
            break
          }

          case 'BLINKER': { 
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row][col+1] = draft[row][col+1] ? 0 : 1
            draft[row][col-1] = draft[row][col-1] ? 0 : 1
            
            break
          }

          case 'BOAT': {
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row][col+1] = draft[row][col+1] ? 0 : 1
            draft[row+1][col] = draft[row+1][col] ? 0 : 1
            draft[row+1][col+2] = draft[row+1][col+2] ? 0 : 1
            draft[row+2][col+1] = draft[row+2][col+1] ? 0 : 1
            break
          }

          case 'SHIP': {
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row][col+1] = draft[row][col+1] ? 0 : 1
            draft[row+1][col] = draft[row+1][col] ? 0 : 1
            draft[row+1][col+2] = draft[row+1][col+2] ? 0 : 1
            draft[row+2][col+1] = draft[row+2][col+1] ? 0 : 1
            draft[row+2][col+2] = draft[row+2][col+2] ? 0 : 1
            break
          }
          case 'BEACON': {
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row][col+1] = draft[row][col+1] ? 0 : 1
            draft[row+1][col] = draft[row+1][col]  ? 0 : 1
            draft[row+3][col+2] = draft[row+3][col+2] ? 0 : 1
            draft[row+3][col+3] = draft[row+3][col+3] ? 0 : 1
            draft[row+2][col+3] = draft[row+2][col+3] ? 0 : 1
            break
          }
          case 'BLOCK': {
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row+1][col+1] = draft[row+1][col+1] ? 0 : 1
            draft[row+1][col] = draft[row+1][col]  ? 0 : 1
            draft[row][col+1] = draft[row][col+1] ? 0 : 1
            break
          }
          default: 
            draft[row][col] = grid[row][col] ? 0 : 1
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
  
    const updatedGrid = produce(grid, draft => {


      for (let i = 0; i < numRows; i++) {

        for (let j = 0; j < numCols; j++) {
          const cellNeighboursCount = countNeighbours(i, j)
          
          // celula muerta y tres vecinas vivas, nace
          if(!draft[i][j] && cellNeighboursCount === 3) {
            draft[i][j] = 1
            stop = false
            continue
          }
          
          // celula viva y dos o tres vecinas vivas, vive
          if(draft[i][j] && [2, 3].includes(cellNeighboursCount)) {
            stop = false
            continue
          }

          // celula viva y menos de dos vecinas vivas, muere
          if(draft[i][j] && cellNeighboursCount < 2) {
            draft[i][j] = 0
            stop = false
            continue
          }

          // celula viva y mas de tres vecinas vivas, muere
          if(draft[i][j] && cellNeighboursCount > 3) {
            draft[i][j] = 0
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

              <DropdownItem callback={()=> setStepmode(!stepmode)}>
                Step Mode: { stepmode ? <b>ON</b> : <b>OFF</b> }
              </DropdownItem>  

              <DropdownItem callback={()=> {setCurrentFigure(nextFigure(currentFigure, figures))}}>
                Figure: <b>{ currentFigure }</b>
              </DropdownItem>

              <DropdownItem>
                Speed

                <Slider aria-label="slider-ex-1" 
                        onChange={(v)=>speedRef.current = v } 
                        defaultValue={speedRef.current} 
                        min={10} 
                        max={800} 
                        isReversed={true}
                        colorScheme='none' >
                  <SliderTrack>
                    <SliderFilledTrack  />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>

              </DropdownItem>  


            </DropdownMenu>

          </MenuItem>


        </MenuBar>

        <Grid draw={draw} 
              currentFigure={currentFigure} 
              grid={grid} 
              numCols={numCols} />
        
      </div>
    </div>
    </ChakraProvider>
  )
}

export default GameOfLife
