function GetPluginSettings()
{
	return {
		"name":			"Hue",
		"id":			"hue",
		"version":		"1.0",
		"description":	"Use Philips Hue lights to enrich your game's visuals.",
		"author":		"@jakubkoziol",
		"help url":		"https://github.com/jakubkoziol/c2hue",
		"category":		"General",
		"type":			"object",
		"rotatable":	false,
		"dependency":	"huejs.js",
		"flags":		0
						| pf_singleglobal
	};
};

////////////////////////////////////////
// Conditions


////////////////////////////////////////
// Actions

AddNumberParam("Light bulb id", "", "1");
AddNumberParam("Hue", "Set hue (0-65000)", "0");
AddNumberParam("Saturation", "Set saturation (0-255)", "255");
AddAction(1, af_none, "Set color", "Color", "Set light bulb {0} to {1} hue and {2} saturation", "Set hue and saturation of the specified light bulb.", "SetColor");

AddNumberParam("Light bulb id", "", "1");
AddNumberParam("Hue", "Set hue (0-65000)", "0");
AddAction(2, af_none, "Set hue", "Color", "Set light bulb {0} to {1} hue", "Set hue of the specified light bulb.", "SetHue");

AddNumberParam("Light bulb id", "", "1");
AddNumberParam("Saturation", "Set saturation (0-255)", "255");
AddAction(3, af_none, "Set saturation", "Color", "Set light bulb {0} to {1} saturation", "Set saturation of the specified light bulb.", "SetSaturation");

AddNumberParam("Light bulb id", "", "1");
AddNumberParam("Brightness", "Set brightness (0-255)", "255");
AddAction(4, af_none, "Set brightness", "Color", "Set light bulb {0} to {1} brightness", "Set brightness of the specified light bulb.", "SetBrightness");

AddNumberParam("Light bulb id", "", "1");
AddComboParamOption("off");
AddComboParamOption("on");
AddComboParam("State", "Set on/off state.");
AddAction(5, af_none, "Change on/off state", "State", "Turn {1} light bulb {0}", "Set state of the specified light bulb.", "SetState");

AddStringParam("IP", "Bridge IP address.", "\"192.168.1.22\"");
AddStringParam("Device Type", "Device Type, you can use any string.", "\"C2app\"");
AddStringParam("Username", "Username, used to authenticate the app with the bridge. You can leave it blank or use any string.", "\"8cc6fcef7d3e41ff8bda76c7aefff7a2\"");
AddAction(6, af_none, "Authenticate", "State", "Authenticate Hue bridge {0} with username {2} and devicetype {1}", "Authenticate the specified Hue user.", "Authenticate");

AddNumberParam("Light bulb id", "", "1");
AddAction(7, af_none, "Switch on/off state", "State", "Switch on/off state of light bulb {0}", "Switch state of the specified light bulb.", "SwitchState");


////////////////////////////////////////
// Expressions

AddNumberParam("Light bulb id", "The id of the light bulb to get a hue from");
AddExpression(0, ef_return_number, "", "Color", "Hue", "Current hue of the specified light bulb.");

AddNumberParam("Light bulb id", "The id of the light bulb to get a saturation from");
AddExpression(1, ef_return_number, "", "Color", "Saturation", "Current saturation of the specified light bulb.");

AddNumberParam("Light bulb id", "The id of the light bulb to get a brightness from");
AddExpression(2, ef_return_number, "", "Color", "Brightness", "Current brightness of the specified light bulb.");

AddNumberParam("Light bulb id", "The id of the light bulb to get the on/off state from");
AddExpression(3, ef_return_number, "", "State", "On", "Current brightness of the specified light bulb.");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin

var property_list = [
	];

// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}