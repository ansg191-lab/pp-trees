import {useEffect, useMemo, useState} from "react";
import Map, {Marker, Popup, ScaleControl} from 'react-map-gl';
import SafeChildren from "./SafeChildren.tsx";

import './App.css';
import {Feature, FeatureCollection} from "geojson";
import Pin from "./Pin.tsx";

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW5zZzE5MSIsImEiOiJjbTYycGJoN2UwemlmMm1vNnltOXN3ZTZpIn0.C7Hmxns8Up-vLYTiuBp5sQ';

interface PopupInfo {
    lat: number;
    lng: number;
    timestamp: Date;
    file: string;
    hash: string;
}

function toPopup(feat: Feature): PopupInfo | undefined {
    const props = feat.properties;
    if (props === null || typeof props !== 'object' || feat.geometry.type !== 'Point') {
        return;
    }
    if ('timestamp' in props && 'file' in props && 'hash' in props) {
        return {
            lng: feat.geometry.coordinates[0],
            lat: feat.geometry.coordinates[1],
            timestamp: new Date(String(props['timestamp'])),
            file: String(props['file']),
            hash: String(props['hash'])
        };
    }

    throw new Error('Invalid tree properties');
}

function App() {
    const [trees, setTrees] = useState<FeatureCollection | undefined>(undefined);
    const [popupInfo, setPopupInfo] = useState<PopupInfo | undefined>(undefined);

    useEffect(() => {
        const jsonUrl = new URL('/output/trees.json', import.meta.url);
        fetch(jsonUrl)
            .then(response => response.json())
            .then(json => setTrees(json))
            .catch(error => console.error(error))
    }, [])

    const pins = useMemo(
        () => trees?.features
            .map((feat, idx) => (
                <Marker
                    key={`tree-marker-${idx}`}
                    longitude={feat.geometry.type === 'Point' ? feat.geometry.coordinates[0] : 0}
                    latitude={feat.geometry.type === 'Point' ? feat.geometry.coordinates[1] : 0}
                    anchor="bottom"
                    onClick={e => {
                        e.originalEvent.stopPropagation()
                        setPopupInfo(toPopup(feat))
                    }}
                >
                    <Pin/>
                </Marker>
            )),
        [trees]
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
                    <ScaleControl/>
                    {pins}

                    {popupInfo && (
                        <Popup
                            anchor="top"
                            longitude={popupInfo.lng}
                            latitude={popupInfo.lat}
                            onClose={() => setPopupInfo(undefined)}
                        >
                            <p>Taken at {popupInfo.timestamp.toLocaleString()}</p>
                            <img width="100%" src={`/output/${popupInfo.hash}.webp`} alt="tree" />
                        </Popup>
                    )}
                </SafeChildren>
            </Map>
        </div>
    )
}

export default App
