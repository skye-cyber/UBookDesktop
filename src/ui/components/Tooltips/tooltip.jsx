import { OnselectTooltip } from './onSelect';
import { PlayerTooltip } from './onReadAlound';
import { ContextMenu } from './onContextmenu';
import { useMediaQuery } from '@mui/material';

export const ToolTipUI = ({ }) => {
    return (
        <section id="tooltip">
        {/*Hide on mobile device: no tooltips&ContextMenu*/}
            {useMediaQuery('(min-width: 400px)') && (
                <>
                    <OnselectTooltip />
                    <ContextMenu />
                </>
            )}
            <PlayerTooltip />

        </section>
    )
}
