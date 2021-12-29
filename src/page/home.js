import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, KmlLayer, Marker, Polygon } from '@react-google-maps/api';
import { kml } from '@tmcw/togeojson'
import { DOMParser } from 'xmldom'
import axios from 'axios'
import nearestPointOnLine from '@turf/nearest-point-on-line'
import pointToLineDistance from '@turf/point-to-line-distance'
import polygonToLine from '@turf/polygon-to-line'
import { polygon, point, lineString } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'

const options = {
    fillColor: "rgba(245, 208, 39, 0.24)",
    fillOpacity: 1,
    strokeColor: "#e6cb00",
    strokeOpacity: 1,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    geodesic: false,
    zIndex: 1
}


const containerStyle = {
    // width: '400px',
    height: '100vh'
};

const center = {
    lat: -6.1607688,
    lng: 106.7863639
};


const position = {
    lat: -6.156449,
    lng: 106.764307,
}



const key = "AIzaSyDMQJ7S1QtdJ6Njb8JK3hlIjWp-J8Erzzs"
const exampleKML = 'https://gist.githubusercontent.com/ydhnwb/c6b23a596af954d19764a803940be2d8/raw/3d0f2167d545d5b2daec23c851add9999283d72f/MyProject1.kml'

const HomePage = () => {

    const [distanceToArea, setDistanceToArea] = useState()
    const [isInsideFench, setInsideFench] = useState(false)
    const [selectedPosition, setSelectedPosition] = useState(position)
    const [nearestPosition, setNearestPosition] = useState()
    const [geoJSON, setGeoJSON] = useState()

    const onLoad = (e) => {
        console.log("Marker onload")
    }

    const onMapLoad = async (e) => {
        const res = await fetchKML()
        const parsedKML = new DOMParser().parseFromString(res);
        setGeoJSON(kml(parsedKML))
    }

    const onMapClick = async (e) => {
        const lat = await e.lat()
        const lng = await e.lng()
        const pt = point([lng, lat])
        const extractedCoord = extractPolygons()
        if (extractedCoord != null) {
            const coordinates = extractedCoord.map((f) => Object.values(f))
            const poly = polygon([coordinates])
            const b = booleanPointInPolygon(pt, poly)
            setInsideFench(b)
        }
        setSelectedPosition({ lat, lng })
    }

    const extractPolygons = () => {
        if (geoJSON) {
            const polygons = geoJSON.features?.filter((g) => g.geometry?.type == 'Polygon')
            if (polygons.length != 0) {
                return polygons[0].geometry?.coordinates[0]?.map((coordinate) => ({
                    lng: coordinate[0],
                    lat: coordinate[1],
                }))

                // getClosestPointToPolygon(coordinates)
            }
        }
        return null
    }

    const getClosestPointToPolygon = () => {
        let minDistanceKm = null
        let nearestPoint = null
        const extractedCoord = extractPolygons()
        if (extractedCoord != null) {
            const coordinates = extractedCoord.map((f) => Object.values(f))
            // arrayOfPoly.map(pol => { //3 violet polygons mentioned above
            const turfPolygon = polygon([coordinates]) // <- bisa multiple polygon/area
            const turfPoint = point([selectedPosition.lng, selectedPosition.lat])
            const distanceKm = pointToLineDistance(turfPoint, polygonToLine(turfPolygon), { units: 'kilometers' })
            if (!!!minDistanceKm || minDistanceKm > distanceKm) {
                minDistanceKm = distanceKm
                nearestPoint = nearestPointOnLine(polygonToLine(turfPolygon), turfPoint)
                setNearestPosition({
                    lat: nearestPoint.geometry?.coordinates[1],
                    lng: nearestPoint.geometry?.coordinates[0],
                })
                setDistanceToArea(minDistanceKm)
            }
            // })
        }


    }


    const fetchKML = async () => {
        return axios
            .get(exampleKML)
            .then(r => {
                return r.data;
            })
            .catch(e => {
                console.log('error' + e);
                return null;
            });

    }

    useEffect(() => {
        extractPolygons()
    }, [geoJSON])

    useEffect(() => {
        getClosestPointToPolygon()
    }, [selectedPosition])

    return (
        <div>
            <LoadScript
                googleMapsApiKey={key}
            >
                <GoogleMap
                    onLoad={onMapLoad}
                    onClick={e => onMapClick(e.latLng)}
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={14}
                >
                    { /* Child components, such as markers, info windows, etc. */}
                    <>
                        {/* <KmlLayer onLoad={e => { console.log(e)}} url={exampleKML} /> */}
                        <Marker
                            onLoad={onLoad}
                            position={selectedPosition}
                        />
                        {
                            extractPolygons() != null && (<Polygon
                                paths={extractPolygons()}
                                options={options}
                            />)
                        }
                        {
                            nearestPosition && <Marker
                                onLoad={onLoad}
                                position={nearestPosition}
                            />
                        }

                    </>
                </GoogleMap>
            </LoadScript>
            <h4 style={{ position: 'absolute', top: 0 }}>{isInsideFench ? "Anda di dalam polygon" : "Anda di luar polygon"}</h4>
            <h4 style={{ position: 'absolute', top: 0, right: 0, marginRight: 56 }}>{distanceToArea ? `Anda ${distanceToArea}km dari area` : "-"}</h4>
        </div>
    )
}

export default HomePage