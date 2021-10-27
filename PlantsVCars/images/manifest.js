/* autogenerated by bundler.py at Wed Oct 27 22:58:34 2021 +1000 */
import React from 'react';
import {Image, ImageBackground} from 'react-native';

var IMG = {};
IMG["Autumn-bg-animated"] = require("./bg/autumn/autumn-bg-animated.gif");
IMG["Spring-bg-animated"] = require("./bg/spring/spring-bg-animated.gif");
IMG["Summer-bg-animated"] = require("./bg/summer/summer-bg-animated.gif");
IMG["Winter-bg-animated"] = require("./bg/winter/winter-bg-animated.gif");
IMG["Waves-in-Sea"] = require("./sub/Waves-in-Sea.jpg");
IMG["Ben"] = require("./ben.png");
IMG["Testflower"] = require("./testflower.png");
IMG["Autumn-bg"] = require("./bg/autumn/autumn-bg.png");
IMG["Autumn-duck"] = require("./bg/autumn/autumn-duck.png");
IMG["Autumn-top"] = require("./bg/autumn/autumn-top.png");
IMG["Autumn"] = require("./bg/autumn/autumn.png");
IMG["Spring-bg"] = require("./bg/spring/spring-bg.png");
IMG["Spring-duck"] = require("./bg/spring/spring-duck.png");
IMG["Spring-top"] = require("./bg/spring/spring-top.png");
IMG["Spring"] = require("./bg/spring/spring.png");
IMG["Summer-bg"] = require("./bg/summer/summer-bg.png");
IMG["Summer-duck"] = require("./bg/summer/summer-duck.png");
IMG["Summer-top"] = require("./bg/summer/summer-top.png");
IMG["Summer"] = require("./bg/summer/summer.png");
IMG["Winter-bg"] = require("./bg/winter/winter-bg.png");
IMG["Winter-duck"] = require("./bg/winter/winter-duck.png");
IMG["Winter-top"] = require("./bg/winter/winter-top.png");
IMG["Winter"] = require("./bg/winter/winter.png");
IMG["Barren"] = require("./flowers/barren.png");
IMG["DandelionFlower"] = require("./flowers/dandelionFlower.png");
IMG["OrchidFlower"] = require("./flowers/orchidFlower.png");
IMG["RoseFlower"] = require("./flowers/roseFlower.png");
IMG["SunflowerFlower"] = require("./flowers/sunflowerFlower.png");
IMG["TulipFlower"] = require("./flowers/tulipFlower.png");
IMG["ClosedboxOutlined"] = require("./garden_elements/closedboxOutlined.png");
IMG["FertiliserOutlined "] = require("./garden_elements/fertiliserOutlined .png");
IMG["OpenedboxOutlined"] = require("./garden_elements/openedboxOutlined.png");
IMG["SunlightOutlined"] = require("./garden_elements/sunlightOutlined.png");
IMG["WaterOutlined"] = require("./garden_elements/waterOutlined.png");
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
