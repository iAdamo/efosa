import React from 'react'
import Wizard from '../../transformation/Wizard'
import NodeToolBar from '../../transformation/Components/SpeccDetail/NodeToolBar'

function BuildMatch() {
  return (
    <div className="relative w-full h-full">
      <Wizard type={"matching"} />
      <NodeToolBar />
    </div>
  )
}

export default BuildMatch