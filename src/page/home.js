import React, { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, KmlLayer, Marker, Polygon, Polyline } from '@react-google-maps/api';
import { kml } from '@tmcw/togeojson'
import { DOMParser } from 'xmldom'
import axios from 'axios'
import nearestPointOnLine from '@turf/nearest-point-on-line'
import pointToLineDistance from '@turf/point-to-line-distance'
import polygonToLine from '@turf/polygon-to-line'
import { polygon, point, lineString, multiLineString } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import length from '@turf/length'
import along from '@turf/along'
import { wait } from '@testing-library/user-event/dist/utils';

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

const path = [
    { lat: -6.160449033283874, lng: 106.7651164617285 },
    { lat: -6.159202564181113, lng: 106.77591762837375 },
    { lat: -6.159202564181113, lng: 106.78083601390364 },
    { lat: -6.156613736991455, lng: 106.78614016081093 },
    { lat: -6.161983145084618, lng: 106.79356596124245 },
    { lat: -6.1601613868276095, lng: 106.80330629850624 }

];


const optionsLine = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: path,
    zIndex: 1
};




const key = "AIzaSyDMQJ7S1QtdJ6Njb8JK3hlIjWp-J8Erzzs"
// const exampleKML = 'https://gist.githubusercontent.com/ydhnwb/c6b23a596af954d19764a803940be2d8/raw/3d0f2167d545d5b2daec23c851add9999283d72f/MyProject1.kml'
const exampleKML = "https://gist.githubusercontent.com/ydhnwb/ef97d2b0e833c39c2caedf2e56902282/raw/2a51e0a4c6291dd91d872e64d4552cad192bdf36/perfect_circle.kml"

const HomePage = () => {

    const [distanceToArea, setDistanceToArea] = useState()
    const [isInsideFench, setInsideFench] = useState(false)
    const [selectedPosition, setSelectedPosition] = useState(position)
    const [nearestPosition, setNearestPosition] = useState()
    const [geoJSON, setGeoJSON] = useState()

    const [historyPoint, setHistoryPoint] = useState()

    const constructHistory = () => {
        const temp = []
        path.forEach((p) => {
            const t = []
            t.push(p.lng)
            t.push(p.lat)
            temp.push(t)
        })

        const extractedCoord = extractPolygons()
        if (extractedCoord != null) {
            const coordinates = extractedCoord.map((f) => Object.values(f))
            const poly = polygon([coordinates])
            const lines = lineString(temp)
            const lineDistance = Math.floor(length(lines, { units: 'meters' }))

            for (let i = 0; i < lineDistance; i++) {
                refreshHistory(i, lines, poly)
            }
        }




    }

    const refreshHistory = (i, lines, poly) => {
        setTimeout(() => {
            const nMeter = along(lines, i, { units: 'meters' })
            const pt = point([nMeter.geometry.coordinates[0], nMeter.geometry.coordinates[1]])
            const b = booleanPointInPolygon(pt, poly)

            const obj = {
                isInsideFench: b,
                lat: nMeter.geometry.coordinates[1],
                lng: nMeter.geometry.coordinates[0],

            }
            setHistoryPoint({ ...historyPoint, ...obj })
        }, 0.5 * i)
    }

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
            const turfPolygon = polygon([coordinates]) // <- bisa multiple polygon/area. convert kumpulan koordinat menjadi turf.polygon
            const turfPoint = point([selectedPosition.lng, selectedPosition.lat]) // convert menjadi turf.point
            const distanceKm = pointToLineDistance(turfPoint, polygonToLine(turfPolygon), { units: 'kilometers' }) // polygonToLine
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

    const SimulateButton = () => (
        <div onClick={constructHistory} style={{ position: 'absolute', alignItems: 'center', margin: 16, bottom: 0, left: 0, right: 0, width: 100, padding: 8, backgroundColor: 'green', borderRadius: 10 }}>
            <h4 style={{ color: 'white', }}>Simulate</h4>
        </div>
    )

    useEffect(() => {
        extractPolygons()
    }, [geoJSON])

    useEffect(() => {
        getClosestPointToPolygon()
    }, [selectedPosition])

    useEffect(() => {
        // constructHistory()
    }, [])

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

                        <Polyline
                            onLoad={onLoad}
                            path={path}
                            options={optionsLine}
                        />

                        <Marker
                            label={historyPoint?.isInsideFench ? "Di dalam" : "Di luar"}
                            onLoad={onLoad}
                            position={historyPoint}
                        />

                    </>
                </GoogleMap>
            </LoadScript>
            <h4 style={{ position: 'absolute', top: 0 }}>{isInsideFench ? "Anda di dalam polygon" : "Anda di luar polygon"}</h4>
            <h4 style={{ position: 'absolute', top: 0, right: 0, marginRight: 56 }}>{distanceToArea ? `Anda ${distanceToArea}km dari area` : "-"}</h4>
            <SimulateButton />
        </div>
    )
}

export default HomePage