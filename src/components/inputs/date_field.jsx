import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const DateField = ({ selectedIni, selectedEnd, handleOnChangeStart, handleOnChangeEnd, message }) => {
  let clazzName = 'ui-column-filter ui-inputfield ui-inputtext ui-widget ui-state-default ui-corner-all'
  return (
    <React.Fragment>
      <DatePicker
        selected={selectedIni}
        onChange={handleOnChangeStart}
        dateFormat='dd/MM/yy'
        startDate={selectedIni}
        endDate={selectedEnd}
        className={clazzName}
      />
      <span>
        {message}
      </span>
      <DatePicker
        selected={selectedEnd}
        onChange={handleOnChangeEnd}
        dateFormat='dd/MM/yy'
        startDate={selectedIni}
        endDate={selectedEnd}
        className={clazzName}
      />
    </React.Fragment>
  )
}

export default DateField
