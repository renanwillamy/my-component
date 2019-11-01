import React from 'react'
import './modals.css'
const LoadingModal = ({ show }) => {
  if (!show) {
    return null
  }
  return (
    <div className='ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow ui-overlay-visible'
      style={{
        width: '180px',
        height: 'auto',
        left: '672.5px',
        top: '178.5px',
        visibility: 'visible',
        zIndex: '1006',
        display: 'block'
      }}
    >
      <div style={{
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)'
      }}>
        <div style={{ background: '#FFF', width: '15%', top: '35%', marginLeft: 'auto', marginRight: 'auto' }}
          className='ui-dialog-content ui-widget-content' >
          <span className='wms-spinner animate-spin' style={{ fontSize: '3.5em', color: '#7a9d3e' }} />
          <span style={{
            verticalAlign: 'middle',
            lineHeight: 'normal',
            display: 'inline-block',
            marginBottom: '20%',
            marginLeft: '5%'
          }}>
            Loading
          </span>
        </div>
      </div>
    </div>
  )
}

export default LoadingModal
