import React from 'react'
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import Badge from 'material-ui/Badge'

const Item = ({ result, select, selected }) => (
  <ListItem button key={result.id} style={{backgroundColor: selected ? '#eee' : 'transparent'}}
            onClick={() => select(result.pmid || result.id)}>
    <ListItemText primary={(result.title || 'Untitled').replace(/\.$/, '')}/>
    <ListItemIcon>
      <Badge badgeContent={ result.citedByCount } color="secondary" className="badge">
        {' '}
      </Badge>
    </ListItemIcon>
  </ListItem>
)

export default Item
