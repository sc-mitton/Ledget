import React, { createContext, useContext, useState } from 'react'
import Picker from '@emoji-mart/react'

import './styles/EmojiPicker.css'
import { DropAnimation } from '@utils'
import { IconButton2 } from '@ledget/shared-ui'

const EmojiContext = createContext()

const Emoji = (props) => {
    const { emoji, setEmoji, children } = props
    const [picker, setPicker] = useState(false)

    return (
        <EmojiContext.Provider value={{ setEmoji, picker, setPicker }}>
            <div id="emoji-picker-ledget">
                {children({ emoji })}
            </div>
        </EmojiContext.Provider>
    )
}

const categoryIcons = {
    frequent: {
        svg: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 88 88" style="enable-background:new 0 0 88 88;" xml:space="preserve"> <style type="text/css"> 	.st734{fill:none;stroke:#C6C6C6;stroke-width:4.8455;stroke-miterlimit:10;} </style> <g> 	<circle class="st734" cx="44" cy="44" r="38"/> 	<polyline class="st734" points="44,16 44,44 23.3,44 	"/> </g> </svg>'
    },
    people: {
        svg: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 88 88" style="enable-background:new 0 0 88 88;" xml:space="preserve"> <style type="text/css"> 	.889{fill:#C6C6C6;} </style> <path class="889" d="M32.7,26c2.2,0,4,3.4,4,7.7s-1.8,7.7-4,7.7s-4-3.4-4-7.7S30.5,26,32.7,26z M53.7,26c-2.6,0-4,4-4,7.7 	s1.4,7.7,4,7.7s4-4,4-7.7S56.3,26,53.7,26z M43.6,57.4c-6.9,0.2-12.9-2.8-18.8-5.9c-2.1-1.2-4.7,0.6-4,2.7c2.8,9,11.9,15.6,23,15.6 	c10.8,0,20-6.5,23-15.6c0.7-2.2-2-4-4.3-2.8c-5.6,3-11.8,5.6-18.2,5.9C43.8,57.4,43.6,57.4,43.6,57.4z M43.6,83.8 	c-22,0-40.1-18.1-40.1-40.1S21.6,3.6,43.6,3.6s40.1,18.1,40.1,40.1S65.6,83.8,43.6,83.8z M43.6,7.6C23.8,7.6,7.5,23.8,7.5,43.7 	s16.3,36.1,36.1,36.1s36.1-16.3,36.1-36.1C79.7,23.8,63.5,7.6,43.6,7.6z"/> </svg>'
    },
    nature: {
        svg: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 88 88" style="enable-background:new 0 0 88 88;" xml:space="preserve"> <style type="text/css"> 	.st683{fill:none;stroke:#C6C6C6;stroke-width:5.1641;stroke-miterlimit:10;} 	.st98{fill:#C6C6C6;} 	.st714{fill:none;stroke:#C6C6C6;stroke-width:4.5926;stroke-linecap:round;stroke-miterlimit:10;} </style> <g> 	<path class="st683" d="M71.9,38.9C71.2,24.1,59,12.1,44.2,12.1c-15.1,0-27.2,12-27.9,26.8c-6,3.5-10,9.7-10,17.3 		C6.3,67,15.2,75.9,26,75.9c1.6,0,3.1-0.2,4.7-0.7C33.3,79.9,38.2,83,44,83s10.9-3.3,13.3-8c1.8,0.4,3.3,0.9,5.3,0.9 		c10.9,0,19.7-8.9,19.7-19.7C82.3,48.6,78.1,42.2,71.9,38.9z"/> 	<ellipse class="st98" cx="26.7" cy="46.4" rx="3.5" ry="5.3"/> 	<ellipse class="st98" cx="60.6" cy="46.4" rx="3.5" ry="5.3"/> 	<line class="st683" x1="43.3" y1="61.7" x2="43.3" y2="74.1"/> 	<path class="st714" d="M50.6,70.3c-1.1,2-4,3.3-7.3,3.3s-6-1.3-7.3-3.3"/> 	<path class="st98" d="M41.8,65.2L36,59.5c-0.7-1.1,0-2.2,1.6-2.2h11.7c1.6,0,2.2,1.1,1.6,2.2l-5.8,5.8 		C44.4,66.1,42.4,66.1,41.8,65.2z"/> 	<path class="st683" d="M16.5,38.7c-3.3-1.6-6.4-4.2-8.4-7.8c-4.9-8.6-2-19.3,6-23.7s18.6-1.3,23.5,7.3"/> 	<path class="st683" d="M49.7,13.4c4.9-7.5,14.4-10.6,22.1-6.6C80.3,11,83.4,21.4,79,30.3c-1.8,3.5-4.4,6.2-7.5,8"/> </g> </svg>'
    },
    objects: {
        svg: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 88 88" style="enable-background:new 0 0 88 88;" xml:space="preserve"> <style type="text/css"> 	.st57{fill:none;stroke:#C6C6C6;stroke-width:4.8946;stroke-miterlimit:10;} 	.st200{fill:none;stroke:#C6C6C6;stroke-width:6.0982;stroke-miterlimit:10;} </style> <g> 	<path class="st57" d="M71,32.4c0-14.9-12.1-27-27-27s-27,12.1-27,27c0,7.3,3,14.2,7.8,19c2.4,2.4,5.4,8.8,8.4,14.7v11.9 		c0,2.6,2.2,4.7,4.7,4.7h11c2.6,0,4.7-2.2,4.7-4.7V67.1c3.5-6.3,6.7-13.6,9.3-16.4C68.2,45.9,71,39.5,71,32.4z"/> 	<line class="st57" x1="34.7" y1="73.6" x2="44" y2="73.6"/> 	<line class="st57" x1="33.4" y1="66" x2="54.1" y2="66"/> 	<line class="st200" x1="44" y1="56.3" x2="44" y2="38"/> 	<line class="st200" x1="33.6" y1="31.3" x2="44" y2="41.6"/> 	<line class="st200" x1="44" y1="41.6" x2="54.8" y2="30.8"/> </g> </svg>'
    },
    activity: {
        svg: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 88 88" style="enable-background:new 0 0 88 88;" xml:space="preserve"> <style type="text/css"> 	.st721{fill:#C6C6C6;} </style> <path class="st721" d="M44,1.8C20.8,1.8,1.8,20.8,1.8,44s19,42.2,42.2,42.2S86.2,67.4,86.2,44S67.2,1.8,44,1.8z M32.1,79.3 	c-5.4-1.8-10.3-4.8-14.5-8.9c-0.4-0.4-0.8-1-1.4-1.4c-0.6-1.2-1.2-2.4-1.8-3.6c-0.6-1.6-1.2-3.2-1.8-4.8c0-0.2-0.2-0.6-0.2-0.8 	l8.9-5.2c3.4,2.2,7.1,4.2,10.7,5.7c1,0.4,1.8,0.8,2.8,1.2l0,0l4.6,13.5C37.1,76.7,34.7,78.1,32.1,79.3 	C32.1,79.1,32.1,79.1,32.1,79.3L32.1,79.3z M40.8,11.5c0.2,0.4,0.6,0.6,0.8,1c1.6,2,3,4,4.4,6.1l-8.3,14.5c-0.2,0-0.4,0-0.6,0 	c-4.4,0.6-8.9,1.4-13.3,2.6c-0.2,0-0.4,0-0.6,0.2L16.3,25c0.4-0.8,0.8-1.4,1.2-2.2C19,20,21,17.2,23,14.7L40.8,11.5z M25.6,11.7 	c6.1-3.6,13.3-5.2,20.2-5c-1.6,0.6-3.2,1.2-4.8,2c-0.2,0-0.2,0.2-0.4,0.2L25.6,11.7z M48.2,19.8c4.8,0,9.3,0.4,14.1,1.4 	c0,0,0,0,0.2,0L71,37.3c-0.4,0.6-0.6,1.2-1,2c-1.8,3.4-3.8,6.7-5.9,9.9l-17.6-1.8c-0.8-1.8-1.8-3.4-2.6-5.2c-1.4-2.6-2.6-5-4-7.5 	L48.2,19.8z M21.6,37.9L21.6,37.9c-1,4.8-1.4,9.5-1.4,14.5v0.2l-9.1,5.4c-0.4-0.4-0.6-0.8-0.8-1.2c-1-1.4-1.8-2.8-2.6-4.2 	c-1.6-6.9-1.2-14.1,1.2-20.8c1.6-1.8,3.4-3.2,5.4-4.4c0.2,0,0.2-0.2,0.4-0.2L21.6,37.9z M37.3,60.1c0.8-0.8,1.6-1.6,2.6-2.6l0,0 	c2-2.4,4.2-4.6,6.1-6.9c0.2-0.2,0.4-0.6,0.6-0.8l17.2,1.8c1,2.2,1.8,4.4,2.6,6.5c0.4,1.2,0.8,2.6,1.2,3.8L55.7,75.3 	c-1.6,0.2-3.2,0-4.8,0c-2.6-0.2-5.2-0.4-7.9-0.8c-0.4,0-0.6-0.2-1-0.2L37.3,60.1z M69.6,63.6c0.4-0.2,0.8-0.2,1.2-0.4 	c2.6-1,5-2.4,7.1-3.8c-1.8,4-4.4,7.7-7.5,11.1c-3.6,3.6-7.7,6.3-12.3,8.1c0-0.6,0-1.2-0.2-1.8L69.6,63.6z M73.3,36.5l-8.9-16.6 	c0.6-2,1-4,1.4-6.1c1.6,1.2,3,2.4,4.6,3.8C76.9,24,80.5,32.3,81.1,41c-0.2-0.2-0.4-0.4-0.8-0.6C78.1,38.8,75.9,37.7,73.3,36.5z"/> </svg>'
    },
    foods: {
        svg: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 88 88" style="enable-background:new 0 0 88 88;" xml:space="preserve"> <style type="text/css"> 	.st474{fill:#C6C6C6;} </style> <path class="st474" d="M81.8,56.6c-0.8,1.2-2,2.2-3.6,2.6l-28.6,7.2c-0.6,0.2-1.2,0.2-1.8,0.2s-1.2,0-1.8-0.2l-28.4-7.2 	c-1-0.2-1.8-0.8-2.6-1.4c-0.4,0.6-0.8,1.2-0.8,2v4.4c0,1.8,1.6,3.4,3.4,3.4h3c-1.6,0.4-2.8,2-2.8,3.8v6.4h-3.2L9.3,26.6h30.8 	L39.4,35c-12.4,1.4-23,5.4-23,12.2c0,1.4,0.4,2.6,1.2,3.8c-3,1-3,4.8,0.6,5.8l28.6,7.4c0.6,0.2,1.4,0.2,2.2,0l28.6-7.4 	c3.4-0.8,3.6-4.4,0.6-5.8c0.8-1.2,1.4-2.4,1.4-3.8c0-8.2-15.8-12.6-31.6-12.6c-1.2,0-2.4,0-3.8,0l1.2-12.8h-8l2.4-11l11,4.2l1.8-4.4 	L36.2,4.3l-3.8,17.4H4.1l6,60.9h9c0.6,0.6,1.6,1,2.6,1h54.9c2.2,0,4-1.8,4-4v-8.2c0-1.8-1.2-3.4-2.8-3.8h2.6c1.8,0,3.4-1.6,3.4-3.4 	v-4.4C84,58.4,83,57.2,81.8,56.6z M74.8,47.2c0,3.2-10.6,7.8-26.8,7.8s-26.8-4.8-26.8-7.8c0-3.2,10.6-7.8,26.8-7.8 	S74.8,44,74.8,47.2z M75.8,78.8H22.6v-6.6h53.3V78.8z M76.6,72.2v-2.4V72.2L76.6,72.2z"/> </svg>'
    },
    places: {
        svg: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 88 88" style="enable-background:new 0 0 88 88;" xml:space="preserve"> <style type="text/css"> 	.st32{fill:#C6C6C6;} </style> <path class="st32" d="M84,24.9V81h-5.1V30h-23v4.2h-5.1v-24H26.2v30.6H8.3V81H3.2V35.7h17.9V5.1h34.8v19.8H84z M31.3,19.7h4.9v-4.9 	h-4.9V19.7z M41.2,19.7H46v-4.9h-4.9V19.7z M31.3,30h4.9v-4.9h-4.9V30z M13.6,50.2h4.9v-4.9h-4.9V50.2z M41.2,30H46v-4.9h-4.9V30z 	 M69.2,39.7h4.9v-4.9h-4.9V39.7z M69.2,49.8h4.9V45h-4.9V49.8z M70.3,62.9V73c0,1.5-1.1,2.7-2.5,3.2V81c0,0.6-0.4,1.3-1.3,1.3h-7.2 	c-0.6,0-1.3-0.4-1.3-1.3v-4.6H29.4V81c0,0.6-0.4,1.3-1.3,1.3h-7.2c-0.6,0-1.3-0.4-1.3-1.3v-4.9c-1.7,0-3-1.5-3-3.2V62.9 	c0-1.9,1.5-3.4,3.4-3.4l4.2-1.1v-7c0-7,5.7-12.7,12.7-12.7h13.7c7,0,12.7,5.7,12.7,12.7v7l4.2,1.1C69.2,59.5,70.7,61,70.3,62.9z 	 M29.4,57.6h28.9v-6.1c0-4.2-3.4-7.6-7.6-7.6H37c-4.2,0-7.6,3.4-7.6,7.6C29.4,51.5,29.4,57.6,29.4,57.6z M22.6,66.3 	c0,1.5,1.1,2.5,2.5,2.5c1.5,0,2.5-1.3,2.5-2.5c0-1.5-1.3-2.5-2.5-2.5C23.9,63.7,22.6,65,22.6,66.3z M64.8,72.8 	c0-0.6-0.6-1.3-1.3-1.3h-7.2c0-0.2,0.2-0.2,0.2-0.4c0-0.6-0.6-1.3-1.3-1.3H32.1c-0.6,0-1.3,0.6-1.3,1.3c0,0.2,0.2,0.2,0.2,0.4h-7.2 	c-0.6,0-1.3,0.6-1.3,1.3s0.6,1.3,1.3,1.3h39.9C64.4,74.1,64.8,73.4,64.8,72.8z M65.6,66.3c0-1.5-1.3-2.5-2.5-2.5 	c-1.5,0-2.5,1.3-2.5,2.5c0,1.5,1.3,2.5,2.5,2.5S65.4,67.5,65.6,66.3z"/> </svg>'
    },
    flags: {
        svg: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 88 88" style="enable-background:new 0 0 88 88;" xml:space="preserve"> <style type="text/css"> 	.st284{fill:none;stroke:#C6C6C6;stroke-width:8;stroke-miterlimit:10;} </style> <g> 	<path class="st284" d="M15.6,83.3"/> 	<path class="st284" d="M72.4,47.2c0,1.2-1.6,2-2.4,1.2c-2-1.8-5.4-3.8-11.3-3.8c-11.9,0-13.5,7.7-25.6,7.7c-10.1,0-17.4-7.1-17.4-7.1 		V12.1c0-1.2,1.4-1.8,2.2-1.2c2.6,1.8,7.5,4.4,15.1,4.4c12.1,0,13.7-7.7,25.6-7.7c10.5,0,13.1,6.1,13.7,7.5c0,0.2,0,0.4,0,0.4V47.2z 		"/> 	<line class="st284" x1="15.8" y1="44.6" x2="15.8" y2="84.3"/> </g> </svg>'
    },
    symbols: {
        svg: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 88 88" style="enable-background:new 0 0 88 88;" xml:space="preserve"> <style type="text/css"> 	.st446{fill:#C6C6C6;} </style> <g> 	<path class="st446" d="M76.1,85.3H11.9c-5.2,0-9.2-4.1-9.2-9.2V11.9c0-5.2,4.1-9.2,9.2-9.2h64.2c5.2,0,9.2,4.1,9.2,9.2v64.2 		C85.5,81,81.2,85.3,76.1,85.3z M11.9,7.8C9.8,7.8,8,9.5,8,11.9v64.2c0,2.1,1.9,4.1,4.1,4.1h64.2c2.1,0,4.1-1.9,4.1-4.1V11.9 		c0-2.1-1.9-4.1-4.1-4.1H11.9z M35.5,68.6c0.2-0.2,0.4-0.9,0.6-1.7c0.6-1.5,0.9-3,1.1-4.5v-0.2h-3.4v0.2c-0.2,0.9-0.2,1.3-0.4,1.7 		c0,0.4-0.2,0.9-0.4,1.5l-3.9-4.7c1.3-0.9,2.1-1.5,2.8-2.1c1.1-1.3,1.5-2.6,1.5-4.3c0-1.5-0.4-2.6-1.5-3.6c-1.1-1.1-2.4-1.5-4.1-1.5 		c-1.9,0-3.2,0.6-4.5,1.7c-1.1,1.1-1.7,2.4-1.7,4.1c0,0.9,0.2,1.5,0.6,2.4c0.4,0.9,1.1,1.7,1.9,2.8c-1.7,1.1-3,1.9-3.6,2.8 		c-0.9,1.3-1.5,2.8-1.5,4.7c0,1.7,0.6,3.4,1.7,4.7c1.3,1.5,3,2.1,5.8,2.1c1.7,0,3.2-0.4,4.7-1.3c0.6-0.4,1.5-1.1,2.4-1.9l2.1,2.6 		l0,0h4.5L35.5,68.6z M26.7,71.6c-1.1,0-1.9-0.4-2.8-1.1c-0.9-0.6-1.3-1.5-1.3-2.8c0-1.1,0.4-2.1,1.1-2.8c0.4-0.4,1.3-1.3,2.8-2.1 		l5.2,6.4c-0.4,0.6-1.1,1.1-1.9,1.7C28.9,71.2,27.8,71.6,26.7,71.6z M25.6,53.3c0.4-0.6,1.3-1.1,2.4-1.1c0.6,0,1.3,0.2,1.7,0.6 		c0.4,0.4,0.6,1.1,0.6,1.7c0,0.9-0.2,1.7-0.9,2.4c-0.4,0.4-1.1,0.9-1.9,1.7c-0.9-0.9-1.3-1.7-1.7-2.1c-0.4-0.6-0.4-1.3-0.4-1.7 		C25.2,54.2,25.4,53.8,25.6,53.3z M52.7,48c-1.5,0-3,0.6-4.1,1.7c-1.1,1.1-1.7,2.4-1.7,4.1c0,1.5,0.6,2.8,1.7,4.1 		c1.1,1.1,2.4,1.7,4.1,1.7c1.5,0,3-0.6,4.1-1.7c1.1-1.1,1.7-2.4,1.7-4.1c0-1.5-0.6-3-1.7-4.1S54.2,48,52.7,48z M55.7,53.6 		c0,0.9-0.2,1.5-0.9,2.1c-0.6,0.6-1.3,0.9-2.1,0.9s-1.5-0.2-2.1-0.9c-0.6-0.6-0.9-1.3-0.9-2.1s0.2-1.5,0.9-2.1 		c0.6-0.6,1.3-0.9,2.1-0.9s1.5,0.2,2.1,0.9C55.5,52,55.7,52.9,55.7,53.6z M72,64.1c-1.1-1.1-2.4-1.7-4.1-1.7c-1.5,0-3,0.6-4.1,1.7 		s-1.7,2.4-1.7,4.1c0,1.5,0.6,3,1.7,4.1s2.4,1.7,4.1,1.7c1.5,0,3-0.6,4.1-1.7s1.7-2.4,1.7-4.1C73.7,66.6,73.1,65.1,72,64.1z 		 M70.9,68.1c0,0.9-0.2,1.5-0.9,2.1c-0.6,0.6-1.3,0.9-2.1,0.9c-0.9,0-1.5-0.2-2.1-0.9c-0.6-0.6-0.9-1.3-0.9-2.1 		c0-0.9,0.2-1.5,0.9-2.1s1.3-0.9,2.1-0.9c0.9,0,1.5,0.2,2.1,0.9C70.7,66.6,70.9,67.3,70.9,68.1z M53.3,72.9l-4.5,0.2l18.5-24.9h4.5 		L53.3,72.9z M71.4,22c-2.8-5.6-8.8-7.5-12.9-11.8c0,1.9,0,16.1,0,23.2c-1.1-0.4-2.4-0.6-3.6-0.6c-4.1,0-7.5,2.4-7.5,5.2 		s3.4,5.2,7.5,5.2s7.5-2.4,7.5-5.2c0-0.2,0-0.6-0.2-0.9V18.8c5.2,4.7,8.8,5.8,4.1,15.9C70.5,32.5,73.7,26.5,71.4,22z M41.7,15.6 		H15.1v5.2h26.6V15.6z M41.7,23.1H15.1v5.2h10.9v13.5h5.2V28.2h10.5V23.1z"/> </g> </svg>'
    },
}

