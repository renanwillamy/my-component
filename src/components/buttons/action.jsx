import React from 'react'
import * as PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'
import DefaultButton from './default_button.jsx'

/**
 * É uma camada acima do DefaultButton. A ideia é que possa ter comportamentos. Diferente de um simples botão.
 */
function Action (props) {
  return <React.Fragment> {
    <DefaultButton
      title={props.title}
      handleClick={props.handleClick}
      clazzName={`ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only action-btn-padding ${props.iconClazz}`}
      hidden={props.hidden}
      disabled={props.disabled}
      text={props.text}
    />
  }
  </React.Fragment>
}

Action.propTypes = {
  /** Action title */
  title: PropTypes.string,
  /** É chamada quando é clicado no action */
  handleClick: PropTypes.any,
  /** Icone que irá aparecer no action */
  iconClazz: PropTypes.any,
  /** Texto para aparecer no action. Pode colocar tag <span> para aparecer com um icone. */
  text: PropTypes.any
}

Action.defaultProps = {
  // por padrão os actions aparecem
  hidden: false
}

export default Action
