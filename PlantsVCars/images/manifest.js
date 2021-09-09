/* autogenerated by bundler.py at Thu Sep  2 13:59:20 2021 +1000 */
import React from 'react';
import {Image, ImageBackground} from 'react-native';

var IMG = {};
IMG["Waves-in-Sea"] = require("./sub/Waves-in-Sea.jpg");
IMG["Ben"] = require("./ben.png");
IMG["Testflower"] = require("./testflower.png");
IMG["DandelionFlower"] = require("./flowers/dandelionFlower.png");
IMG["RoseFlower"] = require("./flowers/roseFlower.png");
IMG["OrchidFlower"] = require("./flowers/orchidFlower.png");
IMG["SunflowerFlower"] = require("./flowers/sunflowerFlower.png");
IMG["TulipFlower"] = require("./flowers/tulipFlower.png");
IMG["OpenedBox"] = require("./garden_elements/OpenedBox.png");
IMG["Fertiliser"] = require("./garden_elements/Fertiliser.png");
IMG["Water"] = require("./garden_elements/Water.png");
IMG["Sunlight"] = require("./garden_elements/Sunlight.png");
IMG["ClosedBox"] = require("./garden_elements/ClosedBox.png");
IMG["OurForestIcon"] = require("./icons/OurForestIcon.png");
IMG["ChallengesIcon"] = require("./icons/ChallengesIcon.png");
IMG["SettingsIcon"] = require("./icons/SettingsIcon.png");
IMG["MyGardenIcon"] = require("./icons/MyGardenIcon.png");
IMG["LeaderboardIcon"] = require("./icons/LeaderboardIcon.png");
IMG["Autumn"] = require("./bg/autumn/autumn.png");
IMG["Autumn-top"] = require("./bg/autumn/autumn-top.png");
IMG["Autumn-duck"] = require("./bg/autumn/autumn-duck.png");
IMG["Winter"] = require("./bg/winter/winter.png");
IMG["Winter-top"] = require("./bg/winter/winter-top.png");
IMG["Winter-duck"] = require("./bg/winter/winter-duck.png");
IMG["Summer"] = require("./bg/summer/summer.png");
IMG["Summer-duck"] = require("./bg/summer/summer-duck.png");
IMG["Summer-top"] = require("./bg/summer/summer-top.png");
IMG["Spring-duck"] = require("./bg/spring/spring-duck.png");
IMG["Spring-top"] = require("./bg/spring/spring-top.png");
IMG["Spring"] = require("./bg/spring/spring.png");

const img = (props) => {
    var realprops = props ;
    realprops['source'] = IMG[props.name];
	return <Image  {... realprops} />
}

export {img}
export default {img};
