var gmap;

beforeEach(function() {
  gmap = new Gmaps4RailsGoogle();
});

describe("Images Handling", function() {

  beforeEach(function(){
    gmap.markerImages = [{"url": "test0"}, {"url": "test1"}, {"url": "test2"}, {"url": "test3"}];
  });

  afterEach(function(){
    gmap.markerImages = [];
  });

  describe("includeMarkerImage", function() {
    it("should retrieve the index when url is in array", function() {
      expect(gmap.includeMarkerImage(gmap.markerImages, "test2")).toEqual(2);
    });

    it("should return false when the url isn't in array", function() {
      expect(gmap.includeMarkerImage(gmap.markerImages, "test4")).toBeFalsy();
    });
  });

  describe("createOrRetrieveImage", function() {
    it("should return existing image when image already exists", function() {
      var image = gmap.createOrRetrieveImage("test1", 20, 20, null);
      expect(image).toEqual({"url": "test1"});
    });
    
    it("should return new image when image doesn't exist yet", function() {
      var image = gmap.createOrRetrieveImage("test4", 20, 20, null);
      expect(image.who).toEqual("Point");
    });
  });
});

describe("createImageAnchorPosition", function() {
  it("should render null when no coordinates passed", function() {
    expect(gmap.createImageAnchorPosition(null)).toEqual(null);
  });

  it("should render a Point with same coordinates as passed", function() {
    expect(gmap.createImageAnchorPosition([10, 20])[0]).toEqual(10);
    expect(gmap.createImageAnchorPosition([10, 20])[1]).toEqual(20);
  });
});

describe("createServiceMarkersFromMarkers", function() {
  beforeEach(function() {
    gmap.markers = getRawMarkers();
  });

  afterEach(function() {
    clearMarkerTraces();
  });

  describe("launch method directly", function() {
    beforeEach(function() {
      spyOn(gmap, "createInfoWindow");
      spyOn(gmap, "createSidebar");
      gmap.createServiceMarkersFromMarkers();
    });
  
    it("should create objects for each marker", function() {
      for (var i = 0; i < gmap.markers.length; ++i) {
        expect(gmap.markers[i].serviceObject).toBeDefined();
      }
    });
  
    it("should set offset properly", function() {
      expect(gmap.markers_conf.offset).toEqual(gmap.markers.length);
    });
  
    // it("should trigger InfoWindow only with markers without serviceObject", function() {
    //   expect(gmap.createInfoWindow).toHaveBeenCalledWith(gmap.markers[0]);
    //   expect(gmap.createInfoWindow).toHaveBeenCalledWith(gmap.markers[1]);
    //   expect(gmap.createInfoWindow).not.toHaveBeenCalledWith(gmap.markers[2]);
    // });
    //  
    // it("should trigger createSidebar only with markers without serviceObject", function() {
    //   expect(gmap.createSidebar).toHaveBeenCalledWith(gmap.markers[0]);
    //   expect(gmap.createSidebar).toHaveBeenCalledWith(gmap.markers[1]);
    //   expect(gmap.createSidebar).not.toHaveBeenCalledWith(gmap.markers[2]);
    // });
  });
  
  describe("required delay to launch method", function() {
    
    it("should randomize if enabled", function() {
      gmap.markers_conf.randomize = true;
      spyOn(gmap, "randomize").andReturn([0,1]);
      gmap.createServiceMarkersFromMarkers();
      expect(gmap.randomize).toHaveBeenCalled();    
    });
    
    it("should not randomize it not requested", function() {
      gmap.markers_conf.randomize = false;
      spyOn(gmap, "randomize");
      gmap.createServiceMarkersFromMarkers();
      expect(gmap.randomize).not.toHaveBeenCalled();    
    });
     
  });
});

