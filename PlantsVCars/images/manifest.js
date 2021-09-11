/* autogenerated by bundler.py at Sat Sep 11 23:53:38 2021 +1000 */
import React from 'react';
import {Image, ImageBackground} from 'react-native';

var IMG = {};
IMG["Waves-in-Sea"] = require("./sub/Waves-in-Sea.jpg");
IMG["Ben"] = require("./ben.png");
IMG["Testflower"] = require("./testflower.png");
IMG["Autumn-duck"] = require("./bg/autumn/autumn-duck.png");
IMG["Autumn-top"] = require("./bg/autumn/autumn-top.png");
IMG["Autumn"] = require("./bg/autumn/autumn.png");
IMG["Spring-bg"] = require("./bg/spring/spring-bg.png");
IMG["Spring-duck"] = require("./bg/spring/spring-duck.png");
IMG["Spring-top"] = require("./bg/spring/spring-top.png");
IMG["Spring"] = require("./bg/spring/spring.png");
IMG["Summer-duck"] = require("./bg/summer/summer-duck.png");
IMG["Summer-top"] = require("./bg/summer/summer-top.png");
IMG["Summer"] = require("./bg/summer/summer.png");
IMG["Winter-duck"] = require("./bg/winter/winter-duck.png");
IMG["Winter-top"] = require("./bg/winter/winter-top.png");
IMG["Winter"] = require("./bg/winter/winter.png");
IMG["Barren"] = require("./flowers/barren.png");
IMG["DandelionFlower"] = require("./flowers/dandelionFlower.png");
IMG["OrchidFlower"] = require("./flowers/orchidFlower.png");
IMG["RoseFlower"] = require("./flowers/roseFlower.png");
IMG["SunflowerFlower"] = require("./flowers/sunflowerFlower.png");
IMG["TulipFlower"] = require("./flowers/tulipFlower.png");
IMG["ClosedBox"] = require("./garden_elements/ClosedBox.png");
IMG["Fertiliser"] = require("./garden_elements/Fertiliser.png");
IMG["OpenedBox"] = require("./garden_elements/OpenedBox.png");
IMG["Sunlight"] = require("./garden_elements/Sunlight.png");
IMG["Water"] = require("./garden_elements/Water.png");
IMG["ChallengesIcon"] = require("./icons/ChallengesIcon.png");
IMG["LeaderboardIcon"] = require("./icons/LeaderboardIcon.png");
IMG["MyGardenIcon"] = require("./icons/MyGardenIcon.png");
IMG["OurForestIcon"] = require("./icons/OurForestIcon.png");
IMG["SettingsIcon"] = require("./icons/SettingsIcon.png");

const img = (props) => {
    var realprops = props ;
    realprops['source'] = IMG[props.name];
	return <Image  {... realprops} />
}

export {img}
export default {img};
