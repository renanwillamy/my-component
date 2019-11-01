import React from 'react'
import './paginator.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward,faStepBackward,faForward,faStepForward } from '@fortawesome/free-solid-svg-icons'

const getLastNumbers = (maxPageNumbers, pageNumbers) => {
  for (let i = maxPageNumbers; i >= 1; i--) {
    if (pageNumbers.length < 10) {
      pageNumbers.push(i)
    } else {
      break
    }
  }
  pageNumbers.reverse()
}

const getNumbers = (currentPage, maxPageNumbers, pageNumbers) => {
  for (let i = 1; i <= maxPageNumbers; i++) {
    if (i >= currentPage - 5 && pageNumbers.length < 10) {
      pageNumbers.push(i)
    }
  }
}

const Paginator = ({ currentPage, total, handleClick, perPage = 10, hidden = false }) => {
  currentPage = currentPage > 1 ? Math.ceil(currentPage / perPage) + 1 : 1
  const previousPage = currentPage > 1 ? currentPage - 1 : 1
  const nextPage = currentPage < total ? currentPage + 1 : total
  let maxPageNumbers = Math.ceil(total / perPage)
  const disabledMaxClass = currentPage >= maxPageNumbers ? 'disabled' : ''
  const disabledMinClass = currentPage <= 1 ? 'disabled' : ''
  const pageNumbers = []
  if (currentPage >= maxPageNumbers - 5) {
    getLastNumbers(maxPageNumbers, pageNumbers)
  } else {
    getNumbers(currentPage, maxPageNumbers, pageNumbers)
  }

  return (
    <div align='center' hidden={hidden}>
            ({currentPage} of {Math.ceil(total / perPage)})
      <div className={'btn-group btn-group-paginator'}>
        <span className={'ui-paginator-last ui-state-default ui-corner-all style-seek-first ' + disabledMinClass}
          onClick={disabledMinClass === '' ? () => handleClick(1) : null} >
          <FontAwesomeIcon icon={faStepBackward} style={{fontSize:'9px', color:'#333333'}}/>
        </span>
        <span className={'ui-paginator-last ui-state-default ui-corner-all style-seek-prev ' + disabledMinClass}
          onClick={disabledMinClass === '' ? () => handleClick((previousPage - 1) * perPage) : null}>          
          <FontAwesomeIcon icon={faBackward} style={{fontSize:'9px', color:'#333333'}} />
        </span>
        {pageNumbers.map((item, index) => {
          let isActive = currentPage === item ? 'gray-background' : ''
          return (
            <span key={index} className={'ui-paginator-last ui-state-default ui-corner-all style-center ' + isActive}
              onClick={() => handleClick((item - 1) * perPage)}>
              <span style={{ fontFamily: 'Source Sans Pro !important', fontSize: '14.256px' }}>{item}</span>
            </span>
          )
        })}
        <span className={'ui-paginator-last ui-state-default ui-corner-all style-seek-next ' + disabledMaxClass}
          onClick={disabledMaxClass === '' ? () => handleClick((nextPage - 1) * perPage) : null}>
          
          <FontAwesomeIcon icon={faForward} style={{fontSize:'9px', color:'#333333'}}/>
        </span>
        <span  className={'ui-paginator-last ui-state-default ui-corner-all style-seek-end ' + disabledMaxClass}
          onClick={disabledMaxClass === '' ? () => handleClick((maxPageNumbers - 1) * perPage) : null} >
          <FontAwesomeIcon icon={faStepForward} style={{fontSize:'9px', color:'#333333'}} />
        </span>
      </div>
    </div>
  )
}

export default Paginator
