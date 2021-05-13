// @dev: Funcion para cambiar la currentFigure.
// Toma la figura actual como primer parametro,
// y un array de las posibles figuras como segundo parametro.
// Si el index de la currentFigure, dentro del array de figuras
// es igual al ultimo index del array, setea el index a 0
// y de lo contrario lo incrementa en uno.
// Finalmente devuelve la figura en la posicion del index

export const nextFigure = (currentFigure, figures) => {
  const length = figures.length-1
  let index = figures.indexOf(currentFigure)
  if(figures.indexOf(currentFigure) >= length) {
    index = 0
  } else {
    index++
  }
  return figures[index]

}

  