describe("createServiceMarkersFromMarkers full stack", function() {
  
  afterEach(function() {
    clearMarkerTraces();
    gmap.map = null;
  });
  
  it("should process all attributes from a marker (without default values)", function() {
    var marker = getFullMarker();
    gmap.markers = [marker];
    gmap.map = "map";

    spyOn(gmap, "createMarker");
    
    gmap.createServiceMarkersFromMarkers();
    
    expect(gmap.createMarker).toHaveBeenCalledWith({
      "marker_picture":   marker.picture,
      "marker_width":     marker.width,
      "marker_height":    marker.height,
      "marker_title":     marker.title,
      "marker_anchor":    marker.marker_anchor,
      "shadow_anchor":    marker.shadow_anchor,
      "shadow_picture":   marker.shadow_picture,
      "shadow_width":     marker.shadow_width,
      "shadow_height":    marker.shadow_height,
      "marker_draggable": marker.draggable,
      "rich_marker":      null,   
      "Lat":              marker.lat,
      "Lng":              marker.lng,
      "index":            0
    }); 
    
    //     spyOn(gmap, "createLatLng").andReturn([5,43]);
    // spyOn(gmap, "createImageAnchorPosition").andReturn("anchor");
    //     spyOn(gmap, "createOrRetrieveImage").andReturn("image");
    // spyOn(gmap, "createMarker").andReturn("marker");
    //     expect(gmap.createLatLng).toHaveBeenCalledWith(marker.latitude, marker.longitude);    
    // expect(gmap.createImageAnchorPosition).toHaveBeenCalledWith(marker.marker_anchor);
    //     expect(gmap.createImageAnchorPosition).toHaveBeenCalledWith(marker.shadow_anchor);
    // expect(gmap.createOrRetrieveImage).toHaveBeenCalledWith(marker.picture, marker.width, marker.height, "anchor");
    //     expect(gmap.createOrRetrieveImage).toHaveBeenCalledWith(marker.shadow_picture, marker.shadow_width, marker.shadow_height, "anchor");
    //     expect(gmap.createMarker).toHaveBeenCalledWith({position: [5,43], map: "map", icon: "image", title: marker.title, draggable: marker.draggable, shadow: "image"});
  });
  
  it("should process all attributes from a marker (with default values)", function() {
    var marker = getEmptyMarker();
    gmap.markers = [marker];
    gmap.map = "map";

    spyOn(gmap, "createMarker");
    
    gmap.createServiceMarkersFromMarkers();
    
    expect(gmap.createMarker).toHaveBeenCalledWith({
      "marker_picture":   gmap.markers_conf.picture,
      "marker_width":     gmap.markers_conf.width,
      "marker_height":    gmap.markers_conf.length,
      "marker_title":     null,
      "marker_anchor":    null,
      "shadow_anchor":    null,
      "shadow_picture":   null,
      "shadow_width":     null,
      "shadow_height":    null,
      "marker_draggable": gmap.markers_conf.draggable,
      "rich_marker":      null,
      "Lat":              marker.lat,
      "Lng":              marker.lng,
      "index":            0
    });    
    
    //     spyOn(gmap, "createLatLng").andReturn([5,43]);
    // spyOn(gmap, "createImageAnchorPosition").andReturn("anchor");
    //     spyOn(gmap, "createOrRetrieveImage").andReturn("image");
    // spyOn(gmap, "createMarker").andReturn("marker");
    //     expect(gmap.createLatLng).toHaveBeenCalledWith(marker.latitude, marker.longitude);    
    // expect(gmap.createImageAnchorPosition).toHaveBeenCalledWith(marker.marker_anchor);
    //     expect(gmap.createImageAnchorPosition).toHaveBeenCalledWith(marker.shadow_anchor);
    // expect(gmap.createOrRetrieveImage).toHaveBeenCalledWith(marker.picture, marker.width, marker.height, "anchor");
    //     expect(gmap.createOrRetrieveImage).toHaveBeenCalledWith(marker.shadow_picture, marker.shadow_width, marker.shadow_height, "anchor");
    //     expect(gmap.createMarker).toHaveBeenCalledWith({position: [5,43], map: "map", icon: "image", title: marker.title, draggable: marker.draggable, shadow: "image"});
  });

});

