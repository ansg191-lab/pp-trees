import * as React from "react";
import {useMap} from "react-map-gl";
import {useEffect, useState} from "react";

interface SafeChildrenProps {
    children: React.ReactNode;
}

function SafeChildren({children}: SafeChildrenProps) {
    const {current: map} = useMap();
    const [canRenderChildren, setCanRenderChildren] = useState(false);

    useEffect(() => {
        if (!map || canRenderChildren) return;

        const checkStyleLoaded = () => {
            if (map.isStyleLoaded() && map.getStyle()) {
                setCanRenderChildren(true);
            }
        };

        checkStyleLoaded();
        const interval = setInterval(checkStyleLoaded, 10); // 😖

        return () => clearInterval(interval);
    }, [map, canRenderChildren]);

    return canRenderChildren ? <>{children}</> : null;
}

export default SafeChildren;