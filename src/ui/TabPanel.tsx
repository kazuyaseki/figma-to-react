import Box from '@material-ui/core/Box'
import * as React from 'react'

const TabPanel = ({ children, value, index, ...other }: any) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ width: '100%' }}>{children}</Box>}
    </div>
  )
}

export default TabPanel