const EmojiPicker = () => {
    const { setEmoji, picker, setPicker } = useContext(EmojiContext)

    const categories = [
        'frequent',
        'people',
        'nature',
        'objects',
        'activity',
        'foods',
        'places',
        'flags',
        'symbols',
    ]

    const handleEmojiSelect = (emoji) => {
        setEmoji(emoji)
        setPicker(false)
    }

    return (
        <DropAnimation visible={picker}>
            <div id="em-picker-container" >
                <Picker
                    autoFocus
                    previewPosition="none"
                    set="apple"
                    navPosition="bottom"
                    onEmojiSelect={handleEmojiSelect}
                    onClickOutside={() => setPicker(false)}
                    theme={'dark'}
                    showCategoryFilter={false}
                    showSkinTones={false}
                    maxFrequentRows={1}
                    perLine={8}
                    categories={categories}
                    categoryIcons={categoryIcons}
                />
            </div>
        </DropAnimation>
    )
}

const EmojiButton = ({ emoji }) => {
    const { picker, setPicker } = useContext(EmojiContext)

    return (
        <IconButton2
            type="button"
            id="emoji-picker-ledget--button"
            onClick={(e) => {
                e.stopPropagation()
                setPicker(!picker)
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    setPicker(!picker)
                }
            }}
            role="button"
            aria-label="Emoji picker"
            aria-haspopup="true"
            aria-expanded={picker}
            aria-controls="emoji-picker-ledget--container"
            tabIndex={0}
            style={{
                color: !emoji && "rgb(0, 0, 0, .4)",
                marginRight: '4px'
            }}
        >
            {emoji ? emoji.native : '☺'}
        </IconButton2>
    )
}

Emoji.Picker = EmojiPicker
Emoji.Button = EmojiButton

export default Emoji
