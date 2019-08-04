import React from 'react';
import content from '../content';

export default function PersonalCard(props) {
    return (
        <div>
            {content.sections.sectionNames[props.displayRank].display}
        </div>
    )
}

PersonalCard.defaultProps = {
    displayRank: 0
}