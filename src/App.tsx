import { useMemo, useState } from "react";
import Map, { Marker, Popup as MapPopup, ScaleControl } from "react-map-gl";
import SafeChildren from "./SafeChildren.tsx";

import "./App.css";
import Pin from "./Pin.tsx";
import Popup, { PopupProps } from "./Popup.tsx";
import useTrees from "./useTrees.ts";
import FullPageError from "./Error.tsx";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function App() {
  const { trees, error } = useTrees();
  const [popupInfo, setPopupInfo] = useState<PopupProps | undefined>(undefined);

  const pins = useMemo(
    () =>
      trees?.map((tree, idx) => (
        <Marker
          key={`tree-marker-${idx}`}
          longitude={tree.lng}
          latitude={tree.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setPopupInfo(tree);
          }}
        >
          <Pin tag={tree.tag} />
        </Marker>
      )),
    [trees],
  );

  if (error) {
    return <FullPageError error={error} />;
  }

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
