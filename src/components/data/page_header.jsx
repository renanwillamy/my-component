import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

const PageHeader = ({ idMessage }) => {
  return (
    <div>
      <div className='ui-panel ui-widget ui-widget-content ui-corner-all swh-title-shadow'>
        <div className='ui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all'>
          <span className='ui-panel-title'>
            <FormattedMessage
              id={idMessage}
              defaultMessage='Message ID not found'
            />
          </span>
        </div>
        <div className='ui-panel-content ui-widget-content' />
      </div>
      <br />
    </div>
  )
}

export default injectIntl(PageHeader)
