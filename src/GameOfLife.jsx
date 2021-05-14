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
  
  // Setea el estado de la celula a 0 si el pattern inicial es DEFAULT
  // o a random (0, 1) si el pattern inicial es RANDOM

  const setCellStatus = pattern => {
    switch(pattern) {
      case 'RANDOM': 
      return Math.round(Math.random())
      case 'DEFAULT':
        return 0
      }
    }

  // Crea la grilla de acuerdo a las filas y columnas pasadas por parametro
  // Dependiendo del pattern (RANDOM, DEFAULT), setea las celulas iniciales
  // como vivas o muertas
  
  const createGrid = (numRows, numCols, pattern) => {
    const rows = []

    for (let i = 0; i < numRows; i++){
      rows[i] = Array.from(Array(numCols), () => setCellStatus(pattern))
    }
    return rows
  }
  

  // STATE DECLARATIONS


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

  // Setea el patron (figura) a dibujar

  const [currentFigure, setCurrentFigure] = useState(() => {
    const figure = localStorage.getItem('figure') || 'GLIDER'
    return figure
  })

  // Valores de inicializacion por defecto
  const [initialGrid, setInitialGrid] = useState({
    numRows: 30,
    numCols: 40,
    pattern: 'DEFAULT'
  })

  // Destructuracion de los valores por defecto
  const { numRows, numCols, pattern } = initialGrid

  // Setea la grid
  const [grid, setGrid] = useState(() => 
    createGrid(numRows, numCols, pattern)
  )
  
  // Stepmode FALSE o TRUE
  const [stepmode, setStepmode] = useState(false)
  
  // Current generation
  const [generation, setGeneration] = useState(1)

  // Velocidad del interval
  const speedRef = useRef()
  
 


  // FUNCTIONS


  const draw = (row, col, figure) => {

    const topRow = row - 1 < 0 ? numRows - 1 : row - 1 
    const bottomRow = row + 1 === numRows ? 0 : row + 1
    const leftCol = col - 1 < 0 ? numCols - 1 : col - 1
    const rightCol = col + 1 === numCols ? 0 : col + 1
    
    const topRow2 = row - 2 < 0 ? numRows - 1 : row - 2 
    const bottomRow2 = row + 2 >= numRows ? row + 2 - numRows : row + 2
    const leftCol2 = col - 2 < 0 ? numCols - 1 : col - 2
    const rightCol2 = col + 2 >= numCols ? col + 2 - numCols : col + 2
    
    const topRow3 = row - 3 < 0 ? numRows - 1 : row - 3 
    const bottomRow3 = row + 3 >= numRows ? row + 3 - numRows : row + 3
    const leftCol3 = col - 3 < 0 ? numCols - 1 : col - 3
    const rightCol3 = col + 3 >= numCols ? col + 3 - numCols : col + 3

    const updatedGrid = produce(grid, draft => {

        switch(figure) {
          case 'DOT':
            draft[row][col] = grid[row][col] ? 0 : 1
            break
       
          case 'GLIDER': { 
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row][rightCol] = draft[row][rightCol] ? 0 : 1
            draft[row][rightCol2] = draft[row][rightCol2] ? 0 : 1
            draft[bottomRow][col] = draft[bottomRow][col] ? 0 : 1
            draft[bottomRow2][rightCol] = draft[bottomRow2][rightCol] ? 0 : 1
            break
          }

          case 'BLINKER': { 
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row][rightCol] = draft[row][rightCol] ? 0 : 1
            draft[row][leftCol] = draft[row][leftCol] ? 0 : 1
            
            break
          }

          case 'BOAT': {
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row][rightCol] = draft[row][rightCol] ? 0 : 1
            draft[bottomRow][col] = draft[bottomRow][col] ? 0 : 1
            draft[bottomRow][rightCol2] = draft[bottomRow][rightCol2] ? 0 : 1
            draft[bottomRow2][rightCol] = draft[bottomRow2][rightCol] ? 0 : 1
            break
          }

          case 'SHIP': {
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row][rightCol] = draft[row][rightCol] ? 0 : 1
            draft[bottomRow][col] = draft[bottomRow][col] ? 0 : 1
            draft[bottomRow][rightCol2] = draft[bottomRow][rightCol2] ? 0 : 1
            draft[bottomRow2][rightCol] = draft[bottomRow2][rightCol] ? 0 : 1
            draft[bottomRow2][rightCol2] = draft[bottomRow2][rightCol2] ? 0 : 1
            break
          }
          case 'BEACON': {
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[row][rightCol] = draft[row][rightCol] ? 0 : 1
            draft[bottomRow][col] = draft[bottomRow][col] ? 0 : 1
            draft[bottomRow3][rightCol2] = draft[bottomRow3][rightCol2] ? 0 : 1
            draft[bottomRow3][rightCol3] = draft[bottomRow3][rightCol3] ? 0 : 1
            draft[bottomRow2][rightCol3] = draft[bottomRow2][rightCol3] ? 0 : 1
            break
          }
          case 'BLOCK': {
            draft[row][col] = draft[row][col] ? 0 : 1
            draft[bottomRow][rightCol] = draft[bottomRow][rightCol] ? 0 : 1
            draft[bottomRow][col] = draft[bottomRow][col]  ? 0 : 1
            draft[row][rightCol] = draft[row][rightCol] ? 0 : 1
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

  // Seteo grid inicial y figura en base al ultimo input del usuario

  useEffect(()=> {
    const grid = JSON.parse(localStorage.getItem('grid')) || grid
    setGrid(grid)
  }, [])

  useEffect(() => {
    localStorage.setItem('grid', JSON.stringify(grid))
  }, [grid]) 


  useEffect(() => {
    localStorage.setItem('figure', currentFigure)
  }, [currentFigure])

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
