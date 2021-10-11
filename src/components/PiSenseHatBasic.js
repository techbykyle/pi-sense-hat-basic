import React from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

const PiSenseHatBasic = ({device, http, httpAction, tile, useHttp, useInterval }) => {

    const device_state = useSelector(state => state.DeviceController.data[tile.id], shallowEqual) || {}
    const user = useSelector(state => state.User)
    const temperature = Math.round((device_state[http['get_temp_f']] * 9/5 + 32) * 10) / 10 || 0
    const humidity = Math.round(device_state[http['get_humidity']] * 10) / 10 || 0
    const dispatch = useDispatch()

    let backgroundColor = 'cyan'

    useHttp(device.id, tile.id, http['get_temp_f'])
    useHttp(device.id, tile.id, http['get_humidity'])

    useInterval(() => {
        httpAction(dispatch, user.token, device.id, tile.id, http['get_temp_f'])
        httpAction(dispatch, user.token, device.id, tile.id, http['get_humidity'])
    }, 30000)

    if(temperature < 33) {
        backgroundColor = '#4c8cf4'
    }

    if(temperature >= 33) {
        backgroundColor = 'cyan'
    }

    if(temperature >= 60) {
        backgroundColor = 'yellow'
    }

    if(temperature >= 80) {
        backgroundColor = 'orange'
    }

    if(temperature >= 100) {
        backgroundColor = 'red'
    }

    if(temperature >= 110) {
        backgroundColor = '#7e0023'
    }

    const circle_style = { 
        position: 'relative', 
        fontWeight: 'bold', 
        fontSize: 43, 
        padding: 0, 
        margin: 10, 
        backgroundColor, 
        width: 100, 
        height: 100
    }

    const temp_style = {
        position: 'absolute', 
        top: 48, 
        left: '%50',
        transform: 'translate(-50%, -50%)'
    }

    return (
        <div className="txt_center">
            <div>
                <span className="circ" style={circle_style} title="Current Temperature">
                    <span style={temp_style}>{temperature}</span>
                </span>
            </div>
            <div>
                <span title="Temperature" style={{color: backgroundColor}}>{temperature}&deg;F</span> / <span title="Humidity">%{humidity}</span>
            </div>
        </div>
    )
}

export default PiSenseHatBasic