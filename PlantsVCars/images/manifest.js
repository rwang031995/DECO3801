/* autogenerated by bundler.py at Thu Aug 26 17:09:22 2021 +1000 */
import React from 'react';
import {Image, ImageBackground} from 'react-native';

var IMG = {};
IMG["Waves-in-Sea"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/sub/Waves-in-Sea.jpg');
IMG["Ben"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/ben.png');
IMG["OurForestIcon"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/icons/OurForestIcon.png');
IMG["MyGardenIcon"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/icons/MyGardenIcon.png');
IMG["Autumn"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/autumn/autumn.png');
IMG["Autumn-top"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/autumn/autumn-top.png');
IMG["Autumn-duck"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/autumn/autumn-duck.png');
IMG["Winter"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/winter/winter.png');
IMG["Winter-top"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/winter/winter-top.png');
IMG["Winter-duck"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/winter/winter-duck.png');
IMG["Summer"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/summer/summer.png');
IMG["Summer-duck"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/summer/summer-duck.png');
IMG["Summer-top"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/summer/summer-top.png');
IMG["Spring-duck"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/spring/spring-duck.png');
IMG["Spring-top"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/spring/spring-top.png');
IMG["Spring"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/bg/spring/spring.png');
IMG["Testflower"] = require('/Users/alexjago/Desktop/DECO3801/PlantsVCars/images/testflower.png');

const img = (props) => {
    var realprops = props ;
    realprops['source'] = IMG[props.name];
	return <Image  {... realprops} />;
}

export {img};
