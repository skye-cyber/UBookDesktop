import React from 'react';
import { OnselectTooltip } from './onSelect';
import { PlayerTooltip } from './onReadAlound';
import { ContextMenu } from './onContextmenu';

export const ToolTipUI = ({ }) => {
    return (
        <section id="tooltip">
            <OnselectTooltip />
            <PlayerTooltip />
            < ContextMenu />
        </section>
    )
}
