import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

const StoryIcon = (props: any) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
         className="lucide lucide-feather-icon lucide-feather" {...props}>
        <Path
            d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/>
        <Path d="M16 8 2 22"/>
        <Path d="M17.5 15H9"/>
    </Svg>
);

export default StoryIcon;
