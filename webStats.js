/**
 * Copyright (c) 2008-2013 GIANTS Software GmbH, Confidential, All Rights Reserved.
 * Copyright (c) 2003-2013 Christian Ammann and Stefan Geiger, Confidential, All Rights Reserved.
 */

function loadWebStats(url, showIsAdmin, showModVersion) {
	var getVehicleType = (function () {
	    // Maps individual vehicle types to vehicle group names
	    var vehicleGroupMapping = {
	        // Default
	        '@': 'tool',

	        // Identities
	        'vehicle': 'vehicle',
	        'harvester': 'harvester',
	        'tool': 'tool',
	        'trailer': 'trailer',

	        // Individuals
	        'tractors': 'vehicle',
	        'trucks': 'vehicle',
	        'wheelLoaders': {
	            '@': 'vehicle',
	            'dynamicMountAttacherImplement': 'tool',
	            'shovel_animated': 'tool',
	            'shovel_dynamicMountAttacher': 'tool'
	        },
	        'teleLoaders': {
	            '@': 'vehicle',
	            'dynamicMountAttacherImplement': 'tool',
	            'baleGrab': 'tool',
	            'shovel_dynamicMountAttacher': 'tool',
	            'shovel_animated': 'tool'
	        },
	        'skidSteers': {
	            '@': 'vehicle',
	            'dynamicMountAttacherImplement': 'tool',
	            'shovel': 'tool',
	            'shovel_dynamicMountAttacher': 'tool',
	            'stumpCutter': 'tool',
	            'treeSaw': 'tool'
	        },
	        'cars': 'vehicle',

	        'harvesters': 'harvester',
	        'forageHarvesters': {
	            '@': 'harvester',
	            'attachableCombine': 'tool'
	        },
	        'potatoHarvesting': {
	            '@': 'harvester',
	            'defoliator_animated': 'tool'
	        },
	        'beetHarvesting': {
	            '@': 'harvester',
	            'defoliater_cutter_animated': 'tool'
	        },

	        'frontLoaders': {
	            '@': 'tool',
	            'wheelLoader': 'vehicle'
	        },
	        'forageHarvesterCutters': 'tool',
	        'cutters': 'tool',
	        'plows': 'tool',
	        'cultivators': 'tool',
	        'sowingMachines': 'tool',
	        'sprayers': {
	            '@': 'tool',
	            'selfPropelledSprayer': 'vehicle'
	        },
	        'fertilizerSpreaders': 'tool',
	        'weeders': 'tool',
	        'mowers': 'tool',
	        'tedders': 'tool',
	        'windrowers': 'tool',
	        'baling': {
	            '@': 'tool',
	            'transportTrailer': 'trailer',
	            'baleLoader': 'trailer',
	            'baler': 'trailer'
	        },
	        'chainsaws': 'tool',
	        'wood': {
	            '@': 'tool',
	            'transportTrailer': 'trailer',
	            'forwarderTrailer_steerable': 'trailer',
	            'woodCrusherTrailer': 'trailer',
	            'combine_animated': 'vehicle',
	            'forwarder': 'vehicle',
	            'woodHarvester': 'vehicle'
	        },
	        'animals': 'tool',
	        'leveler': 'tool',
	        'misc': {
	            '@': 'tool',
	            'fuelTrailer': 'trailer'
	        },
	        'dollys': 'tool',
	        'weights': 'tool',
	        'pallets': 'tool',
	        'belts': 'tool',
	        'placeables': 'tool',

	        'tippers': 'trailer',
	        'augerWagons': 'trailer',
	        'slurryTanks': {
	            '@': 'trailer',
	            'manureBarrelCultivator': 'tool'
	        },
	        'manureSpreaders': 'trailer',
	        'loaderWagons': 'trailer',
	        'lowloaders': 'trailer',
	        'cutterTrailers': 'trailer',
	        'animals': {
	            '@': 'trailer',
	            'selfPropelledMixerWagon': 'vehicle'
	        },
	        'dollys': 'trailer'
	    };

	    return function (vehicleType, vehicleSubtype) {
            var mapping = vehicleGroupMapping[vehicleType] || vehicleGroupMapping['@'];

            if (mapping instanceof Object) {
                mapping = mapping[vehicleSubtype] || mapping['@']
            }

            return mapping;
	    };
	}());

	$.get(url, function(data){
        
		var Server = $(data).find("Server");
        
		if (Server != null) {
			var money = parseInt($(Server).attr("money"));
			var sMoney  = accounting.formatMoney(money, "\u20AC ", 0); // £ -500,000
			$("#webStatsVersion").text($(Server).attr("version"));
			$("#webStatsGame").text($(Server).attr("game"));
			$("#webStatsServer").text($(Server).attr("server"));
			$("#webStatsName").text($(Server).attr("name"));
			$("#webStatsMapName").text($(Server).attr("mapName"));
			$("#webStatsMapSize").text($(Server).attr("mapSize"));
			$("#webStatsMoney").text(sMoney);
			
			var mapSize = $(Server).attr("mapSize");
			var mapSizeHalf = mapSize / 2;

			var webStatsPlayers = $("#webStatsPlayers");
			var Players = $(data).find("Server Slots Player");
			if (webStatsPlayers != null && Players != null) {
				Players.each(function(index, element) {
					var Player = $(element);
					if (Player.attr("isUsed") == "true") {
					
						var uptime = Player.attr("uptime");
						var hours = Math.floor(uptime/60);
						var minutes = Math.floor(uptime-(hours*60));

						var adminStr = "";
						if (showIsAdmin) {
							if (Player.attr("isAdmin") == "true") {
								adminStr = "Admin";
							}
							adminStr = "<td>"+adminStr+"</td>";
						}
						
						var x = Player.attr("x");
						var y = Player.attr("y");
						var z = Player.attr("z");

						var posStr = "";
						if (typeof x !== "undefined" && typeof y !== "undefined" && typeof z !== "undefined") {
							posStr = "<td>" + x + " " + y + " " + z + "</td>";
						}
						

						if (minutes < 10) {minutes = "0"+minutes;}
						webStatsPlayers.append("<tr><td>"+Player.text()+"</td><td>"+hours+":"+minutes+"</td>"+posStr+adminStr+"</tr>");
					}
				});
			}
			
			var webStatsMods = $("#webStatsMods");
			var Mods = $(data).find("Server Mods Mod");
			if (webStatsMods != null && Mods != null) {
				Mods.each(function(index, element) {
					var Mod = $(element);
				
					var versionStr = "";
					if (showModVersion) {
						versionStr = "<td>" + Mod.attr("version") + "</td>";
					}
				
					webStatsMods.append("<tr><td>"+Mod.text()+"</td><td>"+Mod.attr("author")+"</td><td>"+Mod.attr("hash")+"</td>"+versionStr+"</tr>");
				});
			}
			
			
			var webStatsVehicles = $("#webStatsVehicles");
			var Vehicles = $(data).find("Server Vehicles Vehicle");
			if (webStatsVehicles != null && Vehicles != null) {
				Vehicles.each(function(index, element) {
					var veh = $(element);
				
					if (veh.attr("category") == "harvesters") {
						webStatsVehicles.append("<tr><td>"+veh.attr("name")+"</td><td>"+veh.attr("category")+"</td><td>"+veh.attr("type")+"</td><td>"+veh.attr("fillTypes")+"</td><td>"+veh.attr("fillLevels")+"</td><td>"+veh.attr("controller")+"</td><td>"+veh.attr("x")+" "+veh.attr("y")+" "+veh.attr("z")+"</td></tr>");
					}
				});
			}	
            
			var webStatsMap = $("#webStatsMap");
            var Vehicles = $(data).find("Server Vehicles Vehicle");
			if (webStatsMap != null && Vehicles != null) {
            
                var linkToServer = url.replace("dedicated-server-stats.xml", "dedicated-server-stats-map.jpg");
                
                var imageQuality = 60;          // 60, 75, 90
                var imageSize = 1024;           // 256, 512, 1024, 2048

                var linkToImage = linkToServer.concat("&quality=");
                linkToImage = linkToImage.concat(imageQuality);
                linkToImage = linkToImage.concat("&size=");
                linkToImage = linkToImage.concat(imageSize);

                var machineIconSize = 10.0;
                
                webStatsMap.append( "<img src=\"" + linkToImage + "\"  />" );
                
                var stringToAppend = "<div id=\"mapElementsContainer\" >";                
                var i = 0;                
                Vehicles.each(function(index, element) {
                    var veh = $(element);
                    i = i + 1;
        
                    var x = (parseFloat(veh.attr("x")) + mapSizeHalf) / (mapSize / imageSize);
                    var z = (parseFloat(veh.attr("z")) + mapSizeHalf) / (mapSize / imageSize);
                    
                    x = x - (machineIconSize-1)/2;
                    z = z - (machineIconSize-1)/2;
                    
                    var vehicleGroup = getVehicleType(veh.attr("category"), veh.attr("type"));

                    var icon = "icons/" + vehicleGroup + ".png";
                    var iconHover = "icons/" + vehicleGroup + "_selected.png";
                    var backgroundColor = "#4dafd7";
                                        
                    var curString = "<div id=\"vehicle" + i + "Container\" ";
                    curString = curString + "style=\"position:absolute; left: " + x + "px; top: " + z + "px; \"";                     
                    curString = curString + "onmouseout=\"document.getElementById('vehicle" + i + "').style.display='none'; "; 
                    curString = curString + "document.getElementById('vehicle" + i + "Image').src='" + icon + "'; ";
                    curString = curString + "document.getElementById('vehicle" + i + "Container').style.zIndex=1; \" ";                    
                    curString = curString + "onmouseover=\"document.getElementById('vehicle" + i + "').style.display='block'; "; 
                    curString = curString + "document.getElementById('vehicle" + i + "Image').src='" + iconHover + "'; ";
                    curString = curString + "document.getElementById('vehicle" + i + "Container').style.zIndex=10; \"";                    
                    curString = curString + " > ";                    
                    curString = curString + "<image id=\"vehicle" + i + "Image\" src=\"" + icon + "\" width=\"" + machineIconSize + "\" height=\"" + machineIconSize + "\" />";                    
                    curString = curString + "<div id=\"vehicle" + i + "\" style=\"display:none; position:absolute; bottom:0px; left:" + (machineIconSize+1) + "; background:" + backgroundColor + "; padding-left:8px; padding-right:8px; color:#ffffff; \">";                     
                    curString = curString + "<nobr>" + veh.attr("name") + "</nobr>";                    
                    curString = curString + "</div> </div>";                    
                    stringToAppend = stringToAppend + curString;
				});                
                stringToAppend = stringToAppend + "</div>";
                webStatsMap.append(stringToAppend);
			}
		
			
		}

    });            
	
}
