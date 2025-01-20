import {useEffect, useMemo, useState} from "react";
import Map, {Marker, Popup, ScaleControl} from 'react-map-gl';
import SafeChildren from "./SafeChildren.tsx";

import './App.css';
import {Feature, FeatureCollection} from "geojson";
import Pin from "./Pin.tsx";

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW5zZzE5MSIsImEiOiJjbTYzNXp0bmUwdDh4MmpvY2hwZWtwaXMzIn0.F8zBU-kYjr0XcqNZ7oAUQg';

interface PopupInfo {
    lat: number;
    lng: number;
    id: string;
    file: string;
    tag: string;
    hash: string;
    timestamp: Date;
}

function toPopup(feat: Feature): PopupInfo | undefined {
    const props = feat.properties;
    if (props === null || typeof props !== 'object' || feat.geometry.type !== 'Point') {
        return;
    }
    if ('timestamp' in props && 'file' in props && 'hash' in props && 'id' in props && 'tag' in props) {
        return {
            lng: feat.geometry.coordinates[0],
            lat: feat.geometry.coordinates[1],
            id: String(props['id']),
            file: String(props['file']),
            tag: String(props['tag']),
            hash: String(props['hash']),
            timestamp: new Date(String(props['timestamp'])),
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
                    <Pin tag={feat.properties?.['tag'] ?? 'unknown'}/>
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
                            <div style={{display: "flex", alignItems: "center"}}>
                                <span style={{width: "60px"}}>Taken at:</span>
                                <b>{popupInfo.timestamp.toLocaleString()}</b>
                            </div>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <span style={{width: "60px"}}>Tag:</span>
                                <b>{popupInfo.tag}</b>
                            </div>
                            <a
                                href={`/output/${popupInfo.id}.webp`}
                                target="_blank"
                                style={{"outline": "none"}}
                            >
                                <img
                                    width="100%"
                                    src={`/output/${popupInfo.id}.webp`}
                                    alt="tree"
                                    style={{"marginTop": "0.5rem"}}
                                />
                            </a>
                        </Popup>
                    )}
                </SafeChildren>
            </Map>
        </div>
    )
}

export default App
