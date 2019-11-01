import React from 'react'

import PageHeader from '../components/data/page_header.jsx'

const PageContent = ({ header, children }) => {
  if (header === undefined) {
    return children
  }
  return (
    <React.Fragment>
      <PageHeader idMessage={header} />
      <div
        className='ui-panel ui-widget ui-widget-content ui-corner-all'
        style={{ minHeight: '75vh' }}
      >
        {children}
      </div>
    </React.Fragment>
  )
}

export default PageContent
