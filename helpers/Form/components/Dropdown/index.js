import * as PropTypes from 'prop-types'

/**
 * Dropdown input form
 *
 * @param {*} props
 *
 * @return {*}
 */
export const DropdownInput = props => {
    const {
              component,
              ...newProps
          } = props

    return component(newProps)
}

DropdownInput.propTypes = {
    component: PropTypes.func,
}

DropdownInput.defaultProps = {
    component: () => null
}