describe("create_markers", function() {
  
  it("should call all necessary methods", function() {
    spyOn(gmap, "createServiceMarkersFromMarkers");
    spyOn(gmap, "clusterize");
    spyOn(gmap, "adjustMapToBounds");
    gmap.create_markers();
    expect(gmap.createServiceMarkersFromMarkers).toHaveBeenCalled();    
    expect(gmap.clusterize).toHaveBeenCalled();    
    expect(gmap.adjustMapToBounds).toHaveBeenCalled();
  });
  
  it("should set offset properly", function() {
    spyOn(gmap, "createServiceMarkersFromMarkers");
    spyOn(gmap, "clusterize");
    spyOn(gmap, "adjustMapToBounds");
    gmap.create_markers();
    //offset should be 0 here: createServiceMarkersFromMarkers has been mocked
    expect(gmap.markers_conf.offset).toEqual(0);
  });
  
  it("should set offset properly", function() {
    //spyOn(gmap, "createServiceMarkersFromMarkers");
    spyOn(gmap, "clusterize");
    spyOn(gmap, "adjustMapToBounds");
    gmap.markers_conf.offset = 2;
    gmap.markers = getRawMarkers();
    gmap.create_markers();
    //offset should not have changed here: createServiceMarkersFromMarkers has been mocked
    expect(gmap.markers[0]).toBeUndefined;
    expect(gmap.markers[1]).toBeUndefined;
    expect(gmap.markers_conf.offset).toEqual(4);
  });
  
  
});

describe("generic markers methods", function() {
  
  beforeEach(function() {
    gmap.markers = getRawMarkers();
  });
  
  describe("showMarkers", function() {
    it("should call show with all markers", function() {
      spyOn(gmap, "showMarker");
      gmap.showMarkers();
      expect(gmap.showMarker.callCount).toEqual(gmap.markers.length);
    });
  });
  
  describe("hideMarkers", function() {
    it("should call hide with all markers", function() {
      spyOn(gmap, "hideMarker");
      gmap.hideMarkers();
      expect(gmap.hideMarker.callCount).toEqual(gmap.markers.length);
    });
  });
  
  describe("clearMarkers", function() {
    it("should call clear with all markers", function() {
      spyOn(gmap, "clearMarker");
      gmap.clearMarkers();
      expect(gmap.clearMarker.callCount).toEqual(gmap.markers.length);
    });
  });
});

describe("replaceMarkers", function() {
  it("should call all necessary methods", function() {
    gmap.markers = ["full_of_markers"];
    spyOn(gmap, "clearMarkers");
    spyOn(gmap, "createLatLngBounds");
    spyOn(gmap, "resetSidebarContent");
    spyOn(gmap, "addMarkers");
    gmap.replaceMarkers(getRawMarkers());
    //test if everything is reset (nothing added because addMarkers is stubbed)
    expect(gmap.markers).toEqual([]);
    //test if necessary methods are well called
    expect(gmap.clearMarkers).toHaveBeenCalled();    
    expect(gmap.createLatLngBounds).toHaveBeenCalled();    
    expect(gmap.resetSidebarContent).toHaveBeenCalled();    
    expect(gmap.addMarkers).toHaveBeenCalledWith(getRawMarkers());    
  });
});

describe("addMarkers", function() {
  it("should concat markers and create them", function() {
    gmap.markers = [{"hello": "dolly"}];
    spyOn(gmap, "create_markers");
    spyOn(gmap, "clearMarkers");
    gmap.addMarkers(getRawMarkers());
    expect(gmap.markers.length).toEqual(1 + getRawMarkers().length);
    expect(gmap.create_markers).toHaveBeenCalled();
  });
});

describe("clusterize", function() {
  beforeEach(function() {
    gmap.markers = getRawMarkers();
    spyOn(gmap, "createClusterer");
    spyOn(gmap, "clearClusterer");
  });

  afterEach(function() {
    gmap.markers_conf.do_clustering = true;
  });
  
  it("should do nothing when do_clustering is false", function() {
    gmap.markers_conf.do_clustering = false;
    gmap.clusterize();
    expect(gmap.createClusterer).not.toHaveBeenCalled();
  });
  
  it("should launch createClusterer when do_clustering is true", function() {
    gmap.markers_conf.do_clustering = true;
    gmap.clusterize();
    expect(gmap.createClusterer).toHaveBeenCalledWith([ undefined, undefined, true, false]);
  });
  
  it("should not clear previous clusterer if null", function() {
    gmap.markerClusterer = null;
    gmap.clusterize();
    expect(gmap.clearClusterer).not.toHaveBeenCalled();
  });
  
  it("should clear previous clusterer if exists", function() {
    gmap.markerClusterer = [];
    gmap.clusterize();
    expect(gmap.clearClusterer).toHaveBeenCalled();
  });

});
