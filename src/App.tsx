import { useEffect, useMemo, useState } from "react";
import Map, { Marker, Popup as MapPopup, ScaleControl } from "react-map-gl";
import SafeChildren from "./SafeChildren.tsx";

import "./App.css";
import { FeatureCollection } from "geojson";
import Pin from "./Pin.tsx";
import Popup, { PopupProps } from "./Popup.tsx";
import { S3_BASE_URL, TreeFromFeature } from "./gcs.ts";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function App() {
  const [trees, setTrees] = useState<FeatureCollection | undefined>(undefined);
  const [popupInfo, setPopupInfo] = useState<PopupProps | undefined>(undefined);

  useEffect(() => {
    const jsonUrl = new URL(S3_BASE_URL + "trees.json");
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((json) => setTrees(json))
      .catch((error) => console.error(error));
  }, []);

  const pins = useMemo(
    () =>
      trees?.features.map((feat, idx) => (
        <Marker
          key={`tree-marker-${idx}`}
          longitude={
            feat.geometry.type === "Point" ? feat.geometry.coordinates[0] : 0
          }
          latitude={
            feat.geometry.type === "Point" ? feat.geometry.coordinates[1] : 0
          }
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(TreeFromFeature(feat));
          }}
        >
          <Pin tag={feat.properties?.["tag"] ?? "unknown"} />
        </Marker>
      )),
    [trees],
  );

  return (
    <div className="map">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: -117.759929,
          latitude: 33.717878,
          zoom: 15.5,
        }}
        // style={{width: 600, height: 400}}
        // mapStyle="mapbox://styles/mapbox/streets-v9"
        mapStyle="mapbox://styles/mapbox/standard-satellite"
      >
        <SafeChildren>
          <ScaleControl />
          {pins}

          {popupInfo && (
            <MapPopup
              anchor="top"
              longitude={popupInfo.lng}
              latitude={popupInfo.lat}
              maxWidth="300px"
              onClose={() => setPopupInfo(undefined)}
            >
              <Popup {...popupInfo} />
            </MapPopup>
          )}
        </SafeChildren>
      </Map>
    </div>
  );
}

export default App;
