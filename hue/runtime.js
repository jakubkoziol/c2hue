// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.hue = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	var pluginProto = cr.plugins_.hue.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetColor = function (light, hue, saturation)
	{
		this.hue.setHue(light, hue);
		this.hue.setSat(light, saturation);
	};

	Acts.prototype.SetHue = function (light, hue)
	{
		this.hue.setHue(light, hue);
	};

	Acts.prototype.SetSaturation = function (light, saturation)
	{
		this.hue.setSat(light, saturation);
	};
	
	Acts.prototype.SetBrightness = function (light, brightness)
	{
		this.hue.setBri(light, brightness);
	};

	Acts.prototype.SetState = function (light, state)
	{
		if(state === 0){
			this.hue.turnOff(light);
		}
		else {
			this.hue.turnOn(light);
		}
	};

	Acts.prototype.SwitchState = function (light)
	{
		var state = this.hue.getValue(light, "on", true);
		if(state[light].on) { // if light is on
			this.hue.turnOff(light); // turn it off
		}
		else { // else it's turned off
			this.hue.turnOn(light); // so turn it on
		}
	};

	Acts.prototype.Authenticate = function (ip, devicetype, username)
	{
		var hue;

		this.hue = HueJS({
			ipAddress: ip,
			devicetype: devicetype,
			username: username
		});

		hue = this.hue;

		this.hue.authenticate( function(f){
			console.log("Hue Successfully Authenticated");
			//console.log(hue.getCache());
		},
		function(f){
			console.log("Error connecting to Hue");
			console.log(f);
		});
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.Hue = function (ret, light)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var state = this.hue.getValue(light, "hue", true);
		ret.set_int(state[light].hue);
	};
	
	Exps.prototype.Saturation = function (ret, light)
	{
		var state = this.hue.getValue(light, "sat", true);
		ret.set_int(state[light].sat);
	}

	Exps.prototype.Brightness = function (ret, light)
	{
		var state = this.hue.getValue(light, "bri", true);
		ret.set_int(state[light].bri);
	}

	Exps.prototype.On = function (ret, light)
	{
		var on = 0;
		var state = this.hue.getValue(light, "on", true);
		if(state[light].on) {
			on = 1;
		}
		ret.set_int(on);
	}	

	pluginProto.exps = new Exps();

}());