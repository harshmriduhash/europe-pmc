import React from 'react'
import Button from 'material-ui/Button'
import Menu, { MenuItem } from 'material-ui/Menu'
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';

class SortSelect extends React.Component {
  state = {
    open: false,
    anchorEl: undefined,
    selectedIndex: null,
  }

  componentDidMount () {
    this.setState({
      selectedIndex: this.props.selected
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      selectedIndex: nextProps.selected
    })
  }

  openMenu = (event) => {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleMenuItemClick = (selectedIndex) => {
    this.setState({
      selectedIndex,
      open: false
    })
    this.props.onChange(selectedIndex)
  }

  render () {
    const {options} = this.props
    const {selectedIndex, anchorEl, open} = this.state

    return (
      <div>
        <Button onClick={this.openMenu}>{options[selectedIndex]} <ArrowDropDownIcon/></Button>

        <Menu anchorEl={anchorEl} open={open} onRequestClose={() => this.setState({open: false})}>
          {Object.keys(options).map((index) => (
            <MenuItem key={index}
                      selected={index === selectedIndex}
                      onClick={() => this.handleMenuItemClick(index)}>{options[index]}</MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

export default SortSelect
